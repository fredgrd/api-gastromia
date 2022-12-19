"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
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
        type: [String],
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
    return new exports.Item(attr);
};
exports.Item = mongoose_1.default.model("Item", itemSchema);
