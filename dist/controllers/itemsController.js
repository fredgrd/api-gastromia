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
exports.fetchItem = exports.fetchCategory = exports.searchItems = exports.createAddition = exports.createItem = void 0;
const itemModel_1 = require("../models/itemModel");
const databaseService_1 = __importDefault(require("../services/databaseService"));
const itemService_1 = require("../services/itemService");
// --------------------------------------------------------------------------
// Item
// Checks if the object provided is an Item
/// Update the length check of the object keys w/ latest value
const isItem = (item) => {
    const unsafeCast = item;
    return (unsafeCast.name !== undefined &&
        unsafeCast.description !== undefined &&
        unsafeCast.available !== undefined &&
        unsafeCast.available !== undefined &&
        unsafeCast.quick_add !== undefined &&
        unsafeCast.price !== undefined &&
        unsafeCast.discount !== undefined &&
        unsafeCast.discount_price !== undefined &&
        unsafeCast.discount_label !== undefined &&
        unsafeCast.attribute_groups !== undefined &&
        unsafeCast.tags !== undefined &&
        unsafeCast.category !== undefined &&
        unsafeCast.media_url !== undefined &&
        unsafeCast.preview_url !== undefined &&
        Object.keys(unsafeCast).length === 13);
};
// Create an Item Document
/// If the object provided does not conform to the Item interface fails
const createItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, item } = req.body;
    const databaseService = new databaseService_1.default();
    const decodedToken = databaseService.verifyToken(token);
    if (!decodedToken) {
        console.log("CreateItem error: OperationTokenNotValid");
        res.sendStatus(403); // Forbidden
        return;
    }
    if (item && isItem(item)) {
        try {
            const newItem = new itemModel_1.Item(Object.assign({}, item));
            yield newItem.save();
            res.sendStatus(200);
        }
        catch (error) {
            const mongooseError = error;
            console.log(`CreateItem error: ${mongooseError.name}`);
            res.sendStatus(500);
        }
    }
    else {
        console.log("CreateItem error: NotItem");
        res.sendStatus(400);
    }
});
exports.createItem = createItem;
const createAddition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const addition = req.body.addition;
    const newAddition = yield (0, itemService_1.buildAddition)(addition);
    if (newAddition) {
        res.sendStatus(200);
    }
    else {
        res.sendStatus(500);
    }
});
exports.createAddition = createAddition;
const searchItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.k;
    const searchId = req.query.search_id;
    try {
        const items = yield itemModel_1.Item.aggregate()
            .search({
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
        })
            .addFields({
            id: "$_id",
        })
            .project({
            _id: 0,
        });
        res.status(200).json(items);
    }
    catch (error) {
        res.sendStatus(400);
    }
});
exports.searchItems = searchItems;
const fetchCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cQuery = req.query.c;
    try {
        const items = yield itemModel_1.Item.find({ category: { $eq: cQuery } });
        res.status(200).json(items);
    }
    catch (error) {
        res.sendStatus(400);
    }
});
exports.fetchCategory = fetchCategory;
const fetchItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const iQuery = req.query.i;
    console.log("Querying item", iQuery);
    if (typeof iQuery !== "string") {
        res.sendStatus(400);
        return;
    }
    try {
        const item = yield itemModel_1.Item.findById(iQuery).populate("additions.additions");
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
