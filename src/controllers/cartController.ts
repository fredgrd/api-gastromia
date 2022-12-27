import { Request, Response } from "express";
import { ICartItem } from "../models/cartItemModel";
import {
  buildCart,
  patchCart,
  validateCartUpdate,
} from "../services/cartService";
import { Cart, cleanCart } from "../models/cartModel";
import CartService from "../services/crtService";

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

export const updateCart = async (req: Request, res: Response) => {
  const owner_id = req.body.owner_id;
  const item: ICartItem = req.body.item;

  if (owner_id && item && item.item && item.additions && item.quantity) {
    const canUpdate = await validateCartUpdate(item);

    if (!canUpdate) {
      res.sendStatus(400);
      return;
    }

    // Get cart
    const result = await patchCart(owner_id, item);
    if (result.success && result.cart !== undefined) {
      res.status(200).json(cleanCart(result.cart));
      return;
    } else if (result.error?.name === "DocumentNotFoundError") {
      // Could not find a cart document for the user
      const buildResult = await buildCart({
        owner_id: owner_id,
        items: [item],
        updatedAt: Date.now(),
      });

      if (buildResult.success) {
        res.sendStatus(200);
        return;
      }
    }

    res.sendStatus(500);
  } else {
    res.sendStatus(400);
  }
};

export const update = async (req: Request, res: Response) => {
  const cartService = new CartService();
  const items: ICartItem[] = req.body.items;

  await cartService.safeValidate(items);
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
