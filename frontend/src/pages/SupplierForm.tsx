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
import { useEffect, useState } from "react";
import { api, extractAxiosError } from "@/services/api";
import { SquarePen, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ButtonError from "@/components/molecules/ButtonError";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
function SupplierForm() {
  const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isLoad, setIsLoad] = useState(false);
  const [isErr, setIsErr] = useState<string | null>(null);
  const [isLoadUpdate, setIsLoadUpdate] = useState<string | null>(null);
  const [isErrUpdate, setIsErrUpdate] = useState<string | null>(null);
  const [isLoadDelete, setIsLoadDelete] = useState<string | null>(null);
  const [isErrDelete, setIsErrDelete] = useState<string | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<SupplierType | null>(
    null
  );

  async function fetchSuppliers() {
    try {
      const res = await api.get("/supplier");
      setSuppliers(res.data.data);
    } catch (error) {
      console.error("Failed to fetch suppliers", error);
    }
  }

  useEffect(() => {
    fetchSuppliers();
  }, []);

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoad(true);
    const payload = { name, phone, email, address };
    setTimeout(async () => {
      setIsLoad(true);
      setIsErr(null);
      try {
        await api.post("/supplier", payload);
        handleCancelEdit();
      } catch (err: unknown) {
        setIsErr(extractAxiosError(err));
      } finally {
        setIsLoad(false);
        fetchSuppliers();
      }
    }, 500);
  }

  function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingSupplier) return;
    setIsLoadUpdate(editingSupplier.id);
    setIsErrUpdate(null);
    const payload = { name, phone, email, address };
    setTimeout(async () => {
      try {
        await api.put(`/supplier/${editingSupplier.id}`, payload);
        handleCancelEdit();
      } catch (err: unknown) {
        setIsErrUpdate(extractAxiosError(err));
      } finally {
        setIsLoadUpdate(null);
        fetchSuppliers();
      }
    }, 500);
  }

  function handleEditClick(supplier: SupplierType) {
    setEditingSupplier(supplier);
    setName(supplier.name);
    setPhone(supplier.phone);
    setEmail(supplier.email);
    setAddress(supplier.address);
    setIsErr(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id: string) {
    setIsLoadDelete(id);
    setIsErrDelete(null);
    setTimeout(async () => {
      try {
        await api.delete(`/supplier/${id}`);
      } catch (err: unknown) {
        setIsErrDelete(extractAxiosError(err));
      } finally {
        setIsLoadDelete(null);
        fetchSuppliers();
      }
    }, 500);
  }

  function handleCancelEdit() {
    setEditingSupplier(null);
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setIsErr(null);
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
            {suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      {isLoadUpdate === supplier.id ? (
                        <ButtonLoading />
                      ) : isErrUpdate === supplier.id ? (
                        <ButtonError />
                      ) : (
                        <Button
                          size="icon"
                          className="cursor-pointer bg-cyan-500 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-500 text-white h-9 w-9"
                          onClick={() => handleEditClick(supplier)}
                        >
                          <SquarePen />
                        </Button>
                      )}
                      {isLoadDelete === supplier.id ? (
                        <ButtonLoading />
                      ) : isErrDelete === supplier.id ? (
                        <ButtonError />
                      ) : (
                        <Button
                          variant="destructive"
                          size="icon"
                          className="cursor-pointer h-9 w-9"
                          onClick={() => handleDelete(supplier.id)}
                        >
                          <Trash2 />
                        </Button>
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
            action="submit"
            className="flex flex-col gap-5"
            onSubmit={editingSupplier ? handleUpdate : handleAdd}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
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
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            {isErr && <p className="text-destructive w-full">{isErr}</p>}
            <CardAction className="w-full flex gap-2 mt-5">
              {isLoad ||
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
