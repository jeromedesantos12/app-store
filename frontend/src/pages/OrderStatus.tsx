import type { OrderType } from "@/types/order";
import { useState } from "react";
import { api, extractAxiosError } from "@/services/api";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Loading from "@/components/molecules/Loading";
import Error from "@/components/molecules/Error";
import Empty from "@/components/molecules/Empty";
import ButtonLoading from "@/components/molecules/ButtonLoading";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const statuses = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "shipped", label: "Shipped" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function OrderStatus({
  orders,
  isLoad,
  isErr,
  fetchOrdersAll,
}: {
  orders: OrderType[];
  isLoad: boolean;
  isErr: string | null;
  fetchOrdersAll: () => Promise<void>;
}) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  async function handleStatusChange(orderId: string, status: string) {
    setUpdatingId(orderId);
    try {
      await api.patch(`/order/${orderId}/status`, { status });
      toast.success(`Order status updated to ${status}`);
      fetchOrdersAll();
    } catch (err) {
      toast.error(extractAxiosError(err));
    } finally {
      setUpdatingId(null);
      setOpenPopover(null);
    }
  }

  if (isLoad) return <Loading />;
  if (isErr) return <Error error={isErr} />;

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4 text-center text-cyan-700 dark:text-cyan-500">
        Order Status Management
      </h1>
      {orders.length === 0 ? (
        <Empty modelName="orders" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Change Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono">
                  {order.id.substring(0, 8)}...
                </TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>{order.product.name}</TableCell>
                <TableCell>${order.total}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
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
                      order.status === "cancelled" && "bg-red-200 text-red-800"
                    )}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {updatingId === order.id ? (
                    <ButtonLoading className="w-full" />
                  ) : (
                    <Popover
                      open={openPopover === order.id}
                      onOpenChange={(isOpen) =>
                        setOpenPopover(isOpen ? order.id : null)
                      }
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {statuses.find((s) => s.value === order.status)
                            ?.label || "Select Status"}
                          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-0">
                        <Command>
                          <CommandList>
                            <CommandGroup>
                              {statuses.map((status) => (
                                <CommandItem
                                  key={status.value}
                                  onSelect={() =>
                                    handleStatusChange(order.id, status.value)
                                  }
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      order.status === status.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {status.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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

export default OrderStatus;
