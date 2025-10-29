import { Router } from "express";
import { auth, isCustomer } from "../middlewares/auth";
import { cartSchema, updateCartSchema } from "../utils/joi";
import { validate } from "../middlewares/validate";
import { isExist } from "../middlewares/existing";
import {
  readCarts,
  createCart,
  updateCart,
  deleteCart,
} from "../controllers/cart";

const router = Router();

router.get("/cart/me", auth, isCustomer, readCarts);
router.post("/cart", auth, isCustomer, validate(cartSchema), createCart);
router.put(
  "/cart/:id",
  isCustomer,
  validate(updateCartSchema),
  isExist("cart"),
  updateCart
);
router.delete("/cart/:id", auth, isCustomer, isExist("cart"), deleteCart);

export default router;
