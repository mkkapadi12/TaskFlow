import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ICONS } from "@/lib/icons/icons";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full"
      aria-label="Theme toggle"
    >
      {theme === "dark" ? <ICONS.SUN size={18} /> : <ICONS.MOON size={18} />}

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
