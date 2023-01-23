"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = () => {
    const username = process.env.MONGODB_USERNAME;
    const password = process.env.MONGODB_PASSWORD;
    console.log(username, password);
    const uri = `mongodb+srv://${username}:${password}@cluster0.xq6fi.mongodb.net/?retryWrites=true&w=majority`;
    mongoose_1.default.connect(uri, { dbName: "miaDB" }, (error) => {
        if (error) {
            console.log(`MongoDB connection error: ${error}`);
        }
        else {
            console.log("Connected to MongoDB 🚀");
        }
    });
};
exports.connectDatabase = connectDatabase;
