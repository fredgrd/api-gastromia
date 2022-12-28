import { Schema, Types } from "mongoose";

export interface ICartAttribute {
  group_id: string; // ID needed for validation
  attribute: Types.ObjectId; // Will be populated when computing cart / item total
  quantity: number;
}

export const CartAttributeSchema = new Schema<ICartAttribute>(
  {
    group_id: {
      type: String,
      required: true,
    },
    attribute: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { _id: false }
);

export interface ICartItem {
  item: Types.ObjectId; // Will be populated when computing the cart total
  attributes: ICartAttribute[];
  quantity: number;
}

export const CartItemSchema = new Schema<ICartItem>({
  item: { type: Schema.Types.ObjectId, required: true },
  attributes: {
    type: [CartAttributeSchema],
    required: true,
    default: [],
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});
