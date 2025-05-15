"use client";
import React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";
import { cn } from "~/lib/utils";

export default function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  const { theme } = useTheme();

  return (
    <Link href={href}>
      <Image
        src="/images/logo.png"
        height={1080}
        width={1920}
        className={cn(
          `w-fit font-play  ${theme === "dark" && "invert brightness-[.85]"}`,
          className
        )}
        alt="Cloud Metric"
      />
    </Link>
  );
}
