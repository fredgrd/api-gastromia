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
// Fetches the user from the provided token
const fetchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Call", Date.now());
    const token = req.cookies.token;
    const userService = new userService_1.UserService();
    console.log("HAS TOKEN?", token);
    if (!token) {
        res.sendStatus(400);
        return;
    }
    // Verify token
    const userNumber = userService.verifyToken(token || "");
    const foundUser = yield userService.fetchUser(userNumber || "");
    if (foundUser) {
        const token = userService.signToken(userNumber !== null && userNumber !== void 0 ? userNumber : "");
        res.cookie("token", token, {
            maxAge: 60 * 60 * 24 * 10 * 1000,
            httpOnly: true,
            secure: true,
        });
        res.status(200).json({
            id: foundUser._id,
            name: foundUser.name,
            number: foundUser.number,
        });
    }
    else {
        console.log(`Could not find users for: ${userNumber}`);
        res.sendStatus(400);
    }
});
exports.fetchUser = fetchUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
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
        if (newUser) {
            const token = userService.signToken(userNumber !== null && userNumber !== void 0 ? userNumber : "");
            res.cookie("token", token, {
                maxAge: 60 * 60 * 24 * 10 * 1000,
                httpOnly: true,
                secure: true,
            });
            res.status(200).json({
                id: newUser._id,
                name: newUser.name,
                number: newUser.number,
            });
        }
        else {
            res.sendStatus(400);
        }
    }
    else {
        res.sendStatus(400);
    }
});
exports.createUser = createUser;
