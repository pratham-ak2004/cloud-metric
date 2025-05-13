"use client";
import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { useSession } from "~/hooks/useSession";
import { logOut } from "~/lib/auth";

export default function NavbarAuthButton() {
  const router = useRouter();
  const session = useSession();

  // console.log(session);

  return (
    <div className="flex flex-row gap-4 w-fit">
      {session.status === "loading" && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      )}
      {session.status === "unauthenticated" && (
        <>
          <Button
            variant={"secondary"}
            onClick={() => {
              router.push("/login");
            }}
            className="border font-semibold"
          >
            Login
          </Button>
          <Button
            variant={"default"}
            onClick={() => {
              router.push("/signup");
            }}
            className="font-semibold"
          >
            Sign Up
          </Button>
        </>
      )}
      {session.status === "authenticated" && (
        <>
          <Button
            variant={"default"}
            onClick={() => {
              router.push("/dashboard");
            }}
            className="border font-semibold"
          >
            Dashboard
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              logOut();
            }}
            className="font-semibold"
          >
            Logout
          </Button>
        </>
      )}
    </div>
  );
}
