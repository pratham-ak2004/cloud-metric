import React from "react";
import Navbar from "~/components/navbar/navbar";
import { ThemeProvider } from "../providers/themeProvider";
import Footer from "~/components/footer/footer";

export default function CustomRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <Navbar />
      <main>{children}</main>
      <Footer />
    </ThemeProvider>
  );
}
