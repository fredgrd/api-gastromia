import { Router } from "express";
import {
  createItemAttribute,
  deleteItemAttribute,
  fetchAllAttributes,
  searchAttributes,
  updateItemAttribute,
} from "../controllers/attributesController";
import {
  createItem,
  searchItems,
  fetchCategory,
  fetchItem,
  updateItem,
  fetchAllItems,
  deleteItem,
} from "../controllers/itemsController";

const router = Router();

router.post("/attribute/create", createItemAttribute);

router.patch("/attribute/update", updateItemAttribute);

router.patch("/attribute/delete", deleteItemAttribute);

router.get("/attribute/all", fetchAllAttributes);

router.get("/attribute/search", searchAttributes);

router.post("/item/create", createItem);

router.patch("/item/update", updateItem);

router.patch("/item/delete", deleteItem);

router.get("/item", fetchItem);

router.get("/", fetchAllItems);

router.get("/search", searchItems);

router.get("/category", fetchCategory);

export { router as itemsRouter };
