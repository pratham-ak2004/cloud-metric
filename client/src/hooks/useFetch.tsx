"use client";
import React from "react";

export enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

// Removed redundant local Method type
type FetchOptions = {
  method: Method;
  body?: string;
  headers?: {
    [key: string]: string;
  };
};

export default function useFetch(options: FetchOptions) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [data, setData] = React.useState(null);

  async function makeRequest(body?: string | FormData) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: options.method,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: body,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    data,
    makeRequest,
  };
}
