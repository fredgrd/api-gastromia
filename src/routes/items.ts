import { Router } from "express";
import {
  createItemAttribute,
  updateItemAttribute,
} from "../controllers/attributesController";
import {
  createItem,
  createAddition,
  searchItems,
  fetchCategory,
  fetchItem,
} from "../controllers/itemsController";

const router = Router();

router.post("/attribute/create", createItemAttribute);

router.patch("/attribute/update", updateItemAttribute);

router.post("/item/create", createItem);

router.post("/create", createItem);

router.post("/createaddition", createAddition);

router.get("/search", searchItems);

router.get("/category", fetchCategory);

router.get("/item", fetchItem);

export { router as itemsRouter };
