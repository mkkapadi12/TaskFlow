import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full"
      aria-label="Theme toggle"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
