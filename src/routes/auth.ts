import { Router } from "express";
import {
  startVerification,
  checkVerification,
} from "../controllers/authController";

const router = Router();

router.post("/start", startVerification);

router.post("/checkcode", checkVerification);

export { router as authRouter };
