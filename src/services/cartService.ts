import { Types, MongooseError } from "mongoose";
import { ICartItem } from "../models/cartItemModel";
import { ICartOperationAttribute } from "../models/cartOperations";
import { isItemAttributeGroup } from "../models/itemAttributeModel";
import { Item } from "../models/itemModel";

// --------------------------------------------------------------------------
// ItemAddition

// Validates the submitted addition
/// Checks if the item and attributes exist in the Doc structure
/// Checks if the Attributes match the corresponding AttributeGroupRules
export const validateItemAddition = async (
  item_id: string,
  attributes: ICartOperationAttribute[],
  quantity: number
): Promise<ICartItem | null> => {
  try {
    const item = await Item.findById(item_id).orFail();

    // Attributes deep check
    // Check that rule conditions have been met
    const docGroups = new Map<
      string,
      {
        min: number;
        max: number;
        attribute_max: number;
        attributes: string[];
        tot: number;
      }
    >([]);
    for (const group of item.attribute_groups) {
      if (isItemAttributeGroup(group) && group._id) {
        docGroups.set(group._id.toString(), {
          min: group.rules.group_min,
          max: group.rules.group_max,
          attribute_max: group.rules.attribute_max,
          attributes: group.attributes.map((e) => e.toString()),
          tot: 0,
        });
      }
    }

    for (const attribute of attributes) {
      // Check if group exists
      if (docGroups.has(attribute.group_id)) {
        var docGroup = docGroups.get(attribute.group_id);
      } else {
        console.log("ValidateItemAddition error: GroupDoesNotExist");
        return null;
      }

      // Check if attribute exists
      if (
        docGroup &&
        docGroup.attributes.findIndex((e) => e === attribute.attribute_id) ===
          -1
      ) {
        console.log("ValidateItemAddition error: AttributeDoesNotExist");
        return null;
      }

      // Check if attribute max condition is met
      if (
        docGroup &&
        attribute.quantity > docGroups.get(attribute.group_id)!.attribute_max
      ) {
        console.log("ValidateItemAddition error: AttributeBreaksMaxQuantity");
        return null;
      }

      // Check if quantity is zero
      if (attribute.quantity === 0) {
        console.log("ValidateItemAddition error: AttributeZeroQuantity");
        return null;
      }

      // Check if the total + quantity breaks the group max condition
      if (docGroup && docGroup.tot + attribute.quantity > docGroup.max) {
        console.log("ValidateItemAddition error: AttributesBreakGroupMaxQuantity");
        return null;
      } else if (docGroup) {
        docGroups.set(attribute.group_id, {
          ...docGroup,
          tot: docGroup.tot + attribute.quantity,
        });
      }
    }

    // Check if min rules conditions are met
    for (const [_, group] of docGroups) {
      if (group.min > group.tot) {
        console.log("ValidateItemAddition error: GroupMinNotMet");
        return null;
      }
    }

    // If all the checks are passed item addition is validate
    return {
      item: item._id,
      item_version: item.item_version,
      attributes: attributes.map((e) => ({
        group_id: e.group_id,
        attribute: new Types.ObjectId(e.attribute_id),
        quantity: e.quantity,
      })),
      quantity: quantity,
    };
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(`ValidateItemAddition error: ${mongooseError}`);

    return null;
  }
};
