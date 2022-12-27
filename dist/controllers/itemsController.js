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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchItem = exports.fetchCategory = exports.searchItems = exports.createItem = exports.createAddition = void 0;
const itemModel_1 = require("../models/itemModel");
const itemService_1 = require("../services/itemService");
const itemService_2 = require("../services/itemService");
const createAddition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const addition = req.body.addition;
    const newAddition = yield (0, itemService_2.buildAddition)(addition);
    if (newAddition) {
        res.sendStatus(200);
    }
    else {
        res.sendStatus(500);
    }
});
exports.createAddition = createAddition;
const createItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const item = req.body.item;
    const newItem = yield (0, itemService_1.buildItem)(item);
    if (newItem) {
        res.sendStatus(200);
    }
    else {
        res.sendStatus(500);
    }
});
exports.createItem = createItem;
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
