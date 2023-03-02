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
exports.detachCard = exports.fetchCards = exports.createSetupIntent = void 0;
const User_1 = __importDefault(require("../helpers/authenticateUser"));
const stripeService_1 = __importDefault(require("../services/stripeService"));
// Creates a card setupintent w/ Strip SDK
// Used only by the Gastromia WebApp
const createSetupIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = (0, authenticateUser_1.default)(req, res, "CreateSetupIntent");
    console.log(req.cookies);
    if (!authToken) {
        return;
    }
    console.log("AUTH TOKEN", authToken);
    const stripe = new stripeService_1.default();
    const setupIntent = yield stripe.setupIntent(authToken.stripe_id);
    if (setupIntent) {
        res.status(200).json({ client_secret: setupIntent });
    }
    else {
        res.sendStatus(500);
    }
});
exports.createSetupIntent = createSetupIntent;
// Fetches all the cards that match the specific user customer id
// Used only by the Gastromia WebApp
const fetchCards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = (0, authenticateUser_1.default)(req, res, "CreateOrder");
    if (!authToken) {
        return;
    }
    const stripe = new stripeService_1.default();
    const cards = yield stripe.paymentMethods(authToken.stripe_id);
    res.status(200).json({ cards: cards });
});
exports.fetchCards = fetchCards;
const detachCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = (0, authenticateUser_1.default)(req, res, "CreateOrder");
    if (!authToken) {
        return;
    }
    const paymentMethod = req.body.payment_method_id;
    if (paymentMethod && typeof paymentMethod === "string") {
        const stripe = new stripeService_1.default();
        const detached = yield stripe.detach(paymentMethod);
        if (detached) {
            res.sendStatus(200);
        }
        else {
            res.sendStatus(500);
        }
    }
    else {
        res.sendStatus(400);
    }
});
exports.detachCard = detachCard;
