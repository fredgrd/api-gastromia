import { Router } from "express";
import {
  createSetupIntent,
  fetchCards,
} from "../controllers/paymentController";

const router = Router();

router.post("/setup", createSetupIntent);

router.post("/cardpayment");

router.get("/cards", fetchCards);

export { router as paymentRouter };
