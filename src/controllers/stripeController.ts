import { Request, Response } from "express";
import StripeService from "../services/stripeService";

export const createCustomer = async (req: Request, res: Response) => {
  const stripeService = new StripeService();

  const customerId = await stripeService.createCustomer("maooo");

  if (!customerId) {
    res.sendStatus(500);
  }
};
