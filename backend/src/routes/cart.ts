import { Router } from "express";
import { auth, isCustomer } from "../middlewares/auth";
import { cartSchema, cartUpdateSchema } from "../utils/joi";
import { validate } from "../middlewares/validate";
import { isExist } from "../middlewares/existing";
import {
  readCarts,
  upsertCart,
  updateCart,
  deleteCart,
} from "../controllers/cart";

const router = Router();

router.get("/cart/me", auth, isCustomer, readCarts);
router.post("/cart", auth, isCustomer, validate(cartSchema), upsertCart);
router.put(
  "/cart/:id",
  auth,
  isCustomer,
  isExist("cart"),
  validate(cartUpdateSchema),
  updateCart
);
router.delete("/cart/:id", auth, isCustomer, isExist("cart"), deleteCart);

export default router;
