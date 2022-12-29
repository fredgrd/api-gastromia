import { Request, Response } from "express";
import { MongooseError } from "mongoose";
import DatabaseService from "../services/databaseService";
import {
  IItemAttribute,
  ItemAttribute,
  isItemAttribute,
} from "../models/itemAttributeModel";

// --------------------------------------------------------------------------
// ItemAttribute

// Create an ItemAttribute Document
/// If the object provided does not conform to the ItemAttribute interface fails
export const createItemAttribute = async (req: Request, res: Response) => {
  const itemAttribute = req.body.attribute;
  const token = req.body.token;
  const databaseService = new DatabaseService();
  const decodedToken = databaseService.verifyToken(token);

  if (!decodedToken) {
    console.log("CreateItemAttribute error: OperationTokenNotValid");
    res.sendStatus(403); // Forbidden
    return;
  }

  if (itemAttribute && isItemAttribute(itemAttribute)) {
    try {
      const newItemAttribute = new ItemAttribute({ ...itemAttribute });
      await newItemAttribute.save();
      res.sendStatus(200);
    } catch (error) {
      const mongooseError = error as MongooseError;
      console.log(`CreateItemAttribute error: ${mongooseError.name}`);
      res.sendStatus(500);
    }
  } else {
    console.log("CreateItemAttribute error: NotItemAttribute");
    res.sendStatus(400);
  }
};

// Update an ItemAttribute Document
/// If the props object provided do not conform to the ItemAttribute interface fails
export const updateItemAttribute = async (req: Request, res: Response) => {
  const attributeId = req.body.attribute_id;
  const update = req.body.update;
  const token = req.body.token;
  const databaseService = new DatabaseService();
  const decodedToken = databaseService.verifyToken(token);

  if (!decodedToken) {
    console.log("UpdateItemAttribute error: OperationTokenNotValid");
    res.sendStatus(403); // Forbidden
    return;
  }

  if (!attributeId) {
    console.log("UpdateItemAttribute error: ItemAttributeIdNotProvided");
    res.sendStatus(400);
    return;
  }

  if (update) {
    try {
      const itemAttribute = await ItemAttribute.findOneAndUpdate(
        { _id: attributeId },
        update,
        { new: true }
      );
      res.status(200).json(itemAttribute);
      res.sendStatus(200);
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
