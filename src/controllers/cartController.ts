import { Request, Response } from "express";
import { MongooseError, HydratedDocument, Types } from "mongoose";
import { Cart, ICart } from "../models/cartModel";
import { IItem, isItem, Item } from "../models/itemModel";
import { verifyAuthToken } from "../helpers/jwtTokens";
import { validateCartSnapshot } from "../helpers/cartUtils";
import { isCartSnapshot } from "../models/cartSnapshot";

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
  const snapshot = req.body;

  if (!snapshot) {
    console.log("UpdateSnapshot error: NoObjectProvided");
    res.status(403).send("NoObjectProvided");
    return;
  }

  if (!isCartSnapshot(snapshot)) {
    console.log("UpdateSnapshot error: NoSnapshotProvided");
    res.status(403).send("NoSnapshotProvided");
    return;
  }

  // START VALIDATION
  try {
    const items = await Item.find({
      _id: {
        $in: [
          ...new Set(
            snapshot.items_snapshot.map((e) => new Types.ObjectId(e.item_id))
          ),
        ],
      },
    }).populate("attribute_groups.attributes");

    const castedItems: IItem[] = items.filter((e) => isItem(e));

    const { included, excluded } = validateCartSnapshot(
      castedItems,
      snapshot.items_snapshot
    );

    // Update the cart
    await Cart.findOneAndUpdate(
      { owner_id: authtoken.id },
      { items: included }
    );

    if (included.length !== snapshot.items_snapshot.length) {
      res.status(200).json({
        update_snapshot: true,
        included: included,
        excluded: excluded,
      });
    } else {
      res
        .status(200)
        .json({ update_snapshot: false, included: [], excluded: [] });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
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
    let cart: HydratedDocument<ICart> | null = await Cart.findOne({
      owner_id: authtoken.id,
    });

    if (!cart) {
      // Create a cart for the user
      cart = new Cart({ owner_id: authtoken.id, items: [] });
      await cart.save();
    }

    // Cart must be validated

    const items = await Item.find({
      _id: {
        $in: [...new Set(cart.items.map((e) => new Types.ObjectId(e.item_id)))],
      },
    }).populate("attribute_groups.attributes");

    const castedItems: IItem[] = items.filter((e) => isItem(e));

    const { included, excluded } = validateCartSnapshot(
      castedItems,
      cart.items
    );

    // Some items are no longer valid
    if (excluded.length) {
      await cart.updateOne({ items: included });
    }

    res
      .status(200)
      .json({ update_snapshot: true, included: included, excluded: excluded });
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(`FetchCart error: ${mongooseError.name}`);
    res.sendStatus(500);
  }
};
