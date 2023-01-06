import jwt from "jsonwebtoken";
import {
  ISignupToken,
  IAuthToken,
  isSignupToken,
  isAuthToken,
} from "../models/authModel";
import { IDatabaseOpsToken, isDatabaseOpsToken } from "../models/databaseOps";

export const signSignupToken = (number: string): string => {
  const signedToken = jwt.sign(
    { number: number },
    process.env.JWT_SECRET || "",
    {
      expiresIn: "10m",
    }
  );

  return signedToken;
};

export const verifySignupToken = (token: string): ISignupToken | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "");

    if (isSignupToken(decoded)) {
      return decoded;
    } else {
      return null;
    }
  } catch (error) {
    console.log(`VerifySignupToken error: ${error}`);
    return null;
  }
};

export const signAuthToken = (token: IAuthToken): string => {
  const signedToken = jwt.sign(token, process.env.JWT_SECRET || "", {
    expiresIn: "10d",
  });

  return signedToken;
};

export const verifyAuthToken = (token: string): IAuthToken | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "");

    if (isAuthToken(decoded)) {
      return decoded;
    } else {
      return null;
    }
  } catch (error) {
    console.log(`VerifyAuthToken error: ${error}`);
    return null;
  }
};

export const signDatabaseOpsToken = (token: IDatabaseOpsToken): string => {
  const signedToken = jwt.sign(token, process.env.DB_OPERATION_SECRET || "", {
    expiresIn: "10d",
  });

  return signedToken;
};

export const verifyDatabaseToken = (
  token: string
): IDatabaseOpsToken | null => {
  try {
    const decoded = jwt.verify(token, process.env.DB_OPERATION_SECRET || "");

    if (isDatabaseOpsToken(decoded)) {
      return decoded;
    } else {
      return null;
    }
  } catch (error) {
    console.log(`VerifyDatabaseOpsToken error: ${error}`);
    return null;
  }
};
