import { AlertCircle } from "lucide-react";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "API Usage",
};

export default function UsagePage() {
  return (
    <section className="flex flex-col items-center justify-center w-full h-screen p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <AlertCircle className="h-16 w-16 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Usage Analytics</h1>
        <p className="text-muted-foreground">
          This feature is coming soon! We&apos;re working hard to bring you
          detailed usage analytics for your cloud resources.
        </p>
        <div className="rounded-md bg-amber-50 dark:bg-amber-950/30 p-4 mt-6">
          <p className="text-amber-800 dark:text-amber-200 text-sm">
            Check back soon for updates.
          </p>
        </div>
      </div>
    </section>
  );
}
