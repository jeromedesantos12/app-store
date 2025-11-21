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
exports.readCarts = readCarts;
exports.upsertCart = upsertCart;
exports.updateCart = updateCart;
exports.deleteCart = deleteCart;
const client_1 = require("../connections/client");
const error_1 = require("../utils/error");
function readCarts(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id: userId } = req.user;
            const carts = yield client_1.prisma.cart.findMany({
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
        }
        catch (err) {
            next(err);
        }
    });
}
function upsertCart(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id: userId } = req.user;
            const { productId, qty } = req.body;
            const [user, product] = yield Promise.all([
                client_1.prisma.user.findFirst({ where: { id: userId, deletedAt: null } }),
                client_1.prisma.product.findFirst({ where: { id: productId, deletedAt: null } }),
            ]);
            if (user === null) {
                throw (0, error_1.appError)("User not Found", 404);
            }
            if (product === null) {
                throw (0, error_1.appError)("Product not Found", 404);
            }
            const existingCart = yield client_1.prisma.cart.findFirst({
                where: { userId, productId },
            });
            let cart;
            if (existingCart) {
                const newQty = existingCart.qty + qty;
                if (newQty <= 0) {
                    yield client_1.prisma.cart.delete({ where: { id: existingCart.id } });
                    return res.status(200).json({
                        status: "Success",
                        message: `Cart [${existingCart.id}] removed (qty <= 0)`,
                    });
                }
                cart = yield client_1.prisma.cart.update({
                    where: { id: existingCart.id },
                    data: {
                        qty: newQty,
                        total: Number(product.price) * newQty,
                    },
                });
            }
            else {
                cart = yield client_1.prisma.cart.create({
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
        }
        catch (err) {
            next(err);
        }
    });
}
function updateCart(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { qty } = req.body;
            const existingCart = yield client_1.prisma.cart.findUnique({
                where: { id },
                include: { product: true },
            });
            if (existingCart === null) {
                throw (0, error_1.appError)("Cart item not found!", 404);
            }
            if (qty <= 0) {
                yield client_1.prisma.cart.delete({ where: { id } });
                return res.status(200).json({
                    status: "Success",
                    message: `Cart item [${id}] removed (qty <= 0)`,
                });
            }
            const updatedCart = yield client_1.prisma.cart.update({
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
        }
        catch (err) {
            next(err);
        }
    });
}
function deleteCart(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const cart = yield client_1.prisma.cart.delete({
                where: { id },
            });
            res.status(200).json({
                status: "Success",
                message: `Delete order [${cart.id}] success!`,
                data: cart,
            });
        }
        catch (err) {
            next(err);
        }
    });
}
