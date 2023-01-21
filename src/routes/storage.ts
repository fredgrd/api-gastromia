import { Router } from "express";
import { uplodaImage } from "../controllers/storageController";

const router = Router();

router.post("/image/upload", uplodaImage);

export { router as storageRouter };
