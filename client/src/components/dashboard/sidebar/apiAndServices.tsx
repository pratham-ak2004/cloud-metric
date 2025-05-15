"use client";
import { ChartArea, KeySquare } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "~/components/ui/button";

const apiAndServicesOptions = [
  {
    name: "API Management",
    link: "/dashboard/apis",
    icon: <KeySquare />,
  },
  {
    name: "Usage Statistics",
    link: "/dashboard/usage",
    icon: <ChartArea />,
  },
];

export default function ApiAndServices() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div>
      <ul className="flex flex-col gap-1 mt-4">
        {apiAndServicesOptions.map((option, idx) => {
          return (
            <li key={idx}>
              <Button
                className="w-full flex justify-start gap-4"
                onClick={() => router.push(option.link)}
                variant={pathname === option.link ? "default" : "secondary"}
              >
                {option.icon}
                {option.name}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
