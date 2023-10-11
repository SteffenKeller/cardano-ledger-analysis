/**
 * Formats a date object to an UTC string.
 * @param date
 * @returns {string}
 */
export function formatDate(date) {
    return new Date(date).toUTCString()
}

/**
 * Returns a formatted string showing the time passed since a given date.
 * @param date
 * @returns {string}
 */
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

/**
 * Formats a lovelace value to a comma seperated ADA string with 6 digits. 1 ADA = 1,000,000 lovelace.
 * @param lovelace
 * @returns {string}
 */
export function formatLovelace(lovelace) {
    return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 6, minimumFractionDigits: 6}).format(lovelace / 1_000_000)} ₳`
}

/**
 * Truncates a transaction hash to a shorter but still distinguishable string.
 * @param hash
 * @returns {string}
 */
export function truncateTransactionHash(hash) {
    return hash.slice(0,6)+'...'+hash.slice(58)
}

