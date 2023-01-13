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
exports.fetchCards = exports.createSetupIntent = void 0;
const jwtTokens_1 = require("../helpers/jwtTokens");
const stripeService_1 = __importDefault(require("../services/stripeService"));
const createSetupIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.auth_token;
    if (!token || typeof token !== "string") {
        console.log("UpdateCart error: MissingToken");
        res.status(403).send("MissingToken");
        return;
    }
    // Verify token
    const authtoken = (0, jwtTokens_1.verifyAuthToken)(token);
    if (!authtoken) {
        console.log("UpdateCart error: NotAuthToken");
        res.status(403).send("NotAuthToken");
        return;
    }
    const stripe = new stripeService_1.default();
    const setupIntent = yield stripe.setupIntent(authtoken.stripe_id);
    if (setupIntent) {
        res.status(200).json({ client_secret: setupIntent });
    }
    else {
        res.sendStatus(500);
    }
});
exports.createSetupIntent = createSetupIntent;
const fetchCards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.auth_token;
    if (!token || typeof token !== "string") {
        console.log("UpdateCart error: MissingToken");
        res.status(403).send("MissingToken");
        return;
    }
    // Verify token
    const authtoken = (0, jwtTokens_1.verifyAuthToken)(token);
    if (!authtoken) {
        console.log("UpdateCart error: NotAuthToken");
        res.status(403).send("NotAuthToken");
        return;
    }
    const stripe = new stripeService_1.default();
    const cards = yield stripe.paymentMethods(authtoken.stripe_id);
    res.status(200).json({ cards: cards });
});
exports.fetchCards = fetchCards;
