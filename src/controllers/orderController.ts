import { Request, Response } from "express";
import { MongooseError, Types } from "mongoose";
import { Item, IItem, isItem } from "../models/itemModel";
import { priceCartSnapshot, validateCartSnapshot } from "../helpers/cartUtils";
import { Cart } from "../models/cartModel";
import StripeService from "../services/stripeService";
import authenticateUser from "../helpers/authenticateUser";
import {
  ICreateOrderData,
  ICreateOrderResponse,
  isCreateOrderData,
  Order,
} from "../models/orderModel";
import { randomAlphanumeric } from "../helpers/alphanumericGenerator";

// Creates the order
//// If the items validation fails it returns a CartUpdate object
//// If the order creation succeeds it returns the order id w/ status
export const createOrder = async (req: Request, res: Response) => {
  const authToken = authenticateUser(req, res, "CreateOrder");

  if (!authToken) {
    return;
  }

  const data: ICreateOrderData | undefined = req.body;

  // Check data
  if (!data || !isCreateOrderData(data)) {
    console.log("CreateOrder error: InvalidData");
    res.status(400).send("InvalidData");
    return;
  }

  // START VALIDATION
  try {
    const items = await Item.find({
      _id: {
        $in: [
          ...new Set(
            data.items_snapshot.map((e) => new Types.ObjectId(e.item_id))
          ),
        ],
      },
    }).populate("attribute_groups.attributes");

    const castedItems: IItem[] = items.filter((e) => isItem(e));

    // Validate
    const { included, excluded } = validateCartSnapshot(
      castedItems,
      data.items_snapshot
    );

    // Local and remote checkouts objects do not match!
    if (excluded.length) {
      await Cart.findOneAndUpdate(
        { owner_id: authToken.id },
        { items: included }
      );

      // Return
      const response: ICreateOrderResponse = {
        included: included,
        excluded: excluded,
        order_id: null,
        order_status: null,
        client_secret: null,
      };
      res.status(202).json({ ...response });
      return;
    }

    // Price snapshot
    const total = priceCartSnapshot(included);

    let clientSecret: string | null | undefined;
    let intentId: string | undefined;
    if (data.card_payment) {
      const stripeService = new StripeService();
      const result = await stripeService.paymentIntent(
        authToken.stripe_id,
        total
      );

      if (result && result?.secret && result.id) {
        clientSecret = result.secret;
        intentId = result.id;
      } else {
        console.log("CreateOrder error: PaymentIntentError");
        res.status(500).send("PaymentIntentError");
        return;
      }
    }

    // Create order
    const order = await Order.create({
      user_id: authToken.id,
      code: randomAlphanumeric(5),
      items: included,
      total: total,
      interval: data.interval,
      status: data.cash_payment ? "submitted" : "pending",
      cash_payment: data.cash_payment,
      card_payment: data.card_payment,
      card_payment_intent: intentId,
    });

    const response: ICreateOrderResponse = {
      included: [],
      excluded: [],
      order_id: order.id,
      order_status: order.status,
      client_secret: clientSecret ? clientSecret : null,
    };
    res.status(200).json({
      ...response,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const updatePaidOrder = async (req: Request, res: Response) => {
  const authToken = authenticateUser(req, res, "CreateOrder");

  if (!authToken) {
    return;
  }

  const id: string | undefined = req.body.id;
  const orderId: string | undefined = req.body.order_id;

  if (id && orderId) {
    const stripeService = new StripeService();
    const paymentIntent = await stripeService.fetchPaymentIntent(id);

    if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        await Order.findByIdAndUpdate(orderId, {
          status: "submitted",
        }).orFail();

        res.sendStatus(200);
      } catch (error) {
        const mongooseError = error as MongooseError;
        console.log(`UpdatePaidOrder error: ${mongooseError.name}`);
        res.sendStatus(500);
      }
    } else {
      console.log("UpdatePaidOrder error: PaymentNotCompleted");
      res.status(400).send("PaymentNotCompleted");
    }
  } else {
    console.log("UpdatePaidOrder error: SecretNotProvided");
    res.status(400).send("SecretNotProvided");
  }
};

// Fetch the user orders
export const fetchOrders = async (req: Request, res: Response) => {
  const authToken = authenticateUser(req, res, "CreateOrder");

  if (!authToken) {
    return;
  }

  try {
    const orders = await Order.find({ user_id: authToken.id }).orFail();

    res.status(200).json({ orders: orders });
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(`FetchOrders error: ${mongooseError.name}`);
    res.sendStatus(500);
  }
};
