export function ToCamelCase(value, ucfirst, separator) {
    let [first = '', ...rest] = value.trim().split(separator || '-'), capitalize = (word) => (word.charAt(0).toUpperCase() + word.substring(1));
    return (first && ((ucfirst ? capitalize(first) : first) + (rest || []).map(word => capitalize(word)).join('')));
}
