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
import { useAuth } from "@/hooks/useAuth";

function Register() {
  const navigate = useNavigate();
  const { fetchToken } = useAuth();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState<File | string>("");
  const [isLoadLog, setIsLoadLog] = useState(false);
  const [isErrLog, setIsErrLog] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoadLog(true);
    setIsErrLog(null);
    setTimeout(async () => {
      try {
        const formData = new FormData();
        const data = { username, name, email, address, password };
        Object.entries(data).forEach(([key, value]) =>
          formData.append(key, value)
        );
        formData.append("profile", profile);
        await api.post("/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (err: unknown) {
        setIsErrLog(extractAxiosError(err));
      } finally {
        setIsLoadLog(false);
        fetchToken();
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
            onSubmit={handleRegister}
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
                onChange={(e) => setProfile(e.target.files?.[0] || "")}
                required
              />
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="name"
                  className="text-cyan-700 dark:text-zinc-300"
                >
                  Username
                </Label>
                <Input
                  className="rounded-lg"
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
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
                  type="text"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
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
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            {isErrLog && <p className="text-destructive w-full">{isErrLog}</p>}
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
