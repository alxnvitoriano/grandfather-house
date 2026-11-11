import crypto from 'node:crypto';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

// Integração com o Mercado Pago (Checkout Pro).
//
// O valor cobrado é sempre o que veio de server/pricing.js — o cliente nunca
// informa o preço. O fluxo é:
//   1. createPreference() monta a preferência e devolve a URL de checkout;
//   2. o comprador paga no Mercado Pago;
//   3. o Mercado Pago chama o webhook (verifyWebhookSignature + getPayment),
//      que confirma o pagamento e atualiza o pedido.

export const isConfigured = () => Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN);

const getClient = () => {
    if (!isConfigured()) {
        throw new Error(
            'MERCADOPAGO_ACCESS_TOKEN não configurado. Preencha o .env para habilitar o pagamento.'
        );
    }
    return new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });
};

export const createPreference = async ({ order, customer }) => {
    const client = getClient();

    const items = order.items.map((item) => ({
        id: String(item.id),
        title: item.name,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        currency_id: 'BRL',
    }));

    // O Mercado Pago calcula o total como soma dos itens + custo de envio.
    // Um cupom entra como linha negativa para o total fechar exatamente no
    // valor aprovado em server/pricing.js.
    if (order.discount > 0) {
        items.push({
            id: 'desconto',
            title: `Desconto (${order.coupon})`,
            quantity: 1,
            unit_price: -order.discount,
            currency_id: 'BRL',
        });
    }

    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';

    const preference = new Preference(client);
    const result = await preference.create({
        body: {
            items,
            shipments: { cost: order.shipping, mode: 'not_specified' },
            payer: {
                name: customer.name,
                email: customer.email,
                phone: { area_code: '', number: customer.phone },
            },
            external_reference: order.id,
            statement_descriptor: 'CASA DO VELHINHO',
            notification_url: `${process.env.API_PUBLIC_URL ?? 'http://localhost:3001'}/api/webhooks/mercadopago`,
            back_urls: {
                success: `${frontendUrl}/checkout?status=sucesso`,
                pending: `${frontendUrl}/checkout?status=pendente`,
                failure: `${frontendUrl}/checkout?status=falha`,
            },
            auto_return: 'approved',
        },
    });

    return { id: result.id, initPoint: result.init_point };
};

export const getPayment = async (paymentId) => {
    const client = getClient();
    const payment = new Payment(client);
    return payment.get({ id: paymentId });
};

// Valida a assinatura enviada no header x-signature. O Mercado Pago assina o
// manifesto `id:<data.id>;request-id:<x-request-id>;ts:<ts>;` com HMAC-SHA256
// usando o segredo configurado no painel.
export const verifyWebhookSignature = ({ xSignature, xRequestId, dataId }) => {
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

    // Sem segredo configurado (ex.: desenvolvimento) não bloqueia a chamada.
    if (!secret) return true;
    if (!xSignature || !dataId) return false;

    const parts = Object.fromEntries(
        xSignature.split(',').map((part) => part.split('=').map((value) => value.trim()))
    );
    const { ts, v1 } = parts;
    if (!ts || !v1) return false;

    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
    const expected = crypto.createHmac('sha256', secret).update(manifest).digest('hex');

    const expectedBuffer = Buffer.from(expected);
    const receivedBuffer = Buffer.from(v1);
    if (expectedBuffer.length !== receivedBuffer.length) return false;
    return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
};
