export type ProductType = {
  id: string;
  supplierId: string;
  image: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  reorder: number;
  unit: string;
  warehouse: string;
  deletedAt: string | null;
};
