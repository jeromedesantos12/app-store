import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ButtonLoading from "@/components/molecules/ButtonLoading";
import toast from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z.object({
  profile: z.any().optional(), // Joi.string().allow("") translates to optional any for file
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters"),
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .min(10, "Email must be at least 10 characters")
    .max(255, "Email must be at most 255 characters"),
  address: z
    .string()
    .max(255, "Address must be at most 255 characters")
    .optional(), // min(0) and required() is tricky, optional() allows empty string
  password: z
    .string()
    .min(10, "Password must be at least 10 characters")
    .max(255, "Password must be at most 255 characters"),
});

function Register() {
  const navigate = useNavigate();
  const [isLoadLog, setIsLoadLog] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      address: "",
      password: "",
      profile: undefined, // File input
    },
  });

  async function onSubmit(data: z.infer<typeof registerSchema>) {
    setIsLoadLog(true);
    setTimeout(async () => {
      try {
        const formData = new FormData();
        formData.append("username", data.username);
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("address", data.address || ""); // address is optional
        formData.append("password", data.password);
        if (data.profile && data.profile[0]) {
          formData.append("profile", data.profile[0]);
        }
        await api.post("/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Registration successful!");
      } catch (err: unknown) {
        toast.error(extractAxiosError(err));
      } finally {
        reset();
        setIsLoadLog(false);
        navigate("/product");
      }
    }, 500);
  }

  return (
    <div className="flex flex-col">
      <Card className="md:w-100 bg-white dark:bg-zinc-900 flex flex-col gap-5">
        <CardHeader className="flex flex-col gap-2 mb-5 items-center">
          <CardTitle className="text-cyan-700 font-black text-2xl dark:text-zinc-300">
            Register
          </CardTitle>
          <CardDescription className="flex gap-1">
            <p>Sudah punya akun?</p>
            <Link to="/login">
              <span className="text-zinc-300 dark:text-cyan-700 font-bold">
                Login
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
                htmlFor="profile"
                className="text-cyan-700 dark:text-zinc-300"
              >
                Profile
              </Label>
              <Input
                className="rounded-lg"
                type="file"
                id="profile"
                {...register("profile")}
                required
              />
              {errors.profile && (
                <p className="text-red-500 text-sm">
                  {errors.profile.message as React.ReactNode}
                </p>
              )}
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="username"
                  className="text-cyan-700 dark:text-zinc-300"
                >
                  Username
                </Label>
                <Input
                  className="rounded-lg"
                  type="text"
                  id="username"
                  {...register("username")}
                  required
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">
                    {errors.username.message as React.ReactNode}
                  </p>
                )}
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
                  {...register("name")}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">
                    {errors.name.message as React.ReactNode}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="email"
                  className="text-cyan-700 dark:text-zinc-300"
                >
                  Email
                </Label>
                <Input
                  className="rounded-lg"
                  type="text"
                  id="email"
                  {...register("email")}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">
                    {errors.email.message as React.ReactNode}
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
                    {errors.password.message as React.ReactNode}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="address"
                className="text-cyan-700 dark:text-zinc-300"
              >
                Address
              </Label>
              <Textarea
                className="rounded-lg h-20"
                id="address"
                {...register("address")}
                required
              />
              {errors.address && (
                <p className="text-red-500 text-sm">
                  {errors.address.message as React.ReactNode}
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
                  Register
                </Button>
              )}
            </CardAction>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
