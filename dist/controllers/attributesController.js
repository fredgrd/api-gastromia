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
exports.updateItemAttribute = exports.createItemAttribute = void 0;
const databaseService_1 = __importDefault(require("../services/databaseService"));
const itemAttributeModel_1 = require("../models/itemAttributeModel");
// --------------------------------------------------------------------------
// ItemAttribute
// Checks if the object provided is an ItemAttribute
const isItemAttribute = (attribute) => {
    const unsafeCast = attribute;
    return (unsafeCast.media_url !== undefined &&
        unsafeCast.name !== undefined &&
        unsafeCast.available !== undefined &&
        unsafeCast.price !== undefined &&
        unsafeCast.unique_tag !== undefined);
};
// Create an ItemAttribute Document
/// If the object provided does not conform to the ItemAttribute interface fails
const createItemAttribute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const itemAttribute = req.body.attribute;
    const token = req.body.token;
    const databaseService = new databaseService_1.default();
    const decodedToken = databaseService.verifyToken(token);
    if (!decodedToken) {
        console.log("CreateItemAttribute error: OperationTokenNotValid");
        res.sendStatus(403); // Forbidden
        return;
    }
    if (itemAttribute && isItemAttribute(itemAttribute)) {
        try {
            const newItemAttribute = new itemAttributeModel_1.ItemAttribute(Object.assign({}, itemAttribute));
            yield newItemAttribute.save();
            res.sendStatus(200);
        }
        catch (error) {
            const mongooseError = error;
            console.log(`CreateItemAttribute error: ${mongooseError.name}`);
            res.sendStatus(500);
        }
    }
    else {
        console.log("CreateItemAttribute error: NotItemAttribute");
        res.sendStatus(400);
    }
});
exports.createItemAttribute = createItemAttribute;
// Check if the object provided matches at least one of the ItemAttribute props
const isItemAttributeUpdate = (update) => {
    const unsafeCast = update;
    return (unsafeCast.media_url !== undefined ||
        unsafeCast.name !== undefined ||
        unsafeCast.available !== undefined ||
        unsafeCast.price !== undefined ||
        unsafeCast.unique_tag !== undefined);
};
// Update an ItemAttribute Document
/// If the props object provided do not conform to the ItemAttribute interface fails
const updateItemAttribute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const attributeId = req.body.attribute_id;
    const update = req.body.update;
    const token = req.body.token;
    const databaseService = new databaseService_1.default();
    const decodedToken = databaseService.verifyToken(token);
    if (!decodedToken) {
        console.log("UpdateItemAttribute error: OperationTokenNotValid");
        res.sendStatus(403); // Forbidden
        return;
    }
    if (!attributeId) {
        console.log("UpdateItemAttribute error: ItemAttributeIdNotProvided");
        res.sendStatus(400);
        return;
    }
    if (update && isItemAttributeUpdate(update)) {
        try {
            let itemAttribute = yield itemAttributeModel_1.ItemAttribute.findById(attributeId).orFail();
            yield itemAttribute.update(update);
            res.sendStatus(200);
        }
        catch (error) {
            const mongooseError = error;
            console.log(`UpdateItemAttribute error: ${mongooseError.name}`);
            res.sendStatus(500);
        }
    }
    else {
        console.log("UpdateItemAttribute error: UpdateBadlyFormatted");
        res.sendStatus(400);
    }
});
exports.updateItemAttribute = updateItemAttribute;
