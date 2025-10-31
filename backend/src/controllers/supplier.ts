import { Request, Response, NextFunction } from "express";
import { prisma } from "../connections/client";
import { appError } from "../utils/error";

export async function readSuppliers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      sortBy = "createdAt",
      order = "desc",
      limit = 10,
      cursor,
      search,
    } = req.query;
    const take = Number(limit);
    const where: any = {
      deletedAt: null,
    };
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { phone: { contains: search as string, mode: "insensitive" } },
        { email: { contains: search as string, mode: "insensitive" } },
      ];
    }
    const suppliers = await prisma.supplier.findMany({
      where,
      orderBy: {
        [sortBy as string]: order as "asc" | "desc",
      },
      take: take + 1,
      ...(cursor && { cursor: { id: cursor as string }, skip: 1 }),
    });
    let nextCursor: string | null = null;
    if (suppliers.length > take) {
      const nextItem = suppliers.pop();
      nextCursor = nextItem!.id;
    }
    res.status(200).json({
      status: "Success",
      message: "Fetch suppliers success!",
      data: suppliers,
      pagination: {
        nextCursor,
        hasNextPage: !!nextCursor,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function readSupplier(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const supplier = await prisma.supplier.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
    res.status(200).json({
      status: "Success",
      message: "Fetch supplier success!",
      data: supplier,
    });
  } catch (err) {
    next(err);
  }
}
export async function createSupplier(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, phone, email, address } = req.body;
    const existingSupplier = await prisma.supplier.findFirst({
      where: {
        deletedAt: null,
        OR: [{ name }, { email }],
      },
    });
    if (existingSupplier && existingSupplier.name === name) {
      throw appError("name already exists!", 409);
    }
    if (existingSupplier && existingSupplier.email === email) {
      throw appError("Email already exists!", 409);
    }
    const supplier = await prisma.supplier.create({
      data: {
        name,
        phone,
        email,
        address,
      },
    });
    res.status(201).json({
      status: "Success",
      message: `Create supplier ${supplier.name} success!`,
      data: supplier,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateSupplier(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { name, phone, email, address } = req.body;
    const existingSupplier = (req as any).model;
    const supplier = await prisma.supplier.update({
      data: {
        name: name ? name : existingSupplier.name,
        phone: phone ? phone : existingSupplier.phone,
        email: email ? email : existingSupplier.email,
        address: address ? address : existingSupplier.address,
      },
      where: {
        id,
        deletedAt: null,
      },
    });
    res.status(200).json({
      status: "200 OK",
      message: `Update supplier ${supplier.name} success!`,
      data: supplier,
    });
  } catch (err) {
    next(err);
  }
}

export async function restoreSupplier(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const supplier = await prisma.supplier.update({
      data: {
        deletedAt: null,
      },
      where: {
        id,
        deletedAt: { not: null },
      },
    });
    res.status(200).json({
      status: "Success",
      message: `Restore user ${supplier.name} success!`,
      data: supplier,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteSupplier(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const supplier = await prisma.supplier.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id,
        deletedAt: null,
      },
    });
    res.status(200).json({
      status: "Success",
      message: `Delete supplier ${supplier.name} success!`,
      data: supplier,
    });
  } catch (err) {
    next(err);
  }
}
