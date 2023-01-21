import { Schema, Types, model } from "mongoose";
import { CartItemSnapshotSchema, ICartItemSnapshot } from "./cartSnapshot";
import { randomAlphanumeric } from "../helpers/alphanumericGenerator";

// --------------------------------------------------------------------------
// Helpers

export const isCreateOrderData = (data: any): data is ICreateOrderData => {
  const unsafeCast = data as ICreateOrderData;

  return (
    unsafeCast.items_snapshot !== undefined &&
    unsafeCast.items_snapshot.length > 0 &&
    unsafeCast.interval !== undefined &&
    unsafeCast.cash_payment !== undefined &&
    unsafeCast.card_payment !== undefined &&
    unsafeCast.card_payment_method !== undefined
  );
};

// --------------------------------------------------------------------------
// Interface / Schema / Model

export interface ICreateOrderData {
  items_snapshot: ICartItemSnapshot[];
  interval: string;
  cash_payment: boolean;
  card_payment: boolean;
  card_payment_method: string;
}

export interface ICreateOrderResponse {
  included: ICartItemSnapshot[];
  excluded: { item: ICartItemSnapshot; message: string }[];
  order_id: string | null;
  order_status: string | null;
  client_secret: string | null;
}

export interface IOrder {
  _id?: Types.ObjectId;
  code: string;
  user_id: string;
  interval: string;
  items: ICartItemSnapshot[];
  total: number;
  status: string;
  cash_payment: boolean;
  card_payment: boolean;
  card_payment_intent: string;
  created_at: Date;
}

const OrderSchema = new Schema<IOrder>({
  code: {
    type: String,
    default: "AAAAA",
  },
  user_id: {
    type: String,
    required: true,
  },
  interval: {
    type: String,
    required: true,
  },
  items: {
    type: [CartItemSnapshotSchema],
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: [
      "pending",
      "submitted",
      "accepted",
      "rejected",
      "ready",
      "stalled",
      "refunded",
      "completed",
    ],
    default: "pending",
  },
  cash_payment: {
    type: Boolean,
    required: true,
  },
  card_payment: {
    type: Boolean,
    required: true,
  },
  card_payment_intent: {
    type: String,
    default: "",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export const Order = model<IOrder>("Order", OrderSchema);
