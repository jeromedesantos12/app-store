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
import {
  CheckIcon,
  ChevronsUpDownIcon,
  RotateCcw,
  SquarePen,
  Trash2,
} from "lucide-react";
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
import type { SupplierType } from "@/types/supplier";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/lib/schemas";
import { z } from "zod";
import toast from "react-hot-toast";
import Loading from "@/components/molecules/Loading";
import Error from "@/components/molecules/Error";

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
  suppliers,
  isLoad,
  isErr,
  fetchProducts,
  isLoadSuppliers,
  isErrSuppliers,
}: {
  products: ProductType[];
  suppliers: SupplierType[];
  isLoad: boolean;
  isErr: string | null;
  fetchProducts: () => Promise<void>;
  isLoadSuppliers: boolean;
  isErrSuppliers: string | null;
}) {
  const [isLoadAdd, setIsLoadAdd] = useState<boolean>(false);
  const [isLoadUpdate, setIsLoadUpdate] = useState<string | null>(null);
  const [isLoadRestore, setIsLoadRestore] = useState<string | null>(null);
  const [isLoadDelete, setIsLoadDelete] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [openSupplier, setOpenSupplier] = useState(false);
  const [openUnit, setOpenUnit] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      supplierId: "",
      category: "",
      description: "",
      price: 0,
      stock: 0,
      reorder: 0,
      unit: "",
      warehouse: "",
    },
  });

  function onSubmit(values: z.infer<typeof productSchema>) {
    if (editingProduct) {
      handleUpdate(values);
    } else {
      handleAdd(values);
    }
  }

  function handleAdd(values: z.infer<typeof productSchema>) {
    setIsLoadAdd(true);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("supplierId", values.supplierId);
    formData.append("category", values.category);
    formData.append("description", values.description);
    formData.append("price", values.price.toString());
    formData.append("stock", values.stock.toString());
    formData.append("reorder", values.reorder.toString());
    formData.append("unit", values.unit);
    formData.append("warehouse", values.warehouse);
    if (values.image) {
      formData.append("image", values.image[0]);
    }
    setTimeout(async () => {
      try {
        await api.post("/product", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Product added successfully!");
      } catch (err: unknown) {
        toast.error(extractAxiosError(err));
      } finally {
        setEditingProduct(null);
        reset({
          name: "",
          supplierId: "",
          category: "",
          description: "",
          price: 0,
          stock: 0,
          reorder: 0,
          unit: "",
          warehouse: "",
        });
        setIsLoadAdd(false);
        fetchProducts();
      }
    }, 500);
  }

  function handleUpdate(values: z.infer<typeof productSchema>) {
    if (!editingProduct) return;
    setIsLoadUpdate(editingProduct.id);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("supplierId", values.supplierId);
    formData.append("category", values.category);
    formData.append("description", values.description);
    formData.append("price", values.price.toString());
    formData.append("stock", values.stock.toString());
    formData.append("reorder", values.reorder.toString());
    formData.append("unit", values.unit);
    formData.append("warehouse", values.warehouse);
    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    }
    setTimeout(async () => {
      try {
        await api.put(`/product/${editingProduct.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully!");
      } catch (err: unknown) {
        toast.error(extractAxiosError(err));
      } finally {
        setEditingProduct(null);
        reset({
          name: "",
          supplierId: "",
          category: "",
          description: "",
          price: 0,
          stock: 0,
          reorder: 0,
          unit: "",
          warehouse: "",
        });
        setIsLoadUpdate(null);
        fetchProducts();
      }
    }, 500);
  }

  function handleEditClick(product: ProductType) {
    setEditingProduct(product);
    reset(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id: string) {
    setIsLoadDelete(id);
    setTimeout(async () => {
      try {
        await api.delete(`/product/${id}`);
        toast.success("Product deleted successfully!");
      } catch (err: unknown) {
        toast.error(extractAxiosError(err));
      } finally {
        setIsLoadDelete(null);
        fetchProducts();
      }
    }, 500);
  }

  function handleRestore(id: string) {
    setIsLoadRestore(id);
    setTimeout(async () => {
      try {
        await api.patch(`/product/${id}/restore`);
        toast.success("Product restored successfully!");
      } catch (err: unknown) {
        toast.error(extractAxiosError(err));
      } finally {
        setIsLoadRestore(null);
        fetchProducts();
      }
    }, 500);
  }

  function handleCancelEdit() {
    setEditingProduct(null);
    reset({
      name: "",
      supplierId: "",
      category: "",
      description: "",
      price: 0,
      stock: 0,
      reorder: 0,
      unit: "",
      warehouse: "",
    });
  }

  return (
    <div className="flex flex-col md:flex-row gap-10 w-full justify-center">
      <div className="w-full md:max-w-2xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoad ? (
              <Loading />
            ) : isErr ? (
              <Error error={isErr} />
            ) : products.length > 0 ? (
              products.map((product) => {
                const blobURL: string = import.meta.env.VITE_BLOB_URL;
                const imageUrl = `${blobURL}/product/${product.image}`;
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
                        {isLoadRestore === product.id ? (
                          <ButtonLoading className="w-9 h-9" />
                        ) : (
                          product.deletedAt && (
                            <Button
                              variant="secondary"
                              size="icon"
                              className="cursor-pointer h-9 w-9"
                              onClick={() => handleRestore(product.id)}
                            >
                              <RotateCcw />
                            </Button>
                          )
                        )}
                        {isLoadUpdate === product.id ? (
                          <ButtonLoading className="w-9 h-9" />
                        ) : (
                          product.deletedAt === null && (
                            <Button
                              size="icon"
                              className="cursor-pointer bg-cyan-500 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-500 text-white h-9 w-9"
                              onClick={() => handleEditClick(product)}
                            >
                              <SquarePen />
                            </Button>
                          )
                        )}
                        {isLoadDelete === product.id ? (
                          <ButtonLoading className="w-9 h-9" />
                        ) : (
                          product.deletedAt === null && (
                            <Button
                              variant="destructive"
                              size="icon"
                              className="cursor-pointer h-9 w-9"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 />
                            </Button>
                          )
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
      <Card className="bg-white dark:bg-zinc-900 flex flex-col gap-5 w-full md:max-w-md">
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
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
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
                {...register("image")}
              />
              {errors.image && (
                <p className="text-destructive">
                  {errors.image.message as string}
                </p>
              )}
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
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-destructive">
                    {errors.name.message as string}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Label
                  htmlFor="category"
                  className="text-cyan-700 dark:text-zinc-300"
                >
                  Category
                </Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full rounded-lg justify-between"
                        >
                          {field.value
                            ? categories.find(
                                (cat) => cat.category === field.value
                              )?.label
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
                                    field.onChange(currentcategory);
                                    setOpen(false);
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === cat.category
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
                  )}
                />
                {errors.category && (
                  <p className="text-destructive">
                    {errors.category.message as string}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label
                htmlFor="supplierId"
                className="text-cyan-700 dark:text-zinc-300"
              >
                Supplier
              </Label>
              <Controller
                control={control}
                name="supplierId"
                render={({ field }) => (
                  <Popover open={openSupplier} onOpenChange={setOpenSupplier}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openSupplier}
                        className="w-full rounded-lg justify-between"
                        disabled={isLoadSuppliers || isErrSuppliers !== null}
                      >
                        {isLoadSuppliers
                          ? "Loading suppliers..."
                          : isErrSuppliers
                          ? "Error loading suppliers"
                          : field.value
                          ? suppliers.find((sup) => sup.id === field.value)
                              ?.name
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
                                  field.onChange(currentValue);
                                  setOpenSupplier(false);
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === sup.id
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
                )}
              />
              {isErrSuppliers && (
                <p className="text-sm text-destructive">{isErrSuppliers}</p>
              )}
              {errors.supplierId && (
                <p className="text-destructive">
                  {errors.supplierId.message as string}
                </p>
              )}
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
                {...register("description")}
              />
              {errors.description && (
                <p className="text-destructive">
                  {errors.description.message as string}
                </p>
              )}
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
                  {...register("reorder", { valueAsNumber: true })}
                />
                {errors.reorder && (
                  <p className="text-destructive">
                    {errors.reorder.message as string}
                  </p>
                )}
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
                  {...register("stock", { valueAsNumber: true })}
                />
                {errors.stock && (
                  <p className="text-destructive">
                    {errors.stock.message as string}
                  </p>
                )}
              </div>
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
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-destructive">
                    {errors.price.message as string}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Label
                  htmlFor="unit"
                  className="text-cyan-700 dark:text-zinc-300"
                >
                  Unit
                </Label>
                <Controller
                  control={control}
                  name="unit"
                  render={({ field }) => (
                    <Popover open={openUnit} onOpenChange={setOpenUnit}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openUnit}
                          className="w-full rounded-lg justify-between"
                        >
                          {field.value
                            ? units.find((u) => u.value === field.value)?.label
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
                                    field.onChange(currentValue);
                                    setOpenUnit(false);
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === u.value
                                        ? "opacity-100"
                                        : "opacity-0"
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
                  )}
                />
                {errors.unit && (
                  <p className="text-destructive">
                    {errors.unit.message as string}
                  </p>
                )}
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
                {...register("warehouse")}
              />
              {errors.warehouse && (
                <p className="text-destructive">
                  {errors.warehouse.message as string}
                </p>
              )}
            </div>
            <CardAction className="w-full flex gap-2 mt-5">
              {isLoadAdd ||
              (editingProduct && isLoadUpdate === editingProduct.id) ? (
                <ButtonLoading className="flex-1" />
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
