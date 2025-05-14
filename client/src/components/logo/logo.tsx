"use client";
import React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function NavLogo() {
  const { theme } = useTheme();

  return (
    <Link href={"/"}>
      <Image
        src={
          theme === "dark" ? "/images/logo-dark.png" : "/images/logo-light.png"
        }
        height={1080}
        width={1920}
        className="h-10 w-fit font-play"
        alt="Cloud Metric"
      />
    </Link>
  );
}
