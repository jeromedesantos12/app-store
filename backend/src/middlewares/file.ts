import { Request, Response, NextFunction } from "express";
import { resolve } from "path";
import { appError } from "../utils/error";

export function isFile(req: Request, res: Response, next: NextFunction) {
  if (req.file === undefined) {
    throw appError("No file uploaded", 400);
  }
  next();
}

export function saveFile(req: Request, res: Response, next: NextFunction) {
  const { file } = req;
  if (file) {
    const fileName = `${Date.now()}-${file.originalname}`;
    const fileBuffer = file.buffer;
    (req as any).processedFile = {
      fileName,
      fileBuffer,
    };
  }
  next();
}
