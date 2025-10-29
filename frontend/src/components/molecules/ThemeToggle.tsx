import { Toggle } from "@/components/ui/toggle";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <Toggle
      variant="outline"
      className="text-cyan-700 hover:text-cyan-700 dark:text-zinc-300 rounded-full border-0"
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Toggle>
  );
}

export default ThemeToggle;
