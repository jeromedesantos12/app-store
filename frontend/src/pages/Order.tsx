import { cn } from "@/lib/utils";
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
import toast from "react-hot-toast";

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

  async function handleCancel(id: string) {
    setIsLoadCancel(id);
    setTimeout(async () => {
      try {
        await api.delete(`/order/${id}/status`);
        toast.success("Order cancelled!");
      } catch (err: unknown) {
        toast.error(extractAxiosError(err));
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
              const blobURL: string = import.meta.env.VITE_BLOB_URL;
              const imageUrl = `${blobURL}/product/${order.product.image}`;
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
                  <TableCell>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-semibold",
                        order.status === "pending" &&
                          "bg-yellow-200 text-yellow-800",
                        order.status === "paid" && "bg-blue-200 text-blue-800",
                        order.status === "shipped" &&
                          "bg-purple-200 text-purple-800",
                        order.status === "completed" &&
                          "bg-green-200 text-green-800",
                        order.status === "cancelled" &&
                          "bg-red-200 text-red-800"
                      )}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {order.status === "pending" &&
                      (isLoadCancel === order.id ? (
                        <ButtonLoading />
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
