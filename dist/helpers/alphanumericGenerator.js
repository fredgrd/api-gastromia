"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomAlphanumeric = void 0;
// Generates a random alphanumeric code of length N
// Used to generate a reference code when creating an order
const randomAlphanumeric = (length) => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = length; i > 0; --i) {
        result += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return result.toUpperCase();
};
exports.randomAlphanumeric = randomAlphanumeric;
