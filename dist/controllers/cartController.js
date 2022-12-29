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
exports.fetchCart = exports.updateCart = void 0;
const cartService_1 = require("../services/cartService");
const cartModel_1 = require("../models/cartModel");
const itemModel_1 = require("../models/itemModel");
const cartOperations_1 = require("../models/cartOperations");
const itemAttributeModel_1 = require("../models/itemAttributeModel");
// --------------------------------------------------------------------------
// Cart
// Updates the cart with either an ADD or MODIFY operation
/// ADD: Adds the provided CartItem to the cart
/// MODIFY: Changes the quantity of a specific CartItem (if 0 removes from the cart).
const updateCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Retrieve user id from token
    if (req.body || (0, cartOperations_1.isOperation)(req.body)) {
        var operation = req.body;
    }
    else {
        console.log("UpdateCart error: OperationBadlyFormatted");
        res.sendStatus(400);
        return;
    }
    // Retrieve the user's cart or create a new one
    try {
        let cart = yield cartModel_1.Cart.findOne({
            owner_id: operation.owner_id,
        });
        if (!cart) {
            // Create a cart for the user
            cart = new cartModel_1.Cart({ owner_id: operation.owner_id, items: [] });
            yield cart.save();
        }
        // Add a new item to the cart
        if (operation.type === cartOperations_1.CartOperationType.Add &&
            operation.item_id &&
            operation.attributes) {
            const validatedAddition = yield (0, cartService_1.validateItemAddition)(operation.item_id, operation.attributes, operation.quantity);
            if (cart && validatedAddition) {
                // Add to cart
                cart.items.push(Object.assign({}, validatedAddition));
                yield cart.save();
                res.sendStatus(200); // SEND UPDATED CART?
            }
            else {
                console.log(`UpdateCart error: AdditionNotValidated`);
                res.sendStatus(400);
            }
        }
        if (operation.type === cartOperations_1.CartOperationType.Modify && operation.cart_item_id) {
            const cartItemIndex = cart.items.findIndex((e) => { var _a; return ((_a = e._id) === null || _a === void 0 ? void 0 : _a.toString()) === operation.cart_item_id; });
            if (cart && cartItemIndex !== -1 && operation.quantity > 0) {
                cart.items[cartItemIndex].quantity = operation.quantity;
                yield cart.save();
                res.sendStatus(200); // SEND UPDATED CART?
            }
            else if (cart && cartItemIndex !== -1) {
                cart.items.splice(cartItemIndex, 1);
                yield cart.save();
                res.sendStatus(200);
            }
            else {
                console.log("UpdateCart error: Modify/NoCartItem");
                res.sendStatus(400);
            }
        }
    }
    catch (error) {
        const mongooseError = error;
        console.log(`UpdateCart error: ${mongooseError.name}`);
        res.sendStatus(500);
    }
});
exports.updateCart = updateCart;
const fetchCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const owner_id = req.body.owner_id;
    console.log(req.cookies.token);
    if (!owner_id) {
        console.log("FetchCart error: NoOwner");
        res.sendStatus(400);
        return;
    }
    try {
        const cart = yield cartModel_1.Cart.findOne({ owner_id: owner_id })
            .populate("items.item")
            .populate("items.attributes.attribute")
            .orFail();
        const clientCartItems = [];
        const clientCartItemExcluded = [];
        // Filter the items that do not match item_version or are not available
        let cartItems = cart.items.filter((cartItem) => {
            var _a;
            if ((0, itemModel_1.isItem)(cartItem.item) && cartItem._id && cartItem.item._id) {
                let total = cartItem.item.discount
                    ? cartItem.item.discount_price
                    : cartItem.item.price;
                // item_version MUST match
                if (cartItem.item_version !== cartItem.item.item_version) {
                    clientCartItemExcluded.push(cartItem.item.name);
                    return false;
                }
                // item MUST be available
                if (!cartItem.item.available) {
                    clientCartItemExcluded.push(cartItem.item.name);
                    return false;
                }
                const clientCartItemAttributes = [];
                // Filter out the items that have attributes not available
                for (const cartAttribute of cartItem.attributes) {
                    if ((0, itemAttributeModel_1.isItemAttribute)(cartAttribute.attribute) &&
                        !cartAttribute.attribute.available) {
                        clientCartItemExcluded.push(cartItem.item.name);
                        return false;
                    }
                    else if (!(0, itemAttributeModel_1.isItemAttribute)(cartAttribute.attribute)) {
                        clientCartItemExcluded.push(cartItem.item.name);
                        return false;
                    }
                    total += cartAttribute.attribute.price * cartAttribute.quantity;
                    clientCartItemAttributes.push({
                        name: cartAttribute.attribute.name,
                        quantity: cartAttribute.quantity,
                    });
                }
                // Should compute total here
                total *= cartItem.quantity;
                // Append ClientCartItem
                clientCartItems.push({
                    id: cartItem._id.toString(),
                    item_id: (_a = cartItem.item._id) === null || _a === void 0 ? void 0 : _a.toString(),
                    name: cartItem.item.name,
                    preview_url: cartItem.item.preview_url,
                    attributes: clientCartItemAttributes,
                    quantity: cartItem.quantity,
                    total: total,
                });
                return true;
            }
            else {
                return false;
            }
        });
        // Update the cart if items were filtered out
        if (cart.items.length !== cartItems.length) {
            cart.items = cartItems;
            cart.save(); // Don't need to wait for operation to complete
        }
        res
            .status(200)
            .json({ items: clientCartItems, excluded: clientCartItemExcluded });
    }
    catch (error) {
        const mongooseError = error;
        console.log(`FetchCart error: ${mongooseError.name}`);
        res.sendStatus(500);
    }
});
exports.fetchCart = fetchCart;
