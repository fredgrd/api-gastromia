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
exports.createUser = exports.fetchUser = void 0;
const userService_1 = require("../services/userService");
const fetchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    const userService = new userService_1.UserService();
    if (!token) {
        res.sendStatus(400);
        return;
    }
    // Verify token
    const userNumber = userService.verifyToken(token || "");
    const foundUser = yield userService.fetchUser(userNumber || "");
    if (foundUser) {
        res.status(200).json(foundUser);
    }
    else {
        console.log(`Could not find users for: ${userNumber}`);
        res.sendStatus(400);
    }
});
exports.fetchUser = fetchUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const token = (_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", "");
    const name = req.body.name;
    const userService = new userService_1.UserService();
    if (!token) {
        res.sendStatus(400);
        return;
    }
    // Verify token
    const userNumber = userService.verifyToken(token || "");
    const foundUser = yield userService.fetchUser(userNumber || "");
    if (userNumber && !foundUser) {
        const newUser = yield userService.createUser({
            number: userNumber,
            name: name,
        });
        res.status(200).json(newUser);
    }
    else {
        res.sendStatus(400);
    }
});
exports.createUser = createUser;
