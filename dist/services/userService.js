"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authModel_1 = require("../models/authModel");
const userModel_1 = require("../models/userModel");
class UserService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || "";
    }
    signToken(number) {
        const token = jsonwebtoken_1.default.sign({ number: number }, this.jwtSecret, {
            expiresIn: "365d", // Sign for less
        });
        return token;
    }
    signSignupToken(number) {
        const token = jsonwebtoken_1.default.sign({ number: number }, this.jwtSecret, {
            expiresIn: "10m",
        });
        return token;
    }
    verifySignupToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret);
            if ((0, authModel_1.isSignupToken)(decoded)) {
                return decoded;
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.log(`VerifySignupToken error: ${error}`);
            return null;
        }
    }
    signAuthToken(number) {
        const token = jsonwebtoken_1.default.sign({ number: number }, this.jwtSecret, {
            expiresIn: "10d",
        });
        return token;
    }
    verifyAuthToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret);
            console.log(decoded);
            return null;
        }
        catch (error) {
            console.log(`VerifyAuthToken error: ${error}`);
            return null;
        }
    }
    verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret);
            return decoded.number;
        }
        catch (error) {
            console.log(`VerifyToken error: ${error}`);
            return null;
        }
    }
    fetchUser(number) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const foundUser = userModel_1.User.findOne({ number: number });
                return foundUser;
            }
            catch (error) {
                console.log(`FetchUser error: ${error}`);
                return null;
            }
        });
    }
    createUser(attr) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.User.create(attr);
                return user;
            }
            catch (error) {
                const mongooseError = error;
                console.log(`CreateUser error: ${mongooseError.name}`);
                return null;
            }
        });
    }
}
exports.UserService = UserService;
