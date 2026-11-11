import 'dotenv/config';
import crypto from 'node:crypto';
import express from 'express';
import { query } from './db.js';
import { buildOrderTotals } from './pricing.js';
import * as mp from './mercadopago.js';
import * as aliexpress from './aliexpress.js';

const app = express();
app.use(express.json());

const requireSessionId = (req, res) => {
    const sessionId = req.header('x-session-id');
    if (!sessionId) {
        res.status(400).json({ error: 'Cabeçalho x-session-id é obrigatório.' });
        return null;
    }
    return sessionId;
};

const handleError = (res, message) => (error) => {
    console.error(message, error);
    res.status(500).json({ error: message });
};

// ---------------- Carrinho ----------------

app.get('/api/cart', async (req, res) => {
    const sessionId = requireSessionId(req, res);
    if (!sessionId) return;
    try {
        const { rows } = await query(
            'SELECT product, quantity FROM cart_items WHERE session_id = $1 ORDER BY created_at',
            [sessionId]
        );
        res.json(rows.map((row) => ({ ...row.product, quantity: row.quantity })));
    } catch (error) {
        handleError(res, 'Erro ao carregar o carrinho.')(error);
    }
});

app.post('/api/cart', async (req, res) => {
    const sessionId = requireSessionId(req, res);
    if (!sessionId) return;
    const { product, quantity = 1 } = req.body ?? {};
    if (!product?.id || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ error: 'Produto ou quantidade inválidos.' });
    }
    try {
        await query(
            `INSERT INTO cart_items (session_id, product_id, product, quantity)
             VALUES ($1, $2, $3::jsonb, $4)
             ON CONFLICT (session_id, product_id)
             DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity,
                           product = EXCLUDED.product,
                           updated_at = now()`,
            [sessionId, String(product.id), JSON.stringify(product), quantity]
        );
        res.status(204).end();
    } catch (error) {
        handleError(res, 'Erro ao adicionar ao carrinho.')(error);
    }
});

app.put('/api/cart/:productId', async (req, res) => {
    const sessionId = requireSessionId(req, res);
    if (!sessionId) return;
    const { quantity } = req.body ?? {};
    const { productId } = req.params;
    try {
        if (!Number.isInteger(quantity) || quantity < 1) {
            await query(
                'DELETE FROM cart_items WHERE session_id = $1 AND product_id = $2',
                [sessionId, productId]
            );
        } else {
            await query(
                `UPDATE cart_items SET quantity = $3, updated_at = now()
                 WHERE session_id = $1 AND product_id = $2`,
                [sessionId, productId, quantity]
            );
        }
        res.status(204).end();
    } catch (error) {
        handleError(res, 'Erro ao atualizar o carrinho.')(error);
    }
});

app.delete('/api/cart/:productId', async (req, res) => {
    const sessionId = requireSessionId(req, res);
    if (!sessionId) return;
    try {
        await query(
            'DELETE FROM cart_items WHERE session_id = $1 AND product_id = $2',
            [sessionId, req.params.productId]
        );
        res.status(204).end();
    } catch (error) {
        handleError(res, 'Erro ao remover do carrinho.')(error);
    }
});

app.delete('/api/cart', async (req, res) => {
    const sessionId = requireSessionId(req, res);
    if (!sessionId) return;
    try {
        await query('DELETE FROM cart_items WHERE session_id = $1', [sessionId]);
        res.status(204).end();
    } catch (error) {
        handleError(res, 'Erro ao limpar o carrinho.')(error);
    }
});

// ---------------- Lista de desejos ----------------

app.get('/api/wishlist', async (req, res) => {
    const sessionId = requireSessionId(req, res);
    if (!sessionId) return;
    try {
        const { rows } = await query(
            'SELECT product FROM wishlist_items WHERE session_id = $1 ORDER BY created_at',
            [sessionId]
        );
        res.json(rows.map((row) => row.product));
    } catch (error) {
        handleError(res, 'Erro ao carregar a lista de desejos.')(error);
    }
});

app.post('/api/wishlist', async (req, res) => {
    const sessionId = requireSessionId(req, res);
    if (!sessionId) return;
    const { product } = req.body ?? {};
    if (!product?.id) {
        return res.status(400).json({ error: 'Produto inválido.' });
    }
    try {
        await query(
            `INSERT INTO wishlist_items (session_id, product_id, product)
             VALUES ($1, $2, $3::jsonb)
             ON CONFLICT (session_id, product_id) DO NOTHING`,
            [sessionId, String(product.id), JSON.stringify(product)]
        );
        res.status(204).end();
    } catch (error) {
        handleError(res, 'Erro ao adicionar à lista de desejos.')(error);
    }
});

app.delete('/api/wishlist/:productId', async (req, res) => {
    const sessionId = requireSessionId(req, res);
    if (!sessionId) return;
    try {
        await query(
            'DELETE FROM wishlist_items WHERE session_id = $1 AND product_id = $2',
            [sessionId, req.params.productId]
        );
        res.status(204).end();
    } catch (error) {
        handleError(res, 'Erro ao remover da lista de desejos.')(error);
    }
});

app.delete('/api/wishlist', async (req, res) => {
    const sessionId = requireSessionId(req, res);
    if (!sessionId) return;
    try {
        await query('DELETE FROM wishlist_items WHERE session_id = $1', [sessionId]);
        res.status(204).end();
    } catch (error) {
        handleError(res, 'Erro ao limpar a lista de desejos.')(error);
    }
});

// ---------------- Checkout / pagamento ----------------

const isValidCustomer = (customer) =>
    Boolean(customer?.name?.trim() && customer?.email?.trim());

// Cria o pedido a partir do carrinho salvo, calcula o total no servidor e
// devolve a URL de checkout do Mercado Pago.
app.post('/api/checkout', async (req, res) => {
    const sessionId = requireSessionId(req, res);
    if (!sessionId) return;

    const { customer, couponCode } = req.body ?? {};
    if (!isValidCustomer(customer)) {
        return res.status(400).json({ error: 'Dados de entrega incompletos.' });
    }
    if (!mp.isConfigured()) {
        return res
            .status(503)
            .json({ error: 'Pagamento não configurado. Preencha MERCADOPAGO_ACCESS_TOKEN no .env.' });
    }

    try {
        const { rows } = await query(
            'SELECT product, quantity FROM cart_items WHERE session_id = $1 ORDER BY created_at',
            [sessionId]
        );
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Carrinho vazio.' });
        }

        const totals = buildOrderTotals(rows, couponCode);
        const orderId = crypto.randomUUID();

        await query(
            `INSERT INTO orders
                (id, session_id, status, subtotal, discount, shipping, total, coupon_code, customer, items)
             VALUES ($1, $2, 'pending', $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb)`,
            [
                orderId,
                sessionId,
                totals.subtotal,
                totals.discount,
                totals.shipping,
                totals.total,
                totals.coupon,
                JSON.stringify(customer),
                JSON.stringify(totals.items),
            ]
        );

        const preference = await mp.createPreference({
            order: { id: orderId, ...totals },
            customer,
        });

        await query('UPDATE orders SET preference_id = $2, updated_at = now() WHERE id = $1', [
            orderId,
            preference.id,
        ]);

        res.json({ orderId, initPoint: preference.initPoint, total: totals.total });
    } catch (error) {
        handleError(res, 'Erro ao iniciar o pagamento.')(error);
    }
});

// Webhook do Mercado Pago: confirma o pagamento e atualiza o pedido.
app.post('/api/webhooks/mercadopago', async (req, res) => {
    const paymentId = req.body?.data?.id ?? req.query['data.id'] ?? req.query.id;

    const valid = mp.verifyWebhookSignature({
        xSignature: req.header('x-signature'),
        xRequestId: req.header('x-request-id'),
        dataId: paymentId,
    });
    if (!valid) {
        return res.status(401).json({ error: 'Assinatura do webhook inválida.' });
    }

    // Eventos que não são de pagamento são ignorados com 200 para o Mercado
    // Pago não ficar reenviando a mesma notificação.
    if (!paymentId) return res.sendStatus(200);

    try {
        const payment = await mp.getPayment(paymentId);
        if (payment?.external_reference) {
            await query(
                'UPDATE orders SET status = $2, payment_id = $3, updated_at = now() WHERE id = $1',
                [payment.external_reference, payment.status ?? 'unknown', String(payment.id)]
            );
        }
        res.sendStatus(200);
    } catch (error) {
        console.error('Falha ao processar webhook do Mercado Pago:', error);
        res.sendStatus(500);
    }
});

// Consulta do pedido (usada pela tela de retorno do checkout).
app.get('/api/orders/:id', async (req, res) => {
    try {
        const { rows } = await query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }
        res.json(rows[0]);
    } catch (error) {
        handleError(res, 'Erro ao carregar o pedido.')(error);
    }
});

// ---------------- AliExpress ----------------

app.get('/api/aliexpress/auth-url', (_req, res) => {
    if (!aliexpress.isConfigured()) {
        return res
            .status(503)
            .json({ error: 'AliExpress não configurado. Preencha ALIEXPRESS_APP_KEY/SECRET no .env.' });
    }
    res.json({ url: aliexpress.buildAuthUrl() });
});

// Callback do OAuth: troca o código por token e volta para o frontend.
app.get('/api/aliexpress/callback', async (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
    const { code, error } = req.query;

    if (error || !code) {
        return res.redirect(`${frontendUrl}/?aliexpress=erro`);
    }
    try {
        await aliexpress.exchangeCodeForToken(code);
        res.redirect(`${frontendUrl}/?aliexpress=conectado`);
    } catch (failure) {
        console.error('Falha no callback do AliExpress:', failure);
        res.redirect(`${frontendUrl}/?aliexpress=erro`);
    }
});

app.get('/api/aliexpress/products', async (req, res) => {
    if (!aliexpress.isConfigured()) {
        return res.status(503).json({ error: 'AliExpress não configurado.' });
    }
    try {
        const products = await aliexpress.getProducts({
            page: Number(req.query.page) || 1,
            pageSize: Number(req.query.pageSize) || 20,
        });
        res.json(products);
    } catch (error) {
        handleError(res, 'Erro ao carregar produtos do AliExpress.')(error);
    }
});

app.get('/api/aliexpress/products/:id', async (req, res) => {
    if (!aliexpress.isConfigured()) {
        return res.status(503).json({ error: 'AliExpress não configurado.' });
    }
    try {
        const product = await aliexpress.getProductDetail({ productId: req.params.id });
        if (!product) return res.status(404).json({ error: 'Produto não encontrado.' });
        res.json(product);
    } catch (error) {
        handleError(res, 'Erro ao carregar o produto do AliExpress.')(error);
    }
});

app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`API do carrinho rodando em http://localhost:${port}`);
});
