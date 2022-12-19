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
exports.fetchCategory = exports.searchItems = exports.createItem = void 0;
const itemModel_1 = require("../models/itemModel");
const itemService_1 = require("../services/itemService");
const createItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const item = req.body.item;
    const newItem = yield (0, itemService_1.createItem)(item);
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
    const category = req.query.c;
    console.log(category);
    try {
        const items = yield itemModel_1.Item.aggregate()
            .match({
            category: category,
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
exports.fetchCategory = fetchCategory;
