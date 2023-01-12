import { Schema, Types } from "mongoose";

// --------------------------------------------------------------------------
// Helpers

export const isCartSnapshot = (snapshot: any): snapshot is ICartSnapshot => {
  const unsafeCast = snapshot as ICartSnapshot;

  return unsafeCast.items_snapshot !== undefined;
};

export const areCartItemSnapshot = (
  items: any[]
): items is ICartItemSnapshot[] => {
  const areItemSnapshots = items.reduce((acc, curr) => {
    if (isCartItemSnapshot(curr)) {
      return acc * 1;
    } else {
      return acc * 0;
    }
  }, 1);

  return areItemSnapshots === 1;
};

export const isCartItemSnapshot = (
  snapshot: any
): snapshot is ICartItemSnapshot => {
  const unsafeCast = snapshot as ICartItemSnapshot;

  return (
    unsafeCast._id !== undefined &&
    unsafeCast.item_id !== undefined &&
    unsafeCast.name !== undefined &&
    unsafeCast.preview_url !== undefined &&
    unsafeCast.attributes_snapshot !== undefined &&
    unsafeCast.quantity !== undefined &&
    unsafeCast.price !== undefined
  );
};

export const isCartItemAttributeSnapshot = (
  snapshot: any
): snapshot is ICartItemAttributeSnapshot => {
  const unsafeCast = snapshot as ICartItemAttributeSnapshot;

  return (
    unsafeCast.group_id !== undefined &&
    unsafeCast.attribute_id !== undefined &&
    unsafeCast.name !== undefined &&
    unsafeCast.quantity !== undefined &&
    unsafeCast.price !== undefined
  );
};

// --------------------------------------------------------------------------
// Interface

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
}

// --------------------------------------------------------------------------
// Schema

export const CartItemAttributeSnapshotSchema = new Schema({
  group_id: {
    type: String,
    required: true,
  },
  attribute_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

export const CartItemSnapshotSchema = new Schema({
  item_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  preview_url: {
    type: String,
    required: true,
  },
  attributes_snapshot: {
    type: [CartItemAttributeSnapshotSchema],
    required: true,
    default: [],
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});
