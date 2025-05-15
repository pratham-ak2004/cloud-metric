import type { Metadata } from "next";
import "../../globals.css";
import DashBoardLayout from "~/components/layout/dashboardLayout";
import { getServerSession } from "~/server/auth";

export async function generateMetadata() {
  const user = await getServerSession();

  const template =
    user.status === "authenticated"
      ? `${user.data.name} | %s`
      : "Cloud Metric | %s";
  const defaultValue =
    user.status === "authenticated"
      ? `${user.data.name} | Dashboard`
      : "Cloud Metric | Dashboard";

  return {
    title: {
      template: template,
      default: defaultValue,
    },
    description: "Cloud Metric Dashboard",
  } satisfies Metadata;
}

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
