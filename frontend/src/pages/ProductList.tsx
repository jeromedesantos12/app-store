import type { ProductType } from "@/types/product";
import { type Dispatch, type SetStateAction } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Search } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Loading from "@/components/molecules/Loading";
import Error from "@/components/molecules/Error";
import Empty from "@/components/molecules/Empty";

function ProductList({
  search,
  products,
  isLoad,
  isErr,
  setSearch,
}: {
  search: string;
  products: ProductType[];
  isLoad: boolean;
  isErr: string | null;
  setSearch: Dispatch<SetStateAction<string>>;
}) {
  const navigate = useNavigate();

  return (
    <div className="w-full md:max-w-300 flex flex-col gap-10 items-center">
      <div className=" flex gap-2 items-center w-1/2">
        <Search className="text-cyan-700" />
        <Input
          className="rounded-full"
          type="text"
          id="search"
          placeholder="Search products.."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <div className="flex flex-row gap-5 flex-wrap justify-center">
        {isLoad ? (
          <Loading />
        ) : isErr ? (
          <Error error={isErr} />
        ) : products.length === 0 ? (
          <Empty modelName={"product"} />
        ) : (
          products.map((product: ProductType) => {
            const baseURL: string = import.meta.env.VITE_BASE_URL;
            const imageUrl = `${baseURL}/uploads/product/${product.image}`;
            return (
              <Card
                className="w-60 hover:bg-accent transition duration-300"
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <CardContent>
                  <img
                    src={imageUrl}
                    alt={`Image for ${product.name}`}
                    className="object-cover object-center h-50 rounded-2xl"
                  />
                </CardContent>
                <CardHeader>
                  <CardTitle className=" dark:text-zinc-300 text-cyan-700 font-bold">
                    {product.name}
                  </CardTitle>
                  <CardDescription>{product.category}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between gap-5">
                  <CardAction className="text-2xl font-black text-cyan-700 dark:dark:text-cyan-500">
                    $ {product.price}
                  </CardAction>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
      <Outlet />
    </div>
  );
}

export default ProductList;
