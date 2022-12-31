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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCart = exports.updateSnapshot = void 0;
const mongoose_1 = require("mongoose");
const cartModel_1 = require("../models/cartModel");
const itemModel_1 = require("../models/itemModel");
const jwtTokens_1 = require("../helpers/jwtTokens");
const cartUtils_1 = require("../helpers/cartUtils");
const cartSnapshot_1 = require("../models/cartSnapshot");
// --------------------------------------------------------------------------
// Cart
// Update with cart snapshot
//// If the cart is updated returns the client the items to put in the cart along with a excluded array
//// If the excluded array is empty, but snapshot was updated it means that user provided an illegitimate snapshot
const updateSnapshot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    // Receive a snapshot
    const snapshot = req.body;
    if (!snapshot) {
        console.log("UpdateSnapshot error: NoObjectProvided");
        res.status(403).send("NoObjectProvided");
        return;
    }
    if (!(0, cartSnapshot_1.isCartSnapshot)(snapshot)) {
        console.log("UpdateSnapshot error: NoSnapshotProvided");
        res.status(403).send("NoSnapshotProvided");
        return;
    }
    // START VALIDATION
    try {
        const items = yield itemModel_1.Item.find({
            _id: {
                $in: [
                    ...new Set(snapshot.items_snapshot.map((e) => new mongoose_1.Types.ObjectId(e.item_id))),
                ],
            },
        }).populate("attribute_groups.attributes");
        const castedItems = items.filter((e) => (0, itemModel_1.isItem)(e));
        const { included, excluded } = (0, cartUtils_1.validateCartSnapshot)(castedItems, snapshot.items_snapshot);
        // Update the cart
        yield cartModel_1.Cart.findOneAndUpdate({ owner_id: authtoken.id }, { items: included });
        if (included.length !== snapshot.items_snapshot.length) {
            res.status(200).json({
                update_snapshot: true,
                included: included,
                excluded: excluded,
            });
        }
        else {
            res.status(200).json({ update_snapshot: false });
        }
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
});
exports.updateSnapshot = updateSnapshot;
// Fetches the cart and returns the CartItem w/ respective prices
/// Updates the cart document to reflect changes in availability
const fetchCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.auth_token;
    if (!token || typeof token !== "string") {
        console.log("FetchCart error: MissingToken");
        res.status(403).send("MissingToken");
        return;
    }
    // Verify token
    const authtoken = (0, jwtTokens_1.verifyAuthToken)(token);
    if (!authtoken) {
        console.log("FetchCart error: NotAuthToken");
        res.status(403).send("NotAuthToken");
        return;
    }
    try {
        let cart = yield cartModel_1.Cart.findOne({
            owner_id: authtoken.id,
        });
        if (!cart) {
            // Create a cart for the user
            cart = new cartModel_1.Cart({ owner_id: authtoken.id, items: [] });
            yield cart.save();
        }
        // Cart must be validated
        const items = yield itemModel_1.Item.find({
            _id: {
                $in: [...new Set(cart.items.map((e) => new mongoose_1.Types.ObjectId(e.item_id)))],
            },
        }).populate("attribute_groups.attributes");
        const castedItems = items.filter((e) => (0, itemModel_1.isItem)(e));
        const { included, excluded } = (0, cartUtils_1.validateCartSnapshot)(castedItems, cart.items);
        // Some items are no longer valid
        if (!excluded.length) {
            yield cart.updateOne({ items: included });
        }
        res.status(200).json({ included: included, excluded: excluded });
    }
    catch (error) {
        const mongooseError = error;
        console.log(`FetchCart error: ${mongooseError.name}`);
        res.sendStatus(500);
    }
});
exports.fetchCart = fetchCart;
