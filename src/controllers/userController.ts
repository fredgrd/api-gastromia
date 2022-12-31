import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { MongooseError } from "mongoose";
import { User } from "../models/userModel";
import StripeService from "../services/stripeService";
import {
  signAuthToken,
  verifyAuthToken,
  verifySignupToken,
} from "../helpers/jwtTokens";

// Fetches the user from a valid AuthToken
/// Returns both the User object and an updated AuthToken
export const fetchUser = async (req: Request, res: Response) => {
  const token = req.cookies.auth_token;

  if (!token || typeof token !== "string") {
    console.log("FetchUser error: MissingToken");
    res.sendStatus(403);
    return;
  }

  // Verify token
  const authtoken = verifyAuthToken(token);

  if (!authtoken) {
    console.log("FetchUser error: NotAuthToken");
    res.sendStatus(403);
    return;
  }

  try {
    const user = await User.findById(authtoken.id).orFail();

    // Update the AuthToken
    const token = signAuthToken({
      id: user.id,
      stripe_id: user.stripe_id,
      number: user.number,
    });
    res.cookie("auth_token", token, {
      maxAge: 60 * 60 * 24 * 10 * 1000, // 60s * 60m * 24h * 10d => 10 Days in secods => in milliseconds
      httpOnly: true,
      secure: true,
    });

    res.status(200).json(user);
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(`FetchUser error: ${mongooseError.message}`);
    res.sendStatus(500);
  }
};

// Creates a user from a valid signup token
/// Returns both the User object and an AuthToken
export const createUser = async (req: Request, res: Response) => {
  const token = req.cookies.signup_token;
  const name = req.body.name;
  const stripeService = new StripeService();

  if (!token || typeof token !== "string") {
    console.log("CreateUser error: MissingToken");
    res.sendStatus(403);
    return;
  }

  // Verify token
  const signupToken = verifySignupToken(token);

  if (!signupToken) {
    console.log("CreateUser error: NotSignupToken");
    res.sendStatus(403);
    return;
  }

  try {
    const user = await User.create({
      stripe_id: "awaiting",
      number: signupToken.number,
      name: name,
      email: `unknown-${uuidv4()}`,
    });

    const customerId = await stripeService.createCustomer(user.id);

    if (customerId) {
      user.stripe_id = customerId;
      await user.save();

      // Set cookie
      const token = signAuthToken({
        id: user.id,
        stripe_id: user.stripe_id,
        number: user.number,
      });
      res.cookie("auth_token", token, {
        maxAge: 60 * 60 * 24 * 10 * 1000, // 60s * 60m * 24h * 10d => 10 Days in secods => in milliseconds
        httpOnly: true,
        secure: true,
      });

      res.clearCookie("signup_token");

      res.status(200).json(user);
    } else {
      user.delete();
      console.log("CreateUser error: StripeCustomerError");
      res.sendStatus(500);
    }
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(`CreateUser error: ${mongooseError.message}`);
    res.sendStatus(400);
  }
};
