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
exports.update = exports.updateCart = exports.createCart = void 0;
const cartService_1 = require("../services/cartService");
const cartModel_1 = require("../models/cartModel");
const createCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const owner_id = req.body.owner_id;
    const result = yield (0, cartService_1.buildCart)({
        owner_id: owner_id,
        items: [],
        updatedAt: Date.now(),
    });
    if (result.success) {
        res.sendStatus(200);
    }
    else {
        res.sendStatus(500);
    }
});
exports.createCart = createCart;
const isOperation = (operation) => {
    const unsafeCast = operation;
    return (unsafeCast.type !== undefined &&
        unsafeCast.quantity !== undefined &&
        (unsafeCast.cart_item_id !== undefined || unsafeCast.item_id !== undefined));
};
const updateCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Retrieve user id from token
    const operation = req.body;
    if (!operation || !isOperation(operation)) {
        console.log("UpdateCart error: OperationBadlyFormatted");
        res.sendStatus(400);
        return;
    }
    // Retrieve the user's cart or create a new one
    let cart;
    try {
        cart = yield cartModel_1.Cart.findOne({ owner_id: "mao" });
        if (!cart) {
            // Create a cart for the user
            cart = new cartModel_1.Cart({ owner_id: "mao", items: [] });
            yield cart.save();
        }
    }
    catch (error) {
        const mongooseError = error;
        console.log(`UpdateCart error: ${mongooseError.name}`);
        res.sendStatus(500);
    }
    if (operation.type)
        yield (0, cartService_1.validateItemAddition)(operation.item_id || "", operation.attributes || []);
});
exports.updateCart = updateCart;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { owner_id, operation } = req.body;
    if (!owner_id) {
        console.log("UpdateCart error: NoOwnerProvided");
        res.sendStatus(400);
        return;
    }
    if (!operation) {
        console.log("UpdateCart error: NoOperationProvided");
        res.sendStatus(400);
        return;
    }
    else if (operation.type === "add") {
    }
    // Fetch the cart
    // try {
    //   const cart = await Cart.findOne({ owner_id: owner_id }).orFail();
    // } catch (error) {
    //   const mongooseError = error as MongooseError;
    //   console.log(`UpdateCart error: ${mongooseError.name}`);
    //   res.sendStatus(500);
    // }
});
exports.update = update;
// export const fetchCart = async (
//   req: Request,
//   res: Response,
//   owner_id: string
// ) => {
//   try {
//     const cart = await Cart.findOne({owner_id: owner_id}).populate("")
//   }
// };
