"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeRouter = void 0;
const express_1 = require("express");
const stripeController_1 = require("../controllers/stripeController");
const router = (0, express_1.Router)();
exports.stripeRouter = router;
router.post("/", stripeController_1.createCustomer);
