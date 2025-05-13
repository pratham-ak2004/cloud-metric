import React from "react";
import Navbar from "~/components/navbar/navbar";
import { ThemeProvider } from "../themeProvider/themeProvider";
import Footer from "~/components/footer/footer";

export default function CustomRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Navbar />
      <main>{children}</main>
      <Footer />
    </ThemeProvider>
  );
}
