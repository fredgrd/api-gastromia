"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operator = void 0;
const mongoose_1 = require("mongoose");
const OperatorSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});
exports.Operator = (0, mongoose_1.model)("Operator", OperatorSchema);
// --------------------------------------------------------------------------
// Helpers
// export const isDatabaseOpsToken = (token: any): token is IDatabaseOpsToken => {
//   const unsafeCast = token as IDatabaseOpsToken;
//   return (
//     unsafeCast.name !== undefined &&
//     unsafeCast.email !== undefined &&
//     unsafeCast.iat !== undefined &&
//     unsafeCast.exp !== undefined
//   );
// };
