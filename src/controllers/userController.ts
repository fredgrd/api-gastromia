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
import authenticateUser from "../helpers/authenticateUser";

// Fetches the user from a valid AuthToken
/// Returns both the User object and an updated AuthToken
export const fetchUser = async (req: Request, res: Response) => {
  const authToken = authenticateUser(req, res, "FetchUser");

  if (!authToken) {
    return;
  }

  console.log(req.cookies.auth_token);

  try {
    const user = await User.findById(authToken.id).orFail();

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
      domain: "www.gastromia.com",
    });

    res.status(200).json(user);
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(`FetchUser error: ${mongooseError.message}`);

    res.clearCookie("auth_token");

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

  console.log("USER SIGNUP TOKEN");
  console.log(signupToken, token);

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

// Updates the user
// Updates the user document
export const updateUser = async (req: Request, res: Response) => {
  const authToken = authenticateUser(req, res, "UpdateUser");

  if (!authToken) {
    return;
  }

  const update = req.body.update;

  if (!update) {
    console.log("UpdateUser error: UpdateNotProvided");
    res.sendStatus(400);
  }

  try {
    const user = await User.findByIdAndUpdate(
      authToken.id,
      {
        ...update,
      },
      { returnOriginal: false }
    ).orFail();

    res.status(200).json(user);
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(`UpdateUser error: ${mongooseError.message}`);
    res.sendStatus(500);
  }
};
