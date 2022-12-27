"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdditionGroupSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var RuleType;
(function (RuleType) {
    RuleType["SelectOne"] = "select-one";
    RuleType["SelectMany"] = "select-many";
    RuleType["AddMany"] = "add-many";
})(RuleType || (RuleType = {}));
const AdditionGroupRules = new mongoose_1.default.Schema({
    rule_type: {
        type: String,
        enum: ["select-one", "select-many", "add-many"],
        required: true,
    },
    select_one_min: {
        type: Number,
        required: true,
        default: 0,
    },
    select_many_min: {
        type: Number,
        required: true,
        default: 0,
    },
    select_many_max: {
        type: Number,
        required: true,
        default: 5,
    },
    add_many_min: {
        type: Number,
        required: true,
        default: 0,
    },
    add_many_max: {
        type: Number,
        required: true,
        default: 5,
    },
});
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
