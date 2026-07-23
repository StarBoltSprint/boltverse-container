import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  type AuthUser,
  clearAuthUser,
  loadAuthUser,
  newUserId,
  normalizeXHandle,
  saveAuthUser,
} from "./types";
import { saveDisplayName } from "../data/contentStore";

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  signUpLocal: (displayName: string, avatarEmoji?: string) => AuthUser;
  connectWithX: (handle: string, displayName?: string) => AuthUser;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadAuthUser());

  const persist = useCallback((next: AuthUser) => {
    saveAuthUser(next);
    saveDisplayName(next.displayName);
    setUser(next);
  }, []);

  const signUpLocal = useCallback(
    (displayName: string, avatarEmoji = "🐺") => {
      const name = displayName.trim() || "Pack Guardian";
      const next: AuthUser = {
        id: newUserId(),
        displayName: name,
        method: "local",
        avatarEmoji,
        createdAt: Date.now(),
      };
      persist(next);
      return next;
    },
    [persist]
  );

  const connectWithX = useCallback(
    (handle: string, displayName?: string) => {
      const xHandle = normalizeXHandle(handle);
      if (!xHandle) {
        throw new Error("Enter a valid X handle");
      }
      const name = (displayName?.trim() || xHandle).slice(0, 32);
      const next: AuthUser = {
        id: `x-${xHandle.toLowerCase()}`,
        displayName: name,
        method: "x",
        xHandle,
        avatarEmoji: "𝕏",
        createdAt: Date.now(),
      };
      persist(next);
      return next;
    },
    [persist]
  );

  const signOut = useCallback(() => {
    clearAuthUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      signUpLocal,
      connectWithX,
      signOut,
    }),
    [user, signUpLocal, connectWithX, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
