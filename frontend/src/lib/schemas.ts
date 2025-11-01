
import { z } from "zod";

export const supplierSchema = z.object({
  name: z.string().min(3).max(100),
  phone: z.string().min(3).max(20),
  email: z.string().email().min(10).max(255),
  address: z.string().min(0).max(255),
});

export const productSchema = z.object({
  supplierId: z.string().min(1, { message: "Supplier is required" }),
  image: z.any().refine((files) => files?.length >= 1, 'Image is required.'),
  name: z.string().min(3).max(100),
  category: z.string().min(3).max(100),
  description: z.string().min(0).max(255),
  price: z.number().min(0).max(1000000),
  stock: z.number().min(0).max(1000000),
  reorder: z.number().min(0).max(1000000),
  unit: z.string().min(3).max(50),
  warehouse: z.string().min(0).max(255),
});
