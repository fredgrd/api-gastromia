"use strict";
// --------------------------------------------------------------------------
// Helpers
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDatabaseOpsToken = void 0;
const isDatabaseOpsToken = (token) => {
    const unsafeCast = token;
    return (unsafeCast.name !== undefined &&
        unsafeCast.email !== undefined &&
        unsafeCast.iat !== undefined &&
        unsafeCast.exp !== undefined);
};
exports.isDatabaseOpsToken = isDatabaseOpsToken;
