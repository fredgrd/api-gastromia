import { Router } from "express";
import {
  fetchLocationStatus,
  updateLocationStatus,
} from "../controllers/locationController";

const router = Router();

router.get("/status", fetchLocationStatus);

router.patch("/status/update", updateLocationStatus);

export { router as locationRouter };
