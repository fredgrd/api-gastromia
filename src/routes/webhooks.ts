import { Router } from "express";
import { verifyWhatsapp, handleWhatsappEvents, test } from "../controllers/webhooksController";

const router = Router();

router.get("/whatsapp", verifyWhatsapp);

router.get("/whatsapp/test", test);

router.post("/whatsapp", handleWhatsappEvents);

export { router as webhooksRouter };
