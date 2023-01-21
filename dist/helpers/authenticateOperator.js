"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwtTokens_1 = require("./jwtTokens");
// Authenticates the operator according to the token provided
// If the token was not provided it fails
const authenticateOperator = (req, res, from) => {
    const token = req.cookies.operator_token;
    if (!token || typeof token !== "string") {
        console.log(`${from} error: MissingToken`);
        res.status(403).send("MissingToken");
        return null;
    }
    // Verify token
    const operatorToken = (0, jwtTokens_1.verifyOperatorToken)(token);
    if (!operatorToken) {
        console.log(`${from} error: OperatorTokenIvalid`);
        res.status(403).send("OperatorTokenIvalid");
        return null;
    }
    return operatorToken;
};
exports.default = authenticateOperator;
