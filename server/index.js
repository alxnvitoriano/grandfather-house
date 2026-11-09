import 'dotenv/config';
import express from 'express';
import { query } from './db.js';

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

app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`API do carrinho rodando em http://localhost:${port}`);
});
