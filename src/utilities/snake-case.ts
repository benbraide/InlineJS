export function ToSnakeCase(value: string, separator = '-') {
    separator = (separator || '-');
    const converted = value.replace(/([A-Z]+)/g, (match) => `${separator}${match.toLowerCase()}`);
    return (converted.startsWith(separator) ? converted.substring(1) : converted);
}
