import { Request, Response, NextFunction } from "express";
import { resolve } from "path";
import { writeFileSync, renameSync, unlink } from "fs";
import { prisma } from "../connections/client";
import { appError } from "../utils/error";

export async function readProducts(
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
        { category: { contains: search as string, mode: "insensitive" } },
        {
          supplier: {
            name: { contains: search as string, mode: "insensitive" },
          },
        },
      ];
    }
    const products = await prisma.product.findMany({
      where,
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        [sortBy as string]: order as "asc" | "desc",
      },
      take: take + 1,
      ...(cursor && { cursor: { id: cursor as string }, skip: 1 }),
    });
    let nextCursor: string | null = null;
    if (products.length > take) {
      const nextItem = products.pop();
      nextCursor = nextItem!.id;
    }
    res.status(200).json({
      status: "Success",
      message: "Fetch products success!",
      data: products,
      pagination: {
        nextCursor,
        hasNextPage: !!nextCursor,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function readProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
          },
        },
      },
    });
    res.status(200).json({
      status: "Success",
      message: "Fetch product success!",
      data: product,
    });
  } catch (err) {
    next(err);
  }
}

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { supplierId, name, category, description, price, stock } = req.body;
    const fileName = (req as any)?.processedFile?.fileName;
    const fileBuffer = (req as any)?.processedFile?.fileBuffer;
    const product = await prisma.product.create({
      data: {
        supplierId,
        image: fileName,
        name,
        category,
        description,
        price: Number(price),
        stock: Number(stock),
      },
    });
    const savePath = resolve("src", "uploads", "product", fileName);
    writeFileSync(savePath, fileBuffer);
    res.status(201).json({
      status: "Success",
      message: `Create product ${product.name} success!`,
      data: product,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { supplierId, name, category, description, price, stock } = req.body;
    const existingProduct = (req as any).model;
    const fileName = (req as any)?.processedFile?.fileName;
    const fileBuffer = (req as any)?.processedFile?.fileBuffer;
    const product = await prisma.product.update({
      data: {
        supplierId: supplierId ? supplierId : existingProduct.supplierId,
        image: fileName ?? existingProduct.image,
        name: name ? name : existingProduct.name,
        category: category ? category : existingProduct.category,
        description: description ? description : existingProduct.description,
        price: price ? Number(price) : existingProduct.price,
        stock: stock ? Number(stock) : existingProduct.stock,
        updatedAt: new Date(),
      },
      where: {
        id,
        deletedAt: null,
      },
    });
    if (fileName) {
      const savePath = resolve("src", "uploads", "product", fileName);
      const filePath = resolve(
        "src",
        "uploads",
        "product",
        existingProduct.image
      );
      if (filePath) {
        unlink(filePath, (err) => {
          if (err) {
            throw appError("File cannot remove!", 500);
          }
        });
      }
      writeFileSync(savePath, fileBuffer);
    }
    res.status(200).json({
      status: "Success",
      message: `Update product ${product.name} success!`,
      data: product,
    });
  } catch (err) {
    next(err);
  }
}

export async function restoreProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const product = await prisma.product.update({
      data: {
        deletedAt: null,
      },
      where: {
        id,
        deletedAt: { not: null },
      },
    });
    if (product && product.image) {
      const oldPath = resolve(
        "src",
        "uploads",
        "product",
        "temp_" + product.image
      );
      const newPath = resolve("src", "uploads", "product", product.image);
      renameSync(oldPath, newPath);
    }
    res.status(200).json({
      status: "Success",
      message: `Restore product ${product.name} success!`,
      data: product,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const product = await prisma.product.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id,
        deletedAt: null,
      },
    });
    if (product && product.image) {
      const oldPath = resolve("src", "uploads", "product", product.image);
      const newPath = resolve(
        "src",
        "uploads",
        "product",
        "temp_" + product.image
      );
      renameSync(oldPath, newPath);
    }
    res.status(200).json({
      status: "Success",
      message: `Delete product ${product.name} success!`,
      data: product,
    });
  } catch (err) {
    next(err);
  }
}
