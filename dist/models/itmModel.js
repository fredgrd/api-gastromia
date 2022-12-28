"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const mongoose_1 = require("mongoose");
const itemAttributeModel_1 = require("./itemAttributeModel");
const ItemSchema = new mongoose_1.Schema({
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
    quick_add: {
        type: Boolean,
        required: true,
        default: false,
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
    attribute_groups: {
        type: [itemAttributeModel_1.ItemAttributeGroupSchema],
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
exports.Item = (0, mongoose_1.model)("Item", ItemSchema);
