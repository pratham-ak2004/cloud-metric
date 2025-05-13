"use client";
import { useTheme } from "next-themes";

import React from "react";

import { Button } from "~/components/ui/button";
import { Laptop, Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant={"ghost"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "light" ? (
        <Sun className="size-6" />
      ) : theme === "dark" ? (
        <Moon className="size-6" />
      ) : (
        <Laptop className="size-6" />
      )}
    </Button>
  );
}
