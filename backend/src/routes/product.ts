import { Router } from "express";
import { upload } from "../utils/multer";
import { productSchema } from "../utils/joi";
import { validate } from "../middlewares/validate";
import { auth, isAdmin } from "../middlewares/auth";
import { isExist } from "../middlewares/existing";
import { isFile, saveFile } from "../middlewares/file";
import {
  readProducts,
  readProductsAll,
  readProduct,
  createProduct,
  updateProduct,
  restoreProduct,
  deleteProduct,
} from "../controllers/product";

const router = Router();

router.get("/product", auth, readProducts);
router.get("/productAll", auth, readProductsAll);
router.get("/product/:id", auth, readProduct);
router.post(
  "/product",
  auth,
  isAdmin,
  upload.single("image"),
  validate(productSchema),
  isFile,
  saveFile,
  createProduct
);
router.put(
  "/product/:id",
  auth,
  isAdmin,
  isExist("product", false),
  upload.single("image"),
  saveFile,
  updateProduct
);
router.patch(
  "/product/:id/restore",
  auth,
  isAdmin,
  isExist("product", true),
  restoreProduct
);
router.delete(
  "/product/:id",
  auth,
  isAdmin,
  isExist("product", false),
  deleteProduct
);

export default router;
