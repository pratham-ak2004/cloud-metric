import { cookies } from "next/headers";
import type { ServerSessionReturn, User, AuthStatus } from "~/zod/types";

export async function getServerSession(): Promise<ServerSessionReturn> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id");

  const res = await fetch("http://localhost:5000/api/auth/session", {
    method: "GET",
    headers: {
      Cookie: `session_id=${sessionId?.value};`,
    },
  });

  if (res.status === 200) {
    const data = await res.json();
    return {
      data: data.user,
      status: "authenticated",
      error: null,
    };
  } else {
    return {
      data: null,
      status: "unauthenticated",
      error: await res.text(),
    };
  }
}
