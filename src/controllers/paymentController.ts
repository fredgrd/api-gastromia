import { Request, Response } from "express";
import authenticateUser from "../helpers/authenticateUser";
import { verifyAuthToken } from "../helpers/jwtTokens";
import StripeService from "../services/stripeService";

// Creates a card setupintent w/ Strip SDK
// Used only by the Gastromia WebApp
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

// Fetches all the cards that match the specific user customer id
// Used only by the Gastromia WebApp
export const fetchCards = async (req: Request, res: Response) => {
  const authToken = authenticateUser(req, res, "CreateOrder");

  if (!authToken) {
    return;
  }

  const stripe = new StripeService();
  const cards = await stripe.paymentMethods(authToken.stripe_id);

  res.status(200).json({ cards: cards });
};

export const detachCard = async (req: Request, res: Response) => {
  const authToken = authenticateUser(req, res, "CreateOrder");

  if (!authToken) {
    return;
  }

  const paymentMethod: string | any = req.body.payment_method_id;

  if (paymentMethod && typeof paymentMethod === "string") {
    const stripe = new StripeService();
    const detached = await stripe.detach(paymentMethod);

    if (detached) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(400);
  }
};
