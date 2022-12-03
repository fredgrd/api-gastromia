"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
exports.authRouter = router;
router.post("/start", authController_1.startVerification);
router.post("/checkcode/", authController_1.checkVerification);
router.get("/cookie", (req, res) => {
    res.cookie("tokenaaa", "ciao", {
        maxAge: 60 * 60 * 24 * 30 * 1000, // 60s * 60m * 24h * 30d => 30 Days in secods => in milliseconds
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
