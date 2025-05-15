import type { Metadata } from "next";
import "../../globals.css";
import DashBoardLayout from "~/components/layout/dashboardLayout";

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
        <DashBoardLayout>{children}</DashBoardLayout>
      </body>
    </html>
  );
}
