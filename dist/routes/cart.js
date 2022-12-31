"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRouter = void 0;
const express_1 = require("express");
const cartController_1 = require("../controllers/cartController");
const router = (0, express_1.Router)();
exports.cartRouter = router;
router.get("/", cartController_1.fetchCart);
router.patch("/snapshot", cartController_1.updateSnapshot);
