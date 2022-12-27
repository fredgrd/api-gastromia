"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartAdditionSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.CartAdditionSchema = new mongoose_1.default.Schema({
    group_id: {
        type: String,
        required: true,
    },
    addition_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Addition",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
}, { _id: false });
