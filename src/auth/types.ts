export type AuthMethod = "x" | "local";

export interface AuthUser {
  id: string;
  displayName: string;
  method: AuthMethod;
  /** X handle without @ when method is x */
  xHandle?: string;
  avatarEmoji: string;
  createdAt: number;
}

export const AUTH_STORAGE_KEY = "boltverse-auth-user-v1";

export function loadAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw) as AuthUser;
    if (!u?.id || !u?.displayName || !u?.method) return null;
    return u;
  } catch {
    return null;
  }
}

export function saveAuthUser(user: AuthUser): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearAuthUser(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function normalizeXHandle(input: string): string {
  return input.trim().replace(/^@+/, "").replace(/\s+/g, "");
}

export function newUserId(): string {
  return `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
