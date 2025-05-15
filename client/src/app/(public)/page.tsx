"use client";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-20 text-center">
      <h2 className="text-4xl mb-4">
        Welcome to <span className="font-play font-semibold">cloud metric</span>
      </h2>
      <p className="text-lg text-muted-foreground mb-6">
        Your private, customizable platform to track ML training, validation,
        and testing metrics in the cloud.
      </p>
      <div className="flex flex-row gap-4 w-full justify-center">
        <Button variant={"default"} size={"lg"} className="text-lg">
          Get API Key
        </Button>
        <Button variant={"secondary"} size={"lg"} className="text-lg border">
          View API Documentation
        </Button>
        <Button
          onClick={async () => {
            const res = await fetch("http://localhost:5000/api/ping", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
            const data = await res.json();
            console.log(data);
          }}
        >
          Ping
        </Button>
      </div>
    </section>
  );
}
