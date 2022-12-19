import { Item, IItem, ItemDoc } from "../models/itemModel";

export const createItem = async (attr: IItem): Promise<ItemDoc | undefined> => {
  try {
    const item = Item.build(attr);
    await item.save();

    return item;
  } catch (error) {
    console.log(`CreateItem error: ${error}`);
    return;
  }
};
