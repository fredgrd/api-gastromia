import { Router } from "express";
import { fetchCart, updateSnapshot } from "../controllers/cartController";

const router = Router();

router.get("/", fetchCart);

router.patch("/snapshot", updateSnapshot);

export { router as cartRouter };
