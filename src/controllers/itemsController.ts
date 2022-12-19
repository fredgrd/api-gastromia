import { Request, Response } from "express";
import { Item } from "../models/itemModel";
import { createItem as create } from "../services/itemService";

export const createItem = async (req: Request, res: Response) => {
  const item = req.body.item;

  const newItem = await create(item);

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
  const category = req.query.c;

  console.log(category);

  try {
    const items = await Item.aggregate()
      .match({
        category: category,
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
