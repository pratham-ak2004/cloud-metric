import { cookies } from "next/headers";
import { Method } from "~/hooks/useFetch";

/**
 * Makes a server request and returns the response
 * @template T The expected type of the response data
 * @param route The API route to call
 * @param method The HTTP method to use
 * @param body The request body
 * @returns Promise containing the status code and response object
 */
export async function makeServerRequest<T = any>(
  route: string,
  method: Method,
  body: any
): Promise<{
  status: number;
  response: Response;
  data: T | null;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`http://localhost:5000/${route}`, {
    method: method,
    credentials: "include",
    headers: {
      Cookie: `session_id=${token}`,
    },
    body: body,
  });

  const responseClone = res.clone();

  let data: T | null = null;
  try {
    data = await res.json();
  } catch (error) {
    console.error("Failed to parse response as JSON:", error);
  }

  return {
    status: res.status,
    response: responseClone,
    data,
  };
}
