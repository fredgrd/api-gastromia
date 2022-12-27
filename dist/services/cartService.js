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
exports.patchCart = exports.validateCartUpdate = exports.buildCart = void 0;
const cartItemModel_1 = require("../models/cartItemModel");
const cartModel_1 = require("../models/cartModel");
const itemModel_1 = require("../models/itemModel");
const buildCart = (attr) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = cartModel_1.Cart.build(attr);
        yield cart.save();
        return { success: true, error: undefined, cart: cart };
    }
    catch (error) {
        const mongooseError = error;
        return { success: false, error: mongooseError, cart: undefined };
    }
});
exports.buildCart = buildCart;
const validateCartUpdate = (cartItem) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield itemModel_1.Item.findById(cartItem.item).orFail();
        // 1. Check the CartItem has the same number of addition groups as the Item
        const cartItemGroups = [
            ...new Set(cartItem.additions.map((el) => el.group_id)),
        ];
        const itemGroups = item.additions.map((el) => el._id.toString());
        if (cartItemGroups.join("") !== itemGroups.join("")) {
            return false;
        }
        // 2. Addition groups check
        /// 2a. Check group_min requirement is met (for each group)
        /// 2b. Check group_max requirement is met (for each group)
        /// 2c. Check addition_max requirement is met (for each addition)
        for (const id of cartItemGroups) {
            const group = item.additions.find((el) => el._id.toString() === id);
            const group_min = group === null || group === void 0 ? void 0 : group.rules.group_min;
            const group_max = group === null || group === void 0 ? void 0 : group.rules.group_max;
            const addition_max = group === null || group === void 0 ? void 0 : group.rules.addition_max;
            if (group === undefined ||
                group_min === undefined ||
                group_max === undefined ||
                addition_max === undefined) {
                return false;
            }
            const cartAdditions = cartItem.additions.filter((el) => el.group_id === id);
            const additionsCheck = cartAdditions.reduce((acc, curr) => {
                acc.total += curr.quantity;
                acc.max = acc.max > curr.quantity ? acc.max : curr.quantity;
                return acc;
            }, { total: 0, max: 0 });
            if (additionsCheck.total < group_min ||
                additionsCheck.total > group_max ||
                additionsCheck.max > addition_max) {
                return false;
            }
        }
        return true;
    }
    catch (error) {
        console.log(`ValidateCartUpdate error: ${error}`);
        return false;
    }
});
exports.validateCartUpdate = validateCartUpdate;
const patchCart = (owner_id, item) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield cartModel_1.Cart.findOne({ owner_id: owner_id }).orFail();
        const sameItem = cart.items.find((el) => (0, cartItemModel_1.cartItemsEquality)(el, item));
        if (sameItem) {
            sameItem.quantity += item.quantity;
            cart.updatedAt = Date.now();
            yield cart.save();
        }
        else {
            cart.items.push(item);
            cart.updatedAt = Date.now();
            yield cart.save();
        }
        return { success: true, error: undefined, cart: cart };
    }
    catch (error) {
        const mongooseError = error;
        return { success: false, error: mongooseError, cart: undefined };
    }
});
exports.patchCart = patchCart;
