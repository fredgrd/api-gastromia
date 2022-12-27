import { Request, Response } from "express";
import { Item } from "../models/itemModel";
import { buildItem } from "../services/itemService";
import { buildAddition } from "../services/itemService";

export const createAddition = async (req: Request, res: Response) => {
  const addition = req.body.addition;

  const newAddition = await buildAddition(addition);

  if (newAddition) {
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
};

export const createItem = async (req: Request, res: Response) => {
  const item = req.body.item;

  const newItem = await buildItem(item);

  if (newItem) {
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
