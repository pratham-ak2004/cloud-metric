import type { Metadata } from "next";
import "../globals.css";
import CustomRootLayout from "~/components/layout/customRootLayout";

export const metadata: Metadata = {
  title: "Cloud Metric",
  description: "One place to monitor all your model metrics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <CustomRootLayout>{children}</CustomRootLayout>
      </body>
    </html>
  );
}
