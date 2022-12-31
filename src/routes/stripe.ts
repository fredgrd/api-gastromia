import { Router } from "express";
import { createCustomer } from "../controllers/stripeController";

const router = Router();

router.post("/", createCustomer);

export { router as stripeRouter };
