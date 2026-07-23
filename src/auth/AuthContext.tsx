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
  nameKey,
  newUserId,
  normalizeName,
  normalizeXHandle,
} from "./types";
import {
  findByXHandle,
  getAccountById,
  isDisplayNameTaken,
  isXHandleTaken,
  listAccounts,
  loadSessionUser,
  migrateLegacyAuthIfNeeded,
  setSessionUserId,
  touchLogin,
  updateAccount,
  upsertAccount,
} from "./registry";
import { saveDisplayName } from "../data/contentStore";

migrateLegacyAuthIfNeeded();

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  accounts: AuthUser[];
  refreshAccounts: () => void;
  /** Create new local account — name must be unique */
  signUpLocal: (displayName: string, avatarEmoji?: string) => AuthUser;
  /** Register or reconnect via X handle */
  connectWithX: (handle: string, displayName?: string) => AuthUser;
  /** Reconnect to an existing saved account */
  loginAccount: (userId: string) => AuthUser;
  updateProfile: (
    patch: Partial<Pick<AuthUser, "displayName" | "avatarEmoji" | "bio">>
  ) => AuthUser;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadSessionUser());
  const [accounts, setAccounts] = useState<AuthUser[]>(() => listAccounts());

  const refreshAccounts = useCallback(() => {
    setAccounts(listAccounts());
  }, []);

  const persistSession = useCallback((next: AuthUser) => {
    const touched = touchLogin(next);
    setSessionUserId(touched.id);
    saveDisplayName(touched.displayName);
    setUser(touched);
    setAccounts(listAccounts());
    return touched;
  }, []);

  const signUpLocal = useCallback(
    (displayName: string, avatarEmoji = "🐺") => {
      const name = normalizeName(displayName);
      if (!name) throw new Error("Choose a Pack name");
      if (nameKey(name).length < 2) throw new Error("Name is too short");
      if (isDisplayNameTaken(name)) {
        throw new Error("That Pack name is already taken. Choose another.");
      }

      const next: AuthUser = {
        id: newUserId(),
        displayName: name,
        method: "local",
        avatarEmoji,
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
        bio: "",
      };
      upsertAccount(next);
      return persistSession(next);
    },
    [persistSession]
  );

  const connectWithX = useCallback(
    (handle: string, displayName?: string) => {
      const xHandle = normalizeXHandle(handle);
      if (!xHandle) throw new Error("Enter a valid X handle");

      // Reconnect if this X handle is already registered
      const existing = findByXHandle(xHandle);
      if (existing) {
        return persistSession(existing);
      }

      if (isXHandleTaken(xHandle)) {
        throw new Error("That X handle is already registered.");
      }

      const name = normalizeName(displayName || xHandle);
      if (!name) throw new Error("Choose a display name");
      if (isDisplayNameTaken(name)) {
        throw new Error(
          "That Pack name is already taken. Pick a different display name."
        );
      }

      const next: AuthUser = {
        id: `x-${xHandle.toLowerCase()}`,
        displayName: name.slice(0, 32),
        method: "x",
        xHandle,
        avatarEmoji: "𝕏",
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
        bio: "",
      };
      upsertAccount(next);
      return persistSession(next);
    },
    [persistSession]
  );

  const loginAccount = useCallback(
    (userId: string) => {
      const existing = getAccountById(userId);
      if (!existing) throw new Error("Account not found");
      return persistSession(existing);
    },
    [persistSession]
  );

  const updateProfile = useCallback(
    (patch: Partial<Pick<AuthUser, "displayName" | "avatarEmoji" | "bio">>) => {
      if (!user) throw new Error("Not signed in");
      const next = updateAccount(user.id, patch);
      saveDisplayName(next.displayName);
      setUser(next);
      setAccounts(listAccounts());
      return next;
    },
    [user]
  );

  const signOut = useCallback(() => {
    setSessionUserId(null);
    setUser(null);
    setAccounts(listAccounts());
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      accounts,
      refreshAccounts,
      signUpLocal,
      connectWithX,
      loginAccount,
      updateProfile,
      signOut,
    }),
    [
      user,
      accounts,
      refreshAccounts,
      signUpLocal,
      connectWithX,
      loginAccount,
      updateProfile,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
