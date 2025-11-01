import type { ProductType } from "./product";
import type { UserType } from "./user";

export type OrderType = {
  id: string;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  product: ProductType;
  qty: number;
  total: number;
  createdAt: string;
  user: UserType;
};
