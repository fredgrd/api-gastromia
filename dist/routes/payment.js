"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRouter = void 0;
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const router = (0, express_1.Router)();
exports.paymentRouter = router;
router.post("/setup", paymentController_1.createSetupIntent);
router.post("/cardpayment");
router.get("/cards", paymentController_1.fetchCards);
