export function formatDate(date) {
    return new Date(date).toUTCString()
}

export function timeSinceDate(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) {
        return `${seconds} seconds ago`
    } else if (seconds < 60*60) {
        return `${Math.floor(seconds / 60)} min ago`
    } else if (seconds < 60*60*24) {
        return `${Math.floor(seconds / (60*60))}h ago`
    } else {
        return `${Math.floor(seconds / (60*60*24))} days ago`
    }
}

export function formatLovelace(lovelace) {
    return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 6, minimumFractionDigits: 6}).format(lovelace / 1_000_000)} ₳`
}

export function truncateTransactionHash(hash) {
    return hash.slice(0,6)+'...'+hash.slice(58)
}

