export type AuthMethod = "x" | "local";

export interface AuthUser {
  id: string;
  displayName: string;
  method: AuthMethod;
  /** X handle without @ when method is x */
  xHandle?: string;
  avatarEmoji: string;
  bio?: string;
  createdAt: number;
  lastLoginAt: number;
}

export const SESSION_KEY = "boltverse-session-user-id-v2";
export const REGISTRY_KEY = "boltverse-accounts-registry-v2";

export function normalizeXHandle(input: string): string {
  return input.trim().replace(/^@+/, "").replace(/\s+/g, "");
}

export function normalizeName(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

export function nameKey(input: string): string {
  return normalizeName(input).toLowerCase();
}

export function newUserId(): string {
  return `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
