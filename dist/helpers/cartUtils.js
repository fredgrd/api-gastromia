"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAndPriceCart = exports.validateItemAttributes = exports.mapSnapshotAttributes = void 0;
const mongoose_1 = require("mongoose");
const itemModel_1 = require("../models/itemModel");
const itemAttributeModel_1 = require("../models/itemAttributeModel");
// Turn snapshot item attributes into an organized mao
const mapSnapshotAttributes = (attributes) => {
    const map = new Map([]);
    attributes.forEach((attribute) => {
        const attributeSnapshot = map.get(attribute.group_id);
        if (attributeSnapshot) {
            attributeSnapshot.push(attribute);
            map.set(attribute.group_id, attributeSnapshot);
        }
        else {
            map.set(attribute.group_id, [attribute]);
        }
    });
    return map;
};
exports.mapSnapshotAttributes = mapSnapshotAttributes;
// Validates the item attributes
/// Returns the a CartAttribute array if validation is passed, otherwise returns null
const validateItemAttributes = (itemAttributeGroups, operationAttributes) => {
    const attributesTotByGroup = new Map([]);
    itemAttributeGroups.forEach((e) => { var _a; return attributesTotByGroup.set(((_a = e._id) === null || _a === void 0 ? void 0 : _a.toString()) || "", 0); });
    for (const attribute of operationAttributes) {
        // Check if group exists
        const group = itemAttributeGroups.find((e) => { var _a; return ((_a = e._id) === null || _a === void 0 ? void 0 : _a.toString()) === attribute.group_id; });
        if (group === undefined || group._id === undefined) {
            return null;
        }
        // Check if attribute exists in item doc
        if (group.attributes.findIndex((e) => e._id.toString() === attribute.attribute_id) === -1) {
            console.log("ValidateItemAttributes error: AttributeDoesNotExist");
            console.log(`Attribute: ${attribute.attribute_id} Group: ${attribute.group_id}`);
            return null;
        }
        // Check if attribute max condition is met
        if (attribute.quantity > group.rules.attribute_max) {
            console.log("ValidateItemAttributes error: AttributeBreaksMaxQuantity");
            console.log(`Attribute: ${attribute.attribute_id} Group: ${attribute.group_id}`);
            return null;
        }
        // Check if quantity is zero
        if (attribute.quantity === 0) {
            console.log("ValidateItemAttributes error: AttributeZeroQuantity");
            console.log(`Attribute: ${attribute.attribute_id} Group: ${attribute.group_id}`);
            return null;
        }
        // Check if the total + quantity breaks the group max condition
        const groupTot = attributesTotByGroup.get(group._id.toString());
        if (groupTot !== undefined &&
            groupTot + attribute.quantity > group.rules.group_max) {
            console.log("ValidateItemAttribute error: AttributesBreakGroupMaxQuantity");
            console.log(`Attribute: ${attribute.attribute_id} Group: ${attribute.group_id}`);
            return null;
        }
        else if (groupTot) {
            attributesTotByGroup.set(attribute.group_id, groupTot + attribute.quantity);
        }
    }
    // All checks passed
    return operationAttributes.map((e) => ({
        group_id: e.group_id,
        attribute: new mongoose_1.Types.ObjectId(e.attribute_id),
        quantity: e.quantity,
    }));
};
exports.validateItemAttributes = validateItemAttributes;
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
