"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coupon = void 0;
const mongoose_1 = require("mongoose");
const CouponSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    kind: {
        type: String,
        enum: ['absolute', 'percentage'],
        default: 'percentage',
    },
    value: {
        type: Number,
        required: true,
        default: 0,
    },
    redemptions: {
        type: Number,
        required: true,
        default: 0,
    },
    redemptions_max: {
        type: Number,
        required: true,
        default: 1,
    },
    expiry_date: {
        type: Date,
        required: true,
    },
});
exports.Coupon = (0, mongoose_1.model)('Coupon', CouponSchema);
