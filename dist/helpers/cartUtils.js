"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCartSnapshot = void 0;
const itemAttributeModel_1 = require("../models/itemAttributeModel");
// Validate CartSnapshot
const validateCartSnapshot = (items, snapshotItems) => {
    // Validate the snapshot
    //// Validate item existence
    //// Validate item availability
    //// Validate item price
    //// Validate attributes existence
    //// Validate attributes availability
    //// Validate attributes prices
    //// Validate rule
    const included = [];
    const excluded = [];
    for (const snapshotItem of snapshotItems) {
        if (snapshotItem.quantity <= 0 || snapshotItem.quantity > 99) {
            continue;
        }
        const item = items.find((e) => { var _a; return ((_a = e._id) === null || _a === void 0 ? void 0 : _a.toString()) === snapshotItem.item_id; });
        // Edge case
        //// Item does not exist
        if (!item) {
            continue;
        }
        // Not available
        //// Handles item availability changes not reflected in cart
        if (!item.available) {
            excluded.push({
                item: snapshotItem,
                message: "Prodotto non è disponibile",
            });
            continue;
        }
        // Price difference
        //// Handles item price changes not reflected in cart
        if ((item.discount ? item.discount_price : item.price) !== snapshotItem.price) {
            excluded.push({
                item: snapshotItem,
                message: "Prodotto non aggiornato",
            });
            continue;
        }
        // Quick add
        //// If item can be quick-added add to included items
        if (item.quick_add && !snapshotItem.attributes_snapshot.length) {
            included.push(snapshotItem);
            continue;
        }
        // Validate attributes
        let attributesValid = true;
        const groupTotals = new Map([]);
        for (const snapshotAttribute of snapshotItem.attributes_snapshot) {
            if (snapshotAttribute.quantity <= 0 || snapshotAttribute.quantity > 99) {
                attributesValid = false;
                break;
            }
            const group = item.attribute_groups.find((e) => { var _a; return ((_a = e._id) === null || _a === void 0 ? void 0 : _a.toString()) === snapshotAttribute.group_id; });
            if (!group) {
                attributesValid = false;
                break;
            }
            const attributes = group.attributes.flatMap((e) => (0, itemAttributeModel_1.isItemAttribute)(e) ? e : []);
            const attribute = attributes.find((e) => { var _a; return ((_a = e._id) === null || _a === void 0 ? void 0 : _a.toString()) === snapshotAttribute.attribute_id; });
            if (!attribute) {
                attributesValid = false;
                break;
            }
            if (!attribute.available) {
                excluded.push({
                    item: snapshotItem,
                    message: "Una o più aggiunte non disponibili",
                });
                attributesValid = false;
                break;
            }
            if (attribute.price !== snapshotAttribute.price) {
                excluded.push({
                    item: snapshotItem,
                    message: "Una o più aggiunte non aggiornate",
                });
                attributesValid = false;
                break;
            }
            // VALIDATE ATTRIBUTE RULES
            // Count group total
            let groupTotal = groupTotals.get(group._id.toString());
            if (!groupTotal) {
                groupTotals.set(group._id.toString(), 0);
                groupTotal = 0;
            }
            if (snapshotAttribute.quantity > group.rules.attribute_max) {
                // Rules broken
                attributesValid = false;
                break;
            }
            if (groupTotal + snapshotAttribute.quantity > group.rules.group_max) {
                // Rules broken
                attributesValid = false;
                break;
            }
            // Rules not broken
            groupTotals.set(group._id.toString(), groupTotal + snapshotAttribute.quantity);
        }
        // Edge case
        //// Client was able to brake rules
        if (!attributesValid) {
            continue;
        }
        // VALIDATE GROUP RULES
        let conditionsMet = true;
        for (const group of item.attribute_groups) {
            if (!group._id) {
                conditionsMet = false;
                break;
            }
            const groupTotal = groupTotals.get(group._id.toString()); // Group totals
            //// Was not added to item. Client could not add to cart
            //// No groupTotal exists meaning attribute not added by user
            //// Conditions are met because user was not forced to add
            if (!groupTotal && group.rules.group_min === 0) {
                break;
            }
            if (!groupTotal) {
                conditionsMet = false;
                break;
            }
            //// Client was able to brake rules
            if (group.rules.group_min > groupTotal) {
                conditionsMet = false;
                break;
            }
            //// Client was able to brake rules
            if (groupTotal > group.rules.group_max) {
                conditionsMet = false;
                break;
            }
        }
        if (!conditionsMet) {
            continue;
        }
        // VALIDATION PASSED
        included.push(snapshotItem);
    }
    // RETURN
    return { included, excluded };
};
exports.validateCartSnapshot = validateCartSnapshot;
