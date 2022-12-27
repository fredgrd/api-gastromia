import mongoose from "mongoose";
import { CartAdditionSchema, ICartAddition } from "./cartAdditionsModel";

export interface ICartItem {
  item: string;
  additions: ICartAddition[];
  quantity: number;
}

export const CartItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  additions: {
    type: [CartAdditionSchema],
    required: true,
    default: [],
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

export const cartItemsEquality = (a: ICartItem, b: ICartItem): boolean => {
  if (a.item.toString() !== b.item.toString()) {
    return false;
  }

  if (a.additions.length !== b.additions.length) {
    return false;
  }

  const uniqueIdentifiers = a.additions
    .concat(b.additions)
    .map(
      (el) =>
        `${el.group_id.toString()}${el.addition_id.toString()}${el.quantity}`
    );
  const occurences = [...new Set(uniqueIdentifiers)];

  return occurences.length === a.additions.length;
};
