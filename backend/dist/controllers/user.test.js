"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./user");
const client_1 = require("../connections/client");
const bcrypt_1 = require("../utils/bcrypt");
const jwt_1 = require("../utils/jwt");
const error_1 = require("../utils/error");
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
    let req;
    let res;
    let next;
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
    it("should login a user successfully", () => __awaiter(void 0, void 0, void 0, function* () {
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
        client_1.prisma.user.findFirst.mockResolvedValue(mockUser);
        bcrypt_1.comparePassword.mockResolvedValue(true);
        jwt_1.signToken.mockReturnValue(mockToken);
        yield (0, user_1.loginUser)(req, res, next);
        expect(client_1.prisma.user.findFirst).toHaveBeenCalledWith({
            where: {
                OR: [
                    { email: "testuser@example.com" },
                    { username: "testuser@example.com" },
                ],
            },
        });
        expect(bcrypt_1.comparePassword).toHaveBeenCalledWith("password123", "hashedpassword");
        expect(jwt_1.signToken).toHaveBeenCalledWith({
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
    }));
    it("should call next with an error for invalid email or username", () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new Error("Invalid email or username");
        client_1.prisma.user.findFirst.mockResolvedValue(null);
        error_1.appError.mockReturnValue(error);
        yield (0, user_1.loginUser)(req, res, next);
        expect(client_1.prisma.user.findFirst).toHaveBeenCalledWith({
            where: {
                OR: [
                    { email: "testuser@example.com" },
                    { username: "testuser@example.com" },
                ],
            },
        });
        expect(error_1.appError).toHaveBeenCalledWith("Invalid email or username", 401);
        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    }));
    it("should call next with an error for invalid password", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUser = {
            id: "1",
            username: "testuser",
            password: "hashedpassword",
            role: "USER",
        };
        const error = new Error("Invalid password");
        client_1.prisma.user.findFirst.mockResolvedValue(mockUser);
        bcrypt_1.comparePassword.mockResolvedValue(false);
        error_1.appError.mockReturnValue(error);
        yield (0, user_1.loginUser)(req, res, next);
        expect(bcrypt_1.comparePassword).toHaveBeenCalledWith("password123", "hashedpassword");
        expect(error_1.appError).toHaveBeenCalledWith("Invalid password", 401);
        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    }));
    it("should call next with an error if any step fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new Error("Something went wrong");
        client_1.prisma.user.findFirst.mockRejectedValue(error);
        yield (0, user_1.loginUser)(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    }));
});
