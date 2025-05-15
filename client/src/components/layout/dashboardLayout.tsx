import React from "react";
import { ThemeProvider } from "../providers/themeProvider";
import SideBar from "../dashboard/sidebar/sidebar";
import { getServerSession } from "~/server/auth";

export default async function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerSession();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <main className="flex flex-row w-full h-screen overflow-hidden">
        <SideBar />
        <div className="flex-1 overflow-auto">
          {user.status === "authenticated" ? children : "unauthenticated"}
        </div>
      </main>
    </ThemeProvider>
  );
}
