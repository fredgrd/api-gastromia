import { Router } from "express";
import {
  createOrder,
  fetchActiveOrders,
  fetchAllOrders,
  fetchOrder,
  fetchOrders,
  updateOrderStatus,
  updatePaidOrder,
} from "../controllers/orderController";

const router = Router();

router.get("/", fetchOrder);

router.patch("/updatestatus", updateOrderStatus);

router.post("/checkout", createOrder);

router.patch("/paidorder", updatePaidOrder);

router.get("/orders", fetchOrders);

router.get("/orders/active", fetchActiveOrders);

router.get("/orders/all", fetchAllOrders);

export { router as orderRouter };
