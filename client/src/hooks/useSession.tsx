"use client";
import { useState, useEffect } from "react";
import type {
  User,
  AuthStatus,
  UseSessionReturn,
  CacheEntry,
} from "~/zod/types";

// Create a custom event for session changes
const SESSION_CHANGE_EVENT = "session-change";

// Event emitter for session changes
export const sessionEvents = {
  emit: () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(SESSION_CHANGE_EVENT));
    }
  },
};

const cache: { [key: string]: CacheEntry } = {};
let globalPromise: Promise<{ user: User }> | null = null;

export const useSession = (): UseSessionReturn => {
  const [data, setData] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (forceRefresh = false) => {
    const cachedData = cache["user"];

    if (!forceRefresh && cachedData) {
      setData(cachedData.data);
      setStatus("authenticated");
      return;
    }

    if (forceRefresh && globalPromise) {
      globalPromise = null;
    }

    if (!globalPromise) {
      globalPromise = fetch("http://localhost:5000/api/auth/session", {
        method: "GET",
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          return response.json();
        })
        .then(({ user }: { user: User }) => {
          cache["user"] = {
            data: user,
          };
          return { user };
        })
        .catch((err) => {
          throw err;
        });
    }

    try {
      const User = await globalPromise;
      setData(User.user);
      setStatus("authenticated");
    } catch (err) {
      setError((err as Error).message);
      setStatus("unauthenticated");
    } finally {
      globalPromise = null;
    }
  };

  // Function to manually refresh the session
  const refreshSession = async () => {
    setData(null);
    setStatus("loading");
    setError(null);
    await fetchUser(true);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Listen for session change events
  useEffect(() => {
    const handleSessionChange = () => {
      refreshSession();
    };

    if (typeof window !== "undefined") {
      window.addEventListener(SESSION_CHANGE_EVENT, handleSessionChange);

      return () => {
        window.removeEventListener(SESSION_CHANGE_EVENT, handleSessionChange);
      };
    }
  }, []);

  return { data, status, error, refresh: refreshSession };
};

// Export function to clear the cache (for logout and login)
export const clearSessionCache = () => {
  delete cache["user"];
  globalPromise = null;
  // Emit event to notify all hooks to revalidate
  sessionEvents.emit();
};
