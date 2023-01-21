import { Router } from "express";
import {
  fetchUser,
  createUser,
  updateUser,
} from "../controllers/userController";

const router = Router();

router.get("/fetch", fetchUser);

router.post("/create", createUser);

router.patch("/update", updateUser);

export { router as userRouter };
