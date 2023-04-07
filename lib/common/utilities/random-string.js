"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomString = void 0;
function RandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
}
exports.RandomString = RandomString;
