import { Request, Response, NextFunction } from "express";
import { prisma } from "../connections/client";
import { appError } from "../utils/error";

export function isExist(modelName: string, deleted?: boolean) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const name = modelName.charAt(0).toUpperCase() + modelName.slice(1);
      const model = await (prisma as any)[modelName].findUnique({
        where: { id },
      });
      if (model === null) {
        throw appError(`${name} Not Found!`, 404);
      }
      if (deleted === false && model && model.deletedAt !== null) {
        throw appError(`${name} has been deleted!!`, 404);
      }
      if (deleted === true && model && model.deletedAt === null) {
        throw appError(`${name} still exist!!`, 404);
      }
      (req as any).model = model;
      next();
    } catch (err) {
      next(err);
    }
  };
}
