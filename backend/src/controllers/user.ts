import { Request, Response, NextFunction } from "express";
import { writeFileSync, renameSync, unlink } from "fs";
import { resolve } from "path";
import { prisma } from "../connections/client";
import { appError } from "../utils/error";
import { signToken } from "../utils/jwt";
import { hashPassword, comparePassword } from "../utils/bcrypt";

export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { emailOrUsername, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });
    if (user === null) {
      throw appError("Invalid email or username", 401);
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (user && isPasswordValid === false) {
      throw appError("Invalid password", 401);
    }
    const token = signToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
        path: "/",
      })
      .status(200)
      .json({
        status: "Success",
        message: "Login success!",
      });
  } catch (err) {
    next(err);
  }
}

export function logoutUser(req: Request, res: Response, next: NextFunction) {
  try {
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      })
      .status(200)
      .json({
        status: "Success",
        message: "Logout successful!",
      });
  } catch (err) {
    next(err);
  }
}

export async function readUsers(
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
        { email: { contains: search as string, mode: "insensitive" } },
        { role: { contains: search as string, mode: "insensitive" } },
      ];
    }
    const users = await prisma.user.findMany({
      select: {
        id: true,
        profile: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
      where,
      orderBy: {
        [sortBy as string]: order as "asc" | "desc",
      },
      take: take + 1,
      ...(cursor && { cursor: { id: cursor as string }, skip: 1 }),
    });
    let nextCursor: string | null = null;
    if (users.length > take) {
      const nextItem = users.pop();
      nextCursor = nextItem!.id;
    }
    res.status(200).json({
      status: "Success",
      message: "Fetch users success!",
      data: users,
      pagination: {
        nextCursor,
        hasNextPage: !!nextCursor,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function readUsersAll(
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
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { email: { contains: search as string, mode: "insensitive" } },
        { role: { contains: search as string, mode: "insensitive" } },
      ];
    }
    const users = await prisma.user.findMany({
      select: {
        id: true,
        profile: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
      where,
      orderBy: {
        [sortBy as string]: order as "asc" | "desc",
      },
      take: take + 1,
      ...(cursor && { cursor: { id: cursor as string }, skip: 1 }),
    });
    let nextCursor: string | null = null;
    if (users.length > take) {
      const nextItem = users.pop();
      nextCursor = nextItem!.id;
    }
    res.status(200).json({
      status: "Success",
      message: "Fetch users success!",
      data: users,
      pagination: {
        nextCursor,
        hasNextPage: !!nextCursor,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function readUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = (req as any).user;
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        profile: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
      where: {
        id,
        deletedAt: null,
      },
    });
    res.status(200).json({
      status: "Success",
      message: "Fetch user success!",
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

export function verifyUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id, username, role } = (req as any).user;
    res.status(200).json({
      status: "Success",
      message: "Fetch user success!",
      data: { id, username, role },
    });
  } catch (err) {
    next(err);
  }
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, name, email, address, password } = req.body;
    const fileName = (req as any)?.processedFile?.fileName;
    const fileBuffer = (req as any)?.processedFile?.fileBuffer;
    const hashedPassword = await hashPassword(password);
    const existingUser = await prisma.user.findFirst({
      where: {
        deletedAt: null,
        OR: [{ username }, { email }],
      },
    });
    if (existingUser && existingUser.username === username) {
      throw appError("Username already exists!", 409);
    }
    if (existingUser && existingUser.email === email) {
      throw appError("Email already exists!", 409);
    }
    const user = await prisma.user.create({
      data: {
        profile: fileName,
        username,
        name,
        email,
        address,
        password: hashedPassword,
      },
    });
    const savePath = resolve("src", "uploads", "user", fileName);
    writeFileSync(savePath, fileBuffer);
    res.status(201).json({
      status: "Success",
      message: `Create user ${user.name} success!`,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = (req as any).user;
    const { username, name, email, address, password } = req.body;
    const existingUser = (req as any).model;
    const fileName = (req as any)?.processedFile?.fileName;
    const fileBuffer = (req as any)?.processedFile?.fileBuffer;
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.update({
      data: {
        profile: fileName ?? existingUser.profile,
        username: username ? username : existingUser.username,
        name: name ? name : existingUser.name,
        email: email ? email : existingUser.email,
        address: address ? address : existingUser.address,
        password: hashedPassword ? hashedPassword : existingUser.password,
      },
      where: {
        id,
        deletedAt: null,
      },
    });
    if (fileName) {
      const savePath = resolve("src", "uploads", "user", fileName);
      if (existingUser.profile) {
        const filePath = resolve(
          "src",
          "uploads",
          "user",
          existingUser.profile
        );
        if (filePath) {
          unlink(filePath, (err) => {
            if (err) {
              throw appError("File cannot remove!", 500);
            }
          });
        }
      }
      writeFileSync(savePath, fileBuffer);
    }
    res.status(200).json({
      status: "200 OK",
      message: `Update user ${user.name} success!`,
    });
  } catch (err) {
    next(err);
  }
}

export async function restoreUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const existingUser = (req as any).model;
    const user = await prisma.user.update({
      data: {
        profile: existingUser.profile.split("temp_")[1],
        deletedAt: null,
      },
      where: {
        id,
        deletedAt: { not: null },
      },
    });
    if (user && user.profile) {
      const oldPath = resolve("src", "uploads", "user", "temp_" + user.profile);
      const newPath = resolve("src", "uploads", "user", user.profile);
      renameSync(oldPath, newPath);
    }
    res.status(200).json({
      status: "Success",
      message: `Restore user ${user.name} success!`,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const existingUser = (req as any).model;
    const user = await prisma.user.update({
      data: {
        profile: "temp_" + existingUser.profile,
        deletedAt: new Date(),
      },
      where: {
        id,
        deletedAt: null,
      },
    });
    if (user && user.profile) {
      const oldPath = resolve("src", "uploads", "user", user.profile);
      const newPath = resolve("src", "uploads", "user", "temp_" + user.profile);
      renameSync(oldPath, newPath);
    }
    res.status(200).json({
      status: "Success",
      message: `Delete user ${user.name} success!`,
    });
  } catch (err) {
    next(err);
  }
}
