import { MongooseError } from "mongoose";
import { ICartAttribute } from "../models/cartItemModel";
import { Item } from "../models/itemModel";

// --------------------------------------------------------------------------
// ItemAddition

// Validates the submitted addition
/// Checks if the item and attributes exist in the Doc structure
/// Checks if the Attributes match the corresponding AttributeGroupRules
export const validateItemAddition = async (
  item_id: string,
  attributes: ICartAttribute[],
  quantity: number
) => {
  try {
    const item = await Item.findById(item_id)
      .populate("attribute_groups.attributes")
      .orFail();

    // Check if all the attributes provided match the item doc
    const docAttributes = item.attribute_groups.flat()
    console.log(docAttributes)
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(`ValidateItemAddition error: ${mongooseError}`);

    // Must return something
  }
};
