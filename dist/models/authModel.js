"use strict";
// --------------------------------------------------------------------------
// Helpers
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOperatorToken = exports.isAuthToken = exports.isSignupToken = void 0;
const isSignupToken = (token) => {
    const unsafeCast = token;
    return (unsafeCast.number !== undefined &&
        unsafeCast.iat !== undefined &&
        unsafeCast.exp !== undefined);
};
exports.isSignupToken = isSignupToken;
const isAuthToken = (token) => {
    const unsafeCast = token;
    return (unsafeCast.id !== undefined &&
        unsafeCast.stripe_id !== undefined &&
        unsafeCast.number !== undefined &&
        unsafeCast.iat !== undefined &&
        unsafeCast.exp !== undefined);
};
exports.isAuthToken = isAuthToken;
const isOperatorToken = (token) => {
    const unsafeCast = token;
    return (unsafeCast.id !== undefined &&
        unsafeCast.iat !== undefined &&
        unsafeCast.exp !== undefined);
};
exports.isOperatorToken = isOperatorToken;
