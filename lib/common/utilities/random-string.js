"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomString = void 0;
function RandomString(length, charset) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: (length || 11) }, () => (charset || characters).charAt(Math.floor(Math.random() * (charset || characters).length))).join('');
}
exports.RandomString = RandomString;
