import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

function Register() {
  const navigate = useNavigate();
  const { fetchToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoadLog, setIsLoadLog] = useState(false);
  const [isErrLog, setIsErrLog] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoadLog(true);
    setIsErrLog(null);
    setTimeout(async () => {
      try {
        await api.post("/login", {
          email,
          password,
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
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <form
            action="submit"
            className="flex flex-col gap-5"
            onSubmit={handleLogin}
          >
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
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

export default Register;
