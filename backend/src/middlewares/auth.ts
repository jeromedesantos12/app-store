import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { appError } from "../utils/error";

export function auth(req: Request, res: Response, next: NextFunction) {
  const { token } = req.cookies;
  if (token === undefined) {
    throw appError("You must Login to access!", 401);
  }
  const decoded = verifyToken(token);
  (req as any).user = decoded as any;
  next();
}

export function nonAuth(req: Request, res: Response, next: NextFunction) {
  const { token } = req.cookies;
  if (token) {
    throw appError("You're already logged in!", 400);
  }
  next();
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const { role } = (req as any).user;
  if (role !== "admin") {
    throw appError("Only admin can access this route!", 401);
  }
  next();
}

export function isCustomer(req: Request, res: Response, next: NextFunction) {
  const { role } = (req as any).user;
  if (role !== "customer") {
    throw appError("Only customer can access this route!", 401);
  }
  next();
}
