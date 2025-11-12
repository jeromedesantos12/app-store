import { Request, Response, NextFunction } from "express";
import { loginUser } from "./user";
import { prisma } from "../connections/client";
import { comparePassword } from "../utils/bcrypt";
import { signToken } from "../utils/jwt";
import { appError } from "../utils/error";

jest.mock("../connections/client", () => ({
  prisma: {
    user: {
      findFirst: jest.fn(),
    },
  },
}));
jest.mock("../utils/bcrypt");
jest.mock("../utils/jwt");
jest.mock("../utils/error");

describe("loginUser Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {
        emailOrUsername: "testuser@example.com",
        password: "password123",
      },
    };
    res = {
      cookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should login a user successfully", async () => {
    const mockUser = {
      id: "1",
      profile: "profile.jpg",
      name: "Test User",
      username: "testuser",
      email: "testuser@example.com",
      password: "hashedpassword",
      role: "USER",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockToken = "mock-jwt-token";

    (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
    (comparePassword as jest.Mock).mockResolvedValue(true);
    (signToken as jest.Mock).mockReturnValue(mockToken);

    await loginUser(req as Request, res as Response, next);

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        OR: [
          { email: "testuser@example.com" },
          { username: "testuser@example.com" },
        ],
      },
    });
    expect(comparePassword).toHaveBeenCalledWith(
      "password123",
      "hashedpassword"
    );
    expect(signToken).toHaveBeenCalledWith({
      id: mockUser.id,
      username: mockUser.username,
      role: mockUser.role,
    });
    expect(res.cookie).toHaveBeenCalledWith("token", mockToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
      path: "/",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "Success",
      message: "Login success!",
      data: {
        id: mockUser.id,
        profile: mockUser.profile,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with an error for invalid email or username", async () => {
    const error = new Error("Invalid email or username");
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (appError as jest.Mock).mockReturnValue(error);

    await loginUser(req as Request, res as Response, next);

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        OR: [
          { email: "testuser@example.com" },
          { username: "testuser@example.com" },
        ],
      },
    });
    expect(appError).toHaveBeenCalledWith("Invalid email or username", 401);
    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should call next with an error for invalid password", async () => {
    const mockUser = {
      id: "1",
      username: "testuser",
      password: "hashedpassword",
      role: "USER",
    };
    const error = new Error("Invalid password");

    (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
    (comparePassword as jest.Mock).mockResolvedValue(false);
    (appError as jest.Mock).mockReturnValue(error);

    await loginUser(req as Request, res as Response, next);

    expect(comparePassword).toHaveBeenCalledWith(
      "password123",
      "hashedpassword"
    );
    expect(appError).toHaveBeenCalledWith("Invalid password", 401);
    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should call next with an error if any step fails", async () => {
    const error = new Error("Something went wrong");
    (prisma.user.findFirst as jest.Mock).mockRejectedValue(error);

    await loginUser(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
