import { Types } from "mongoose";

export interface ICartItemAttributeSnapshot {
  group_id: string;
  attribute_id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface ICartItemSnapshot {
  _id?: Types.ObjectId; // The id of the item in cart
  item_id: string;
  name: string;
  preview_url: string;
  attributes_snapshot: ICartItemAttributeSnapshot[];
  quantity: number;
  price: number;
}

export interface ICartSnapshot {
  items_snapshot: ICartItemSnapshot[];
  snapshot_version: string; // Should update the cart with this value
}
