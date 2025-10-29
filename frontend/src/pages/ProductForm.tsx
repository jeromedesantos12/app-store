import type { ProductType } from "@/types/product";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ButtonLoading from "@/components/molecules/ButtonLoading";
import { useState } from "react";
import { api, extractAxiosError } from "@/services/api";
import { CheckIcon, ChevronsUpDownIcon, SquarePen, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import ButtonError from "@/components/molecules/ButtonError";

const categories = [
  {
    category: "backrooms",
    label: "Backrooms",
  },
  {
    category: "scp",
    label: "SCP",
  },
  {
    category: "fnaf",
    label: "FNAF",
  },
];

function ProductForm({
  products,
  fetchProducts,
  fetchFilterProducts,
}: {
  products: ProductType[];
  fetchProducts: () => Promise<void>;
  fetchFilterProducts: () => Promise<void>;
}) {
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [isLoad, setIsLoad] = useState(false);
  const [isErr, setIsErr] = useState<string | null>(null);
  const [isLoadUpdate, setIsLoadUpdate] = useState<string | null>(null);
  const [isErrUpdate, setIsErrUpdate] = useState<string | null>(null);
  const [isLoadDelete, setIsLoadDelete] = useState<string | null>(null);
  const [isErrDelete, setIsErrDelete] = useState<string | null>(null);

  const [open, setOpen] = useState(false);

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoad(true);
    const formData = new FormData();
    if (image) {
      formData.append("image", image);
    }
    formData.append("name", name);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("stock", stock.toString());
    setTimeout(async () => {
      setIsLoad(true);
      setIsErr(null);
      try {
        await api.post("/product", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Header ini penting!
          },
        });
      } catch (err: unknown) {
        setIsErr(extractAxiosError(err));
      } finally {
        setIsLoad(false);
        fetchProducts();
        fetchFilterProducts();
      }
    }, 500);
  }

  function handleDelete(id: string) {
    setIsLoadDelete(id);
    setIsErrDelete(null);
    setTimeout(async () => {
      try {
        await api.delete(`/product/${id}`);
      } catch (err: unknown) {
        setIsErrDelete(extractAxiosError(err));
      } finally {
        setIsLoadDelete(null);
        fetchProducts();
        fetchFilterProducts();
      }
    }, 500);
  }

  return (
    <div className=" flex gap-10 flex-col flex-wrap w-full md:flex-row justify-center">
      <Card className="bg-white dark:bg-zinc-900 max-w-110 flex flex-col gap-5 md:max-w-md w-full">
        <CardHeader className="flex flex-col gap-2 mb-5 items-center">
          <CardTitle className="text-cyan-700 font-black text-2xl dark:text-zinc-300">
            Product Form
          </CardTitle>
          <CardDescription>
            Hello admin, feel free to add more product!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <form
            action="submit"
            className="flex flex-col gap-5"
            onSubmit={handleAdd}
          >
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="image"
                className="text-cyan-700 dark:text-zinc-300"
              >
                Image
              </Label>
              <Input
                className="rounded-lg"
                type="file"
                id="image"
                onChange={(e) => e.target.files && setImage(e.target.files[0])}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="name"
                className="text-cyan-700 dark:text-zinc-300"
              >
                Name
              </Label>
              <Input
                className="rounded-lg"
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="category"
                className="text-cyan-700 dark:text-zinc-300"
              >
                Category
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full rounded-lg justify-between"
                  >
                    {category
                      ? categories.find((cat) => cat.category === category)
                          ?.label
                      : "Select category..."}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-sm p-0">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {categories.map((cat) => (
                          <CommandItem
                            key={cat.category}
                            value={cat.category}
                            onSelect={(currentcategory) => {
                              setCategory(
                                currentcategory === category
                                  ? ""
                                  : currentcategory
                              );
                              setOpen(false);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                category === cat.category
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {cat.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="description"
                className="text-cyan-700 dark:text-zinc-300"
              >
                Description
              </Label>
              <Textarea
                className="rounded-2xl resize-none"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="price"
                className="text-cyan-700 dark:text-zinc-300"
              >
                Price
              </Label>
              <Input
                className="rounded-lg"
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value))}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="stock"
                className="text-cyan-700 dark:text-zinc-300"
              >
                Stock
              </Label>
              <Input
                className="rounded-lg"
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value))}
                required
              />
            </div>
            {isErr && <p className="text-destructive w-full">{isErr}</p>}
            <CardAction className="w-full flex flex-col gap-2 mt-5">
              {isLoad ? (
                <ButtonLoading />
              ) : (
                <Button
                  type="submit"
                  variant="default"
                  className="w-full rounded-lg bg-cyan-500 hover:bg-cyan-700 font-bold cursor-pointer dark:bg-cyan-700 dark:hover:bg-cyan-500 dark:text-zinc-300"
                >
                  Add Product
                </Button>
              )}
            </CardAction>
          </form>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-2 w-full md:max-w-70">
        {products.map((product) => {
          const baseURL: string = import.meta.env.VITE_BASE_URL;
          const imageUrl = `${baseURL}/uploads/product/${product.image}`;
          return (
            <div
              key={product.id}
              className="flex border-2 p-5 rounded-2xl items-center justify-between bg-white dark:bg-zinc-900 hover:bg-accent dark:hover:bg-zinc-800 transition duration-300"
            >
              <div className="flex items-center gap-5">
                <img
                  src={imageUrl}
                  alt={`Image for ${product.name}`}
                  className="object-cover object-center h-10 w-10 rounded-full"
                />
                <h1 className="text-cyan-700 dark:text-zinc-300 font-bold">
                  {product.name}
                </h1>
              </div>
              <div className="flex gap-2">
                {isLoadUpdate ? (
                  <ButtonLoading />
                ) : isErrUpdate ? (
                  <ButtonError />
                ) : (
                  <Button
                    size="icon"
                    className="cursor-pointer bg-cyan-500 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-500 text-white h-9 w-9"
                    onClick={() => {
                      //   setEditingCartId(cart.id);
                      //   setEditingQty(cart.qty);
                    }}
                  >
                    <SquarePen />
                  </Button>
                )}
                {isLoadDelete === product.id ? (
                  <ButtonLoading />
                ) : isErrDelete ? (
                  <ButtonError />
                ) : (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="cursor-pointer h-9 w-9"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductForm;
