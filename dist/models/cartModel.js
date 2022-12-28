"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const mongoose_1 = require("mongoose");
const cartItemModel_1 = require("./cartItemModel");
const CartSchema = new mongoose_1.Schema({
    owner_id: {
        type: String,
        required: true,
    },
    items: {
        type: [cartItemModel_1.CartItemSchema],
        required: true,
        default: [],
    },
});
exports.Cart = (0, mongoose_1.model)("Cart", CartSchema);
