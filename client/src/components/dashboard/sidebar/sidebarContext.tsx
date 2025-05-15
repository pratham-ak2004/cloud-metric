"use client";
import React, { createContext, useEffect, useState } from "react";

type SidebarContextType = {
  open: boolean;
  mounted: boolean;
  toggle: (value: boolean) => void;
};

const sidebarContext = createContext<SidebarContextType>({
  open: true,
  mounted: false,
  toggle: () => {},
});

function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedState = localStorage.getItem("sidebarState");
      if (storedState !== null) {
        setIsOpen(JSON.parse(storedState));
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("sidebarState", JSON.stringify(isOpen));
      } catch (error) {
        console.error("Error writing to localStorage:", error);
      }
    }
  }, [isOpen, mounted]);

  const toggle = (value: boolean) => {
    setIsOpen(value);
  };

  // Provide the context value
  return (
    <sidebarContext.Provider
      value={{
        open: isOpen,
        mounted,
        toggle,
      }}
    >
      {children}
    </sidebarContext.Provider>
  );
}

export { SidebarProvider, sidebarContext };
