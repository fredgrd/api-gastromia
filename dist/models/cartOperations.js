"use strict";
// --------------------------------------------------------------------------
// Helpers
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartOperationType = exports.isOperation = void 0;
// Check if the object is a ICartOperation
const isOperation = (operation) => {
    const unsafeCast = operation;
    return (unsafeCast.type !== undefined &&
        unsafeCast.quantity !== undefined &&
        (unsafeCast.cart_item_id !== undefined || unsafeCast.item_id !== undefined));
};
exports.isOperation = isOperation;
// --------------------------------------------------------------------------
// Interface / Schema / Model
var CartOperationType;
(function (CartOperationType) {
    CartOperationType["Modify"] = "modify";
    CartOperationType["Add"] = "add";
})(CartOperationType = exports.CartOperationType || (exports.CartOperationType = {}));
