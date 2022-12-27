import { Item, IItem, ItemDoc } from "../models/itemModel";
import { Addition, IAddition, AdditionDoc } from "../models/additionModel";

export const buildItem = async (attr: IItem): Promise<ItemDoc | undefined> => {
  try {
    const item = Item.build(attr);
    await item.save();

    return item;
  } catch (error) {
    console.log(`CreateItem error: ${error}`);
    return;
  }
};

export const buildAddition = async (
  attr: IAddition
): Promise<AdditionDoc | undefined> => {
  try {
    const addition = Addition.build(attr);
    await addition.save();

    return addition;
  } catch (error) {
    console.log(`CreateAddition error: ${error}`);
    return;
  }
};
