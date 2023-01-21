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
exports.fetchOperator = exports.logoutOperator = exports.loginOperator = void 0;
const authenticateOperator_1 = __importDefault(require("../helpers/authenticateOperator"));
const jwtTokens_1 = require("../helpers/jwtTokens");
const operatorModel_1 = require("../models/operatorModel");
// Logs in the operator
// Returns an OperatorToken
const loginOperator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || typeof email !== "string") {
        console.log("LoginOperator error: NoEmail");
        res.status(400).send("NoEmail");
        return;
    }
    if (!password || typeof password !== "string") {
        console.log("LoginOperator error: NoPassword");
        res.status(400).send("NoPassword");
        return;
    }
    try {
        const operator = yield operatorModel_1.Operator.findOne({ email: email }).orFail();
        const passwordMatch = operator.password === password;
        if (passwordMatch) {
            // Set cookie
            const token = (0, jwtTokens_1.signOperatorToken)({ id: operator.id });
            res.cookie("operator_token", token, {
                maxAge: 60 * 60 * 24 * 10 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: "none",
                domain: "gastromia.com",
            });
            res.status(200).json({
                _id: operator.id,
                name: operator.name,
                surname: operator.surname,
                email: operator.email,
            });
        }
        else {
            console.log("LoginOperator error: WrongPassword");
            res.status(400).send("WrongPassword");
        }
    }
    catch (error) {
        const mongooseError = error;
        if (mongooseError.name === "DocumentNotFoundError") {
            res.status(400).send("No Email");
            return;
        }
        console.log(`LoginOperator error: ${mongooseError.name} ${mongooseError.message}`);
        res.sendStatus(500);
    }
});
exports.loginOperator = loginOperator;
// Logs out the operator
// Removes the OperatorToken from the browser
const logoutOperator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("operator_token");
    res.sendStatus(200);
});
exports.logoutOperator = logoutOperator;
const fetchOperator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const operatorToken = (0, authenticateOperator_1.default)(req, res, "FetchOperator");
    if (!operatorToken) {
        return;
    }
    try {
        const operator = yield operatorModel_1.Operator.findById(operatorToken.id).orFail();
        const token = (0, jwtTokens_1.signOperatorToken)({ id: operator.id });
        res.cookie("operator_token", token, {
            maxAge: 60 * 60 * 24 * 10 * 1000,
            httpOnly: true,
            secure: true,
        });
        res.status(200).json({
            _id: operator.id,
            name: operator.name,
            surname: operator.surname,
            email: operator.email,
        });
    }
    catch (error) {
        const mongooseError = error;
        console.log(`LoginOperator error: ${mongooseError.name} ${mongooseError.message}`);
        res.sendStatus(500);
    }
});
exports.fetchOperator = fetchOperator;
