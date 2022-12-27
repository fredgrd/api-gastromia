"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Addition = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const additionSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    unique_tag: {
        type: String,
        require: true,
        default: "",
    },
    price: {
        type: Number,
        required: true,
    },
    available: {
        type: Boolean,
        required: true,
        default: true,
    },
    media_url: {
        type: String,
        required: true,
        default: "",
    },
});
additionSchema.statics.build = (attr) => {
    return new exports.Addition(attr);
};
exports.Addition = mongoose_1.default.model("Addition", additionSchema);
