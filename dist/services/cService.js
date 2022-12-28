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
const itemModel_1 = require("../models/itemModel");
// --------------------------------------------------------------------------
// ItemAddition
// Validates the submitted addition
/// Checks if the item and attributes exist in the Doc structure
/// Checks if the Attributes match the corresponding AttributeGroupRules
const validateItemAddition = (item_id, attributes, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield itemModel_1.Item.findById(item_id)
            .populate("attribute_groups.attributes")
            .orFail();
        // Check if all the attributes provided match the item doc
        const docAttributes = item.attribute_groups.flat();
        console.log(docAttributes);
    }
    catch (error) {
        const mongooseError = error;
        console.log(`ValidateItemAddition error: ${mongooseError}`);
        // Must return something
    }
});
exports.validateItemAddition = validateItemAddition;
