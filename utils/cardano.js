"use server"

import {
    Address,
    BaseAddress, ByronAddress,
    RewardAddress, Transaction,
} from "@emurgo/cardano-serialization-lib-asmjs"

import {
    queryAddressBalance,
    queryAddressTokenBalances,
    queryAddressFirstSeen,
    queryAddressLastSeen,
    queryAddressTxCount,
    queryBlock,
    queryMultiAssetInfo,
    queryPaymentAddressesForStakeAddress,
    queryTransactionByHash,
    queryTransactionById,
    queryTransactionInputs,
    queryTransactionOutputs,
    queryTransactionTokenOutputs, queryTransactionMetadata
} from "@/utils/database";
import {console} from "next/dist/compiled/@edge-runtime/primitives";

export async function getAddressInfo(address) {
    // Query basic infos
    let firstSeen = await queryAddressFirstSeen(address)
    let lastSeen = await queryAddressLastSeen(address)
    let txCount = await queryAddressTxCount(address)
    let balance = await queryAddressBalance(address)
    // Calculate the stake address for this payment address
    let stakeAddress = await calculateStakeAddress(address)
    let stakeAddressTotalStake = 0
    let stakeAddressPaymentAddresses = []
    if (stakeAddress != null) {
        // Query all payment addresses related to this stake address and their balances
        let paymentAddresses = await queryPaymentAddressesForStakeAddress(stakeAddress)
        for (const paymentAddress of paymentAddresses) {
            let paymentAddressBalance = await queryAddressBalance(paymentAddress.address)
            stakeAddressTotalStake += parseInt(paymentAddressBalance)
            stakeAddressPaymentAddresses.push({
                address: paymentAddress.address,
                balance: parseInt(paymentAddressBalance)
            })
        }
    }
    // Query token balances
    let tokenBalances = []
    let tokenBalancesRaw = await queryAddressTokenBalances(address)
    for (const tokenBalance of tokenBalancesRaw) {
        tokenBalances.push({
            policy: tokenBalance.policy.toString('hex'),
            assetName: tokenBalance.name.toString(),
            fingerprint: tokenBalance.fingerprint.toString(),
            quantity: parseInt(tokenBalance.quantity)
        })
    }
    return {address, stakeAddress, firstSeen, lastSeen, txCount, balance, stakeAddressTotalStake, stakeAddressPaymentAddresses, tokenBalances}
}

export async function getTransactionInfo(hash) {
    // Query transaction data
    const tx = await queryTransactionByHash(hash)
    if (tx == null) {
        return null
    }
    // Query transaction outputs
    const outputsRaw = await queryTransactionOutputs(tx.id)
    // Query transaction inputs
    const inputsRaw = await queryTransactionInputs(tx.id)
    // Keep track of which wallet the addresses belong to
    let walletBookRaw = []
    for (const obj of inputsRaw) {
        const stakeAddress = await calculateStakeAddress(obj.address)
        walletBookRaw.push(stakeAddress || obj.address)
    }
    for (const obj of outputsRaw) {
        const stakeAddress = await calculateStakeAddress(obj.address)
        walletBookRaw.push(stakeAddress || obj.address)
    }
    // Remove duplicates
    const walletBook = [...new Set(walletBookRaw)];
    // Query the previous transaction hash and add the wallet id for each input
    let inputs = []
    for (const obj of inputsRaw) {
        // Query tokens
        let tokens = []
        const tokenOutputs = await queryTransactionTokenOutputs(obj.id)
        for (const tokenOutput of tokenOutputs) {
            const tokenDetail = await queryMultiAssetInfo(tokenOutput.ident)
            tokens.push({
                policy: tokenDetail.policy.toString('hex'),
                assetName: tokenDetail.name.toString(),
                fingerprint: tokenDetail.fingerprint.toString(),
                quantity: parseInt(tokenOutput.quantity)
            })
        }
        // Previous Transaction
        const tx = await queryTransactionById(obj.tx_id)
        // Stake address for wallet id determination
        const stakeAddress = await calculateStakeAddress(obj.address)
        inputs.push({...obj, tokens: tokens, tx_hash: tx.hash.toString('hex'), wallet_id: walletBook.indexOf(stakeAddress || obj.address) + 1})
    }

    // Add the wallet id for each output
    let outputs = []
    for (const obj of outputsRaw) {
        // Query tokens
        let tokens = []
        const tokenOutputs = await queryTransactionTokenOutputs(obj.id)
        for (const tokenOutput of tokenOutputs) {
            const tokenDetail = await queryMultiAssetInfo(tokenOutput.ident)
            tokens.push({
                policy: tokenDetail.policy.toString('hex'),
                assetName: tokenDetail.name.toString(),
                fingerprint: tokenDetail.fingerprint.toString(),
                quantity: parseInt(tokenOutput.quantity)
            })
        }
        // Stake address for wallet id determination
        const stakeAddress = await calculateStakeAddress(obj.address)
        outputs.push({...obj, tokens: tokens, wallet_id: walletBook.indexOf(stakeAddress || obj.address) + 1})
    }
    // Query block data
    const block = await queryBlock(tx.block_id)
    // Query transaction metadata
    const metadata = await queryTransactionMetadata(tx.id)
    // Backtrace chart data
    // Level 1
    let backtraceData = {
        "name": "Tx",
        "children": []
    }
    for (const input of inputs) {
        // Level 2
        let backtraceData2 = {
            "name": `${input.address.slice(0,8)}...${input.address.slice(input.address.length-4)} \n${Math.floor(input.value/1000000)} ₳`,
            "children": []
        }
        const inputsLevel2 = await queryTransactionInputs(input.tx_id)
        for (const input of inputsLevel2) {
            // Level 3
            let backtraceData3 = {
                "name": `${input.address.slice(0,8)}...${input.address.slice(input.address.length-4)} \n${Math.floor(input.value/1000000)} ₳`,
                "children": []
            }
            const inputsLevel3 = await queryTransactionInputs(input.tx_id)
            for (const input of inputsLevel3) {
                // Level 4
                backtraceData3.children.push({
                    "name": `${input.address.slice(0,8)}...${input.address.slice(input.address.length-4)} \n${Math.floor(input.value/1000000)} ₳`
                })
            }

            backtraceData2.children.push(backtraceData3)
        }
        backtraceData.children.push(backtraceData2)
    }
    return {hash, tx, outputs, inputs, block, metadata, backtraceData}
}

export async function validateShellyAddress(address) {
    try {
        Address.from_bech32(address);
        return true
    } catch (e) {
        console.log(e)
        return false
    }
}

export async function validateByronAddress(address) {
    try {
        ByronAddress.from_base58(address);
        return true
    } catch (e) {
        console.log(e)
        return false
    }
}

export async function validateTransactionHash(hash) {
    try {
        Transaction.from_hex(hash);
        return true
    } catch (e) {
        console.log(e)
        return false
    }
}

export async function calculateStakeAddress(address) {
    try {
        let addr = Address.from_bech32(address)
        let base_addr = BaseAddress.from_address(addr)
        if (base_addr == null) {
            return null
        }
        let stake_cred = base_addr.stake_cred()
        let reward_addr_bytes = new Uint8Array(29)
        reward_addr_bytes.set([0xe1], 0)
        reward_addr_bytes.set(stake_cred.to_bytes().slice(4, 32), 1)
        let reward_addr = RewardAddress.from_address(Address.from_bytes(reward_addr_bytes))
        return reward_addr.to_address().to_bech32()
    } catch (e) {
        return null
    }
}