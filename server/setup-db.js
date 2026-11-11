import 'dotenv/config';
import { query } from './db.js';

const statements = [
    `CREATE TABLE IF NOT EXISTS cart_items (
        session_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        product JSONB NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        PRIMARY KEY (session_id, product_id)
    )`,
    `CREATE TABLE IF NOT EXISTS wishlist_items (
        session_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        product JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        PRIMARY KEY (session_id, product_id)
    )`,
    // Pedidos: os valores são calculados no servidor e gravados aqui antes de
    // enviar a cobrança ao gateway de pagamento.
    `CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        subtotal NUMERIC(10, 2) NOT NULL,
        discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
        shipping NUMERIC(10, 2) NOT NULL DEFAULT 0,
        total NUMERIC(10, 2) NOT NULL,
        coupon_code TEXT,
        customer JSONB NOT NULL,
        items JSONB NOT NULL,
        preference_id TEXT,
        payment_id TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`,
    `CREATE INDEX IF NOT EXISTS orders_session_id_idx ON orders (session_id)`,
    `CREATE INDEX IF NOT EXISTS orders_payment_id_idx ON orders (payment_id)`,
    // Token OAuth do AliExpress. Usamos uma única linha (id = 'default')
    // enquanto a loja opera com uma conta só.
    `CREATE TABLE IF NOT EXISTS aliexpress_tokens (
        id TEXT PRIMARY KEY,
        account TEXT,
        access_token TEXT NOT NULL,
        refresh_token TEXT,
        expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`,
];

const applySchema = async () => {
    for (const statement of statements) {
        await query(statement);
    }

    console.log(`Schema aplicado com sucesso (${statements.length} tabela(s)).`);
};

applySchema().catch((error) => {
    console.error('Falha ao aplicar o schema:', error.message);
    process.exit(1);
});
