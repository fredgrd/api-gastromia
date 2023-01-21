import jwt from "jsonwebtoken";
import {
  ISignupToken,
  IAuthToken,
  isSignupToken,
  isAuthToken,
  IOperatorToken,
  isOperatorToken,
} from "../models/authModel";

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

export const signOperatorToken = (token: IOperatorToken): string => {
  const signedToken = jwt.sign(token, process.env.OPERATOR_SECRET || "", {
    expiresIn: "10d",
  });

  return signedToken;
};

export const verifyOperatorToken = (token: string): IOperatorToken | null => {
  try {
    const decoded = jwt.verify(token, process.env.OPERATOR_SECRET || "");

    if (isOperatorToken(decoded)) {
      return decoded;
    } else {
      return null;
    }
  } catch (error) {
    console.log(`VerifyDatabaseOpsToken error: ${error}`);
    return null;
  }
};
