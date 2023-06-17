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
exports.updateUser = exports.createUser = exports.fetchUser = void 0;
const uuid_1 = require("uuid");
const userModel_1 = require("../models/userModel");
const stripeService_1 = __importDefault(require("../services/stripeService"));
const jwtTokens_1 = require("../helpers/jwtTokens");
const authenticateUser_1 = __importDefault(require("../helpers/authenticateUser"));
// Fetches the user from a valid AuthToken
/// Returns both the User object and an updated AuthToken
const fetchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = (0, authenticateUser_1.default)(req, res, "FetchUser");
    if (!authToken) {
        return;
    }
    console.log("AUTHTOKEN", req.cookies.auth_token);
    try {
        const user = yield userModel_1.User.findById(authToken.id).orFail();
        // Update the AuthToken
        const token = (0, jwtTokens_1.signAuthToken)({
            id: user.id,
            stripe_id: user.stripe_id,
            number: user.number,
        });
        res.cookie("auth_token", token, {
            maxAge: 60 * 60 * 24 * 10 * 1000,
            httpOnly: true,
            secure: true,
            domain: "gastromia.app",
        });
        res.status(200).json(user);
    }
    catch (error) {
        const mongooseError = error;
        console.log(`FetchUser error: ${mongooseError.message}`);
        res.clearCookie("auth_token");
        res.sendStatus(500);
    }
});
exports.fetchUser = fetchUser;
// Creates a user from a valid signup token
/// Returns both the User object and an AuthToken
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.signup_token;
    const name = req.body.name;
    const stripeService = new stripeService_1.default();
    if (!token || typeof token !== "string") {
        console.log("CreateUser error: MissingToken");
        res.sendStatus(403);
        return;
    }
    // Verify token
    const signupToken = (0, jwtTokens_1.verifySignupToken)(token);
    console.log("USER SIGNUP TOKEN");
    console.log(signupToken, token);
    if (!signupToken) {
        console.log("CreateUser error: NotSignupToken");
        res.sendStatus(403);
        return;
    }
    try {
        const user = yield userModel_1.User.create({
            stripe_id: "awaiting",
            number: signupToken.number,
            name: name,
            email: `unknown-${(0, uuid_1.v4)()}`,
        });
        const customerId = yield stripeService.createCustomer(user.id);
        if (customerId) {
            user.stripe_id = customerId;
            yield user.save();
            // Set cookie
            const token = (0, jwtTokens_1.signAuthToken)({
                id: user.id,
                stripe_id: user.stripe_id,
                number: user.number,
            });
            res.cookie("auth_token", token, {
                maxAge: 60 * 60 * 24 * 10 * 1000,
                httpOnly: true,
                secure: true,
                domain: "gastromia.app",
            });
            res.clearCookie("signup_token");
            res.status(200).json(user);
        }
        else {
            user.delete();
            console.log("CreateUser error: StripeCustomerError");
            res.sendStatus(500);
        }
    }
    catch (error) {
        const mongooseError = error;
        console.log(`CreateUser error: ${mongooseError.message}`);
        res.sendStatus(400);
    }
});
exports.createUser = createUser;
// Updates the user
// Updates the user document
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = (0, authenticateUser_1.default)(req, res, "UpdateUser");
    if (!authToken) {
        return;
    }
    const update = req.body.update;
    if (!update) {
        console.log("UpdateUser error: UpdateNotProvided");
        res.sendStatus(400);
    }
    try {
        const user = yield userModel_1.User.findByIdAndUpdate(authToken.id, Object.assign({}, update), { returnOriginal: false }).orFail();
        res.status(200).json(user);
    }
    catch (error) {
        const mongooseError = error;
        console.log(`UpdateUser error: ${mongooseError.message}`);
        res.sendStatus(500);
    }
});
exports.updateUser = updateUser;
