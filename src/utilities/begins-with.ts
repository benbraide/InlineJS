export function BeginsWith(match: string, ignoreCase = false){
    return (new RegExp(`^${match}`, (ignoreCase ? 'i' : undefined)));
}
