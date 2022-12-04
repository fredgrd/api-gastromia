import { Router } from "express";
import {
  startVerification,
  checkVerification,
} from "../controllers/authController";

const router = Router();

router.post("/start", startVerification);

router.post("/checkcode/", checkVerification);

router.get("/cookie", (req, res) => {
  res.cookie("tokenaaa", "ciao", {
    maxAge: 60 * 60 * 24 * 30 * 1000, // 60s * 60m * 24h * 30d => 30 Days in secods => in milliseconds
    httpOnly: true,
    // sameSite: "none",
    secure: true,
  });
  res.sendStatus(200);
});

router.get("/readcookie", (req, res) => {
  const token = req.cookies.token;

  console.log("ALL COOKIES", req.cookies);

  console.log("COOKIE", token);
  res.sendStatus(200);
});

export { router as authRouter };
