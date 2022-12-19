import { Router } from "express";
import {
  createItem,
  searchItems,
  fetchCategory,
} from "../controllers/itemsController";

const router = Router();

router.post("/create", createItem);

router.get("/search", searchItems);

router.get("/category", fetchCategory);

export { router as itemsRouter };
