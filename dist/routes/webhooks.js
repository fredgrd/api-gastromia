"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhooksRouter = void 0;
const express_1 = require("express");
const webhooksController_1 = require("../controllers/webhooksController");
const router = (0, express_1.Router)();
exports.webhooksRouter = router;
router.get("/whatsapp", webhooksController_1.verifyWhatsapp);
router.post("/whatsapp", webhooksController_1.handleWhatsappEvents);
