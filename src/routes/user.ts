import { Router } from "express";
import { fetchUser, createUser } from "../controllers/userController";

const router = Router();

router.get("/fetch", fetchUser);

router.post("/create", createUser);

export { router as userRouter };
