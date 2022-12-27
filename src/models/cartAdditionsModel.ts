import mongoose from "mongoose";

export interface ICartAddition {
  group_id: string;
  addition_id: string;
  quantity: number;
}

export const CartAdditionSchema = new mongoose.Schema(
  {
    group_id: {
      type: String,
      required: true,
    },
    addition_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Addition",
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
