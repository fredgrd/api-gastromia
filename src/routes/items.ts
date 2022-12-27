import { Router } from "express";
import {
  createItem,
  createAddition,
  searchItems,
  fetchCategory,
  fetchItem,
} from "../controllers/itemsController";

const router = Router();

router.post("/create", createItem);

router.post("/createaddition", createAddition);

router.get("/search", searchItems);

router.get("/category", fetchCategory);

router.get("/item", fetchItem);

export { router as itemsRouter };
