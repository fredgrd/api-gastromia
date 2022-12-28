"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemAttributeGroupSchema = exports.ItemAttributeGroupRulesSchema = exports.ItemAttribute = void 0;
const mongoose_1 = require("mongoose");
const ItemAttributeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    unique_tag: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    available: {
        type: Boolean,
        required: true,
        default: true,
    },
    media_url: {
        type: String,
        required: true,
        default: " ",
    },
});
exports.ItemAttribute = (0, mongoose_1.model)("ItemAttribute", ItemAttributeSchema);
exports.ItemAttributeGroupRulesSchema = new mongoose_1.Schema({
    group_min: {
        type: Number,
        required: true,
        default: 0,
    },
    group_max: {
        type: Number,
        required: true,
        default: 1,
    },
    attribute_max: {
        type: Number,
        required: true,
        default: 1,
    },
}, { _id: false });
exports.ItemAttributeGroupSchema = new mongoose_1.Schema({
    with_media: {
        type: Boolean,
        required: true,
        default: false,
    },
    rules: {
        type: exports.ItemAttributeGroupRulesSchema,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    attributes: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "ItemAttribute",
        required: true,
        default: [],
    },
});
