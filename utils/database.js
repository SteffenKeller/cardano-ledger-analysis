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

export async function queryAddressFirstSeen(address) {
    const query =
        `
        SELECT 
            MIN(block.time) AS time
        FROM 
            tx
        JOIN 
            tx_out ON tx.id = tx_out.tx_id
        JOIN
            block ON tx.block_id = block.id
        WHERE 
            tx_out.address = '${address}';    
        `
    const client = await pool.connect();
    try {
        const res = await client.query(query)
        const date = new Date(res.rows[0].time)
        return date
    } finally {
        client.release();
    }
}

export async function queryAddressTxCount(address) {
    const query =
        `
        SELECT 
            COUNT(DISTINCT tx_id) AS num_transactions
        FROM (
            -- Count transactions where the address was used as input
            SELECT 
                tx.id AS tx_id
            FROM 
                tx_out
            JOIN 
                tx_in ON tx_out.tx_id = tx_in.tx_out_id
            JOIN 
                tx ON tx.id = tx_in.tx_in_id AND tx_in.tx_out_index = tx_out.index
            WHERE 
                tx_out.address = '${address}'
          
            UNION
          
            -- Count transactions where the address was used as output
            SELECT 
                tx.id AS tx_id
            FROM 
                tx
            JOIN    
                tx_out ON tx.id = tx_out.tx_id
            WHERE 
                tx_out.address = '${address}'
        ) AS combined;
        `
    const client = await pool.connect();
    try {
        const res = await client.query(query)
        console.log(res.rows)
        return res.rows[0].num_transactions
    } finally {
        client.release();
    }
}

export async function queryAddressBalance(address) {
    const query =
        `
        SELECT 
            SUM(tx_out.value) AS current_balance
        FROM 
            tx_out
        LEFT JOIN 
            tx_in ON tx_out.tx_id = tx_in.tx_out_id AND tx_out.index = tx_in.tx_out_index
        WHERE 
            tx_out.address = '${address}' AND tx_in.tx_out_id IS NULL;
        `
    const client = await pool.connect();
    try {
        const res = await client.query(query)
        return res.rows[0].current_balance || 0
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