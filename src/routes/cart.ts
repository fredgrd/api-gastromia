import { Router } from "express";
import {
  updateCart,
  fetchCart,
  updateSnapshot,
} from "../controllers/cartController";

const router = Router();

router.get("/", fetchCart);

router.patch("/update", updateCart);

router.patch("/snapshot", updateSnapshot);

export { router as cartRouter };
