import { Schema, model, Types } from "mongoose";
import { CartItemSnapshotSchema, ICartItemSnapshot } from "./cartSnapshot";

// --------------------------------------------------------------------------
// Interface / Schema / Model

export interface ICart {
  _id?: Types.ObjectId;
  owner_id: string; // No need to reference ObjectId - this will not be populated
  items: ICartItemSnapshot[];
}

const CartSchema = new Schema<ICart>({
  owner_id: {
    type: String,
    required: true,
  },
  items: {
    type: [CartItemSnapshotSchema],
    required: true,
    default: [],
  },
});

export const Cart = model<ICart>("Cart", CartSchema);
