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
    res.cookie("token", "ciao", {
        httpOnly: true,
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
