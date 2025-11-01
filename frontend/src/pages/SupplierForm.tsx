import type { SupplierType } from "@/types/supplier";
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
import { RotateCcw, SquarePen, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supplierSchema } from "@/lib/schemas";
import { z } from "zod";
import toast from "react-hot-toast";
import Loading from "@/components/molecules/Loading";
import Error from "@/components/molecules/Error";

function SupplierForm({
  suppliers,
  isLoad,
  isErr,
  fetchSuppliers,
}: {
  suppliers: SupplierType[];
  isLoad: boolean;
  isErr: string | null;
  fetchSuppliers: () => Promise<void>;
}) {
  const [isLoadAdd, setIsLoadAdd] = useState<boolean>(false);
  const [isLoadUpdate, setIsLoadUpdate] = useState<string | null>(null);
  const [isLoadRestore, setIsLoadRestore] = useState<string | null>(null);
  const [isLoadDelete, setIsLoadDelete] = useState<string | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<SupplierType | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof supplierSchema>>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  function onSubmit(values: z.infer<typeof supplierSchema>) {
    if (editingSupplier) {
      handleUpdate(values);
    } else {
      handleAdd(values);
    }
  }

  function handleAdd(values: z.infer<typeof supplierSchema>) {
    setIsLoadAdd(true);
    setTimeout(async () => {
      try {
        await api.post("/supplier", values);
        toast.success("Supplier added successfully!");
      } catch (err: unknown) {
        toast.error(extractAxiosError(err));
      } finally {
        handleCancelEdit();
        setIsLoadAdd(false);
        fetchSuppliers();
      }
    }, 500);
  }

  function handleUpdate(values: z.infer<typeof supplierSchema>) {
    if (!editingSupplier) return;
    setIsLoadUpdate(editingSupplier.id);
    setTimeout(async () => {
      try {
        await api.put(`/supplier/${editingSupplier.id}`, values);
        toast.success("Supplier updated successfully!");
      } catch (err: unknown) {
        toast.error(extractAxiosError(err));
      } finally {
        handleCancelEdit();
        setIsLoadUpdate(null);
        fetchSuppliers();
      }
    }, 500);
  }

  function handleEditClick(supplier: SupplierType) {
    setEditingSupplier(supplier);
    reset(supplier);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id: string) {
    setIsLoadDelete(id);
    setTimeout(async () => {
      try {
        await api.delete(`/supplier/${id}`);
        toast.success("Supplier deleted successfully!");
      } catch (err: unknown) {
        toast.error(extractAxiosError(err));
      } finally {
        setIsLoadDelete(null);
        fetchSuppliers();
      }
    }, 500);
  }

  function handleRestore(id: string) {
    setIsLoadRestore(id);
    setTimeout(async () => {
      try {
        await api.patch(`/supplier/${id}/restore`);
        toast.success("Supplier restored successfully!");
      } catch (err: unknown) {
        toast.error(extractAxiosError(err));
      } finally {
        setIsLoadRestore(null);
        fetchSuppliers();
      }
    }, 500);
  }

  function handleCancelEdit() {
    setEditingSupplier(null);
    reset();
  }

  return (
    <div className="flex flex-col md:flex-row gap-10 w-full justify-center">
      <div className="w-full md:max-w-2xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-fit">Phone</TableHead>
              <TableHead className="text-right w-fit">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoad ? (
              <Loading />
            ) : isErr ? (
              <Error error={isErr} />
            ) : suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      {isLoadRestore === supplier.id ? (
                        <ButtonLoading className="w-9 h-9" />
                      ) : (
                        supplier.deletedAt && (
                          <Button
                            variant="secondary"
                            size="icon"
                            className="cursor-pointer h-9 w-9"
                            onClick={() => handleRestore(supplier.id)}
                          >
                            <RotateCcw />
                          </Button>
                        )
                      )}
                      {isLoadUpdate === supplier.id ? (
                        <ButtonLoading />
                      ) : (
                        supplier.deletedAt === null && (
                          <Button
                            size="icon"
                            className="cursor-pointer bg-cyan-500 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-500 text-white h-9 w-9"
                            onClick={() => handleEditClick(supplier)}
                          >
                            <SquarePen />
                          </Button>
                        )
                      )}
                      {isLoadDelete === supplier.id ? (
                        <ButtonLoading />
                      ) : (
                        supplier.deletedAt === null && (
                          <Button
                            variant="destructive"
                            size="icon"
                            className="cursor-pointer h-9 w-9"
                            onClick={() => handleDelete(supplier.id)}
                          >
                            <Trash2 />
                          </Button>
                        )
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No suppliers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Card className="bg-white dark:bg-zinc-900 flex flex-col gap-5 w-full md:max-w-md">
        <CardHeader className="flex flex-col gap-2 mb-5 items-center">
          <CardTitle className="text-cyan-700 font-black text-2xl dark:text-zinc-300">
            Supplier Form
          </CardTitle>
          <CardDescription>
            Hello admin, feel free to add more suppliers!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
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
                {...register("name")}
              />
              {errors.name && (
                <p className="text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="phone"
                className="text-cyan-700 dark:text-zinc-300"
              >
                Phone
              </Label>
              <Input
                className="rounded-lg"
                type="text"
                id="phone"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-destructive">{errors.phone.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="email"
                className="text-cyan-700 dark:text-zinc-300"
              >
                Email
              </Label>
              <Input
                className="rounded-lg"
                type="email"
                id="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="address"
                className="text-cyan-700 dark:text-zinc-300"
              >
                Address
              </Label>
              <Textarea
                className="rounded-2xl resize-none"
                id="address"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-destructive">{errors.address.message}</p>
              )}
            </div>
            <CardAction className="w-full flex gap-2 mt-5">
              {isLoadAdd ||
              (editingSupplier && isLoadUpdate === editingSupplier.id) ? (
                <ButtonLoading />
              ) : (
                <>
                  {editingSupplier && (
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
                      editingSupplier ? "w-full md:w-auto flex-1" : "w-full"
                    )}
                  >
                    {editingSupplier ? "Update Supplier" : "Add Supplier"}
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

export default SupplierForm;
