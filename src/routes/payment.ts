import { Router } from "express";
import {
  createSetupIntent,
  detachCard,
  fetchCards,
} from "../controllers/paymentController";

const router = Router();

router.get("/setup", createSetupIntent);

router.post("/cardpayment");

router.patch("/detach", detachCard);

router.get("/cards", fetchCards);

export { router as paymentRouter };