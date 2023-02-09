"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.isCreateOrderData = void 0;
const mongoose_1 = require("mongoose");
const cartSnapshot_1 = require("./cartSnapshot");
// --------------------------------------------------------------------------
// Helpers
const isCreateOrderData = (data) => {
    const unsafeCast = data;
    return (unsafeCast.user_name !== undefined &&
        unsafeCast.user_number !== undefined &&
        unsafeCast.items_snapshot !== undefined &&
        unsafeCast.items_snapshot.length > 0 &&
        unsafeCast.info !== undefined &&
        unsafeCast.interval !== undefined &&
        unsafeCast.cash_payment !== undefined &&
        unsafeCast.card_payment !== undefined &&
        unsafeCast.card_payment_method !== undefined);
};
exports.isCreateOrderData = isCreateOrderData;
const OrderSchema = new mongoose_1.Schema({
    code: {
        type: String,
        default: 'AAAAA',
    },
    user_id: {
        type: String,
        required: true,
    },
    user_name: {
        type: String,
        required: true,
    },
    user_number: {
        type: String,
        required: true,
    },
    interval: {
        type: String,
        required: true,
    },
    items: {
        type: [cartSnapshot_1.CartItemSnapshotSchema],
        required: true,
    },
    info: {
        type: String,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: [
            'pending',
            'submitted',
            'accepted',
            'rejected',
            'ready',
            'stalled',
            'refunded',
            'completed',
        ],
        default: 'pending',
    },
    cash_payment: {
        type: Boolean,
        required: true,
    },
    card_payment: {
        type: Boolean,
        required: true,
    },
    card_payment_intent: {
        type: String,
        default: '',
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});
exports.Order = (0, mongoose_1.model)('Order', OrderSchema);
