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
const mongoose_1 = __importDefault(require("mongoose"));
const sf_1 = require("../models/sf");
class CartService {
    constructor() {
        this.fetchedItems = [];
    }
    safeValidate(cartItems) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = yield sf_1.Item.find({
                    _id: { $in: cartItems.map((e) => new mongoose_1.default.Types.ObjectId(e.item)) },
                    available: true,
                })
                    .populate("additions.additions")
                    .orFail();
                const itemIds = items.map((e) => e.id);
                cartItems = cartItems.filter((item) => itemIds.includes(item.item));
                cartItems = cartItems.filter((cartItem) => {
                    const item = items.find((e) => e.id === cartItem.item);
                    console.log("ITEM", item);
                    if (item === undefined) {
                        return false;
                    }
                    // Add quick-buy exit
                    // Validate additions
                    const validAdditions = this.validateAdditions(cartItem.additions, item);
                    console.log("VALIDATE ADDITIONS", validAdditions);
                });
            }
            catch (error) {
                const mongooseError = error;
                console.log(`SafeValidate error: ${mongooseError}`);
            }
        });
    }
    validateAdditions(additions, item) {
        const groupIds = [...new Set(additions.map((e) => e.group_id))]; // Unique occurences of group_id
        const filteredGroupIds = groupIds.filter((e) => item.additions.find((a) => a._id.toString() === e));
        if (filteredGroupIds.length !== groupIds.length) {
            return false;
        }
        // Validate each group of additions
        for (const groupId of groupIds) {
            const group = item.additions.find((e) => e._id.toString() === groupId);
            const group_min = group === null || group === void 0 ? void 0 : group.rules.group_min;
            const group_max = group === null || group === void 0 ? void 0 : group.rules.group_max;
            const addition_max = group === null || group === void 0 ? void 0 : group.rules.addition_max;
            if (group === undefined ||
                group_min === undefined ||
                group_max === undefined ||
                addition_max === undefined) {
                return false;
            }
            const cartAdditions = additions.filter((e) => e.group_id === groupId);
            const filteredAdditions = cartAdditions.filter((e) => group.additions.find((a) => a === e.addition_id));
            if (filteredAdditions.length !== cartAdditions.length) {
                return false;
            }
            console.log("ADDITIONS LENGTH");
            // Check all additions are available
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
}
exports.default = CartService;
