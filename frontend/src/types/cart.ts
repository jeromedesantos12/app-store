export type CartType = {
  id: string;
  userId: string;
  productId: string;
  product: { image: string; name: string };
  category: string;
  qty: number;
  total: number;
};
