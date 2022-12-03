import { Router } from "express";
import {
  startVerification,
  checkVerification,
} from "../controllers/authController";

const router = Router();

router.post("/start", startVerification);

router.post("/checkcode/", checkVerification);

router.get("/cookie", (req, res) => {
  res.cookie("token", "ciao", { httpOnly: true });
  res.send("Cookie sent")
});

export { router as authRouter };
