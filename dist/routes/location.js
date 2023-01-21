"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationRouter = void 0;
const express_1 = require("express");
const locationController_1 = require("../controllers/locationController");
const router = (0, express_1.Router)();
exports.locationRouter = router;
router.get("/status", locationController_1.fetchLocationStatus);
router.patch("/status/update", locationController_1.updateLocationStatus);
