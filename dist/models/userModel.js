"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.isUser = void 0;
const mongoose_1 = require("mongoose");
// --------------------------------------------------------------------------
// Helpers
const isUser = (user) => {
    const unsafeCast = user;
    return (unsafeCast._id !== undefined &&
        unsafeCast.number !== undefined &&
        unsafeCast.name !== undefined &&
        unsafeCast.email !== undefined &&
        unsafeCast.createdAt !== undefined);
};
exports.isUser = isUser;
const userSchema = new mongoose_1.Schema({
    stripe_id: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        default: " ",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.User = (0, mongoose_1.model)("User", userSchema);
