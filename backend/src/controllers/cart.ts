import { Request, Response, NextFunction } from "express";
import { prisma } from "../connections/client";
import { appError } from "../utils/error";

export async function readCarts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: userId } = (req as any).user;
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            name: true,
            price: true,
          },
        },
      },
    });
    res.status(200).json({
      status: "success",
      message: "Fetch cart success!",
      data: cartItems,
    });
  } catch (err) {
    next(err);
  }
}
export async function createCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: userId } = (req as any).user;
    const { productId, qty } = req.body;
    const [user, product] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId, deletedAt: null },
      }),
      prisma.product.findUnique({
        where: { id: productId, deletedAt: null },
      }),
    ]);
    if (user === null) {
      throw appError("User not Found", 404);
    }
    if (product === null) {
      throw appError("Product not Found", 404);
    }
    const total = Number(product.price) * qty;
    const createdCart = await prisma.cart.create({
      data: {
        userId,
        productId,
        qty,
        total,
      },
    });
    res.status(201).json({
      status: "Success",
      message: `Create cart [${createdCart.id}] success!`,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { qty } = req.body;
    const oldCart = await prisma.cart.findUnique({
      where: { id },
    });
    if (oldCart === null) {
      throw appError("Old cart not Found", 404);
    }
    const [user, product] = await Promise.all([
      prisma.user.findUnique({
        where: { id: oldCart.userId },
      }),
      prisma.product.findUnique({
        where: { id: oldCart.productId },
      }),
    ]);
    if (user === null) {
      throw appError("User not Found", 404);
    }
    if (product === null) {
      throw appError("Product not Found", 404);
    }
    const total = Number(product.price) * qty;
    const updatedCart = await prisma.cart.update({
      where: { id },
      data: { qty, total },
    });
    res.status(200).json({
      status: "Success",
      message: `Update cart [${updatedCart.id}] success!`,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const deletedCart = await prisma.cart.delete({
      where: { id },
    });
    res.status(200).json({
      status: "Success",
      message: `Delete order [${deletedCart.id}] success!`,
    });
  } catch (err) {
    next(err);
  }
}
