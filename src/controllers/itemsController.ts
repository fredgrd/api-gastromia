import { Request, Response } from "express";
import { MongooseError } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import authenticateOperator from "../helpers/authenticateOperator";
import { Item } from "../models/itemModel";

// --------------------------------------------------------------------------
// Item

// Create an Item Document
/// If the object provided does not conform to the Item interface fails
export const createItem = async (req: Request, res: Response) => {
  const operatorToken = authenticateOperator(req, res, "CreateItem");

  if (!operatorToken) {
    return;
  }

  const item = req.body.item;

  if (item) {
    try {
      const newItem = new Item({ ...item });
      await newItem.save();
      res.sendStatus(200);
    } catch (error) {
      const mongooseError = error as MongooseError;
      console.log(
        `CreateItem error: ${mongooseError.name} ${mongooseError.message}`
      );
      res.status(400).send(mongooseError.message);
    }
  } else {
    console.log("CreateItem error: NotItem");
    res.sendStatus(400);
  }
};

// Update an Item Document
// Does not check the strucure of the update object
export const updateItem = async (req: Request, res: Response) => {
  const operatorToken = authenticateOperator(req, res, "UpdateItem");

  if (!operatorToken) {
    return;
  }

  const itemId = req.body.item_id;
  const update = req.body.update;

  if (!itemId) {
    console.log("UpdateItem error: ItemIdNotProvided");
    res.sendStatus(400);
    return;
  }

  if (update) {
    try {
      const item = await Item.findOneAndUpdate(
        { _id: itemId },
        { ...update, item_version: uuidv4() },
        {
          new: true,
        }
      ).orFail();

      console.log(item);

      res.status(200).json({ item: item });
    } catch (error) {
      const mongooseError = error as MongooseError;
      console.log(
        `UpdateItemAttribute error: ${mongooseError.name} ${mongooseError.message}`
      );
      res.sendStatus(500);
    }
  } else {
    console.log("UpdateItemAttribute error: UpdateBadlyFormatted");
    res.sendStatus(400);
  }
};

// Deletes the item document
export const deleteItem = async (req: Request, res: Response) => {
  const operatorToken = authenticateOperator(req, res, "DeleteItem");

  if (!operatorToken) {
    return;
  }

  const itemID: string | any = req.body.item_id;

  if (!itemID || typeof itemID !== "string") {
    console.log("DeleteItem error: NoItemId");
    res.status(400).send("NoItemId");
    return;
  }

  try {
    const deleted = await Item.deleteOne({ _id: itemID }).orFail();
    res.status(200).send(deleted.acknowledged);
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(
      `DeleteItem error: ${mongooseError.name} ${mongooseError.message}`
    );
    res.sendStatus(500);
  }
};

// Searches the item documents accordding to the provided query
export const searchItems = async (req: Request, res: Response) => {
  const query = req.query.k;

  try {
    const items = await Item.aggregate().search({
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
    });

    res.status(200).json({ items: items });
  } catch (error) {
    res.sendStatus(400);
  }
};

// Fetches the category according to the provided query
export const fetchCategory = async (req: Request, res: Response) => {
  const cQuery = req.query.c;

  try {
    const items = await Item.find({ category: { $eq: cQuery } }).orFail();

    res.status(200).json({ items: items });
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(
      `FetchCategory error: ${mongooseError.name} ${mongooseError.message}`
    );
    res.sendStatus(500);
  }
};

// Fetchs all the item documents
// Used only by the Hub Manager
export const fetchAllItems = async (req: Request, res: Response) => {
  const operatorToken = authenticateOperator(req, res, "FetchAllItems");

  if (!operatorToken) {
    return;
  }

  try {
    const items = await Item.find()
      .populate("attribute_groups.attributes")
      .orFail();
    res.status(200).json({ items: items });
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(
      `FetchAllItemss error: ${mongooseError.name} ${mongooseError.message}`
    );
    res.sendStatus(500);
  }
};

// Fetches the item document according to the provided query
export const fetchItem = async (req: Request, res: Response) => {
  const iQuery = req.query.i;

  if (typeof iQuery !== "string") {
    res.sendStatus(400);
    return;
  }

  try {
    const item = await Item.findById(iQuery).populate(
      "attribute_groups.attributes"
    );

    if (item) {
      res.status(200).json(item);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    res.sendStatus(400);
  }
};
