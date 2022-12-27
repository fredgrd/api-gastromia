import mongoose, { MongooseError } from "mongoose";
import { cartItemsEquality, ICartItem } from "../models/cartItemModel";
import { Cart, ICart, CartDoc } from "../models/cartModel";
import { Item } from "../models/itemModel";
import { MongooseBasicOperationResult } from "../models/mongooseOperationModels";

interface BuildCartResult extends MongooseBasicOperationResult {
  cart: CartDoc | undefined;
}

export const buildCart = async (attr: ICart): Promise<BuildCartResult> => {
  try {
    const cart = Cart.build(attr);
    await cart.save();

    return { success: true, error: undefined, cart: cart };
  } catch (error) {
    const mongooseError = error as MongooseError;
    return { success: false, error: mongooseError, cart: undefined };
  }
};

export const validateCartUpdate = async (
  cartItem: ICartItem
): Promise<boolean> => {
  try {
    const item = await Item.findById(cartItem.item).orFail();

    // 1. Check the CartItem has the same number of addition groups as the Item
    const cartItemGroups: string[] = [
      ...new Set(cartItem.additions.map((el) => el.group_id)),
    ];
    const itemGroups: string[] = item.additions.map((el) => el._id.toString());

    if (cartItemGroups.join("") !== itemGroups.join("")) {
      return false;
    }

    // 2. Addition groups check
    /// 2a. Check group_min requirement is met (for each group)
    /// 2b. Check group_max requirement is met (for each group)
    /// 2c. Check addition_max requirement is met (for each addition)
    for (const id of cartItemGroups) {
      const group = item.additions.find((el) => el._id.toString() === id);
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

      const cartAdditions = cartItem.additions.filter(
        (el) => el.group_id === id
      );
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
  } catch (error) {
    console.log(`ValidateCartUpdate error: ${error}`);
    return false;
  }
};

interface PatchCartResult extends MongooseBasicOperationResult {
  cart: CartDoc | undefined;
}

export const patchCart = async (
  owner_id: string,
  item: ICartItem
): Promise<PatchCartResult> => {
  try {
    const cart = await Cart.findOne({ owner_id: owner_id }).orFail();
    const sameItem = cart.items.find((el) => cartItemsEquality(el, item));

    if (sameItem) {
      sameItem.quantity += item.quantity;
      cart.updatedAt = Date.now();
      await cart.save();
    } else {
      cart.items.push(item);
      cart.updatedAt = Date.now();
      await cart.save();
    }

    return { success: true, error: undefined, cart: cart };
  } catch (error) {
    const mongooseError = error as mongoose.MongooseError;
    return { success: false, error: mongooseError, cart: undefined };
  }
};
