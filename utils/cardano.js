import {
    Address,
    BaseAddress,
    RewardAddress,
} from "@emurgo/cardano-serialization-lib-asmjs"

export function getWalletInfo(address) {
    let stakeAddress
    try {
        stakeAddress = calculateStakeAddress(address)
    } catch (e) {
        console.log(e)
    }
    return {address, stakeAddress}
}

export function calculateStakeAddress(address) {
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
}