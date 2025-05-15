import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { getServerSession } from "~/server/auth";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_id");

  const res = await getServerSession();

  return (
    <main className="max-w-6xl mx-auto px-4 py-20 text-center">
      <h2 className="text-4xl mb-4">
        Welcome to <span className="font-play font-semibold">cloud metric</span>
      </h2>
      <p className="text-lg text-muted-foreground mb-6">
        Your private, customizable platform to track ML training, validation,
        and testing metrics in the cloud.
      </p>
      <p>Token : {res.data?.email}</p>
      {res.status === "unauthenticated" && (
        <Link href={"/auth/login?redirect=/dashboard"}>Login</Link>
      )}
    </main>
  );
}
