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

function Order({
  orders,
  isLoad,
  isErr,
  fetchOrders,
}: {
  orders: OrderType[];
  isLoad: boolean;
  isErr: string | null;
  fetchOrders: () => Promise<void>;
}) {
  const baseURL: string = import.meta.env.VITE_BASE_URL;

  async function handleCancel(id: string) {
    try {
      await api.delete(`/order/${id}/status`);
    } catch (err: unknown) {
      console.error(extractAxiosError(err));
    }
    fetchOrders();
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
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="flex items-center gap-4">
                  <img
                    src={`${baseURL}/uploads/product/${order.product.image}`}
                    alt={order.product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <span>{order.product.name}</span>
                </TableCell>
                <TableCell>{order.qty}</TableCell>
                <TableCell>{order.product.price}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  {order.status === "pending" && (
                    <Button
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={() => handleCancel(order.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Order;
