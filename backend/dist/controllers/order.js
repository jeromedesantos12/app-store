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
exports.readOrdersAll = readOrdersAll;
exports.readOrders = readOrders;
exports.readOrderById = readOrderById;
exports.createOrder = createOrder;
exports.updateOrder = updateOrder;
exports.deleteOrder = deleteOrder;
const client_1 = require("../connections/client");
const error_1 = require("../utils/error");
function readOrdersAll(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const orders = yield client_1.prisma.order.findMany({
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
                message: "Fetch all orders success!",
                data: orders,
            });
        }
        catch (err) {
            next(err);
        }
    });
}
function readOrders(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id: userId } = req.user;
            const orders = yield client_1.prisma.order.findMany({
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
        }
        catch (err) {
            next(err);
        }
    });
}
function readOrderById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const order = yield client_1.prisma.order.findUnique({
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
        }
        catch (err) {
            next(err);
        }
    });
}
function createOrder(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const cartItems = yield client_1.prisma.cart.findMany({
                where: { userId },
                include: { product: true },
            });
            if (cartItems.length === 0) {
                throw (0, error_1.appError)("Cart is empty!", 400);
            }
            const orders = yield client_1.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const result = [];
                for (const item of cartItems) {
                    if (item.product.stock < item.qty) {
                        throw (0, error_1.appError)(`Insufficient stock for product "${item.product.name}"!`, 400);
                    }
                    const order = yield tx.order.create({
                        data: {
                            userId,
                            productId: item.productId,
                            qty: item.qty,
                            total: item.total,
                            status: "pending",
                        },
                    });
                    yield tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { decrement: item.qty } },
                    });
                    result.push(order);
                }
                yield tx.cart.deleteMany({ where: { userId } });
                return result;
            }));
            const totalAmount = orders.reduce((sum, o) => sum + Number(o.total), 0);
            res.status(201).json({
                status: "Success",
                message: `Checkout completed successfully!`,
                data: { orders, totalAmount },
            });
        }
        catch (err) {
            next(err);
        }
    });
}
function updateOrder(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
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
                throw (0, error_1.appError)(`Invalid status! Valid statuses: ${validStatuses.join(", ")}`, 400);
            }
            const order = yield client_1.prisma.order.update({
                where: { id },
                data: { status },
            });
            res.status(200).json({
                status: "Success",
                message: `Order [${order.id}] status updated to "${status}"!`,
                data: order,
            });
        }
        catch (err) {
            next(err);
        }
    });
}
function deleteOrder(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const order = yield client_1.prisma.order.update({
                where: { id },
                data: { status: "cancelled" },
            });
            res.status(200).json({
                status: "Success",
                message: `Order [${order.id}] status updated to "cancelled"!`,
                data: order,
            });
        }
        catch (err) {
            next(err);
        }
    });
}
