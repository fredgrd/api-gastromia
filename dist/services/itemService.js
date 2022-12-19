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
exports.createItem = void 0;
const itemModel_1 = require("../models/itemModel");
const createItem = (attr) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = itemModel_1.Item.build(attr);
        yield item.save();
        return item;
    }
    catch (error) {
        console.log(`CreateItem error: ${error}`);
        return;
    }
});
exports.createItem = createItem;
