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
exports.loginUser = loginUser;
exports.logoutUser = logoutUser;
exports.readUsers = readUsers;
exports.readUsersAll = readUsersAll;
exports.readUser = readUser;
exports.verifyUser = verifyUser;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.restoreUser = restoreUser;
exports.deleteUser = deleteUser;
const client_1 = require("../connections/client");
const error_1 = require("../utils/error");
const jwt_1 = require("../utils/jwt");
const bcrypt_1 = require("../utils/bcrypt");
const blob_1 = require("../utils/blob");
function loginUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { emailOrUsername, password } = req.body;
            const user = yield client_1.prisma.user.findFirst({
                where: {
                    OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
                },
            });
            if (user === null) {
                throw (0, error_1.appError)("Invalid email or username", 401);
            }
            const isPasswordValid = yield (0, bcrypt_1.comparePassword)(password, user.password);
            if (user && isPasswordValid === false) {
                throw (0, error_1.appError)("Invalid password", 401);
            }
            const token = (0, jwt_1.signToken)({
                id: user.id,
                username: user.username,
                role: user.role,
            });
            const sanitizedUser = {
                id: user.id,
                profile: user.profile,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
            res
                .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
                path: "/",
            })
                .status(200)
                .json({
                status: "Success",
                message: "Login success!",
                data: sanitizedUser,
            });
        }
        catch (err) {
            next(err);
        }
    });
}
function logoutUser(req, res, next) {
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
    }
    catch (err) {
        next(err);
    }
}
function readUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { sortBy = "createdAt", order = "desc", limit = 10, cursor, search, } = req.query;
            const take = Number(limit);
            const where = {
                deletedAt: null,
            };
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                    { role: { contains: search, mode: "insensitive" } },
                ];
            }
            const users = yield client_1.prisma.user.findMany(Object.assign({ select: {
                    id: true,
                    profile: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    deletedAt: true,
                }, where, orderBy: {
                    [sortBy]: order,
                }, take: take + 1 }, (cursor && { cursor: { id: cursor }, skip: 1 })));
            let nextCursor = null;
            if (users.length > take) {
                const nextItem = users.pop();
                nextCursor = nextItem.id;
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
        }
        catch (err) {
            next(err);
        }
    });
}
function readUsersAll(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { sortBy = "createdAt", order = "desc", limit = 10, cursor, search, } = req.query;
            const take = Number(limit);
            const where = {};
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                    { role: { contains: search, mode: "insensitive" } },
                ];
            }
            const users = yield client_1.prisma.user.findMany(Object.assign({ select: {
                    id: true,
                    profile: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    deletedAt: true,
                }, where, orderBy: {
                    [sortBy]: order,
                }, take: take + 1 }, (cursor && { cursor: { id: cursor }, skip: 1 })));
            let nextCursor = null;
            if (users.length > take) {
                const nextItem = users.pop();
                nextCursor = nextItem.id;
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
        }
        catch (err) {
            next(err);
        }
    });
}
function readUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.user;
            const user = yield client_1.prisma.user.findUnique({
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
        }
        catch (err) {
            next(err);
        }
    });
}
function verifyUser(req, res, next) {
    try {
        const { id, username, role } = req.user;
        res.status(200).json({
            status: "Success",
            message: "Fetch user success!",
            data: { id, username, role },
        });
    }
    catch (err) {
        next(err);
    }
}
function createUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const { username, name, email, address, password } = req.body;
            const fileName = (_a = req === null || req === void 0 ? void 0 : req.processedFile) === null || _a === void 0 ? void 0 : _a.fileName;
            const fileBuffer = (_b = req === null || req === void 0 ? void 0 : req.processedFile) === null || _b === void 0 ? void 0 : _b.fileBuffer;
            const hashedPassword = yield (0, bcrypt_1.hashPassword)(password);
            const existingUser = yield client_1.prisma.user.findFirst({
                where: {
                    deletedAt: null,
                    OR: [{ username }, { email }],
                },
            });
            if (existingUser && existingUser.username === username) {
                throw (0, error_1.appError)("Username already exists!", 409);
            }
            if (existingUser && existingUser.email === email) {
                throw (0, error_1.appError)("Email already exists!", 409);
            }
            if (fileName && fileBuffer) {
                yield (0, blob_1.uploadFile)("user", fileName, fileBuffer);
            }
            const user = yield client_1.prisma.user.create({
                data: {
                    profile: fileName,
                    username,
                    name,
                    email,
                    address,
                    password: hashedPassword,
                },
            });
            const sanitizedUser = {
                id: user.id,
                profile: user.profile,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
            res.status(201).json({
                status: "Success",
                message: `Create user ${user.name} success!`,
                data: sanitizedUser,
            });
        }
        catch (err) {
            next(err);
        }
    });
}
function updateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const { id } = req.user;
            const { username, name, email, address, password } = req.body;
            const hashedPassword = yield (0, bcrypt_1.hashPassword)(password);
            const existingUser = req.model;
            const fileName = (_a = req === null || req === void 0 ? void 0 : req.processedFile) === null || _a === void 0 ? void 0 : _a.fileName;
            const fileBuffer = (_b = req === null || req === void 0 ? void 0 : req.processedFile) === null || _b === void 0 ? void 0 : _b.fileBuffer;
            if (fileName && fileBuffer) {
                if (existingUser.profile) {
                    yield (0, blob_1.deleteFile)("user", existingUser.profile);
                }
                yield (0, blob_1.uploadFile)("user", fileName, fileBuffer);
            }
            const user = yield client_1.prisma.user.update({
                data: {
                    profile: fileName !== null && fileName !== void 0 ? fileName : existingUser.profile,
                    username: username ? username : existingUser.username,
                    name: name ? name : existingUser.name,
                    email: email ? email : existingUser.email,
                    address: address ? address : existingUser.address,
                    password: hashedPassword ? hashedPassword : existingUser.password,
                    updatedAt: new Date(),
                },
                where: {
                    id,
                    deletedAt: null,
                },
            });
            res.status(200).json({
                status: "200 OK",
                message: `Update user ${user.name} success!`,
            });
        }
        catch (err) {
            next(err);
        }
    });
}
function restoreUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { id } = req.params;
            const existingUser = req.model;
            if (existingUser.profile) {
                const fileResponse = yield (0, blob_1.downloadFile)("user", existingUser.profile);
                const fileBuffer = fileResponse.data;
                yield (0, blob_1.uploadFile)("user", (_a = existingUser.profile) === null || _a === void 0 ? void 0 : _a.split("temp_")[1], fileBuffer);
                yield (0, blob_1.deleteFile)("user", existingUser.profile);
            }
            const user = yield client_1.prisma.user.update({
                data: {
                    profile: existingUser.profile.split("temp_")[1],
                    deletedAt: null,
                },
                where: {
                    id,
                    deletedAt: { not: null },
                },
            });
            res.status(200).json({
                status: "Success",
                message: `Restore user ${user.name} success!`,
            });
        }
        catch (err) {
            next(err);
        }
    });
}
function deleteUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const existingUser = req.model;
            if (existingUser.profile) {
                yield (0, blob_1.deleteFile)("user", "temp_" + existingUser.profile);
            }
            if (existingUser.profile.startsWith("temp_")) {
                return res.status(200).json({
                    status: "Success",
                    message: "User already deleted.",
                    data: existingUser,
                });
            }
            const user = yield client_1.prisma.user.update({
                data: {
                    profile: "temp_" + existingUser.profile,
                    deletedAt: new Date(),
                },
                where: {
                    id,
                    deletedAt: null,
                },
            });
            res.status(200).json({
                status: "Success",
                message: `Delete user ${user.name} success!`,
            });
        }
        catch (err) {
            next(err);
        }
    });
}
