"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const additionGroupModel_1 = require("./additionGroupModel");
const itemSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    available: {
        type: Boolean,
        required: true,
        default: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Boolean,
        required: true,
        default: false,
    },
    discount_price: {
        type: Number,
        required: true,
    },
    discount_label: {
        type: String,
        required: true,
        default: "",
    },
    additions: {
        type: [additionGroupModel_1.AdditionGroupSchema],
        required: true,
        default: [],
    },
    tags: {
        type: [String],
        required: true,
        default: [],
    },
    category: {
        type: String,
        required: true,
        default: "",
    },
    media_url: {
        type: String,
        required: true,
        default: "",
    },
    preview_url: {
        type: String,
        required: true,
        default: "",
    },
});
itemSchema.statics.build = (attr) => {
    return new Item(attr);
};
// export const Item = mongoose.model<ItemDoc, ItemModelInterface>(
//   "Item",
//   itemSchema
// );
