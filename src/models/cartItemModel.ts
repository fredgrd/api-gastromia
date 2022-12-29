import { Schema, Types } from "mongoose";
import { IItemAttribute } from "./itemAttributeModel";
import { IItem } from "./itemModel";

// --------------------------------------------------------------------------
// Interface / Schema / Model

export interface ICartAttribute {
  group_id: string; // ID needed for validation
  attribute: Types.ObjectId | IItemAttribute; // Will be populated when computing cart / item total
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
      ref: "ItemAttribute",
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
  _id?: Types.ObjectId;
  item: Types.ObjectId | IItem; // Will be populated when computing the cart total
  item_version: string;
  attributes: ICartAttribute[];
  quantity: number;
}

export const CartItemSchema = new Schema<ICartItem>({
  item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
  item_version: {
    type: String,
    required: true,
  },
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

// --------------------------------------------------------------------------
// Client Interfaces

export interface IClientCartItemAttribute {
  name: string;
  quantity: number;
}

export interface IClientCartItem {
  id: string;
  item_id: string;
  name: string;
  preview_url: string;
  attributes: IClientCartItemAttribute[];
  quantity: number;
  total: number;
}
