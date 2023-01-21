import { Router } from "express";
import {
  fetchOperator,
  loginOperator,
  logoutOperator,
} from "../controllers/operatorController";

const router = Router();

router.post("/login", loginOperator);

router.get("/logout", logoutOperator);

router.get("/fetch", fetchOperator);

export { router as operatorRouter };
