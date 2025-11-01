import { Router } from "express";
import { upload } from "../utils/multer";
import { userSchema } from "../utils/joi";
import { validate } from "../middlewares/validate";
import { auth, nonAuth, isAdmin } from "../middlewares/auth";
import { isExist } from "../middlewares/existing";
import { isFile, saveFile } from "../middlewares/file";
import {
  loginUser,
  logoutUser,
  createUser,
  readUsers,
  readUsersAll,
  readUser,
  verifyUser,
  updateUser,
  restoreUser,
  deleteUser,
} from "../controllers/user";

const router = Router();

router.post("/login", nonAuth, loginUser);
router.post("/logout", auth, logoutUser);
router.post(
  "/register",
  nonAuth,
  upload.single("profile"),
  validate(userSchema),
  isFile,
  saveFile,
  createUser
);
router.get("/verify", auth, verifyUser);
router.get("/user", auth, isAdmin, readUsers);
router.get("/userAll", auth, isAdmin, readUsersAll);
router.get("/user/me", auth, readUser);
router.put(
  "/user/me",
  auth,
  isExist("user", false),
  upload.single("profile"),
  saveFile,
  updateUser
);
router.patch(
  "/user/:id/restore",
  auth,
  isAdmin,
  isExist("user", true),
  restoreUser
);
router.delete("/user/:id", auth, isExist("user", false), deleteUser);

export default router;
