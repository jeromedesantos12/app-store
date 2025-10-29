import type { ProductType } from "@/types/product";
import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Box, CircleX } from "lucide-react";
import { api, extractAxiosError } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Loading from "@/components/molecules/Loading";
import Error from "@/components/molecules/Error";
import ButtonLoading from "@/components/molecules/ButtonLoading";
import ButtonError from "@/components/molecules/ButtonError";

function ProductDetail({
  products,
  isLoad,
  isErr,
  fetchProducts,
  fetchFilterProducts,
  fetchCarts,
}: {
  products: ProductType[];
  isLoad: boolean;
  isErr: string | null;
  fetchProducts: () => Promise<void>;
  fetchFilterProducts: () => Promise<void>;
  fetchCarts: () => Promise<void>;
}) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product: ProductType | undefined = products.find(
    (product) => product.id == (productId || "")
  );
  const [qty, setQty] = useState(0);
  const [isLoadAdd, setIsLoadAdd] = useState<string | null>(null);
  const [isErrAdd, setIsErrAdd] = useState<string | null>(null);
  const baseURL: string = import.meta.env.VITE_BASE_URL;
  const imageUrl = `${baseURL}/uploads/product/${product?.image}`;
  const userId = useAuth().token?.id;

  function handleAdd(id: string) {
    setIsLoadAdd(id);
    setIsErrAdd(null);
    setTimeout(async () => {
      try {
        await api.post("/order", {
          userId,
          productId: id,
          qty,
        });
      } catch (err: unknown) {
        setIsErrAdd(extractAxiosError(err));
      }
      setQty(0);
      setIsLoadAdd(null);
      fetchProducts();
      fetchFilterProducts();
      fetchCarts();
    }, 500);
  }

  return (
    <div className="w-full min-h-screen fixed flex justify-center top-0 z-20 bg-black/70">
      {isLoad ? (
        <Loading />
      ) : isErr ? (
        <Error error={isErr} />
      ) : product ? (
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="w-3/4 flex flex-row-reverse ml-20">
            <CircleX
              className="size-10 text-cyan-700 dark:text-zinc-300 cursor-pointer"
              onClick={() => {
                setQty(0);
                navigate(`/product`);
              }}
            />
          </div>
          <div className="w-3/4 md:max-w-250 h-150 text-justify flex flex-col gap-5 bg-white dark:bg-zinc-900 shadow-lg py-15 px-10 rounded-2xl overflow-y-auto">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-black text-cyan-700 dark:text-zinc-300">
                {product.name}
              </h1>
              <p className="flex items-center gap-2 text-cyan-700 dark:text-cyan-500">
                <Box /> {product.stock}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2 justify-center items-center dark:text-zinc-300 text-cyan-700">
                <Button
                  variant="ghost"
                  className="font-bold cursor-pointer"
                  onClick={() => setQty((prev) => Math.max(0, prev - 1))}
                >
                  -
                </Button>
                <p className="text-center font-bold">{qty}</p>
                <Button
                  variant="ghost"
                  className="font-bold cursor-pointer"
                  onClick={() =>
                    setQty((prev) => Math.min(prev + 1, product.stock))
                  }
                >
                  +
                </Button>
              </div>
              {isLoadAdd === product.id ? (
                <ButtonLoading />
              ) : isErrAdd ? (
                <ButtonError />
              ) : (
                <Button
                  variant={
                    product.stock === 0 || qty === 0 ? "ghost" : "default"
                  }
                  className={`cursor-pointer font-bold ${
                    product.stock === 0 || qty === 0
                      ? ""
                      : "bg-cyan-500 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-500 text-white"
                  }`}
                  disabled={product.stock === 0 || qty === 0}
                  onClick={() => handleAdd(product.id)}
                >
                  + ADD
                </Button>
              )}
            </div>
            <div className="flex flex-col gap-5 mt-5">
              <img
                src={imageUrl}
                alt={`Image for ${product.name}`}
                className="rounded-2xl max-w-48 h-48 object-cover object-center"
              />
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          </div>
        </div>
      ) : (
        <Navigate to="/product" replace />
      )}
    </div>
  );
}

export default ProductDetail;
