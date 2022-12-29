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
exports.validateItemAddition = void 0;
const mongoose_1 = require("mongoose");
const itemAttributeModel_1 = require("../models/itemAttributeModel");
const itemModel_1 = require("../models/itemModel");
// --------------------------------------------------------------------------
// ItemAddition
// Validates the submitted addition
/// Checks if the item and attributes exist in the Doc structure
/// Checks if the Attributes match the corresponding AttributeGroupRules
const validateItemAddition = (item_id, attributes, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield itemModel_1.Item.findById(item_id).orFail();
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
        for (const attribute of attributes) {
            // Check if group exists
            if (docGroups.has(attribute.group_id)) {
                var docGroup = docGroups.get(attribute.group_id);
            }
            else {
                console.log("ValidateItemAddition error: GroupDoesNotExist");
                return null;
            }
            // Check if attribute exists
            if (docGroup &&
                docGroup.attributes.findIndex((e) => e === attribute.attribute_id) ===
                    -1) {
                console.log("ValidateItemAddition error: AttributeDoesNotExist");
                return null;
            }
            // Check if attribute max condition is met
            if (docGroup &&
                attribute.quantity > docGroups.get(attribute.group_id).attribute_max) {
                console.log("ValidateItemAddition error: AttributeBreaksMaxQuantity");
                return null;
            }
            // Check if quantity is zero
            if (attribute.quantity === 0) {
                console.log("ValidateItemAddition error: AttributeZeroQuantity");
                return null;
            }
            // Check if the total + quantity breaks the group max condition
            if (docGroup && docGroup.tot + attribute.quantity > docGroup.max) {
                console.log("ValidateItemAddition error: AttributesBreakGroupMaxQuantity");
                return null;
            }
            else if (docGroup) {
                docGroups.set(attribute.group_id, Object.assign(Object.assign({}, docGroup), { tot: docGroup.tot + attribute.quantity }));
            }
        }
        // Check if min rules conditions are met
        for (const [_, group] of docGroups) {
            if (group.min > group.tot) {
                console.log("ValidateItemAddition error: GroupMinNotMet");
                return null;
            }
        }
        // If all the checks are passed item addition is validate
        return {
            item: item._id,
            item_version: item.item_version,
            attributes: attributes.map((e) => ({
                group_id: e.group_id,
                attribute: new mongoose_1.Types.ObjectId(e.attribute_id),
                quantity: e.quantity,
            })),
            quantity: quantity,
        };
    }
    catch (error) {
        const mongooseError = error;
        console.log(`ValidateItemAddition error: ${mongooseError}`);
        return null;
    }
});
exports.validateItemAddition = validateItemAddition;
