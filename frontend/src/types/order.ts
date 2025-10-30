import type { ProductType } from "./product";

export type OrderType = {
  id: string;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  product: ProductType;
  qty: number;
};
