import { Pool } from '@neondatabase/serverless';

let pool;

const getPool = () => {
    if (!process.env.DATABASE_URL) {
        throw new Error(
            'DATABASE_URL não configurada. Copie .env.example para .env e preencha a connection string do Neon.'
        );
    }
    if (!pool) {
        pool = new Pool({ connectionString: process.env.DATABASE_URL });
    }
    return pool;
};

export const query = (text, params) => getPool().query(text, params);
