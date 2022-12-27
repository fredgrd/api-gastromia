"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdditionGroupSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AdditionGroupRules = new mongoose_1.default.Schema({
    group_min: {
        type: Number,
        required: true,
        default: 0,
    },
    group_max: {
        type: Number,
        required: true,
        default: 99,
    },
    addition_max: {
        type: Number,
        required: true,
        default: 99,
    },
}, { _id: false });
exports.AdditionGroupSchema = new mongoose_1.default.Schema({
    withMedia: {
        type: Boolean,
        required: true,
    },
    rules: {
        type: AdditionGroupRules,
        required: true,
    },
    additions: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "Addition",
        required: true,
        default: [],
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});
