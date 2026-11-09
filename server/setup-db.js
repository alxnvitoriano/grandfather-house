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
