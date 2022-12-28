import { Router } from "express";
import { createCart, update, updateCart } from "../controllers/cartController";

const router = Router();

router.post("/create", createCart);

router.patch("/update", updateCart);

export { router as cartRouter };
