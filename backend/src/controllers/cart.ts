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
    const carts = await prisma.cart.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            image: true,
            name: true,
            price: true,
          },
        },
      },
    });
    res.status(200).json({
      status: "Success",
      message: "Fetch cart success!",
      data: carts,
    });
  } catch (err) {
    next(err);
  }
}
export async function upsertCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: userId } = (req as any).user;
    const { productId, qty } = req.body;
    const [user, product] = await Promise.all([
      prisma.user.findFirst({ where: { id: userId, deletedAt: null } }),
      prisma.product.findFirst({ where: { id: productId, deletedAt: null } }),
    ]);
    if (user === null) {
      throw appError("User not Found", 404);
    }
    if (product === null) {
      throw appError("Product not Found", 404);
    }
    const existingCart = await prisma.cart.findFirst({
      where: { userId, productId },
    });
    let cart;
    if (existingCart) {
      const newQty = existingCart.qty + qty;
      if (newQty <= 0) {
        await prisma.cart.delete({ where: { id: existingCart.id } });
        return res.status(200).json({
          status: "Success",
          message: `Cart [${existingCart.id}] removed (qty <= 0)`,
        });
      }
      cart = await prisma.cart.update({
        where: { id: existingCart.id },
        data: {
          qty: newQty,
          total: Number(product.price) * newQty,
        },
      });
    } else {
      cart = await prisma.cart.create({
        data: {
          userId,
          productId,
          qty,
          total: Number(product.price) * qty,
        },
      });
    }
    res.status(200).json({
      status: "Success",
      message: `Cart ${existingCart ? "updated" : "created"} successfully!`,
      data: cart,
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
    const existingCart = await prisma.cart.findUnique({
      where: { id },
      include: { product: true },
    });
    if (existingCart === null) {
      throw appError("Cart item not found!", 404);
    }
    if (qty <= 0) {
      await prisma.cart.delete({ where: { id } });
      return res.status(200).json({
        status: "Success",
        message: `Cart item [${id}] removed (qty <= 0)`,
      });
    }
    const updatedCart = await prisma.cart.update({
      where: { id },
      data: {
        qty,
        total: Number(existingCart.product.price) * qty,
      },
    });
    res.status(200).json({
      status: "Success",
      message: `Cart item [${id}] updated successfully!`,
      data: updatedCart,
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
    const cart = await prisma.cart.delete({
      where: { id },
    });
    res.status(200).json({
      status: "Success",
      message: `Delete order [${cart.id}] success!`,
      data: cart,
    });
  } catch (err) {
    next(err);
  }
}
