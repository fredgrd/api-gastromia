import { Request, Response } from "express";
import { MongooseError } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Item, isItem } from "../models/itemModel";
import DatabaseService from "../services/databaseService";

// --------------------------------------------------------------------------
// Item

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

// Update an Item Document
/// If the object provided does not conform to the ItemSchema no changes will be applied
export const updateItem = async (req: Request, res: Response) => {
  const itemId = req.body.item_id;
  const update = req.body.update;
  const token = req.body.token;
  const databaseService = new DatabaseService();
  const decodedToken = databaseService.verifyToken(token);

  if (!decodedToken) {
    console.log("UpdateItem error: OperationTokenNotValid");
    res.sendStatus(403); // Forbidden
    return;
  }

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
      );
      res.status(200).json(item);
    } catch (error) {
      const mongooseError = error as MongooseError;
      console.log(`UpdateItemAttribute error: ${mongooseError.name}`);
      res.sendStatus(500);
    }
  } else {
    console.log("UpdateItemAttribute error: UpdateBadlyFormatted");
    res.sendStatus(400);
  }
};

// TODO: Review
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

// TODO: Review
export const fetchCategory = async (req: Request, res: Response) => {
  const cQuery = req.query.c;

  try {
    const items = await Item.find({ category: { $eq: cQuery } });

    res.status(200).json(items);
  } catch (error) {
    res.sendStatus(400);
  }
};

// TODO: Review
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
