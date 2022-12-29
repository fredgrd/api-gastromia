import { Schema, Types, model, InferSchemaType } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ItemAttributeGroupSchema } from "./itemAttributeModel";

// --------------------------------------------------------------------------
// Helpers

// Checks if the object provided is an Item
/// Update the length check of the object keys w/ latest value
export const isItem = (item: any): item is IItem => {
  const unsafeCast = item as IItem;

  return (
    unsafeCast._id !== undefined &&
    unsafeCast.name !== undefined &&
    unsafeCast.description !== undefined &&
    unsafeCast.available !== undefined &&
    unsafeCast.quick_add !== undefined &&
    unsafeCast.price !== undefined &&
    unsafeCast.discount !== undefined &&
    unsafeCast.discount_price !== undefined &&
    unsafeCast.discount_label !== undefined &&
    unsafeCast.attribute_groups !== undefined &&
    unsafeCast.tags !== undefined &&
    unsafeCast.category !== undefined &&
    unsafeCast.media_url !== undefined &&
    unsafeCast.preview_url !== undefined &&
    unsafeCast.item_version !== undefined
  );
};

// --------------------------------------------------------------------------
// Interface / Schema / Model

export interface IItem {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  available: boolean;
  quick_add: boolean;
  price: number;
  discount: boolean;
  discount_price: number;
  discount_label: string;
  attribute_groups: InferSchemaType<typeof ItemAttributeGroupSchema>[];
  tags: string[];
  category: string;
  media_url: string;
  preview_url: string;
  item_version: string;
}

const ItemSchema = new Schema<IItem>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
    default: true,
  },
  quick_add: {
    type: Boolean,
    required: true,
    default: false,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Boolean,
    required: true,
    default: false,
  },
  discount_price: {
    type: Number,
    required: true,
  },
  discount_label: {
    type: String,
    required: true,
    default: "",
  },
  attribute_groups: {
    type: [ItemAttributeGroupSchema],
    required: true,
    default: [],
  },
  tags: {
    type: [String],
    required: true,
    default: [],
  },
  category: {
    type: String,
    required: true,
    default: "",
  },
  media_url: {
    type: String,
    required: true,
    default: "",
  },
  preview_url: {
    type: String,
    required: true,
    default: "",
  },
  item_version: {
    type: String,
    required: true,
    default: uuidv4(),
  },
});

export const Item = model<IItem>("Item", ItemSchema);
