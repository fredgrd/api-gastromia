import { Router } from "express";
import {
  startVerification,
  completeVerification,
} from "../controllers/authController";

const router = Router();

router.post("/start", startVerification);

router.post("/complete", completeVerification);

export { router as authRouter };
