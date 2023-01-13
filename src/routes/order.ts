import { Router } from "express";
import {
  createOrder,
  fetchOrders,
  updatePaidOrder,
} from "../controllers/orderController";

const router = Router();

router.post("/checkout", createOrder);

router.patch("/paidorder", updatePaidOrder);

router.get("/orders", fetchOrders);

export { router as orderRouter };
