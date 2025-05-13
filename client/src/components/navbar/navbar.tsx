import Link from "next/link";
import React from "react";

import ThemeToggle from "./themeToggle";
import NavbarAuthButton from "../authButton/navbarAuthButton";
import { Button } from "~/components/ui/button";

export const navItems = [
  {
    name: "API Docs",
    href: "/docs",
  },
  {
    name: "GitHub",
    href: "http://github.com/pratham-ak2004/cloud-metric",
  },
];

export default function Navbar() {
  return (
    <>
      <header className="w-full h-fit py-6 px-4 fixed top-0 left-0 backdrop-blur-md z-10">
        <nav className="w-full flex flex-row justify-between items-center">
          <Link
            href={"/"}
            aria-label="Brand Name"
            className="text-2xl font-bold font-play"
          >
            Cloud Metric
          </Link>
          <div className="w-fit flex flex-row gap-4">
            <div className="flex flex-row items-center gap-6">
              {navItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary flex flex-col items-center group"
                >
                  {item.name}
                  <div className="bg-black dark:bg-white h-px transition-all duration-400 group-hover:w-full w-0"></div>
                </Link>
              ))}
            </div>
            <NavbarAuthButton />
            <div>
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </header>
      <div className="h-20"></div>
    </>
  );
}
