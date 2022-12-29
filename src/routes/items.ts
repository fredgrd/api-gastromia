import { Router } from "express";
import {
  createItemAttribute,
  updateItemAttribute,
} from "../controllers/attributesController";
import {
  createItem,
  searchItems,
  fetchCategory,
  fetchItem,
  updateItem,
} from "../controllers/itemsController";

const router = Router();

router.post("/attribute/create", createItemAttribute);

router.patch("/attribute/update", updateItemAttribute);

router.post("/item/create", createItem);

router.patch("/item/update", updateItem);

router.get("/item", fetchItem);

router.get("/search", searchItems);

router.get("/category", fetchCategory);

export { router as itemsRouter };
