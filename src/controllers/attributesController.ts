import { Request, Response } from "express";
import { MongooseError } from "mongoose";
import authenticateOperator from "../helpers/authenticateOperator";
import { ItemAttribute } from "../models/itemAttributeModel";

// --------------------------------------------------------------------------
// ItemAttribute

// Create an ItemAttribute Document
/// If the object provided does not conform to the ItemAttribute interface fails
export const createItemAttribute = async (req: Request, res: Response) => {
  const operatorToken = authenticateOperator(req, res, "CreateItemAttribute");

  if (!operatorToken) {
    return;
  }

  const attribute = req.body.attribute;

  if (attribute) {
    try {
      const newItemAttribute = new ItemAttribute(attribute);
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
// Does not check the structure of the update object
export const updateItemAttribute = async (req: Request, res: Response) => {
  const operatorToken = authenticateOperator(req, res, "UpdateItemAttribute");

  if (!operatorToken) {
    return;
  }

  const attributeId = req.body.attribute_id;
  const update = req.body.update;

  if (!attributeId) {
    console.log("UpdateItemAttribute error: ItemAttributeIdNotProvided");
    res.sendStatus(400);
    return;
  }

  if (update) {
    try {
      const attribute = await ItemAttribute.findOneAndUpdate(
        { _id: attributeId },
        update,
        { new: true }
      );
      res.status(200).json({ attribute: attribute });
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

// Delete an ItemAttribute document
export const deleteItemAttribute = async (req: Request, res: Response) => {
  const operatorToken = authenticateOperator(req, res, "DeleteItemAttribute");

  if (!operatorToken) {
    return;
  }

  const attributeId = req.body.attribute_id;

  if (!attributeId) {
    console.log("UpdateItemAttribute error: ItemAttributeIdNotProvided");
    res.sendStatus(400);
    return;
  }

  try {
    const attribute = await ItemAttribute.findOneAndDelete({
      _id: attributeId,
    }).orFail();
    res.status(200).json();
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(`UpdateItemAttribute error: ${mongooseError.name}`);
    res.sendStatus(500);
  }
};

// Fetches all attribute documents
// Returns an ItemAttribute array if successful
export const fetchAllAttributes = async (req: Request, res: Response) => {
  const operatorToken = authenticateOperator(req, res, "FetchAllAttributes");

  if (!operatorToken) {
    return;
  }

  try {
    const attributes = await ItemAttribute.find().orFail();

    res.status(200).json({ attributes: attributes });
  } catch (error) {
    console.log("FetchAllAttributes error: UpdateBadlyFormatted");
    res.sendStatus(500);
  }
};

// Searches the attributes according to the provided query
export const searchAttributes = async (req: Request, res: Response) => {
  const operatorToken = authenticateOperator(req, res, "SearchAttributes");

  if (!operatorToken) {
    console.log("SearchAttributes error: Forbidden");
    res.sendStatus(403);
  }

  const query = req.query.k;

  console.log("QUERYING", query);

  try {
    const attributes = await ItemAttribute.aggregate().search({
      index: "AttributeSearch",
      compound: {
        should: [
          {
            autocomplete: {
              query: query,
              path: "name",
            },
          },
        ],
      },
    });

    console.log(attributes);

    res.status(200).json({ attributes: attributes });
  } catch (error) {
    const mongoseError = error as MongooseError;
    console.log(
      `SearchAttributes error: ${mongoseError.name} ${mongoseError.message}`
    );
    res.sendStatus(400);
  }
};
