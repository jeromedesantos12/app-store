import { Request, Response, NextFunction } from "express";
import { prisma } from "../connections/client";
import { appError } from "../utils/error";

export async function readOrders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: userId } = (req as any).user;
    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        product: {
          select: { image: true, name: true, price: true },
        },
        user: {
          select: { profile: true, name: true, username: true, address: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json({
      status: "Success",
      message: "Fetch order success!",
      data: orders,
    });
  } catch (err) {
    next(err);
  }
}

export async function readOrderById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        product: { select: { image: true, name: true, price: true } },
        user: {
          select: { profile: true, name: true, username: true, address: true },
        },
      },
    });
    res.status(200).json({
      status: "Success",
      message: "Fetch single order success!",
      data: order,
    });
  } catch (err) {
    next(err);
  }
}

export async function createOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).user.id;
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { product: true },
    });
    if (cartItems.length === 0) {
      throw appError("Cart is empty!", 400);
    }
    const orders = await prisma.$transaction(async (tx) => {
      const result: any[] = [];
      for (const item of cartItems) {
        if (item.product.stock < item.qty) {
          throw appError(
            `Insufficient stock for product "${item.product.name}"!`,
            400
          );
        }
        const order = await tx.order.create({
          data: {
            userId,
            productId: item.productId,
            qty: item.qty,
            total: item.total,
            status: "pending",
          },
        });
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.qty } },
        });
        result.push(order);
      }
      await tx.cart.deleteMany({ where: { userId } });
      return result;
    });
    const totalAmount = orders.reduce((sum, o) => sum + Number(o.total), 0);
    res.status(201).json({
      status: "Success",
      message: `Checkout completed successfully!`,
      data: { orders, totalAmount },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = [
      "pending",
      "paid",
      "shipped",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      throw appError(
        `Invalid status! Valid statuses: ${validStatuses.join(", ")}`,
        400
      );
    }
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });
    res.status(200).json({
      status: "Success",
      message: `Order [${order.id}] status updated to "${status}"!`,
      data: order,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const order = await prisma.order.update({
      where: { id },
      data: { status: "cancelled" },
    });
    res.status(200).json({
      status: "Success",
      message: `Order [${order.id}] status updated to "cancelled"!`,
      data: order,
    });
  } catch (err) {
    next(err);
  }
}
