"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartItemsEquality = exports.CartItemSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cartAdditionsModel_1 = require("./cartAdditionsModel");
exports.CartItemSchema = new mongoose_1.default.Schema({
    item: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
    },
    additions: {
        type: [cartAdditionsModel_1.CartAdditionSchema],
        required: true,
        default: [],
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
});
const cartItemsEquality = (a, b) => {
    if (a.item.toString() !== b.item.toString()) {
        return false;
    }
    if (a.additions.length !== b.additions.length) {
        return false;
    }
    const uniqueIdentifiers = a.additions
        .concat(b.additions)
        .map((el) => `${el.group_id.toString()}${el.addition_id.toString()}${el.quantity}`);
    const occurences = [...new Set(uniqueIdentifiers)];
    return occurences.length === a.additions.length;
};
exports.cartItemsEquality = cartItemsEquality;
