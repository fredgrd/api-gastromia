import { Request, Response } from "express";
import { MongooseError, HydratedDocument, Types, Schema } from "mongoose";
import { Cart, ICart } from "../models/cartModel";
import { Item } from "../models/itemModel";
import {
  CartOperationType,
  ICartOperation,
  isOperation,
} from "../models/cartOperations";
import { IItemAttribute, isItemAttribute } from "../models/itemAttributeModel";
import { verifyAuthToken } from "../helpers/jwtTokens";
import {
  updateAndPriceCart,
  validateItemAttributes,
} from "../helpers/cartUtils";
import { ICartItemSnapshot, ICartSnapshot } from "../models/cartSnapshot";

// --------------------------------------------------------------------------
// Cart

// Update with cart snapshot
//// If the cart is updated returns the client the items to put in the cart along with a excluded array
//// If the excluded array is empty, but snapshot was updated it means that user provided an illegitimate snapshot
export const updateSnapshot = async (req: Request, res: Response) => {
  const token = req.cookies.auth_token;

  if (!token || typeof token !== "string") {
    console.log("UpdateCart error: MissingToken");
    res.status(403).send("MissingToken");
    return;
  }

  // Verify token
  const authtoken = verifyAuthToken(token);

  if (!authtoken) {
    console.log("UpdateCart error: NotAuthToken");
    res.status(403).send("NotAuthToken");
    return;
  }

  // Receive a snapshot
  const snapshot: ICartSnapshot = req.body;

  // Check if snapshot

  // Extract all the item_ids from the snapshot

  try {
    var items = await Item.find({
      _id: {
        $in: [
          ...new Set(
            snapshot.items_snapshot.map((e) => new Types.ObjectId(e.item_id))
          ),
        ],
      },
    }).populate("attribute_groups.attributes");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }

  // Validate the snapshot
  //// Validate item existence
  //// Validate item availability
  //// Validate item price
  //// Validate attributes existence
  //// Validate attributes availability
  //// Validate attributes prices
  //// Validate rule
  const included: ICartItemSnapshot[] = [];
  const excluded: { item: ICartItemSnapshot; message: string }[] = [];
  for (const snapshotItem of snapshot.items_snapshot) {
    if (snapshotItem.quantity <= 0 || snapshotItem.quantity > 99) {
      continue;
    }

    const item = items.find((e) => e.id === snapshotItem.item_id);

    // Edge case
    //// Item does not exist
    if (!item) {
      continue;
    }

    // Not available
    //// Handles item availability changes not reflected in cart
    if (!item.available) {
      excluded.push({
        item: snapshotItem,
        message: "Prodotto non è disponibile",
      });
      continue;
    }

    // Price difference
    //// Handles item price changes not reflected in cart
    if (
      (item.discount ? item.discount_price : item.price) !== snapshotItem.price
    ) {
      excluded.push({
        item: snapshotItem,
        message: "Prodotto non aggiornato",
      });
      continue;
    }

    // Quick add
    //// If item can be quick-added add to included items
    if (item.quick_add && !snapshotItem.attributes_snapshot.length) {
      included.push(snapshotItem);
      continue;
    }

    // Validate attributes
    let attributesValid = true;
    const groupTotals: Map<string, number> = new Map([]);
    for (const snapshotAttribute of snapshotItem.attributes_snapshot) {
      if (snapshotAttribute.quantity <= 0 || snapshotAttribute.quantity > 99) {
        attributesValid = false;
        break;
      }

      const group = item.attribute_groups.find(
        (e) => e._id?.toString() === snapshotAttribute.group_id
      );

      if (!group) {
        attributesValid = false;
        break;
      }

      const attributes: IItemAttribute[] = group.attributes.flatMap((e) =>
        isItemAttribute(e) ? e : []
      );

      const attribute = attributes.find(
        (e) => e._id?.toString() === snapshotAttribute.attribute_id
      );

      if (!attribute) {
        attributesValid = false;
        break;
      }

      if (!attribute.available) {
        excluded.push({
          item: snapshotItem,
          message: "Una o più aggiunte non disponibili",
        });
        attributesValid = false;
        break;
      }

      if (attribute.price !== snapshotAttribute.price) {
        excluded.push({
          item: snapshotItem,
          message: "Una o più aggiunte non aggiornate",
        });
        attributesValid = false;
        break;
      }

      // VALIDATE ATTRIBUTE RULES

      // Count group total
      let groupTotal = groupTotals.get(group._id!.toString());
      if (!groupTotal) {
        groupTotals.set(group._id!.toString(), 0);
        groupTotal = 0;
      }

      if (snapshotAttribute.quantity > group.rules.attribute_max) {
        // Rules broken
        attributesValid = false;
        break;
      }

      if (groupTotal + snapshotAttribute.quantity > group.rules.group_max) {
        // Rules broken
        attributesValid = false;
        break;
      }

      // Rules not broken
      groupTotals.set(
        group._id!.toString(),
        groupTotal + snapshotAttribute.quantity
      );
    }

    // Edge case
    //// Client was able to brake rules
    if (!attributesValid) {
      continue;
    }

    // VALIDATE GROUP RULES
    let conditionsMet = true;
    for (const group of item.attribute_groups) {
      if (!group._id) {
        conditionsMet = false;
        break;
      }

      const groupTotal = groupTotals.get(group._id.toString()); // Group totals

      //// Was not added to item. Client could not add to cart
      //// No groupTotal exists meaning attribute not added by user
      //// Conditions are met because user was not forced to add
      if (!groupTotal && group.rules.group_min === 0) {
        break;
      }

      if (!groupTotal) {
        conditionsMet = false;
        break;
      }

      //// Client was able to brake rules
      if (group.rules.group_min > groupTotal) {
        conditionsMet = false;
        break;
      }

      //// Client was able to brake rules
      if (groupTotal > group.rules.group_max) {
        conditionsMet = false;
        break;
      }
    }

    if (!conditionsMet) {
      continue;
    }

    // VALIDATION PASSED
    included.push(snapshotItem);
  }

  // Included snapshot should become new cart
  try {
    // await Cart.findOneAndUpdate(
    //   { owner_id: authtoken.id },
    //   { items: included }
    // );

    if (included.length !== snapshot.items_snapshot.length) {
      res.status(200).json({
        update_snapshot: true,
        included: included,
        excluded: excluded,
      });
    } else {
      res.status(200).json({ update_snapshot: false });
    }
  } catch (error) {
    console.log(error);
    return null;
  }

  //// Check if it passes with an empty snapshot => SHOULD PASS
};

// Updates the cart with either an ADD or MODIFY operation
/// ADD: Adds the provided CartItem to the cart
/// MODIFY: Changes the quantity of a specific CartItem (if 0 removes from the cart).
export const updateCart = async (req: Request, res: Response) => {
  const token = req.cookies.auth_token;

  if (!token || typeof token !== "string") {
    console.log("UpdateCart error: MissingToken");
    res.status(403).send("MissingToken");
    return;
  }

  // Verify token
  const authtoken = verifyAuthToken(token);

  if (!authtoken) {
    console.log("UpdateCart error: NotAuthToken");
    res.status(403).send("NotAuthToken");
    return;
  }

  // Extract operation details from body
  if (req.body && isOperation(req.body)) {
    var operation: ICartOperation = req.body;
  } else {
    console.log("UpdateCart error: OperationBadlyFormatted");
    res.sendStatus(400);
    return;
  }

  try {
    // Retrieve the user's cart or create a new one
    let cart: HydratedDocument<ICart> | null = await Cart.findOne({
      owner_id: authtoken.id,
    });

    if (!cart) {
      // Create a cart for the user
      cart = new Cart({ owner_id: authtoken.id, items: [] });
      await cart.save();
    }

    // QUICK ADD

    // ADD ITEM
    if (
      operation.type === CartOperationType.Add &&
      operation.item_id &&
      operation.attributes
    ) {
      const item = await Item.findById(operation.item_id).orFail();

      const attributes = validateItemAttributes(
        item.attribute_groups,
        operation.attributes
      );

      if (cart && attributes) {
        // Add a new CartItem doc to the cart
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

// Fetches the cart and returns the CartItem w/ respective prices
/// Updates the cart document to reflect changes in availability
export const fetchCart = async (req: Request, res: Response) => {
  const token = req.cookies.auth_token;

  if (!token || typeof token !== "string") {
    console.log("FetchCart error: MissingToken");
    res.status(403).send("MissingToken");
    return;
  }

  // Verify token
  const authtoken = verifyAuthToken(token);

  if (!authtoken) {
    console.log("FetchCart error: NotAuthToken");
    res.status(403).send("NotAuthToken");
    return;
  }

  try {
    const cart = await Cart.findOne({ owner_id: authtoken.id })
      .populate("items.item")
      .populate("items.attributes.attribute")
      .orFail();

    const { cartItems, clientItems, excludedClientItems } = updateAndPriceCart(
      cart.items
    );

    // Update the cart if items were filtered out
    if (cart.items.length !== cartItems.length) {
      cart.items = cartItems;
      cart.save(); // Don't need to wait for operation to complete
    }

    res.status(200).json({ items: clientItems, excluded: excludedClientItems });
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(`FetchCart error: ${mongooseError.name}`);
    res.sendStatus(500);
  }
};
