import mongoose from "mongoose";
import { CartItemSchema, ICartItem } from "./cartItemModel";

export interface ICart {
  owner_id: string;
  items: ICartItem[];
  updatedAt: Number;
}

export interface CartDoc extends mongoose.Document {
  owner_id: string;
  items: ICartItem[];
  createdAt: Number;
  updatedAt: Number;
}

interface CartModelInterface extends mongoose.Model<CartDoc> {
  build(attr: ICart): CartDoc;
}

const cartSchema = new mongoose.Schema({
  owner_id: {
    type: String,
    required: true,
    default: "",
  },
  items: {
    type: [CartItemSchema],
    required: true,
    default: [],
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

cartSchema.statics.build = (attr: ICart) => {
  return new Cart(attr);
};

export const Cart = mongoose.model<CartDoc, CartModelInterface>(
  "Cart",
  cartSchema
);

export const cleanCart = (cart: CartDoc): { items: ICartItem[] } => {
  const items = cart.items.map((item) => {
    const additions = item.additions.filter(
      (addition) => addition.quantity > 0
    );

    return {
      item: item.item,
      additions: additions,
      quantity: item.quantity,
    };
  });

  return { items: items };
};
