import { Request, Response } from 'express';
import { MongooseError, Types } from 'mongoose';
import { Item, IItem, isItem } from '../models/itemModel';
import { priceCartSnapshot, validateCartSnapshot } from '../helpers/cartUtils';
import { Cart } from '../models/cartModel';
import StripeService from '../services/stripeService';
import authenticateUser from '../helpers/authenticateUser';
import {
  ICreateOrderData,
  ICreateOrderResponse,
  isCreateOrderData,
  Order,
} from '../models/orderModel';
import { randomAlphanumeric } from '../helpers/alphanumericGenerator';
import authenticateOperator from '../helpers/authenticateOperator';

// Creates the order
//// If the items validation fails it returns a CartUpdate object
//// If the order creation succeeds it returns the order id w/ status
export const createOrder = async (req: Request, res: Response) => {
  const authToken = authenticateUser(req, res, 'CreateOrder');

  if (!authToken) {
    return;
  }

  const data: ICreateOrderData | undefined = req.body;

  // Check data
  if (!data || !isCreateOrderData(data)) {
    console.log('CreateOrder error: InvalidData');
    res.status(400).send('InvalidData');
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
    }).populate('attribute_groups.attributes');

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
        console.log('CreateOrder error: PaymentIntentError');
        res.status(500).send('PaymentIntentError');
        return;
      }
    }

    // Create order
    const order = await Order.create({
      user_id: authToken.id,
      user_name: data.user_name,
      user_number: data.user_number,
      code: randomAlphanumeric(5),
      items: included,
      info: data.info,
      total: total,
      interval: data.interval,
      status: data.cash_payment ? 'submitted' : 'pending',
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

// Update the user order when purchasing with a card
// The order is updated from pending to submitted when the card payment is successfull
export const updatePaidOrder = async (req: Request, res: Response) => {
  const authToken = authenticateUser(req, res, 'UpdatePaidOrder');

  if (!authToken) {
    return;
  }

  const id: string | undefined = req.body.id;
  const orderId: string | undefined = req.body.order_id;

  if (id && orderId) {
    const stripeService = new StripeService();
    const paymentIntent = await stripeService.fetchPaymentIntent(id);

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        await Order.findByIdAndUpdate(orderId, {
          status: 'submitted',
        }).orFail();

        res.sendStatus(200);
      } catch (error) {
        const mongooseError = error as MongooseError;
        console.log(`UpdatePaidOrder error: ${mongooseError.name}`);
        res.sendStatus(500);
      }
    } else {
      console.log('UpdatePaidOrder error: PaymentNotCompleted');
      res.status(400).send('PaymentNotCompleted');
    }
  } else {
    console.log('UpdatePaidOrder error: SecretNotProvided');
    res.status(400).send('SecretNotProvided');
  }
};

// Fetch the user orders documents
// Only used by the Gastromia WebApp to retrieve all the orders matching the user_id
export const fetchOrders = async (req: Request, res: Response) => {
  const authToken = authenticateUser(req, res, 'CreateOrder');

  if (!authToken) {
    return;
  }

  try {
    const orders = await Order.find({ user_id: authToken.id });
    res.status(200).json({ orders: orders });
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(`FetchOrders error: ${mongooseError.name}`);
    res.sendStatus(500);
  }
};

// Fetches the active orders (matching the submitted, accepted, or ready statuses)
// Orders not active are not returned to the operator
// Used only by the Hub Manager
export const fetchActiveOrders = async (req: Request, res: Response) => {
  const operatorToken = authenticateOperator(req, res, 'FetchActiveOrders');

  if (!operatorToken) {
    return;
  }

  try {
    const orders = await Order.find({
      status: {
        $in: ['submitted', 'accepted', 'ready'],
      },
    }).orFail();

    res.status(200).json({ orders: orders });
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(
      `FetchActiveOrders error: ${mongooseError.name} ${mongooseError.message}`
    );
    res.sendStatus(500);
  }
};

// Fetches all the orders received
// Used only by the Hub Manager
export const fetchAllOrders = async (req: Request, res: Response) => {
  const operatorToken = authenticateOperator(req, res, 'FetchAllOrders');

  if (!operatorToken) {
    return;
  }

  try {
    const orders = await Order.find().orFail();

    res.status(200).json({ orders: orders });
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(
      `FetchAllOrders error: ${mongooseError.name} ${mongooseError.message}`
    );
    res.sendStatus(500);
  }
};

// Fetches a specific order for the operator
// Used only by the Hub Manager
export const fetchOrder = async (req: Request, res: Response) => {
  const operatorToken = authenticateOperator(req, res, 'UpdateOrderStatus');

  if (!operatorToken) {
    return;
  }

  const orderId = req.query.o;

  if (!orderId || typeof orderId !== 'string') {
    console.log('UpdateOrderStatus error: NoOrderProvided');
    res.sendStatus(400);
    return;
  }

  try {
    const order = await Order.findById(orderId).orFail();

    res.status(200).json({ order: order });
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(`FetchOrder error: ${mongooseError.name}`);
    res.sendStatus(500);
  }
};

// Update the order status
// Used only by the Hub Manager
export const updateOrderStatus = async (req: Request, res: Response) => {
  const operatorToken = authenticateOperator(req, res, 'UpdateOrderStatus');

  if (!operatorToken) {
    return;
  }

  const orderId: string | any = req.body.order_id;
  const status: string | any = req.body.status;

  if (!orderId || typeof orderId !== 'string') {
    console.log('UpdateOrderStatus error: NoOrderProvided');
    res.sendStatus(400);
    return;
  }

  if (!status || typeof status !== 'string') {
    console.log('UpdateOrderStatus error: NoStatusProvided');
    res.sendStatus(400);
    return;
  }

  try {
    let order = await Order.findById(orderId).orFail();

    if (order.card_payment && status === 'rejected') {
      const stripe = new StripeService();

      const refunded = await stripe.refundPaymentIntent(
        order.card_payment_intent
      );

      if (refunded && refunded.status === 'succeeded') {
        order.status = 'refunded';
        await order.save();

        res.status(200).json({ order: order });
        return;
      } else {
        res.sendStatus(500);
        return;
      }
    }

    if (status === 'rejected') {
      order.status = 'rejected';
      await order.save();

      res.status(200).json({ order: order });
      return;
    }

    order.status = status;
    await order.save();
    res.status(200).json({ order: order });
    return;
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(mongooseError.message);
    console.log(`UpdateOrderStatus error: ${mongooseError.name}`);
    res.sendStatus(500);
  }
};
