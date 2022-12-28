import { Schema, Types, model } from "mongoose";

export interface IItemAttribute {
  name: string;
  unique_tag: string;
  price: number;
  available: boolean;
  media_url: string;
}

const ItemAttributeSchema = new Schema<IItemAttribute>({
  name: {
    type: String,
    required: true,
  },
  unique_tag: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  available: {
    type: Boolean,
    required: true,
    default: true,
  },
  media_url: {
    type: String,
    required: true,
    default: " ",
  },
});

export const ItemAttribute = model<IItemAttribute>(
  "ItemAttribute",
  ItemAttributeSchema
);

interface IItemAttributeGroupRules {
  group_min: number;
  group_max: number;
  attribute_max: number;
}

export const ItemAttributeGroupRulesSchema =
  new Schema<IItemAttributeGroupRules>(
    {
      group_min: {
        type: Number,
        required: true,
        default: 0,
      },
      group_max: {
        type: Number,
        required: true,
        default: 1,
      },
      attribute_max: {
        type: Number,
        required: true,
        default: 1,
      },
    },
    { _id: false }
  );

export interface IItemAttributeGroup {
  with_media: boolean;
  rules: IItemAttributeGroupRules;
  name: string;
  description: string;
  attributes: Types.ObjectId[];
}

export const ItemAttributeGroupSchema = new Schema<IItemAttributeGroup>({
  with_media: {
    type: Boolean,
    required: true,
    default: false,
  },
  rules: {
    type: ItemAttributeGroupRulesSchema,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  attributes: {
    type: [Schema.Types.ObjectId],
    ref: "ItemAttribute",
    required: true,
    default: [],
  },
});
