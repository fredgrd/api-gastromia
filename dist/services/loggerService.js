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
exports.LoggerService = void 0;
const logModel_1 = require("../models/logModel");
class LoggerService {
    constructor() {
    }
    createLog(attr) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const log = logModel_1.Log.build(attr);
                yield log.save();
                console.log("CREATED");
                return log;
            }
            catch (error) {
                console.log(`CreateUser error: ${error}`);
                return;
            }
        });
    }
}
exports.LoggerService = LoggerService;
