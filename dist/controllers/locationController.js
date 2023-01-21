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
exports.updateLocationStatus = exports.fetchLocationStatus = void 0;
const authenticateOperator_1 = __importDefault(require("../helpers/authenticateOperator"));
const locationModel_1 = require("../models/locationModel");
// Fetches the location status
// Used by both Gastromia WebApp and the Hub Manager
const fetchLocationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const locationId = "63c2dddb8da9d8981bcc335a";
    try {
        const location = yield locationModel_1.Location.findById(locationId).orFail();
        res.status(200).json({ is_open: location.is_open });
    }
    catch (error) {
        const mongooseError = error;
        console.log(`FetchLocation error: ${mongooseError.name} ${mongooseError.message}`);
        res.sendStatus(500);
    }
});
exports.fetchLocationStatus = fetchLocationStatus;
// Updates the status (is_open) of the location
// Used only by the Hub Manager
const updateLocationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const operatorToken = (0, authenticateOperator_1.default)(req, res, "UpdateLocationStatus");
    if (!operatorToken) {
        res.sendStatus(403);
        return;
    }
    const locationId = "63c2dddb8da9d8981bcc335a";
    const status = req.body.status;
    console.log(status, typeof status);
    if (typeof status !== "boolean") {
        res.sendStatus(400);
        return;
    }
    try {
        const location = yield locationModel_1.Location.findByIdAndUpdate(locationId, {
            is_open: status,
        }, { new: true }).orFail();
        res.status(200).json({ is_open: location.is_open });
    }
    catch (error) {
        const mongooseError = error;
        console.log(`FetchLocation error: ${mongooseError.name} ${mongooseError.message}`);
        res.sendStatus(500);
    }
});
exports.updateLocationStatus = updateLocationStatus;
