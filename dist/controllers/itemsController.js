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
exports.fetchItem = exports.fetchAllItems = exports.fetchCategory = exports.searchItems = exports.deleteItem = exports.updateItem = exports.createItem = void 0;
const uuid_1 = require("uuid");
const authenticateOperator_1 = __importDefault(require("../helpers/authenticateOperator"));
const itemModel_1 = require("../models/itemModel");
// --------------------------------------------------------------------------
// Item
// Create an Item Document
/// If the object provided does not conform to the Item interface fails
const createItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const operatorToken = (0, authenticateOperator_1.default)(req, res, "CreateItem");
    if (!operatorToken) {
        return;
    }
    const item = req.body.item;
    if (item) {
        try {
            const newItem = new itemModel_1.Item(Object.assign({}, item));
            yield newItem.save();
            res.sendStatus(200);
        }
        catch (error) {
            const mongooseError = error;
            console.log(`CreateItem error: ${mongooseError.name} ${mongooseError.message}`);
            res.status(400).send(mongooseError.message);
        }
    }
    else {
        console.log("CreateItem error: NotItem");
        res.sendStatus(400);
    }
});
exports.createItem = createItem;
// Update an Item Document
// Does not check the strucure of the update object
const updateItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const operatorToken = (0, authenticateOperator_1.default)(req, res, "UpdateItem");
    if (!operatorToken) {
        return;
    }
    const itemId = req.body.item_id;
    const update = req.body.update;
    if (!itemId) {
        console.log("UpdateItem error: ItemIdNotProvided");
        res.sendStatus(400);
        return;
    }
    if (update) {
        try {
            const item = yield itemModel_1.Item.findOneAndUpdate({ _id: itemId }, Object.assign(Object.assign({}, update), { item_version: (0, uuid_1.v4)() }), {
                new: true,
            }).orFail();
            console.log(item);
            res.status(200).json({ item: item });
        }
        catch (error) {
            const mongooseError = error;
            console.log(`UpdateItemAttribute error: ${mongooseError.name} ${mongooseError.message}`);
            res.sendStatus(500);
        }
    }
    else {
        console.log("UpdateItemAttribute error: UpdateBadlyFormatted");
        res.sendStatus(400);
    }
});
exports.updateItem = updateItem;
// Deletes the item document
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const operatorToken = (0, authenticateOperator_1.default)(req, res, "DeleteItem");
    if (!operatorToken) {
        return;
    }
    const itemID = req.body.item_id;
    if (!itemID || typeof itemID !== "string") {
        console.log("DeleteItem error: NoItemId");
        res.status(400).send("NoItemId");
        return;
    }
    try {
        const deleted = yield itemModel_1.Item.deleteOne({ _id: itemID }).orFail();
        res.status(200).send(deleted.acknowledged);
    }
    catch (error) {
        const mongooseError = error;
        console.log(`DeleteItem error: ${mongooseError.name} ${mongooseError.message}`);
        res.sendStatus(500);
    }
});
exports.deleteItem = deleteItem;
// Searches the item documents accordding to the provided query
const searchItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.k;
    try {
        const items = yield itemModel_1.Item.aggregate().search({
            index: "ItemSearch",
            compound: {
                should: [
                    {
                        autocomplete: {
                            query: query,
                            path: "name",
                        },
                    },
                    {
                        autocomplete: {
                            query: query,
                            path: "tags",
                        },
                    },
                ],
            },
        });
        res.status(200).json({ items: items });
    }
    catch (error) {
        res.sendStatus(400);
    }
});
exports.searchItems = searchItems;
// Fetches the category according to the provided query
const fetchCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cQuery = req.query.c;
    try {
        const items = yield itemModel_1.Item.find({ category: { $eq: cQuery } }).orFail();
        res.status(200).json({ items: items });
    }
    catch (error) {
        const mongooseError = error;
        console.log(`FetchCategory error: ${mongooseError.name} ${mongooseError.message}`);
        res.sendStatus(500);
    }
});
exports.fetchCategory = fetchCategory;
// Fetchs all the item documents
// Used only by the Hub Manager
const fetchAllItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const operatorToken = (0, authenticateOperator_1.default)(req, res, "FetchAllItems");
    if (!operatorToken) {
        return;
    }
    try {
        const items = yield itemModel_1.Item.find()
            .populate("attribute_groups.attributes")
            .orFail();
        res.status(200).json({ items: items });
    }
    catch (error) {
        const mongooseError = error;
        console.log(`FetchAllItemss error: ${mongooseError.name} ${mongooseError.message}`);
        res.sendStatus(500);
    }
});
exports.fetchAllItems = fetchAllItems;
// Fetches the item document according to the provided query
const fetchItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const iQuery = req.query.i;
    if (typeof iQuery !== "string") {
        res.sendStatus(400);
        return;
    }
    try {
        const item = yield itemModel_1.Item.findById(iQuery).populate("attribute_groups.attributes");
        if (item) {
            res.status(200).json(item);
        }
        else {
            res.sendStatus(400);
        }
    }
    catch (error) {
        res.sendStatus(400);
    }
});
exports.fetchItem = fetchItem;
