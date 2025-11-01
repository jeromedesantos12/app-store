import { Request, Response, NextFunction } from "express";
import { extension } from "mime-types";
import { appError } from "../utils/error";

export function isFile(req: Request, res: Response, next: NextFunction) {
  if (req.file === undefined) {
    throw appError("No file uploaded", 400);
  }
  next();
}

export function saveFile(req: Request, res: Response, next: NextFunction) {
  const file = (req as any).file;

  if (file) {
    const fieldName = file.fieldname;
    const ext = extension(file.mimetype);
    const uniqueSuffix = Date.now() + `-` + Math.round(Math.random() * 1e9);
    const fileName = fieldName + "-" + uniqueSuffix + "." + ext;
    const fileBuffer = file.buffer;
    (req as any).processedFile = {
      fileName,
      fileBuffer,
    };
  }
  next();
}
