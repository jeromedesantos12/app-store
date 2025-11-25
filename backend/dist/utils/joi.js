"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSchema = exports.cartUpdateSchema = exports.cartSchema = exports.productSchema = exports.supplierSchema = exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userSchema = joi_1.default.object({
    profile: joi_1.default.string().allow(""),
    username: joi_1.default.string().min(3).max(50).required(),
    name: joi_1.default.string().min(3).max(100).required(),
    email: joi_1.default.string().email().min(10).max(255).required(),
    address: joi_1.default.string().min(0).max(255).required(),
    password: joi_1.default.string().min(10).max(255).required(),
});
exports.supplierSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).max(100).required(),
    phone: joi_1.default.string().min(3).max(20).required(),
    email: joi_1.default.string().email().min(10).max(255).required(),
    address: joi_1.default.string().min(0).max(255).required(),
});
exports.productSchema = joi_1.default.object({
    supplierId: joi_1.default.string().min(0).max(255).required(),
    image: joi_1.default.string().allow(""),
    name: joi_1.default.string().min(3).max(100).required(),
    category: joi_1.default.string().min(3).max(100).required(),
    description: joi_1.default.string().min(0).max(255).required(),
    price: joi_1.default.number().min(0).max(1000000).required(),
    stock: joi_1.default.number().min(0).max(1000000).required(),
    reorder: joi_1.default.number().min(0).max(1000000).required(),
    unit: joi_1.default.string().min(3).max(50).required(),
    warehouse: joi_1.default.string().min(0).max(255).required(),
});
exports.cartSchema = joi_1.default.object({
    productId: joi_1.default.string().min(0).max(255).required(),
    qty: joi_1.default.number().min(0).max(1000000).required(),
});
exports.cartUpdateSchema = joi_1.default.object({
    qty: joi_1.default.number().min(0).max(1000000).required(),
});
exports.orderSchema = joi_1.default.object({
    status: joi_1.default.string()
        .valid("pending", "paid", "shipped", "completed", "cancelled")
        .required(),
});
