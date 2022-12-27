"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanCart = exports.Cart = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cartItemModel_1 = require("./cartItemModel");
const cartSchema = new mongoose_1.default.Schema({
    owner_id: {
        type: String,
        required: true,
        default: "",
    },
    items: {
        type: [cartItemModel_1.CartItemSchema],
        required: true,
        default: [],
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});
cartSchema.statics.build = (attr) => {
    return new exports.Cart(attr);
};
exports.Cart = mongoose_1.default.model("Cart", cartSchema);
const cleanCart = (cart) => {
    const items = cart.items.map((item) => {
        const additions = item.additions.filter((addition) => addition.quantity > 0);
        return {
            item: item.item,
            additions: additions,
            quantity: item.quantity,
        };
    });
    return { items: items };
};
exports.cleanCart = cleanCart;
