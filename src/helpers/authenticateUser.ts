import { Request, Response } from "express";
import { IAuthToken } from "../models/authModel";
import { verifyAuthToken } from "./jwtTokens";

const authenticateUser = (
  req: Request,
  res: Response,
  from: string
): IAuthToken | null => {
  const token = req.cookies.auth_token;

  if (!token || typeof token !== "string") {
    console.log(`${from} error: MissingToken`);
    res.status(403).send("MissingToken");
    return null;
  }

  // Verify token
  const authtoken = verifyAuthToken(token);

  if (!authtoken) {
    console.log(`${from} error: AuthTokenIvalid`);
    res.status(403).send("AuthTokenInvalid");
    return null;
  }

  return authtoken;
};

export default authenticateUser;
