import { Request, Response } from "express";
import { MongooseError, HydratedDocument } from "mongoose";
import { validateItemAddition } from "../services/cartService";
import { Cart, ICart } from "../models/cartModel";
import { isItem } from "../models/itemModel";
import {
  CartOperationType,
  ICartOperation,
  isOperation,
} from "../models/cartOperations";
import {
  ICartItem,
  IClientCartItem,
  IClientCartItemAttribute,
} from "../models/cartItemModel";
import { isItemAttribute } from "../models/itemAttributeModel";

// --------------------------------------------------------------------------
// Cart

// Updates the cart with either an ADD or MODIFY operation
/// ADD: Adds the provided CartItem to the cart
/// MODIFY: Changes the quantity of a specific CartItem (if 0 removes from the cart).
export const updateCart = async (req: Request, res: Response) => {
  // Retrieve user id from token
  if (req.body || isOperation(req.body)) {
    var operation: ICartOperation = req.body;
  } else {
    console.log("UpdateCart error: OperationBadlyFormatted");
    res.sendStatus(400);
    return;
  }

  // Retrieve the user's cart or create a new one
  try {
    let cart: HydratedDocument<ICart> | null = await Cart.findOne({
      owner_id: operation.owner_id,
    });

    if (!cart) {
      // Create a cart for the user
      cart = new Cart({ owner_id: operation.owner_id, items: [] });
      await cart.save();
    }

    // Add a new item to the cart
    if (
      operation.type === CartOperationType.Add &&
      operation.item_id &&
      operation.attributes
    ) {
      const validatedAddition = await validateItemAddition(
        operation.item_id,
        operation.attributes,
        operation.quantity
      );

      if (cart && validatedAddition) {
        // Add to cart
        cart.items.push({ ...validatedAddition });
        await cart.save();
        res.sendStatus(200); // SEND UPDATED CART?
      } else {
        console.log(`UpdateCart error: AdditionNotValidated`);
        res.sendStatus(400);
      }
    }

    if (operation.type === CartOperationType.Modify && operation.cart_item_id) {
      const cartItemIndex = cart.items.findIndex(
        (e) => e._id?.toString() === operation.cart_item_id
      );

      if (cart && cartItemIndex !== -1 && operation.quantity > 0) {
        cart.items[cartItemIndex].quantity = operation.quantity;
        await cart.save();
        res.sendStatus(200); // SEND UPDATED CART?
      } else if (cart && cartItemIndex !== -1) {
        cart.items.splice(cartItemIndex, 1);
        await cart.save();
        res.sendStatus(200);
      } else {
        console.log("UpdateCart error: Modify/NoCartItem");
        res.sendStatus(400);
      }
    }
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(`UpdateCart error: ${mongooseError.name}`);
    res.sendStatus(500);
  }
};

export const fetchCart = async (req: Request, res: Response) => {
  const owner_id = req.body.owner_id;

  console.log(req.cookies.token);

  if (!owner_id) {
    console.log("FetchCart error: NoOwner");
    res.sendStatus(400);
    return;
  }

  try {
    const cart = await Cart.findOne({ owner_id: owner_id })
      .populate("items.item")
      .populate("items.attributes.attribute")
      .orFail();

    const clientCartItems: IClientCartItem[] = [];
    const clientCartItemExcluded: string[] = [];
    // Filter the items that do not match item_version or are not available
    let cartItems: ICartItem[] = cart.items.filter((cartItem) => {
      if (isItem(cartItem.item) && cartItem._id && cartItem.item._id) {
        let total: number = cartItem.item.discount
          ? cartItem.item.discount_price
          : cartItem.item.price;

        // item_version MUST match
        if (cartItem.item_version !== cartItem.item.item_version) {
          clientCartItemExcluded.push(cartItem.item.name);
          return false;
        }

        // item MUST be available
        if (!cartItem.item.available) {
          clientCartItemExcluded.push(cartItem.item.name);
          return false;
        }

        const clientCartItemAttributes: IClientCartItemAttribute[] = [];
        // Filter out the items that have attributes not available
        for (const cartAttribute of cartItem.attributes) {
          if (
            isItemAttribute(cartAttribute.attribute) &&
            !cartAttribute.attribute.available
          ) {
            clientCartItemExcluded.push(cartItem.item.name);
            return false;
          } else if (!isItemAttribute(cartAttribute.attribute)) {
            clientCartItemExcluded.push(cartItem.item.name);
            return false;
          }

          total += cartAttribute.attribute.price * cartAttribute.quantity;
          clientCartItemAttributes.push({
            name: cartAttribute.attribute.name,
            quantity: cartAttribute.quantity,
          });
        }

        // Should compute total here
        total *= cartItem.quantity;

        // Append ClientCartItem
        clientCartItems.push({
          id: cartItem._id.toString(),
          item_id: cartItem.item._id?.toString(),
          name: cartItem.item.name,
          preview_url: cartItem.item.preview_url,
          attributes: clientCartItemAttributes,
          quantity: cartItem.quantity,
          total: total,
        });

        return true;
      } else {
        return false;
      }
    });

    // Update the cart if items were filtered out
    if (cart.items.length !== cartItems.length) {
      cart.items = cartItems;
      cart.save(); // Don't need to wait for operation to complete
    }

    res
      .status(200)
      .json({ items: clientCartItems, excluded: clientCartItemExcluded });
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(`FetchCart error: ${mongooseError.name}`);
    res.sendStatus(500);
  }
};
