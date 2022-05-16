export function EndsWith(match, ignoreCase = false) {
    return (new RegExp(`${match}$`, (ignoreCase ? 'i' : undefined)));
}
