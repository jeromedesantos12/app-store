import multer from "multer";
import { extname } from "path";
import { appError } from "../utils/error";

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
      return cb(appError("Invalid file type: must jpg, jpeg, & png,", 400));
    }
    cb(null, true);
  },
});
