import { useState, type Dispatch, type SetStateAction } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu } from "lucide-react";
import { api, extractAxiosError } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/molecules/Logo";
import ButtonLoading from "@/components/molecules/ButtonLoading";
import ButtonError from "@/components/molecules/ButtonError";
import ThemeToggle from "@/components/molecules/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

function Navbar({
  nav,
  setNav,
  carts,
}: {
  nav: boolean;
  setNav: Dispatch<SetStateAction<boolean>>;
  carts: number;
}) {
  const { token, setToken } = useAuth();
  const [isLoadLog, setIsLoadLog] = useState(false);
  const [isErrLog, setIsErrLog] = useState<string | null>(null);

  async function logout() {
    setIsLoadLog(true);
    setIsErrLog(null);
    setTimeout(async () => {
      try {
        await api.post("/logout");
        setToken(null);
      } catch (err) {
        setIsErrLog(extractAxiosError(err));
      } finally {
        setIsLoadLog(false);
      }
    }, 500);
  }

  return (
    <header className=" dark:bg-zinc-950 bg-white text-cyan-700 font-semibold w-full py-5 flex items-center justify-center shadow-lg sticky top-0 z-20 dark:text-cyan-500">
      <div className="w-4/5 md:max-w-300 flex flex-row items-center justify-between gap-2">
        <Logo />
        <Menu
          className="block md:hidden size-7 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setNav((nav) => !nav);
          }}
        />
        <NavigationMenu
          className={`${
            !nav ? "hidden" : ""
          } absolute md:block md:static shadow-xl md:shadow-none rounded-2xl md:rounded-none md:bg-none bg-white dark:text-zinc-300 dark:bg-cyan-950 md:dark:bg-transparent md:bg-transparent p-10 md:p-0 top-20 right-10 md:top-0 md:right-0 font-bold`}
        >
          <NavigationMenuList className="flex flex-col md:flex-row items-center gap-5">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/" className="">
                  HOME
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/about" className="">
                  ABOUT
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {token?.role === "admin" && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/productForm" className="">
                    DASHBOARD
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            {token?.role === "customer" && (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/product" className="">
                      PRODUCT
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/cart">
                      <div className="flex flex-row items-center justify-center gap-2">
                        <ShoppingCart className="text-cyan-700 dark:text-zinc-300 size-5" />
                        {carts}
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}
            {isLoadLog ? (
              <ButtonLoading />
            ) : isErrLog ? (
              <ButtonError />
            ) : token?.role ? (
              <Button
                variant="destructive"
                className="font-bold cursor-pointer rounded-full"
                onClick={logout}
              >
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button
                  variant="default"
                  className=" dark:bg-cyan-700 dark:hover:bg-cyan-500 dark:text-zinc-300 font-bold bg-cyan-500 hover:bg-cyan-700 cursor-pointer rounded-full"
                >
                  Login
                </Button>
              </Link>
            )}
            <ThemeToggle />
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}

export default Navbar;
