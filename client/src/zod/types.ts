export type User = {
  id: String;
  email: String;
  name: String;
};

export type AuthStatus = "authenticated" | "unauthenticated" | "loading";

export type UseSessionReturn = {
  data: User | null;
  status: AuthStatus;
  error: string | null;
  refresh: () => Promise<void>;
};

export type CacheEntry = {
  data: User;
};

export type ServerSessionReturn = {
  data: User | null;
  status: AuthStatus;
  error: string | null;
};
