import { Schema, model } from "mongoose";
import { CartItemSchema, ICartItem } from "./cartItemModel";

export interface ICart {
  owner_id: string; // No need to reference ObjectId - this will not be populated
  items: ICartItem[];
}

const CartSchema = new Schema<ICart>({
  owner_id: {
    type: String,
    required: true,
  },
  items: {
    type: [CartItemSchema],
    required: true,
    default: [],
  },
});

export const Cart = model<ICart>("Cart", CartSchema);