"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItemSchema = exports.CartAttributeSchema = void 0;
const mongoose_1 = require("mongoose");
exports.CartAttributeSchema = new mongoose_1.Schema({
    group_id: {
        type: String,
        required: true,
    },
    attribute: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
}, { _id: false });
exports.CartItemSchema = new mongoose_1.Schema({
    item: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    attributes: {
        type: [exports.CartAttributeSchema],
        required: true,
        default: [],
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
});
