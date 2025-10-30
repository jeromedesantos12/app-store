import { Router } from "express";
import { auth, isAdmin, isCustomer } from "../middlewares/auth";
import { orderSchema } from "../utils/joi";
import { validate } from "../middlewares/validate";
import { isExist } from "../middlewares/existing";
import {
  readOrders,
  readOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/order";

const router = Router();

router.get("/order/me", auth, isCustomer, readOrders);
router.get("/order/:id", auth, isCustomer, readOrderById);
router.post("/order", auth, isCustomer, createOrder);
router.patch(
  "/order/:id/status",
  isAdmin,
  validate(orderSchema),
  isExist("order"),
  updateOrder
);
router.delete(
  "/order/:id/status",
  auth,
  isCustomer,
  isExist("order"),
  deleteOrder
);

export default router;
