"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItemSnapshotSchema = exports.CartItemAttributeSnapshotSchema = exports.isCartItemAttributeSnapshot = exports.isCartItemSnapshot = exports.areCartItemSnapshot = exports.isCartSnapshot = void 0;
const mongoose_1 = require("mongoose");
// --------------------------------------------------------------------------
// Helpers
const isCartSnapshot = (snapshot) => {
    const unsafeCast = snapshot;
    return unsafeCast.items_snapshot !== undefined;
};
exports.isCartSnapshot = isCartSnapshot;
const areCartItemSnapshot = (items) => {
    const areItemSnapshots = items.reduce((acc, curr) => {
        if ((0, exports.isCartItemSnapshot)(curr)) {
            return acc * 1;
        }
        else {
            return acc * 0;
        }
    }, 1);
    return areItemSnapshots === 1;
};
exports.areCartItemSnapshot = areCartItemSnapshot;
const isCartItemSnapshot = (snapshot) => {
    const unsafeCast = snapshot;
    return (unsafeCast._id !== undefined &&
        unsafeCast.item_id !== undefined &&
        unsafeCast.name !== undefined &&
        unsafeCast.preview_url !== undefined &&
        unsafeCast.attributes_snapshot !== undefined &&
        unsafeCast.quantity !== undefined &&
        unsafeCast.price !== undefined);
};
exports.isCartItemSnapshot = isCartItemSnapshot;
const isCartItemAttributeSnapshot = (snapshot) => {
    const unsafeCast = snapshot;
    return (unsafeCast.group_id !== undefined &&
        unsafeCast.attribute_id !== undefined &&
        unsafeCast.name !== undefined &&
        unsafeCast.quantity !== undefined &&
        unsafeCast.price !== undefined);
};
exports.isCartItemAttributeSnapshot = isCartItemAttributeSnapshot;
// --------------------------------------------------------------------------
// Schema
exports.CartItemAttributeSnapshotSchema = new mongoose_1.Schema({
    group_id: {
        type: String,
        required: true,
    },
    attribute_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});
exports.CartItemSnapshotSchema = new mongoose_1.Schema({
    item_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    preview_url: {
        type: String,
        required: true,
    },
    attributes_snapshot: {
        type: [exports.CartItemAttributeSnapshotSchema],
        required: true,
        default: [],
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});
