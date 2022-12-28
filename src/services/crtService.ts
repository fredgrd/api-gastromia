import mongoose from "mongoose";
import { Item } from "../models/sf";
import { ICartItem } from "../models/cartItemModel";
import { ItemDoc } from "../models/sf";
import { ICartAddition } from "../models/cartAdditionsModel";

class CartService {
  fetchedItems: ItemDoc[];

  constructor() {
    this.fetchedItems = [];
  }

  async safeValidate(cartItems: ICartItem[]) {
    try {
      const items = await Item.find({
        _id: { $in: cartItems.map((e) => new mongoose.Types.ObjectId(e.item)) },
        available: true,
      })
        .populate("additions.additions")
        .orFail();
      const itemIds = items.map((e) => e.id);

      cartItems = cartItems.filter((item) => itemIds.includes(item.item));

      cartItems = cartItems.filter((cartItem) => {
        const item = items.find((e) => e.id === cartItem.item);

        console.log("ITEM", item);

        if (item === undefined) {
          return false;
        }

        // Add quick-buy exit

        // Validate additions
        const validAdditions = this.validateAdditions(cartItem.additions, item);
        console.log("VALIDATE ADDITIONS", validAdditions);
      });
    } catch (error) {
      const mongooseError = error as mongoose.MongooseError;
      console.log(`SafeValidate error: ${mongooseError}`);
    }
  }

  validateAdditions(additions: ICartAddition[], item: ItemDoc): boolean {
    const groupIds = [...new Set(additions.map((e) => e.group_id))]; // Unique occurences of group_id
    const filteredGroupIds = groupIds.filter((e) =>
      item.additions.find((a) => a._id.toString() === e)
    );

    if (filteredGroupIds.length !== groupIds.length) {
      return false;
    }

    // Validate each group of additions
    for (const groupId of groupIds) {
      const group = item.additions.find((e) => e._id.toString() === groupId);
      const group_min = group?.rules.group_min;
      const group_max = group?.rules.group_max;
      const addition_max = group?.rules.addition_max;

      if (
        group === undefined ||
        group_min === undefined ||
        group_max === undefined ||
        addition_max === undefined
      ) {
        return false;
      }

      const cartAdditions = additions.filter((e) => e.group_id === groupId);
      const filteredAdditions = cartAdditions.filter((e) =>
        group.additions.find((a) => a === e.addition_id)
      );

      if (filteredAdditions.length !== cartAdditions.length) {
        return false;
      }

      console.log("ADDITIONS LENGTH")
      // Check all additions are available

      const additionsCheck: { total: number; max: number } =
        cartAdditions.reduce(
          (acc, curr) => {
            acc.total += curr.quantity;
            acc.max = acc.max > curr.quantity ? acc.max : curr.quantity;

            return acc;
          },
          { total: 0, max: 0 }
        );

      if (
        additionsCheck.total < group_min ||
        additionsCheck.total > group_max ||
        additionsCheck.max > addition_max
      ) {
        return false;
      }
    }

    return true;
  }


}

export default CartService;
