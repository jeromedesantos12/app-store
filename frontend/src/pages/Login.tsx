import { useState } from "react";
import { Link } from "react-router-dom";
import { api, extractAxiosError } from "@/services/api";
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
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(3, "Email or Username must be at least 3 characters")
    .max(100, "Email or Username must be at most 100 characters"),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters")
    .max(255, "Password must be at most 255 characters"),
});

function Login({
  fetchProducts,
  fetchFilterProducts,
  fetchCarts,
  fetchOrders,
}: {
  fetchProducts: () => Promise<void>;
  fetchFilterProducts: () => Promise<void>;
  fetchCarts: () => Promise<void>;
  fetchOrders: () => Promise<void>;
}) {
  const { fetchToken } = useAuth();
  const [isLoadLog, setIsLoadLog] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    setIsLoadLog(true);
    setTimeout(async () => {
      try {
        await api.post("/login", {
          emailOrUsername: data.emailOrUsername,
          password: data.password,
        });
        fetchToken();
      } catch (err: unknown) {
        toast.error(extractAxiosError(err));
      } finally {
        reset();
        setIsLoadLog(false);
        fetchProducts();
        fetchFilterProducts();
        fetchCarts();
        fetchOrders();
        fetchToken();
      }
    }, 500);
  }

  return (
    <div className="flex flex-col">
      <Card className="md:w-100 bg-white dark:bg-zinc-900 flex flex-col gap-5">
        <CardHeader className="flex flex-col gap-2 mb-5 items-center">
          <CardTitle className="text-cyan-700 font-black text-2xl dark:text-zinc-300">
            Login
          </CardTitle>
          <CardDescription className="flex gap-1">
            <p>Belum punya akun?</p>
            <Link to="/register">
              <span className="text-zinc-300 dark:text-cyan-700 font-bold">
                Register
              </span>
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <form
            action="submit"
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="username"
                className="text-cyan-700 dark:text-zinc-300"
              >
                Email or Username
              </Label>
              <Input
                className="rounded-lg"
                type="text"
                id="emailOrUsername"
                {...register("emailOrUsername")}
                required
              />
              {errors.emailOrUsername && (
                <p className="text-red-500 text-sm">
                  {errors.emailOrUsername.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="password"
                className="text-cyan-700 dark:text-zinc-300"
              >
                Password
              </Label>
              <Input
                className="rounded-lg"
                type="password"
                id="password"
                {...register("password")}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <CardAction className="w-full flex flex-col gap-2 mt-5">
              {isLoadLog ? (
                <ButtonLoading />
              ) : (
                <Button
                  type="submit"
                  variant="default"
                  className="w-full rounded-lg bg-cyan-500 hover:bg-cyan-700 font-bold cursor-pointer dark:bg-cyan-700 dark:hover:bg-cyan-500 dark:text-zinc-300"
                >
                  Login
                </Button>
              )}
            </CardAction>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
