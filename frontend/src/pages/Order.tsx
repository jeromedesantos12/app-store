import type { OrderType } from "@/types/order";
import { api, extractAxiosError } from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Loading from "@/components/molecules/Loading";
import Error from "@/components/molecules/Error";
import Empty from "@/components/molecules/Empty";
import { useState } from "react";
import ButtonLoading from "@/components/molecules/ButtonLoading";
import ButtonError from "@/components/molecules/ButtonError";

function Order({
  orders,
  isLoad,
  isErr,
  fetchProducts,
  fetchCarts,
  fetchOrders,
}: {
  orders: OrderType[];
  isLoad: boolean;
  isErr: string | null;
  fetchProducts: () => Promise<void>;
  fetchCarts: () => Promise<void>;
  fetchOrders: () => Promise<void>;
}) {
  const [isLoadCancel, setIsLoadCancel] = useState<string | null>(null);
  const [isErrCancel, setIsErrCancel] = useState<string | null>(null);

  async function handleCancel(id: string) {
    setIsLoadCancel(id);
    setIsErrCancel(null);
    setTimeout(async () => {
      try {
        await api.delete(`/order/${id}/status`);
      } catch (err: unknown) {
        setIsErrCancel(extractAxiosError(err));
      } finally {
        setIsLoadCancel(null);
        fetchProducts();
        fetchCarts();
        fetchOrders();
      }
    }, 500);
  }

  return (
    <div className="w-full">
      {isLoad ? (
        <Loading />
      ) : isErr ? (
        <Error error={isErr} />
      ) : orders.length === 0 ? (
        <div className="flex justify-center">
          <Empty modelName={"orders"} />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const baseURL: string = import.meta.env.VITE_BASE_URL;
              const imageUrl = `${baseURL}/uploads/product/${order.product.image}`;
              return (
                <TableRow key={order.id}>
                  <TableCell className="flex items-center gap-4">
                    <img
                      src={imageUrl}
                      alt={order.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <span>{order.product.name}</span>
                  </TableCell>
                  <TableCell>{order.qty}</TableCell>
                  <TableCell>{order.product.price}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    {order.status === "pending" &&
                      (isLoadCancel === order.id ? (
                        <ButtonLoading />
                      ) : isErrCancel === order.id ? (
                        <ButtonError />
                      ) : (
                        <Button
                          variant="destructive"
                          className="cursor-pointer"
                          onClick={() => handleCancel(order.id)}
                        >
                          Cancel
                        </Button>
                      ))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Order;
