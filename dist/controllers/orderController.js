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
exports.fetchOrders = exports.updatePaidOrder = exports.createOrder = void 0;
const mongoose_1 = require("mongoose");
const itemModel_1 = require("../models/itemModel");
const cartUtils_1 = require("../helpers/cartUtils");
const cartModel_1 = require("../models/cartModel");
const stripeService_1 = __importDefault(require("../services/stripeService"));
const authenticateUser_1 = __importDefault(require("../helpers/authenticateUser"));
const orderModel_1 = require("../models/orderModel");
const alphanumericGenerator_1 = require("../helpers/alphanumericGenerator");
// Creates the order
//// If the items validation fails it returns a CartUpdate object
//// If the order creation succeeds it returns the order id w/ status
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = (0, authenticateUser_1.default)(req, res, "CreateOrder");
    if (!authToken) {
        return;
    }
    const data = req.body;
    // Check data
    if (!data || !(0, orderModel_1.isCreateOrderData)(data)) {
        console.log("CreateOrder error: InvalidData");
        res.status(400).send("InvalidData");
        return;
    }
    // START VALIDATION
    try {
        const items = yield itemModel_1.Item.find({
            _id: {
                $in: [
                    ...new Set(data.items_snapshot.map((e) => new mongoose_1.Types.ObjectId(e.item_id))),
                ],
            },
        }).populate("attribute_groups.attributes");
        const castedItems = items.filter((e) => (0, itemModel_1.isItem)(e));
        // Validate
        const { included, excluded } = (0, cartUtils_1.validateCartSnapshot)(castedItems, data.items_snapshot);
        // Local and remote checkouts objects do not match!
        if (excluded.length) {
            yield cartModel_1.Cart.findOneAndUpdate({ owner_id: authToken.id }, { items: included });
            // Return
            const response = {
                included: included,
                excluded: excluded,
                order_id: null,
                order_status: null,
                client_secret: null,
            };
            res.status(202).json(Object.assign({}, response));
            return;
        }
        // Price snapshot
        const total = (0, cartUtils_1.priceCartSnapshot)(included);
        let clientSecret;
        let intentId;
        if (data.card_payment) {
            const stripeService = new stripeService_1.default();
            const result = yield stripeService.paymentIntent(authToken.stripe_id, total);
            if (result && (result === null || result === void 0 ? void 0 : result.secret) && result.id) {
                clientSecret = result.secret;
                intentId = result.id;
            }
            else {
                console.log("CreateOrder error: PaymentIntentError");
                res.status(500).send("PaymentIntentError");
                return;
            }
        }
        // Create order
        const order = yield orderModel_1.Order.create({
            user_id: authToken.id,
            code: (0, alphanumericGenerator_1.randomAlphanumeric)(5),
            items: included,
            total: total,
            interval: data.interval,
            status: data.cash_payment ? "submitted" : "pending",
            cash_payment: data.cash_payment,
            card_payment: data.card_payment,
            card_payment_intent: intentId,
        });
        const response = {
            included: [],
            excluded: [],
            order_id: order.id,
            order_status: order.status,
            client_secret: clientSecret ? clientSecret : null,
        };
        res.status(200).json(Object.assign({}, response));
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});
exports.createOrder = createOrder;
const updatePaidOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = (0, authenticateUser_1.default)(req, res, "CreateOrder");
    if (!authToken) {
        return;
    }
    const id = req.body.id;
    const orderId = req.body.order_id;
    if (id && orderId) {
        const stripeService = new stripeService_1.default();
        const paymentIntent = yield stripeService.fetchPaymentIntent(id);
        if (paymentIntent && paymentIntent.status === "succeeded") {
            try {
                yield orderModel_1.Order.findByIdAndUpdate(orderId, {
                    status: "submitted",
                }).orFail();
                res.sendStatus(200);
            }
            catch (error) {
                const mongooseError = error;
                console.log(`UpdatePaidOrder error: ${mongooseError.name}`);
                res.sendStatus(500);
            }
        }
        else {
            console.log("UpdatePaidOrder error: PaymentNotCompleted");
            res.status(400).send("PaymentNotCompleted");
        }
    }
    else {
        console.log("UpdatePaidOrder error: SecretNotProvided");
        res.status(400).send("SecretNotProvided");
    }
});
exports.updatePaidOrder = updatePaidOrder;
// Fetch the user orders
const fetchOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = (0, authenticateUser_1.default)(req, res, "CreateOrder");
    if (!authToken) {
        return;
    }
    try {
        const orders = yield orderModel_1.Order.find({ user_id: authToken.id }).orFail();
        res.status(200).json({ orders: orders });
    }
    catch (error) {
        const mongooseError = error;
        console.log(`FetchOrders error: ${mongooseError.name}`);
        res.sendStatus(500);
    }
});
exports.fetchOrders = fetchOrders;
