import { Router } from "express";
import { auth, isAdmin, isCustomer } from "../middlewares/auth";
import { orderSchema } from "../utils/joi";
import { validate } from "../middlewares/validate";
import { isExist } from "../middlewares/existing";
import {
  readOrdersAll,
  readOrders,
  readOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/order";

const router = Router();

router.get("/order/all", auth, isAdmin, readOrdersAll);
router.get("/order/me", auth, isCustomer, readOrders);
router.get("/order/:id", auth, isCustomer, readOrderById);
router.post("/order", auth, isCustomer, createOrder);
router.patch(
  "/order/:id/status",
  auth,
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
