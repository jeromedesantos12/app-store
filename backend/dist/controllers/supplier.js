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
exports.readSuppliers = readSuppliers;
exports.readSuppliersAll = readSuppliersAll;
exports.readSupplier = readSupplier;
exports.createSupplier = createSupplier;
exports.updateSupplier = updateSupplier;
exports.restoreSupplier = restoreSupplier;
exports.deleteSupplier = deleteSupplier;
const client_1 = require("../connections/client");
const error_1 = require("../utils/error");
function readSuppliers(req, res, next) {
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
                    { phone: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ];
            }
            const suppliers = yield client_1.prisma.supplier.findMany(Object.assign({ where, orderBy: {
                    [sortBy]: order,
                }, take: take + 1 }, (cursor && { cursor: { id: cursor }, skip: 1 })));
            let nextCursor = null;
            if (suppliers.length > take) {
                const nextItem = suppliers.pop();
                nextCursor = nextItem.id;
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
        }
        catch (err) {
            next(err);
        }
    });
}
function readSuppliersAll(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { sortBy = "createdAt", order = "desc", limit = 10, cursor, search, } = req.query;
            const take = Number(limit);
            const where = {};
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: "insensitive" } },
                    { phone: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ];
            }
            const suppliers = yield client_1.prisma.supplier.findMany(Object.assign({ where, orderBy: {
                    [sortBy]: order,
                }, take: take + 1 }, (cursor && { cursor: { id: cursor }, skip: 1 })));
            let nextCursor = null;
            if (suppliers.length > take) {
                const nextItem = suppliers.pop();
                nextCursor = nextItem.id;
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
        }
        catch (err) {
            next(err);
        }
    });
}
function readSupplier(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const supplier = yield client_1.prisma.supplier.findUnique({
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
        }
        catch (err) {
            next(err);
        }
    });
}
function createSupplier(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, phone, email, address } = req.body;
            const existingSupplier = yield client_1.prisma.supplier.findFirst({
                where: {
                    deletedAt: null,
                    OR: [{ name }, { email }],
                },
            });
            if (existingSupplier && existingSupplier.name === name) {
                throw (0, error_1.appError)("name already exists!", 409);
            }
            if (existingSupplier && existingSupplier.email === email) {
                throw (0, error_1.appError)("Email already exists!", 409);
            }
            const supplier = yield client_1.prisma.supplier.create({
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
        }
        catch (err) {
            next(err);
        }
    });
}
function updateSupplier(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, phone, email, address } = req.body;
            const existingSupplier = req.model;
            const supplier = yield client_1.prisma.supplier.update({
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
        }
        catch (err) {
            next(err);
        }
    });
}
function restoreSupplier(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const supplier = yield client_1.prisma.supplier.update({
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
        }
        catch (err) {
            next(err);
        }
    });
}
function deleteSupplier(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const supplier = yield client_1.prisma.supplier.update({
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
        }
        catch (err) {
            next(err);
        }
    });
}
