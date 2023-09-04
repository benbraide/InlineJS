export function RandomString(length?: number, charset?: string){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: (length || 11) }, () => (charset || characters).charAt(Math.floor(Math.random() * (charset || characters).length))).join('');
}
