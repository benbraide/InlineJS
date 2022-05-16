export function BeginsWith(match, ignoreCase = false) {
    return (new RegExp(`^${match}`, (ignoreCase ? 'i' : undefined)));
}
