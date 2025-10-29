import Joi from "joi";

export const userSchema = Joi.object({
  profile: Joi.string().allow(""),
  username: Joi.string().min(3).max(50).required(),
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().min(10).max(255).required(),
  password: Joi.string().min(10).max(255).required(),
});

export const supplierSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  phone: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().min(10).max(255).required(),
  address: Joi.string().min(0).max(255).required(),
});

export const productSchema = Joi.object({
  supplierId: Joi.string().min(0).max(255).required(),
  image: Joi.string().allow(""),
  name: Joi.string().min(3).max(100).required(),
  category: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(0).max(255).required(),
  price: Joi.number().min(0).max(1000000).required(),
  stock: Joi.number().min(0).max(1000000).required(),
});

export const cartSchema = Joi.object({
  productId: Joi.string().min(0).max(255).required(),
  qty: Joi.number().min(0).max(1000000).required(),
});

export const updateCartSchema = Joi.object({
  qty: Joi.number().min(0).max(1000000).required(),
});

export const orderSchema = Joi.object({
  address: Joi.string().min(0).max(255).required(),
});

export const updateOrderSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "paid", "shipped", "completed", "cancelled")
    .required(),
});
