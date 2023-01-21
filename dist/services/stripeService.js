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
const stripe_1 = __importDefault(require("stripe"));
class StripeService {
    constructor() {
        this.stripeKey = process.env.STRIPE_SECRET || "";
        this.stripe = new stripe_1.default(this.stripeKey, { apiVersion: "2022-11-15" });
    }
    createCustomer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                description: id,
            };
            try {
                const customer = yield this.stripe.customers.create(params);
                return customer.id;
            }
            catch (error) {
                console.log(`CreateCustomer error: ${error}`);
                return null;
            }
        });
    }
    setupIntent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const intent = yield this.stripe.setupIntents.create({
                    customer: id,
                });
                return intent.client_secret;
            }
            catch (error) {
                console.log(`SetupIntent error: ${error}`);
                return null;
            }
        });
    }
    paymentIntent(id, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const intent = yield this.stripe.paymentIntents.create({
                    customer: id,
                    amount: amount / 10,
                    currency: "eur",
                });
                if (intent.client_secret) {
                    return { secret: intent.client_secret, id: intent.id };
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log(`PaymentIntent error: ${error}`);
                return null;
            }
        });
    }
    paymentMethods(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const methods = yield this.stripe.paymentMethods.list({
                    customer: id,
                    type: "card",
                });
                const filteredMethods = methods.data.filter((method) => method.card !== undefined);
                const mappedMethods = filteredMethods.map((method) => ({
                    id: method.id,
                    brand: method.card.brand,
                    last4: method.card.last4,
                    exp_month: method.card.exp_month,
                    exp_year: method.card.exp_year,
                }));
                return mappedMethods;
            }
            catch (error) {
                console.log(`PaymentMethods error: ${error}`);
                return [];
            }
        });
    }
    detach(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _ = yield this.stripe.paymentMethods.detach(id);
                return true;
            }
            catch (error) {
                console.log(`DetachPaymentMethod error: ${error}`);
                return false;
            }
        });
    }
    fetchPaymentIntent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const intent = yield this.stripe.paymentIntents.retrieve(id);
                return intent;
            }
            catch (error) {
                console.log(`FetchPaymentMethod error: ${error}`);
                return null;
            }
        });
    }
    refundPaymentIntent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refund = yield this.stripe.refunds.create({
                    payment_intent: id,
                });
                return refund;
            }
            catch (error) {
                console.log(`RefundPaymentIntent error: ${error}`);
                return null;
            }
        });
    }
}
exports.default = StripeService;
