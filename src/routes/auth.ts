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
    // httpOnly: true,
    // sameSite: "none",
    // secure: true,
  });
  res.send("Cookie sent");
});

router.get("/readcookie", (req, res) => {
  const token = req.cookies.token;

  console.log("ALL COOKIES", req.cookies);

  console.log("COOKIE", token);
  res.sendStatus(200);
});

export { router as authRouter };
