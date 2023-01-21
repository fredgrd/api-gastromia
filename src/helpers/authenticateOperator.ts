import { Request, Response } from "express";
import { IOperatorToken } from "../models/authModel";
import { verifyOperatorToken } from "./jwtTokens";

// Authenticates the operator according to the token provided
// If the token was not provided it fails
const authenticateOperator = (
  req: Request,
  res: Response,
  from: string
): IOperatorToken | null => {
  const token = req.cookies.operator_token;

  if (!token || typeof token !== "string") {
    console.log(`${from} error: MissingToken`);
    res.status(403).send("MissingToken");
    return null;
  }

  // Verify token
  const operatorToken = verifyOperatorToken(token);

  if (!operatorToken) {
    console.log(`${from} error: OperatorTokenIvalid`);
    res.status(403).send("OperatorTokenIvalid");
    return null;
  }

  return operatorToken;
};

export default authenticateOperator;
