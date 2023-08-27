export function formatDate(date) {
    return new Date(date).toUTCString()
}

export function formatLovelace(lovelace) {
    return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 6, minimumFractionDigits: 6}).format(lovelace / 1_000_000)} ₳`
}