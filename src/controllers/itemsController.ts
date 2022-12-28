import { Request, Response } from "express";
import { MongooseError } from "mongoose";
import { IItemAttributeGroup } from "../models/itemAttributeModel";
import { Item } from "../models/itemModel";
import { IItem } from "../models/itemModel";
import DatabaseService from "../services/databaseService";
import { buildItem } from "../services/itemService";
import { buildAddition } from "../services/itemService";

// --------------------------------------------------------------------------
// Item

// Checks if the object provided is an Item
/// Update the length check of the object keys w/ latest value
const isItem = (item: any): boolean => {
  const unsafeCast = item as IItem;

  return (
    unsafeCast.name !== undefined &&
    unsafeCast.description !== undefined &&
    unsafeCast.available !== undefined &&
    unsafeCast.available !== undefined &&
    unsafeCast.quick_add !== undefined &&
    unsafeCast.price !== undefined &&
    unsafeCast.discount !== undefined &&
    unsafeCast.discount_price !== undefined &&
    unsafeCast.discount_label !== undefined &&
    unsafeCast.attribute_groups !== undefined &&
    unsafeCast.tags !== undefined &&
    unsafeCast.category !== undefined &&
    unsafeCast.media_url !== undefined &&
    unsafeCast.preview_url !== undefined &&
    Object.keys(unsafeCast).length === 13
  );
};

// Create an Item Document
/// If the object provided does not conform to the Item interface fails
export const createItem = async (req: Request, res: Response) => {
  const { token, item } = req.body;
  const databaseService = new DatabaseService();
  const decodedToken = databaseService.verifyToken(token);

  if (!decodedToken) {
    console.log("CreateItem error: OperationTokenNotValid");
    res.sendStatus(403); // Forbidden
    return;
  }

  if (item && isItem(item)) {
    try {
      const newItem = new Item({ ...item });
      await newItem.save();
      res.sendStatus(200);
    } catch (error) {
      const mongooseError = error as MongooseError;
      console.log(`CreateItem error: ${mongooseError.name}`);
      res.sendStatus(500);
    }
  } else {
    console.log("CreateItem error: NotItem");
    res.sendStatus(400);
  }
};

export const createAddition = async (req: Request, res: Response) => {
  const addition = req.body.addition;

  const newAddition = await buildAddition(addition);

  if (newAddition) {
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
};

export const searchItems = async (req: Request, res: Response) => {
  const query = req.query.k;
  const searchId = req.query.search_id;

  try {
    const items = await Item.aggregate()
      .search({
        index: "ItemSearch",
        compound: {
          should: [
            {
              autocomplete: {
                query: query,
                path: "name",
              },
            },
            {
              autocomplete: {
                query: query,
                path: "tags",
              },
            },
          ],
        },
      })
      .addFields({
        id: "$_id",
      })
      .project({
        _id: 0,
      });

    res.status(200).json(items);
  } catch (error) {
    res.sendStatus(400);
  }
};

export const fetchCategory = async (req: Request, res: Response) => {
  const cQuery = req.query.c;

  try {
    const items = await Item.find({ category: { $eq: cQuery } });

    res.status(200).json(items);
  } catch (error) {
    res.sendStatus(400);
  }
};

export const fetchItem = async (req: Request, res: Response) => {
  const iQuery = req.query.i;

  console.log("Querying item", iQuery);

  if (typeof iQuery !== "string") {
    res.sendStatus(400);
    return;
  }

  try {
    const item = await Item.findById(iQuery).populate("additions.additions");

    if (item) {
      res.status(200).json(item);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    res.sendStatus(400);
  }
};
