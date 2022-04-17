export function ToCamelCase(value: string, ucfirst?: boolean, separator?: string){
    let [first = '', ...rest] = value.trim().split(separator || '-'), capitalize = (word: string) => (word.charAt(0).toUpperCase() + word.substring(1));
    return (first && ((ucfirst ? capitalize(first) : first) + (rest || []).map(word => capitalize(word)).join('')));
}
