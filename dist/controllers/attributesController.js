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
exports.searchAttributes = exports.fetchAllAttributes = exports.deleteItemAttribute = exports.updateItemAttribute = exports.createItemAttribute = void 0;
const authenticateOperator_1 = __importDefault(require("../helpers/authenticateOperator"));
const itemAttributeModel_1 = require("../models/itemAttributeModel");
// --------------------------------------------------------------------------
// ItemAttribute
// Create an ItemAttribute Document
/// If the object provided does not conform to the ItemAttribute interface fails
const createItemAttribute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const operatorToken = (0, authenticateOperator_1.default)(req, res, "CreateItemAttribute");
    if (!operatorToken) {
        return;
    }
    const attribute = req.body.attribute;
    if (attribute) {
        try {
            const newItemAttribute = new itemAttributeModel_1.ItemAttribute(attribute);
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
// Update an ItemAttribute Document
// Does not check the structure of the update object
const updateItemAttribute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const operatorToken = (0, authenticateOperator_1.default)(req, res, "UpdateItemAttribute");
    if (!operatorToken) {
        return;
    }
    const attributeId = req.body.attribute_id;
    const update = req.body.update;
    if (!attributeId) {
        console.log("UpdateItemAttribute error: ItemAttributeIdNotProvided");
        res.sendStatus(400);
        return;
    }
    if (update) {
        try {
            const attribute = yield itemAttributeModel_1.ItemAttribute.findOneAndUpdate({ _id: attributeId }, update, { new: true });
            res.status(200).json({ attribute: attribute });
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
// Delete an ItemAttribute document
const deleteItemAttribute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const operatorToken = (0, authenticateOperator_1.default)(req, res, "DeleteItemAttribute");
    if (!operatorToken) {
        return;
    }
    const attributeId = req.body.attribute_id;
    if (!attributeId) {
        console.log("UpdateItemAttribute error: ItemAttributeIdNotProvided");
        res.sendStatus(400);
        return;
    }
    try {
        const attribute = yield itemAttributeModel_1.ItemAttribute.findOneAndDelete({
            _id: attributeId,
        }).orFail();
        res.status(200).json();
    }
    catch (error) {
        const mongooseError = error;
        console.log(`UpdateItemAttribute error: ${mongooseError.name}`);
        res.sendStatus(500);
    }
});
exports.deleteItemAttribute = deleteItemAttribute;
// Fetches all attribute documents
// Returns an ItemAttribute array if successful
const fetchAllAttributes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const operatorToken = (0, authenticateOperator_1.default)(req, res, "FetchAllAttributes");
    if (!operatorToken) {
        return;
    }
    try {
        const attributes = yield itemAttributeModel_1.ItemAttribute.find().orFail();
        res.status(200).json({ attributes: attributes });
    }
    catch (error) {
        console.log("FetchAllAttributes error: UpdateBadlyFormatted");
        res.sendStatus(500);
    }
});
exports.fetchAllAttributes = fetchAllAttributes;
// Searches the attributes according to the provided query
const searchAttributes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const operatorToken = (0, authenticateOperator_1.default)(req, res, "SearchAttributes");
    if (!operatorToken) {
        console.log("SearchAttributes error: Forbidden");
        res.sendStatus(403);
    }
    const query = req.query.k;
    console.log("QUERYING", query);
    try {
        const attributes = yield itemAttributeModel_1.ItemAttribute.aggregate().search({
            index: "AttributeSearch",
            compound: {
                should: [
                    {
                        autocomplete: {
                            query: query,
                            path: "name",
                        },
                    },
                ],
            },
        });
        console.log(attributes);
        res.status(200).json({ attributes: attributes });
    }
    catch (error) {
        const mongoseError = error;
        console.log(`SearchAttributes error: ${mongoseError.name} ${mongoseError.message}`);
        res.sendStatus(400);
    }
});
exports.searchAttributes = searchAttributes;
