"use server"

import {
    Address,
    BaseAddress, ByronAddress,
    RewardAddress, Transaction,
} from "@emurgo/cardano-serialization-lib-asmjs"

import {
    queryAddressBalance,
    queryAddressFirstSeen,
    queryAddressLastSeen,
    queryAddressTxCount,
    queryBlock,
    queryMultiAssetInfo, queryPaymentAddressesForStakeAddress,
    queryStakeAddressTotalStake,
    queryTransactionByHash,
    queryTransactionById,
    queryTransactionInputs,
    queryTransactionMultiAssetOutputs,
    queryTransactionOutputs
} from "@/utils/database";
import {console} from "next/dist/compiled/@edge-runtime/primitives";

export async function getAddressInfo(address) {
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
    return {address, stakeAddress, firstSeen, lastSeen, txCount, balance, stakeAddressTotalStake, stakeAddressPaymentAddresses}
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
        const multiAssetOutputs = await queryTransactionMultiAssetOutputs(obj.id)
        for (const multiAssetOutput of multiAssetOutputs) {
            const multiAssetDetail = await queryMultiAssetInfo(multiAssetOutput.ident)
            tokens.push({
                policy: multiAssetDetail.policy.toString('hex'),
                assetName: multiAssetDetail.name.toString(),
                fingerprint: multiAssetDetail.fingerprint.toString(),
                quantity: parseInt(multiAssetOutput.quantity)
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
        const multiAssetOutputs = await queryTransactionMultiAssetOutputs(obj.id)
        for (const multiAssetOutput of multiAssetOutputs) {
            const multiAssetDetail = await queryMultiAssetInfo(multiAssetOutput.ident)
            tokens.push({
                policy: multiAssetDetail.policy.toString('hex'),
                assetName: multiAssetDetail.name.toString(),
                fingerprint: multiAssetDetail.fingerprint.toString(),
                quantity: parseInt(multiAssetOutput.quantity)
            })
        }
        // Stake address for wallet id determination
        const stakeAddress = await calculateStakeAddress(obj.address)
        outputs.push({...obj, tokens: tokens, wallet_id: walletBook.indexOf(stakeAddress || obj.address) + 1})
    }
    // query block data
    const block = await queryBlock(tx.block_id)
    return {hash, tx, outputs, inputs, block}
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