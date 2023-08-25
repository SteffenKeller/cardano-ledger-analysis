import { Pool } from 'pg'
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    max: 20, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
});

export async function queryLatestTxId() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT id FROM tx ORDER BY id DESC LIMIT 1')
        return res.rows[0].id
    } finally {
        client.release();
    }
}

export async function queryTransaction(id) {
    const client = await pool.connect();
    try {
        const res = await client.query(`SELECT * FROM tx WHERE id = ${id} LIMIT 1`)
        return res.rows[0]
    } finally {
        client.release();
    }
}

export async function queryTransactionOutputs(id) {
    const client = await pool.connect();
    try {
        const res = await client.query(`SELECT * FROM tx_out WHERE tx_id = ${id}`)
        return res.rows
    } finally {
        client.release();
    }
}

export async function queryTransactionMultiAssetOutputs(txOutId) {
    const client = await pool.connect();
    try {
        const res = await client.query(`select * from ma_tx_out where tx_out_id = ${txOutId}`)
        return res.rows
    } finally {
        client.release();
    }
}

export async function querMultiAssetInfo(id) {
    const client = await pool.connect();
    try {
        const res = await client.query(`select * from multi_asset where id = ${id}`)
        return res.rows
    } finally {
        client.release();
    }
}