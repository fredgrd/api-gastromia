import { Request, Response } from "express";
import { verifyAuthToken } from "../helpers/jwtTokens";
import StripeService from "../services/stripeService";

export const createSetupIntent = async (req: Request, res: Response) => {
  const token = req.cookies.auth_token;

  if (!token || typeof token !== "string") {
    console.log("UpdateCart error: MissingToken");
    res.status(403).send("MissingToken");
    return;
  }

  // Verify token
  const authtoken = verifyAuthToken(token);

  if (!authtoken) {
    console.log("UpdateCart error: NotAuthToken");
    res.status(403).send("NotAuthToken");
    return;
  }

  const stripe = new StripeService();
  const setupIntent = await stripe.setupIntent(authtoken.stripe_id);

  if (setupIntent) {
    res.status(200).json({ client_secret: setupIntent });
  } else {
    res.sendStatus(500);
  }
};

export const fetchCards = async (req: Request, res: Response) => {
  const token = req.cookies.auth_token;

  if (!token || typeof token !== "string") {
    console.log("UpdateCart error: MissingToken");
    res.status(403).send("MissingToken");
    return;
  }

  // Verify token
  const authtoken = verifyAuthToken(token);

  if (!authtoken) {
    console.log("UpdateCart error: NotAuthToken");
    res.status(403).send("NotAuthToken");
    return;
  }

  const stripe = new StripeService();
  const cards = await stripe.paymentMethods(authtoken.stripe_id);

  res.status(200).json({ cards: cards });
};
