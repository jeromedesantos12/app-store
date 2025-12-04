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
exports.readProducts = readProducts;
exports.readProductsAll = readProductsAll;
exports.readProduct = readProduct;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.restoreProduct = restoreProduct;
exports.deleteProduct = deleteProduct;
const client_1 = require("../connections/client");
const blob_1 = require("../utils/blob");
function readProducts(req, res, next) {
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
                    { category: { contains: search, mode: "insensitive" } },
                    {
                        supplier: {
                            name: { contains: search, mode: "insensitive" },
                        },
                    },
                ];
            }
            const products = yield client_1.prisma.product.findMany(Object.assign({ where, include: {
                    supplier: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },
                }, orderBy: {
                    [sortBy]: order,
                }, take: take + 1 }, (cursor && { cursor: { id: cursor }, skip: 1 })));
            let nextCursor = null;
            if (products.length > take) {
                const nextItem = products.pop();
                nextCursor = nextItem.id;
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
        }
        catch (err) {
            next(err);
        }
    });
}
function readProductsAll(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { sortBy = "createdAt", order = "desc", limit = 10, cursor, search, } = req.query;
            const take = Number(limit);
            const where = {};
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: "insensitive" } },
                    { category: { contains: search, mode: "insensitive" } },
                    {
                        supplier: {
                            name: { contains: search, mode: "insensitive" },
                        },
                    },
                ];
            }
            const products = yield client_1.prisma.product.findMany(Object.assign({ where, include: {
                    supplier: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },
                }, orderBy: {
                    [sortBy]: order,
                }, take: take + 1 }, (cursor && { cursor: { id: cursor }, skip: 1 })));
            let nextCursor = null;
            if (products.length > take) {
                const nextItem = products.pop();
                nextCursor = nextItem.id;
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
        }
        catch (err) {
            next(err);
        }
    });
}
function readProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const product = yield client_1.prisma.product.findUnique({
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
        }
        catch (err) {
            next(err);
        }
    });
}
function createProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const { supplierId, name, category, description, price, stock, reorder, unit, warehouse, } = req.body;
            const fileName = (_a = req === null || req === void 0 ? void 0 : req.processedFile) === null || _a === void 0 ? void 0 : _a.fileName;
            const fileBuffer = (_b = req === null || req === void 0 ? void 0 : req.processedFile) === null || _b === void 0 ? void 0 : _b.fileBuffer;
            if (fileName && fileBuffer) {
                yield (0, blob_1.uploadFile)("product", fileName, fileBuffer);
            }
            const product = yield client_1.prisma.product.create({
                data: {
                    supplierId,
                    image: fileName,
                    name,
                    category,
                    description,
                    price: Number(price),
                    stock: Number(stock),
                    reorder: Number(reorder),
                    unit,
                    warehouse,
                },
            });
            res.status(201).json({
                status: "Success",
                message: `Create product ${product.name} success!`,
                data: product,
            });
        }
        catch (err) {
            next(err);
        }
    });
}
function updateProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const { id } = req.params;
            const { supplierId, name, category, description, price, stock } = req.body;
            const existingProduct = req.model;
            const fileName = (_a = req === null || req === void 0 ? void 0 : req.processedFile) === null || _a === void 0 ? void 0 : _a.fileName;
            const fileBuffer = (_b = req === null || req === void 0 ? void 0 : req.processedFile) === null || _b === void 0 ? void 0 : _b.fileBuffer;
            if (fileName && fileBuffer) {
                if (existingProduct.image) {
                    yield (0, blob_1.deleteFile)("user", existingProduct.image);
                }
                yield (0, blob_1.uploadFile)("user", fileName, fileBuffer);
            }
            const product = yield client_1.prisma.product.update({
                data: {
                    supplierId: supplierId ? supplierId : existingProduct.supplierId,
                    image: fileName !== null && fileName !== void 0 ? fileName : existingProduct.image,
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
            res.status(200).json({
                status: "Success",
                message: `Update product ${product.name} success!`,
                data: product,
            });
        }
        catch (err) {
            next(err);
        }
    });
}
function restoreProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { id } = req.params;
            const existingProduct = req.model;
            if (existingProduct.image) {
                const fileResponse = yield (0, blob_1.downloadFile)("product", existingProduct.image);
                const fileBuffer = fileResponse.data;
                yield (0, blob_1.uploadFile)("product", (_a = existingProduct.image) === null || _a === void 0 ? void 0 : _a.split("temp_")[1], fileBuffer);
                yield (0, blob_1.deleteFile)("product", existingProduct.image);
            }
            const product = yield client_1.prisma.product.update({
                data: {
                    image: existingProduct.image.split("temp_")[1],
                    deletedAt: null,
                },
                where: {
                    id,
                    deletedAt: { not: null },
                },
            });
            res.status(200).json({
                status: "Success",
                message: `Restore product ${product.name} success!`,
                data: product,
            });
        }
        catch (err) {
            next(err);
        }
    });
}
function deleteProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const existingProduct = req.model;
            if (existingProduct.image) {
                if (existingProduct.image) {
                    const fileResponse = yield (0, blob_1.downloadFile)("product", existingProduct.image);
                    const fileBuffer = fileResponse.data;
                    yield (0, blob_1.uploadFile)("product", "temp_" + existingProduct.image, fileBuffer);
                    yield (0, blob_1.deleteFile)("product", existingProduct.image);
                }
            }
            if (existingProduct.image.startsWith("temp_")) {
                return res.status(200).json({
                    status: "Success",
                    message: "Product already deleted.",
                    data: existingProduct,
                });
            }
            const product = yield client_1.prisma.product.update({
                data: {
                    image: "temp_" + existingProduct.image,
                    deletedAt: new Date(),
                },
                where: {
                    id,
                    deletedAt: null,
                },
            });
            res.status(200).json({
                status: "Success",
                message: `Delete product ${product.name} success!`,
                data: product,
            });
        }
        catch (err) {
            next(err);
        }
    });
}
