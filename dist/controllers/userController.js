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
exports.createUser = exports.fetchUser = void 0;
const userModel_1 = require("../models/userModel");
const stripeService_1 = __importDefault(require("../services/stripeService"));
const jwtTokens_1 = require("../helpers/jwtTokens");
// Fetches the user from a valid AuthToken
/// Returns both the User object and an updated AuthToken
const fetchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.auth_token;
    if (!token || typeof token !== "string") {
        console.log("FetchUser error: MissingToken");
        res.sendStatus(403);
        return;
    }
    // Verify token
    const authtoken = (0, jwtTokens_1.verifyAuthToken)(token);
    if (!authtoken) {
        console.log("FetchUser error: NotAuthToken");
        res.sendStatus(403);
        return;
    }
    try {
        const user = yield userModel_1.User.findById(authtoken.id).orFail();
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
        });
        res.status(200).json(user);
    }
    catch (error) {
        const mongooseError = error;
        console.log(`FetchUser error: ${mongooseError.message}`);
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
            email: "noemail",
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
            });
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
