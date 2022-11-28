import { Router } from "express";
import { verifyWhatsapp, handleWhatsappEvents } from "../controllers/webhooksController";

const router = Router();

router.get("/whatsapp", verifyWhatsapp);

router.post("/whatsapp", handleWhatsappEvents);

export { router as webhooksRouter };
