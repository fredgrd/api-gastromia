"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAndPriceCart = exports.validateItem = void 0;
const itemModel_1 = require("../models/itemModel");
const itemAttributeModel_1 = require("../models/itemAttributeModel");
// Add an item to the cart
const validateItem = (item) => {
    // Attributes deep check
    // Check that rule conditions have been met
    const docGroups = new Map([]);
    for (const group of item.attribute_groups) {
        if ((0, itemAttributeModel_1.isItemAttributeGroup)(group) && group._id) {
            docGroups.set(group._id.toString(), {
                min: group.rules.group_min,
                max: group.rules.group_max,
                attribute_max: group.rules.attribute_max,
                attributes: group.attributes.map((e) => e.toString()),
                tot: 0,
            });
        }
    }
};
exports.validateItem = validateItem;
// Updates and prices every item in the cart
/// Excludes items not available or that contain attributes not available
const updateAndPriceCart = (cartItems) => {
    const clientItems = [];
    const excludedClientItems = [];
    // Filter the items that do not match item_version or are not available
    cartItems = cartItems.filter((cartItem) => {
        var _a;
        if ((0, itemModel_1.isItem)(cartItem.item) && cartItem._id && cartItem.item._id) {
            let total = cartItem.item.discount
                ? cartItem.item.discount_price
                : cartItem.item.price;
            // item_version MUST match
            if (cartItem.item_version !== cartItem.item.item_version) {
                excludedClientItems.push(cartItem.item.name);
                return false;
            }
            // item MUST be available
            if (!cartItem.item.available) {
                excludedClientItems.push(cartItem.item.name);
                return false;
            }
            const clientCartItemAttributes = [];
            // Filter out the items that have attributes not available
            for (const cartAttribute of cartItem.attributes) {
                if ((0, itemAttributeModel_1.isItemAttribute)(cartAttribute.attribute) &&
                    !cartAttribute.attribute.available) {
                    excludedClientItems.push(cartItem.item.name);
                    return false;
                }
                else if (!(0, itemAttributeModel_1.isItemAttribute)(cartAttribute.attribute)) {
                    excludedClientItems.push(cartItem.item.name);
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
            clientItems.push({
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
    return {
        cartItems: cartItems,
        clientItems: clientItems,
        excludedClientItems: excludedClientItems,
    };
};
exports.updateAndPriceCart = updateAndPriceCart;
