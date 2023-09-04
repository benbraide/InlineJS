export function ToSnakeCase(value, separator = '-') {
    separator = (separator || '-');
    let converted = value.replace(/([A-Z]+)/g, (match) => `${separator}${match.toLowerCase()}`);
    return (converted.startsWith(separator) ? converted.substring(1) : converted);
}
