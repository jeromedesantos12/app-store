import { Router } from "express";
import { supplierSchema } from "../utils/joi";
import { validate } from "../middlewares/validate";
import { auth, isAdmin } from "../middlewares/auth";
import { isExist } from "../middlewares/existing";
import {
  readSuppliers,
  readSuppliersAll,
  readSupplier,
  createSupplier,
  updateSupplier,
  restoreSupplier,
  deleteSupplier,
} from "../controllers/supplier";

const router = Router();
router.get("/supplier", auth, readSuppliers);
router.get("/supplierAll", auth, readSuppliersAll);
router.get("/supplier/:id", auth, readSupplier);
router.post(
  "/supplier",
  auth,
  isAdmin,
  validate(supplierSchema),
  createSupplier
);
router.put(
  "/supplier/:id",
  auth,
  isAdmin,
  isExist("supplier", false),
  updateSupplier
);
router.patch(
  "/supplier/:id/restore",
  auth,
  isAdmin,
  isExist("supplier", true),
  restoreSupplier
);
router.delete(
  "/supplier/:id",
  auth,
  isAdmin,
  isExist("supplier", false),
  deleteSupplier
);

export default router;
