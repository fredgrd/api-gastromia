"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomAlphanumeric = void 0;
const randomAlphanumeric = (length) => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = length; i > 0; --i) {
        result += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return result.toUpperCase();
};
exports.randomAlphanumeric = randomAlphanumeric;
