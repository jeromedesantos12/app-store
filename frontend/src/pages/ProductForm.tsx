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
import { useEffect, useState } from "react";
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
import type { SupplierType } from "@/types/supplier";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const categories = [
  {
    category: "cosplay",
    label: "Cosplay",
  },
  {
    category: "jaket",
    label: "Jaket",
  },
  {
    category: "kaos",
    label: "Kaos",
  },
];

const units = [
  { value: "pcs", label: "Pcs" },
  { value: "box", label: "Box" },
  { value: "set", label: "Set" },
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
  const [supplierId, setSupplierId] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [reorder, setReorder] = useState(0);
  const [unit, setUnit] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [isLoad, setIsLoad] = useState(false);
  const [isErr, setIsErr] = useState<string | null>(null);
  const [isLoadUpdate, setIsLoadUpdate] = useState<string | null>(null);
  const [isErrUpdate, setIsErrUpdate] = useState<string | null>(null);
  const [isLoadDelete, setIsLoadDelete] = useState<string | null>(null);
  const [isErrDelete, setIsErrDelete] = useState<string | null>(null);

  const [editingProduct, setEditingProduct] = useState<ProductType | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [openSupplier, setOpenSupplier] = useState(false);
  const [openUnit, setOpenUnit] = useState(false);
  const [suppliers, setSuppliers] = useState<SupplierType[]>([]);

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const res = await api.get("/supplier");
        setSuppliers(res.data.data);
      } catch (error) {
        console.error("Failed to fetch suppliers", error);
      }
    }
    fetchSuppliers();
  }, []);

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoad(true);
    const formData = new FormData();
    if (image) {
      formData.append("image", image);
    }
    formData.append("name", name);
    formData.append("supplierId", supplierId);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("stock", stock.toString());
    formData.append("reorder", reorder.toString());
    formData.append("unit", unit);
    formData.append("warehouse", warehouse || "");
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

  function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingProduct) return;

    setIsLoadUpdate(editingProduct.id);
    setIsErrUpdate(null);

    const formData = new FormData();
    if (image) {
      formData.append("image", image);
    }
    formData.append("name", name);
    formData.append("supplierId", supplierId);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("stock", stock.toString());
    formData.append("reorder", reorder.toString());
    formData.append("unit", unit);
    formData.append("warehouse", warehouse || "");

    setTimeout(async () => {
      try {
        await api.put(`/product/${editingProduct.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        handleCancelEdit();
      } catch (err: unknown) {
        setIsErrUpdate(extractAxiosError(err));
      } finally {
        setIsLoadUpdate(null);
        fetchProducts();
        fetchFilterProducts();
      }
    }, 500);
  }

  function handleEditClick(product: ProductType) {
    setEditingProduct(product);
    setName(product.name);
    setSupplierId(product.supplierId);
    setCategory(product.category);
    setDescription(product.description);
    setPrice(product.price);
    setStock(product.stock);
    setReorder(product.reorder);
    setUnit(product.unit);
    setWarehouse(product.warehouse || "");
    setImage(null);
    setIsErr(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  function handleCancelEdit() {
    setEditingProduct(null);
    setName("");
    setSupplierId("");
    setCategory("");
    setDescription("");
    setPrice(0);
    setStock(0);
    setReorder(0);
    setUnit("");
    setWarehouse("");
    setImage(null);
    setIsErr(null);
  }

  return (
    <div className=" flex gap-10 flex-wrap w-full justify-center">
      <div className="flex flex-col gap-2 md:max-w-2xl flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => {
                const baseURL: string = import.meta.env.VITE_BASE_URL;
                const imageUrl = `${baseURL}/uploads/product/${product.image}`;
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={imageUrl}
                        alt={`Image for ${product.name}`}
                        className="object-cover object-center h-10 w-10 rounded-full"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {isLoadUpdate === product.id ? (
                          <ButtonLoading />
                        ) : isErrUpdate === product.id ? (
                          <ButtonError />
                        ) : (
                          <Button
                            size="icon"
                            className="cursor-pointer bg-cyan-500 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-500 text-white h-9 w-9"
                            onClick={() => handleEditClick(product)}
                          >
                            <SquarePen />
                          </Button>
                        )}
                        {isLoadDelete === product.id ? (
                          <ButtonLoading />
                        ) : isErrDelete === product.id ? (
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
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Card className="bg-white dark:bg-zinc-900 flex flex-col gap-5 md:max-w-md flex-1">
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
            onSubmit={editingProduct ? handleUpdate : handleAdd}
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
                required={!editingProduct}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col gap-2 w-full">
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
              <div className="flex flex-col gap-2 w-full">
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
                  <PopoverContent className="w-full p-0">
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
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label
                htmlFor="supplierId"
                className="text-cyan-700 dark:text-zinc-300"
              >
                Supplier
              </Label>
              <Popover open={openSupplier} onOpenChange={setOpenSupplier}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openSupplier}
                    className="w-full rounded-lg justify-between"
                  >
                    {supplierId
                      ? suppliers.find((sup) => sup.id === supplierId)?.name
                      : "Select supplier..."}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search supplier..." />
                    <CommandList>
                      <CommandEmpty>No supplier found.</CommandEmpty>
                      <CommandGroup>
                        {suppliers.map((sup) => (
                          <CommandItem
                            key={sup.id}
                            value={sup.id}
                            onSelect={(currentValue) => {
                              setSupplierId(
                                currentValue === supplierId ? "" : currentValue
                              );
                              setOpenSupplier(false);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                supplierId === sup.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {sup.name}
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
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col gap-2 w-full">
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
              <div className="flex flex-col gap-2 w-full">
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
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col gap-2 w-full">
                <Label
                  htmlFor="reorder"
                  className="text-cyan-700 dark:text-zinc-300"
                >
                  Reorder Level
                </Label>
                <Input
                  className="rounded-lg"
                  type="number"
                  id="reorder"
                  value={reorder}
                  onChange={(e) => setReorder(parseInt(e.target.value))}
                  required
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Label
                  htmlFor="unit"
                  className="text-cyan-700 dark:text-zinc-300"
                >
                  Unit
                </Label>
                <Popover open={openUnit} onOpenChange={setOpenUnit}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openUnit}
                      className="w-full rounded-lg justify-between"
                    >
                      {unit
                        ? units.find((u) => u.value === unit)?.label
                        : "Select unit..."}
                      <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search unit..." />
                      <CommandList>
                        <CommandEmpty>No unit found.</CommandEmpty>
                        <CommandGroup>
                          {units.map((u) => (
                            <CommandItem
                              key={u.value}
                              value={u.value}
                              onSelect={(currentValue) => {
                                setUnit(
                                  currentValue === unit ? "" : currentValue
                                );
                                setOpenUnit(false);
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  unit === u.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {u.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label
                htmlFor="warehouse"
                className="text-cyan-700 dark:text-zinc-300"
              >
                Warehouse
              </Label>
              <Input
                className="rounded-lg"
                type="text"
                id="warehouse"
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
              />
            </div>
            {isErr && <p className="text-destructive w-full">{isErr}</p>}
            <CardAction className="w-full flex gap-2 mt-5">
              {isLoad ||
              (editingProduct && isLoadUpdate === editingProduct.id) ? (
                <ButtonLoading />
              ) : (
                <>
                  {editingProduct && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full rounded-lg md:w-auto flex-1"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="default"
                    className={cn(
                      "rounded-lg bg-cyan-500 hover:bg-cyan-700 font-bold cursor-pointer dark:bg-cyan-700 dark:hover:bg-cyan-500 dark:text-zinc-300",
                      editingProduct ? "w-full md:w-auto flex-1" : "w-full"
                    )}
                  >
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                </>
              )}
            </CardAction>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProductForm;
