"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageRouter = void 0;
const express_1 = require("express");
const storageController_1 = require("../controllers/storageController");
const router = (0, express_1.Router)();
exports.storageRouter = router;
router.post("/image/upload", storageController_1.uplodaImage);
