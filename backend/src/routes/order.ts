import { Router } from "express";
import { auth, isCustomer } from "../middlewares/auth";
import { orderSchema, updateOrderSchema } from "../utils/joi";
import { validate } from "../middlewares/validate";
import { isExist } from "../middlewares/existing";
import {
  readOrders,
  readOrderById,
  createOrder,
  updateOrder,
} from "../controllers/order";

const router = Router();

router.get("/order/me", auth, isCustomer, readOrders);
router.get("/order/:id", auth, isCustomer, readOrderById);
router.post("/order", auth, isCustomer, validate(orderSchema), createOrder);
router.patch(
  "/order/:id/status",
  isCustomer,
  validate(updateOrderSchema),
  isExist("order"),
  updateOrder
);

export default router;
