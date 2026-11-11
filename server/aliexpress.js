import crypto from 'node:crypto';
import { query } from './db.js';

// Integração com a AliExpress Open Platform (API de Dropshipping / DS).
//
// Observação importante: os hosts e paths do OAuth abaixo são os do gateway
// oficial, mas devem ser conferidos no console do seu app em
// https://open.aliexpress.com — eles ficam centralizados aqui para facilitar
// qualquer ajuste.
//
// O fluxo tem duas partes:
//   1. Autorização (uma vez): buildAuthUrl -> callback -> exchangeCodeForToken,
//      que guarda o token na tabela aliexpress_tokens;
//   2. Uso: getProducts()/getProductDetail() assinam a chamada e usam o token.

const getConfig = () => {
    const appKey = process.env.ALIEXPRESS_APP_KEY;
    const appSecret = process.env.ALIEXPRESS_APP_SECRET;
    const baseUrl = process.env.ALIEXPRESS_API_BASE ?? 'https://api-sg.aliexpress.com';
    const redirectUri =
        process.env.ALIEXPRESS_REDIRECT_URI ??
        'http://localhost:3001/api/aliexpress/callback';

    if (!appKey || !appSecret) {
        throw new Error(
            'ALIEXPRESS_APP_KEY/ALIEXPRESS_APP_SECRET não configurados. Preencha o .env.'
        );
    }
    return { appKey, appSecret, baseUrl, redirectUri };
};

export const isConfigured = () =>
    Boolean(process.env.ALIEXPRESS_APP_KEY && process.env.ALIEXPRESS_APP_SECRET);

// URL para onde o lojista é levado a fim de autorizar o app.
export const buildAuthUrl = (state = crypto.randomUUID()) => {
    const { appKey, baseUrl, redirectUri } = getConfig();
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: appKey,
        redirect_uri: redirectUri,
        state,
    });
    return `${baseUrl}/oauth/authorize?${params.toString()}`;
};

// Assinatura do gateway /sync: ordena os parâmetros por nome, concatena
// chave+valor e aplica MD5(secret + base + secret) em maiúsculas.
const signParams = (params, appSecret) => {
    const base = Object.keys(params)
        .filter((key) => key !== 'sign')
        .sort()
        .map((key) => `${key}${params[key]}`)
        .join('');
    return crypto
        .createHash('md5')
        .update(`${appSecret}${base}${appSecret}`)
        .digest('hex')
        .toUpperCase();
};

// Troca código de autorização por token e persiste no banco.
export const exchangeCodeForToken = async (code) => {
    const { appKey, appSecret, baseUrl, redirectUri } = getConfig();

    const response = await fetch(`${baseUrl}/auth/token/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: appKey,
            client_secret: appSecret,
            code,
            redirect_uri: redirectUri,
        }),
    });

    const data = await response.json();
    if (!response.ok || !data.access_token) {
        throw new Error(`Falha ao trocar o código por token: ${JSON.stringify(data)}`);
    }
    await saveToken(data);
    return data;
};

export const refreshAccessToken = async (refreshToken) => {
    const { appKey, appSecret, baseUrl } = getConfig();

    const response = await fetch(`${baseUrl}/auth/token/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: appKey,
            client_secret: appSecret,
            refresh_token: refreshToken,
        }),
    });

    const data = await response.json();
    if (!response.ok || !data.access_token) {
        throw new Error(`Falha ao renovar o token: ${JSON.stringify(data)}`);
    }
    await saveToken({ ...data, refresh_token: data.refresh_token ?? refreshToken });
    return data;
};

const saveToken = async ({ access_token, refresh_token, expires_in, account }) => {
    const expiresAt = new Date(Date.now() + Number(expires_in ?? 0) * 1000).toISOString();
    await query(
        `INSERT INTO aliexpress_tokens (id, account, access_token, refresh_token, expires_at, updated_at)
         VALUES ('default', $1, $2, $3, $4, now())
         ON CONFLICT (id) DO UPDATE SET
             account = EXCLUDED.account,
             access_token = EXCLUDED.access_token,
             refresh_token = EXCLUDED.refresh_token,
             expires_at = EXCLUDED.expires_at,
             updated_at = now()`,
        [account ?? null, access_token, refresh_token ?? null, expiresAt]
    );
};

// Devolve um token válido, renovando automaticamente quando estiver perto de
// expirar. Lança erro quando o app ainda não foi autorizado.
export const getAccessToken = async () => {
    const { rows } = await query(
        'SELECT access_token, refresh_token, expires_at FROM aliexpress_tokens WHERE id = $1',
        ['default']
    );
    const token = rows[0];
    if (!token) {
        throw new Error(
            'App ainda não autorizado no AliExpress. Acesse /api/aliexpress/auth-url e conclua o fluxo OAuth.'
        );
    }

    const expiresAt = token.expires_at ? new Date(token.expires_at).getTime() : 0;
    const aboutToExpire = expiresAt - Date.now() < 60_000;

    if (aboutToExpire && token.refresh_token) {
        const refreshed = await refreshAccessToken(token.refresh_token);
        return refreshed.access_token;
    }
    return token.access_token;
};

// Chamada assinada ao gateway /sync.
const callApi = async (method, businessParams, { session } = {}) => {
    const { appKey, appSecret, baseUrl } = getConfig();

    const params = {
        method,
        app_key: appKey,
        timestamp: String(Date.now()),
        format: 'json',
        v: '2.0',
        sign_method: 'md5',
        simplify: 'true',
        ...(session ? { session } : {}),
        ...businessParams,
    };
    params.sign = signParams(params, appSecret);

    const response = await fetch(`${baseUrl}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(params),
    });

    const data = await response.json();
    if (data?.error_response) {
        throw new Error(
            `Erro do AliExpress (${data.error_response.code}): ${data.error_response.msg}`
        );
    }
    return data;
};

// Converte a resposta da DS API no formato de produto usado pela loja.
const normalizeFeedProduct = (raw) => ({
    id: String(raw.product_id),
    name: raw.product_title,
    price: raw.target_sale_price,
    oldPrice: raw.target_original_price ?? undefined,
    currency: raw.target_sale_price_currency,
    image: raw.product_main_image_url,
    rating: raw.evaluate_rate ? Number(String(raw.evaluate_rate).replace('%', '')) / 20 : undefined,
    url: raw.product_detail_url,
    source: 'aliexpress',
});

// Lista produtos do feed de dropshipping.
// Exige que o app esteja aprovado para o feed no console do AliExpress.
export const getProducts = async ({ page = 1, pageSize = 20, currency = 'BRL' } = {}) => {
    const session = await getAccessToken();

    const data = await callApi(
        'aliexpress.ds.recommend.feed.get',
        {
            feed_name: 'DS bestseller',
            target_currency: currency,
            target_language: 'PT',
            country: 'BR',
            page_no: String(page),
            page_size: String(pageSize),
        },
        { session }
    );

    const products =
        data?.aliexpress_ds_recommend_feed_get_response?.result?.products
            ?.traffic_product_d_t_o ?? [];

    return products.map(normalizeFeedProduct);
};

// Detalhe de um produto específico do AliExpress.
export const getProductDetail = async ({ productId, currency = 'BRL' }) => {
    const session = await getAccessToken();

    const data = await callApi(
        'aliexpress.ds.product.get',
        {
            product_id: String(productId),
            ship_to_country: 'BR',
            target_currency: currency,
            target_language: 'PT',
        },
        { session }
    );

    const result = data?.aliexpress_ds_product_get_response?.result;
    if (!result) return null;

    const base = result.ae_item_base_info_dto ?? {};
    const media = result.ae_multimedia_info_dto ?? {};

    return {
        id: String(base.product_id ?? productId),
        name: base.subject,
        image: (media.image_urls ?? '').split(';')[0],
        images: (media.image_urls ?? '').split(';').filter(Boolean),
        source: 'aliexpress',
        raw: result,
    };
};
