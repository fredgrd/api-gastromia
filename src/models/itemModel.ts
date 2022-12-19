import mongoose from "mongoose";

export interface IItem {
  name: string;
  description: string;
  available: boolean;
  price: number;
  discount: boolean;
  discount_price: number;
  discount_label: string;
  additions: [];
  tags: [string];
  category: string;
  media_url: string;
  preview_url: string;
}

export interface ItemDoc extends mongoose.Document {
  name: string;
  description: string;
  available: boolean;
  price: number;
  discount: boolean;
  discount_price: number;
  discount_label: string;
  additions: [];
  tags: [string];
  category: string;
  media_url: string;
  preview_url: string;
}

interface ItemModelInterface extends mongoose.Model<ItemDoc> {
  build(attr: IItem): ItemDoc;
}

const itemSchema = new mongoose.Schema({
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
  additions: {
    type: [String],
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

itemSchema.statics.build = (attr: IItem) => {
  return new Item(attr);
};

export const Item = mongoose.model<ItemDoc, ItemModelInterface>(
  "Item",
  itemSchema
);
