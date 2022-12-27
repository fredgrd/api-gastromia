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
exports.update = exports.updateCart = exports.createCart = void 0;
const cartService_1 = require("../services/cartService");
const cartModel_1 = require("../models/cartModel");
const crtService_1 = __importDefault(require("../services/crtService"));
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
const updateCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const owner_id = req.body.owner_id;
    const item = req.body.item;
    if (owner_id && item && item.item && item.additions && item.quantity) {
        const canUpdate = yield (0, cartService_1.validateCartUpdate)(item);
        if (!canUpdate) {
            res.sendStatus(400);
            return;
        }
        // Get cart
        const result = yield (0, cartService_1.patchCart)(owner_id, item);
        if (result.success && result.cart !== undefined) {
            res.status(200).json((0, cartModel_1.cleanCart)(result.cart));
            return;
        }
        else if (((_a = result.error) === null || _a === void 0 ? void 0 : _a.name) === "DocumentNotFoundError") {
            // Could not find a cart document for the user
            const buildResult = yield (0, cartService_1.buildCart)({
                owner_id: owner_id,
                items: [item],
                updatedAt: Date.now(),
            });
            if (buildResult.success) {
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(500);
    }
    else {
        res.sendStatus(400);
    }
});
exports.updateCart = updateCart;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartService = new crtService_1.default();
    const items = req.body.items;
    yield cartService.safeValidate(items);
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
