"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRouter = void 0;
const express_1 = require("express");
const cartController_1 = require("../controllers/cartController");
const router = (0, express_1.Router)();
exports.cartRouter = router;
router.post("/create", cartController_1.createCart);
router.patch("/update", cartController_1.update);
