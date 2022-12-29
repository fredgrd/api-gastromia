import { Router } from "express";
import { updateCart, fetchCart } from "../controllers/cartController";

const router = Router();

router.get("/", fetchCart);

router.patch("/update", updateCart);

export { router as cartRouter };
