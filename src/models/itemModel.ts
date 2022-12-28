import { Schema, Types, model } from "mongoose";
import {
  IItemAttributeGroup,
  ItemAttributeGroupSchema,
} from "./itemAttributeModel";

export interface IItem {
  name: string;
  description: string;
  available: boolean;
  quick_add: boolean;
  price: number;
  discount: boolean;
  discount_price: number;
  discount_label: string;
  attribute_groups: IItemAttributeGroup[];
  tags: string[];
  category: string;
  media_url: string;
  preview_url: string;
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
});

export const Item = model<IItem>("Item", ItemSchema);
