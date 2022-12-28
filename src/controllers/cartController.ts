import { Request, Response } from "express";
import { MongooseError, HydratedDocument } from "mongoose";
import { ICartItem } from "../models/cartItemModel";
import {
  buildCart,
  patchCart,
  validateCartUpdate,
  validateItemAddition,
} from "../services/cartService";
import { Cart, cleanCart, ICart } from "../models/cartModel";
import CartService from "../services/crtService";

import { ICartOperation } from "../models/cartOperations";

export const createCart = async (req: Request, res: Response) => {
  const owner_id = req.body.owner_id;

  const result = await buildCart({
    owner_id: owner_id,
    items: [],
    updatedAt: Date.now(),
  });

  if (result.success) {
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
};

const isOperation = (operation: any) => {
  const unsafeCast = operation as ICartOperation;

  return (
    unsafeCast.type !== undefined &&
    unsafeCast.quantity !== undefined &&
    (unsafeCast.cart_item_id !== undefined || unsafeCast.item_id !== undefined)
  );
};

export const updateCart = async (req: Request, res: Response) => {
  // Retrieve user id from token
  const operation = req.body;

  if (!operation || !isOperation(operation)) {
    console.log("UpdateCart error: OperationBadlyFormatted");
    res.sendStatus(400);
    return
  }

  // Retrieve the user's cart or create a new one
  let cart: HydratedDocument<ICart> | null;
  try {
    cart = await Cart.findOne({ owner_id: "mao" });

    if (!cart) {
      // Create a cart for the user
      cart = new Cart({ owner_id: "mao", items: [] });
      await cart.save();
    }
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(`UpdateCart error: ${mongooseError.name}`);
    res.sendStatus(500);
  }

  if (operation.type)
    await validateItemAddition(
      operation.item_id || "",
      operation.attributes || []
    );
};

export const update = async (req: Request, res: Response) => {
  const { owner_id, operation } = req.body;

  if (!owner_id) {
    console.log("UpdateCart error: NoOwnerProvided");
    res.sendStatus(400);
    return;
  }

  if (!operation) {
    console.log("UpdateCart error: NoOperationProvided");
    res.sendStatus(400);
    return;
  } else if (operation.type === "add") {
  }

  // Fetch the cart
  // try {
  //   const cart = await Cart.findOne({ owner_id: owner_id }).orFail();

  // } catch (error) {
  //   const mongooseError = error as MongooseError;
  //   console.log(`UpdateCart error: ${mongooseError.name}`);
  //   res.sendStatus(500);
  // }
};

// export const fetchCart = async (
//   req: Request,
//   res: Response,
//   owner_id: string
// ) => {
//   try {
//     const cart = await Cart.findOne({owner_id: owner_id}).populate("")
//   }
// };
