import { Request, Response } from "express";
import { MongooseError } from "mongoose";
import DatabaseService from "../services/databaseService";
import { IItemAttribute, ItemAttribute } from "../models/itemAttributeModel";

// --------------------------------------------------------------------------
// ItemAttribute

// Checks if the object provided is an ItemAttribute
const isItemAttribute = (attribute: any): boolean => {
  const unsafeCast = attribute as IItemAttribute;

  return (
    unsafeCast.media_url !== undefined &&
    unsafeCast.name !== undefined &&
    unsafeCast.available !== undefined &&
    unsafeCast.price !== undefined &&
    unsafeCast.unique_tag !== undefined
  );
};

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

// Check if the object provided matches at least one of the ItemAttribute props
const isItemAttributeUpdate = (update: any) => {
  const unsafeCast = update as IItemAttribute;

  return (
    unsafeCast.media_url !== undefined ||
    unsafeCast.name !== undefined ||
    unsafeCast.available !== undefined ||
    unsafeCast.price !== undefined ||
    unsafeCast.unique_tag !== undefined
  );
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

  if (update && isItemAttributeUpdate(update)) {
    try {
      let itemAttribute = await ItemAttribute.findById(attributeId).orFail();
      await itemAttribute.update(update);
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
