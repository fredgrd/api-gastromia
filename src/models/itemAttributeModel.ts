import { Schema, Types, model } from "mongoose";

// --------------------------------------------------------------------------
// Helpers

// Checks if the object provided is an ItemAttribute
export const isItemAttribute = (
  itemAttribute: any
): itemAttribute is IItemAttribute => {
  const unsafeCast = itemAttribute as IItemAttribute;

  return (
    unsafeCast._id !== undefined &&
    unsafeCast.name !== undefined &&
    unsafeCast.available !== undefined &&
    unsafeCast.price !== undefined &&
    unsafeCast.media_url !== undefined &&
    unsafeCast.unique_tag !== undefined
  );
};

// Checks if the object provided is an ItemAttributeGroup
export const isItemAttributeGroup = (
  group: any
): group is IItemAttributeGroup => {
  const unsafeCast = group as IItemAttributeGroup;

  return (
    unsafeCast._id !== undefined &&
    unsafeCast.with_media !== undefined &&
    unsafeCast.rules !== undefined &&
    unsafeCast.name !== undefined &&
    unsafeCast.description !== undefined &&
    unsafeCast.attributes !== undefined
  );
};

export interface IItemAttribute {
  _id?: Types.ObjectId;
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
  _id?: Types.ObjectId;
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
