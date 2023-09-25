"use server";

import { Pool } from 'pg'

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    max: 20,
    idleTimeoutMillis: 60000,
});

export async function checkDBSyncStatus() {
    const query =
        `
        SELECT 
            epoch_no,block_no,slot_no,timezone('UTC', time) as time
        FROM 
            block 
        ORDER BY 
            id DESC
        LIMIT
            1        
        `
    const client = await pool.connect();
    try {
        const res = await client.query(query.replace(/(\r\n|\n|\r)/gm, ""));
        const block = res.rows[0]
        const firstBlock = new Date('2017-09-23 21:44:51')
        const blockDate = new Date(block.time)
        const now = new Date()
        const behindSec = (now.getTime()-blockDate.getTime())/1000
        let behind = behindSec+' sec'
        if (behindSec > 60) {behind = (behindSec/60).toFixed() + ' min'}
        if (behindSec/60 > 60) {behind = (behindSec/60/60).toFixed()+'h'}
        if (behindSec/60/60 > 24) {behind = (behindSec/60/60/24).toFixed(2)+' days'}
        console.log('DB-Sync', `Epoch: ${block.epoch_no}, Block: ${block.block_no}, Slot: ${block.slot_no}, Sync: ${(((blockDate.getTime()-firstBlock.getTime())/(now.getTime()-firstBlock.getTime()))*100).toFixed(2)}%, Behind: ${behind}`)
    } finally {
        client.release();
    }


}

export async function queryRecentTransactions(n) {
    console.log('[DB-Sync]', 'Query recent transactions')
    const query =
        `
        SELECT 
            tx.id, tx.out_sum, timezone('UTC', block.time) as time, tx.hash, block.block_no
        FROM 
            tx
        JOIN
            block ON tx.block_id = block.id
        ORDER BY 
            id DESC
        LIMIT 
            ${n ?? 1}
        `
    const client = await pool.connect();
    try {
        const res = await client.query(query)
        return res.rows
    } finally {
        client.release();
    }
}

export async function queryTransactionsWithHighestOutputs(n) {
    console.log('[DB-Sync]', 'Query transactions by largest sum')
    const query =
        `
            SELECT
                tx.id, tx.out_sum, timezone('UTC', block.time) as time, tx.hash, block.block_no
            FROM
                tx
            JOIN
                block ON tx.block_id = block.id
            WHERE
                block.time >= (CURRENT_TIMESTAMP - INTERVAL '7 day')
            ORDER BY
                tx.out_sum DESC      
            LIMIT
                ${n}
        `
    const client = await pool.connect();
    try {
        const res = await client.query(query)
        return res.rows
    } finally {
        client.release();
    }
}

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
    console.log('[DB-Sync]', 'Query address first seen')
    const query =
        `
        SELECT 
            timezone('UTC', MIN(block.time)) AS time
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

export async function queryAddressLastSeen(address) {
    console.log('[DB-Sync]', 'Query address last seen')
    const query =
        `
        SELECT 
            timezone('UTC', MAX(block.time)) AS time
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
    console.log('[DB-Sync]', 'Query address tx count')
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
        return res.rows[0].num_transactions
    } finally {
        client.release();
    }
}

export async function queryAddressBalance(address) {
    console.log('[DB-Sync]', 'Query address balance')
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

export async function queryAddressTokenBalances(address) {
    console.log('[DB-Sync]', 'Query address balance')
    const query =
        `
        SELECT 
            policy,name,fingerprint,quantity
        FROM 
            tx_out
        LEFT JOIN 
            tx_in ON tx_out.tx_id = tx_in.tx_out_id AND tx_out.index = tx_in.tx_out_index
        LEFT JOIN 
            ma_tx_out ON ma_tx_out.tx_out_id = tx_out.id
	    INNER JOIN
	        multi_asset ON multi_asset.id = ma_tx_out.ident
        WHERE 
            tx_out.address = '${address}' AND tx_in.tx_out_id IS NULL;        `
    const client = await pool.connect();
    try {
        const res = await client.query(query)
        console.log(res)
        return res.rows
    } finally {
        client.release();
    }
}

export async function queryPaymentAddressesForStakeAddress(stakeAddress) {
    console.log('[DB-Sync]', 'Query payment addresses for stake address')
    const query =
        `
        SELECT 
            DISTINCT address
        FROM
            stake_address
        JOIN 
            utxo_view
        ON 
            stake_address.id = utxo_view.stake_address_id
        WHERE
            stake_address.view = '${stakeAddress}'
        `
    const client = await pool.connect();
    try {
        const res = await client.query(query)
        if (res.rows.length > 0) {
            return res.rows
        } else {
            return null
        }
    } finally {
        client.release();
    }
}

export async function queryTransactionByHash(hash) {
    console.log('[DB-Sync]', 'Query transaction')
    const query =
        `
        SELECT
            *
        FROM 
            tx
        WHERE
            hash = '\\x${hash}'
        LIMIT 1 
        `
    const client = await pool.connect();
    try {
        const res = await client.query(query)
        return res.rows[0]
    } finally {
        client.release();
    }
}

export async function queryTransactionById(id) {
    console.log('[DB-Sync]', 'Query transaction')
    const query =
        `
        SELECT
            *
        FROM 
            tx
        WHERE
            id = ${id}
        LIMIT 1 
        `
    const client = await pool.connect();
    try {
        const res = await client.query(query)
        return res.rows[0]
    } finally {
        client.release();
    }
}

export async function queryTransactionInputs(txId) {
    console.log('[DB-Sync]', 'Query transaction inputs')
    const query =
        `
        SELECT 
            tx_out.*
        FROM
            tx_out
        JOIN
            tx_in on tx_out.tx_id = tx_in.tx_out_id
        JOIN
            tx on tx.id = tx_in.tx_in_id AND tx_in.tx_out_index = tx_out.index 
        WHERE
            tx.id = ${txId}
        `
    const client = await pool.connect();
    try {
        const res = await client.query(query)
        return res.rows
    } finally {
        client.release();
    }
}

export async function queryTransactionOutputs(txId) {
    console.log('[DB-Sync]', 'Query transaction outputs')
    const query =
        `
        SELECT 
            * 
        FROM 
            tx_out 
        WHERE
            tx_id = ${txId}        
        `
    const client = await pool.connect();
    try {
        const res = await client.query(query)
        return res.rows
    } finally {
        client.release();
    }
}

export async function queryBlock(id) {
    console.log('[DB-Sync]', 'Query block')
    const query =
        `
        SELECT 
            *,timezone('UTC', time) as time
        FROM 
            block 
        WHERE
            id = ${id}        
        `
    const client = await pool.connect();
    try {
        const res = await client.query(query)
        return res.rows[0]
    } finally {
        client.release();
    }
}

export async function queryTransactionTokenOutputs(txOutId) {
    console.log('[DB-Sync]', 'Query transaction multi asset outputs')
    const query =
        `
        SELECT 
            *
        FROM
            ma_tx_out
        WHERE
            tx_out_id = ${txOutId}
        `
    const client = await pool.connect();
    try {
        const res = await client.query(query)
        return res.rows
    } finally {
        client.release();
    }
}

export async function queryMultiAssetInfo(id) {
    console.log('[DB-Sync]', 'Query multi asset info')
    const query =
        `
        SELECT 
            *
        FROM
            multi_asset
        WHERE
            id = ${id}
        `
    const client = await pool.connect();
    try {
        const res = await client.query(query)
        if (res.rows.length > 0) {
            return res.rows[0]
        } else {
            return null
        }
    } finally {
        client.release();
    }
}