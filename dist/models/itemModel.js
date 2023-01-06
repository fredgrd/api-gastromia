"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = exports.isItem = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const itemAttributeModel_1 = require("./itemAttributeModel");
// --------------------------------------------------------------------------
// Helpers
// Checks if the object provided is an Item
/// Update the length check of the object keys w/ latest value
const isItem = (item) => {
    const unsafeCast = item;
    return (unsafeCast._id !== undefined &&
        unsafeCast.name !== undefined &&
        unsafeCast.description !== undefined &&
        unsafeCast.details !== undefined &&
        unsafeCast.ingredients !== undefined &&
        unsafeCast.available !== undefined &&
        unsafeCast.quick_add !== undefined &&
        unsafeCast.price !== undefined &&
        unsafeCast.discount !== undefined &&
        unsafeCast.discount_price !== undefined &&
        unsafeCast.discount_label !== undefined &&
        unsafeCast.attribute_groups !== undefined &&
        unsafeCast.tags !== undefined &&
        unsafeCast.category !== undefined &&
        unsafeCast.media_url !== undefined &&
        unsafeCast.preview_url !== undefined &&
        unsafeCast.item_version !== undefined);
};
exports.isItem = isItem;
const ItemSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        default: "",
    },
    ingredients: {
        type: String,
        default: "",
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
    item_version: {
        type: String,
        required: true,
        default: (0, uuid_1.v4)(),
    },
});
exports.Item = (0, mongoose_1.model)("Item", ItemSchema);
