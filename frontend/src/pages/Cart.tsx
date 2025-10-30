import type { ProductType } from "@/types/product";
import type { CartType } from "@/types/cart";
import { useState } from "react";
import { Save, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loading from "@/components/molecules/Loading";
import Error from "@/components/molecules/Error";
import ButtonLoading from "@/components/molecules/ButtonLoading";
import { api, extractAxiosError } from "@/services/api";
import ButtonError from "@/components/molecules/ButtonError";
import Empty from "@/components/molecules/Empty";

function Cart({
  carts,
  products,
  isLoad,
  isErr,
  fetchCarts,
  fetchOrders,
}: {
  carts: CartType[];
  products: ProductType[];
  isLoad: boolean;
  isErr: string | null;
  fetchCarts: () => Promise<void>;
  fetchOrders: () => Promise<void>;
}) {
  const [editingCartId, setEditingCartId] = useState<string | null>(null);
  const [editingQty, setEditingQty] = useState(1);
  const [isLoadUpdate, setIsLoadUpdate] = useState<string | null>(null);
  const [isErrUpdate, setIsErrUpdate] = useState<string | null>(null);
  const [isLoadDelete, setIsLoadDelete] = useState<string | null>(null);
  const [isErrDelete, setIsErrDelete] = useState<string | null>(null);
  const [isLoadCheckout, setIsLoadCheckout] = useState<boolean | null>(false);
  const [isErrCheckout, setIsErrCheckout] = useState<string | null>(null);

  function handleUpdate(id: string, qty: number) {
    setIsLoadUpdate(id);
    setIsErrUpdate(null);
    setTimeout(async () => {
      try {
        await api.put(`/cart/${id}`, {
          qty,
        });
      } catch (err: unknown) {
        setIsErrUpdate(extractAxiosError(err));
      } finally {
        setEditingQty(0);
        setEditingCartId(null);
        setIsLoadUpdate(null);
        fetchCarts();
        fetchOrders();
      }
    }, 500);
  }

  function handleDelete(id: string) {
    setIsLoadDelete(id);
    setIsErrDelete(null);
    setTimeout(async () => {
      try {
        await api.delete(`/cart/${id}`);
      } catch (err: unknown) {
        setIsErrDelete(extractAxiosError(err));
      } finally {
        setIsLoadDelete(null);
        fetchCarts();
        fetchOrders();
      }
    }, 500);
  }

  function handleCheckout() {
    setIsLoadCheckout(true);
    setIsErrDelete(null);
    setTimeout(async () => {
      try {
        await api.post("/order");
      } catch (err: unknown) {
        setIsErrCheckout(extractAxiosError(err));
      } finally {
        setIsLoadCheckout(false);
        fetchCarts();
        fetchOrders();
      }
    }, 500);
  }

  return (
    <div className="w-full max-w-2xl flex flex-col gap-5">
      {isLoad ? (
        <Loading />
      ) : isErr ? (
        <div className="flex justify-center">
          <Error error={isErr} />
        </div>
      ) : carts.length === 0 ? (
        <div className="flex justify-center">
          <Empty modelName={"carts"} />
        </div>
      ) : (
        carts.map((cart: CartType) => {
          const product = products.find(
            (product) => product.id === cart.productId
          );
          const availableStock = (product?.stock || 0) + cart.qty;
          const baseURL: string = import.meta.env.VITE_BASE_URL;
          const imageUrl = `${baseURL}/uploads/product/${cart.product.image}`;
          return (
            <div
              className="flex flex-wrap md:flex-nowrap gap-5 items-center hover:bg-accent dark:bg-zinc-900 dark:hover:bg-zinc-800 transition duration-300 py-5 rounded-2xl border-2 px-5 justify-between"
              key={cart.productId}
            >
              <img
                src={imageUrl}
                alt={`Image for ${cart.product.name}`}
                className="object-cover object-center h-20 w-20 rounded-2xl"
              />
              <div className="flex flex-col gap-2 flex-grow">
                <h1 className="text-cyan-700 dark:text-zinc-300 font-bold">
                  {cart.product.name}
                </h1>
                {editingCartId === cart.id ? (
                  isLoad ? (
                    <Loading />
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            setEditingQty((prev) => Math.max(0, prev - 1))
                          }
                        >
                          -
                        </Button>
                        <p className="text-center font-bold w-8">
                          {editingQty}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            setEditingQty((prev) =>
                              Math.min(prev + 1, availableStock)
                            )
                          }
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        className="font-bold cursor-pointer"
                        onClick={() => {
                          setEditingCartId(null);
                          setEditingQty(0);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )
                ) : (
                  <p className="text-muted-foreground">Qty. {cart.qty}</p>
                )}
              </div>
              <div className="flex flex-col gap-2 items-end">
                <p className="text-xl font-black text-cyan-700 dark:text-zinc-300">
                  {cart.total} $
                </p>
                <div className="flex gap-2">
                  {editingCartId === cart.id ? (
                    isLoadUpdate === cart.id ? (
                      <ButtonLoading />
                    ) : isErrUpdate ? (
                      <ButtonError />
                    ) : (
                      <Button
                        size="icon"
                        disabled={editingQty === 0}
                        className="cursor-pointer bg-green-500 hover:bg-green-600 text-white font-bold h-9 w-9"
                        onClick={() => handleUpdate(cart.id, editingQty)}
                      >
                        <Save />
                      </Button>
                    )
                  ) : (
                    <Button
                      size="icon"
                      className="cursor-pointer bg-cyan-500 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-500 text-white h-9 w-9"
                      onClick={() => {
                        setEditingCartId(cart.id);
                        setEditingQty(cart.qty);
                      }}
                    >
                      <SquarePen />
                    </Button>
                  )}
                  {isLoadDelete === cart.id ? (
                    <ButtonLoading />
                  ) : isErrDelete ? (
                    <ButtonError />
                  ) : (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="cursor-pointer h-9 w-9"
                      onClick={() => handleDelete(cart.id)}
                    >
                      <Trash2 />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
      {carts.length > 0 &&
        (isLoadCheckout ? (
          <ButtonLoading />
        ) : isErrCheckout ? (
          <ButtonError />
        ) : (
          <Button className="cursor-pointer" onClick={handleCheckout}>
            Checkout
          </Button>
        ))}
    </div>
  );
}

export default Cart;
