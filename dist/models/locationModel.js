"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location = void 0;
const mongoose_1 = require("mongoose");
const LocationSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    locality: {
        type: String,
        required: true,
    },
    is_open: {
        type: Boolean,
        required: true,
    },
});
exports.Location = (0, mongoose_1.model)("Location", LocationSchema);
