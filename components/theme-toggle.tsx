import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

const KEY_THEME = "ev_theme";

export function ThemeToggle() {
  const [gelap, setGelap] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    const sinkron = () => setGelap(document.documentElement.classList.contains("dark"));
    sinkron();
    window.addEventListener("storage", sinkron);
    return () => window.removeEventListener("storage", sinkron);
  }, []);

  const pilih = (mode: "light" | "dark") => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    try {
      localStorage.setItem(KEY_THEME, mode);
    } catch {
      // mode hanya berlaku di perangkat ini
    }
    setGelap(mode === "dark");
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={gelap ? "Aktif mode gelap" : "Aktif mode terang"}
      title={gelap ? "Mode terang" : "Mode gelap"}
      onClick={() => pilih(gelap ? "light" : "dark")}
    >
      {gelap ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
    </Button>
  );
}
