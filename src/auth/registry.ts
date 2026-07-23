import {
  type AuthUser,
  REGISTRY_KEY,
  SESSION_KEY,
  nameKey,
  normalizeName,
  normalizeXHandle,
} from "./types";

function readRegistry(): AuthUser[] {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as AuthUser[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeRegistry(list: AuthUser[]): void {
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(list));
}

export function listAccounts(): AuthUser[] {
  return readRegistry().sort((a, b) => b.lastLoginAt - a.lastLoginAt);
}

export function getAccountById(id: string): AuthUser | undefined {
  return readRegistry().find((a) => a.id === id);
}

export function getSessionUserId(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionUserId(id: string | null): void {
  if (!id) localStorage.removeItem(SESSION_KEY);
  else localStorage.setItem(SESSION_KEY, id);
}

export function loadSessionUser(): AuthUser | null {
  const id = getSessionUserId();
  if (!id) return null;
  return getAccountById(id) ?? null;
}

/** True if display name is taken by another account (case-insensitive). */
export function isDisplayNameTaken(name: string, exceptUserId?: string): boolean {
  const key = nameKey(name);
  if (!key) return false;
  return readRegistry().some(
    (a) => nameKey(a.displayName) === key && a.id !== exceptUserId
  );
}

/** True if X handle is taken by another account. */
export function isXHandleTaken(handle: string, exceptUserId?: string): boolean {
  const h = normalizeXHandle(handle).toLowerCase();
  if (!h) return false;
  return readRegistry().some(
    (a) => a.xHandle?.toLowerCase() === h && a.id !== exceptUserId
  );
}

export function findByXHandle(handle: string): AuthUser | undefined {
  const h = normalizeXHandle(handle).toLowerCase();
  return readRegistry().find((a) => a.xHandle?.toLowerCase() === h);
}

export function findByDisplayName(name: string): AuthUser | undefined {
  const key = nameKey(name);
  return readRegistry().find((a) => nameKey(a.displayName) === key);
}

export function upsertAccount(user: AuthUser): AuthUser {
  const list = readRegistry();
  const i = list.findIndex((a) => a.id === user.id);
  if (i >= 0) list[i] = user;
  else list.push(user);
  writeRegistry(list);
  return user;
}

export function touchLogin(user: AuthUser): AuthUser {
  const next = { ...user, lastLoginAt: Date.now() };
  return upsertAccount(next);
}

export function updateAccount(
  id: string,
  patch: Partial<Pick<AuthUser, "displayName" | "avatarEmoji" | "bio">>
): AuthUser {
  const existing = getAccountById(id);
  if (!existing) throw new Error("Account not found");

  if (patch.displayName !== undefined) {
    const name = normalizeName(patch.displayName);
    if (!name) throw new Error("Name cannot be empty");
    if (isDisplayNameTaken(name, id)) {
      throw new Error("That Pack name is already taken");
    }
    patch = { ...patch, displayName: name };
  }

  const next: AuthUser = {
    ...existing,
    ...patch,
    lastLoginAt: Date.now(),
  };
  return upsertAccount(next);
}

export function deleteAccount(id: string): void {
  writeRegistry(readRegistry().filter((a) => a.id !== id));
  if (getSessionUserId() === id) setSessionUserId(null);
}

// Migrate v1 single session into registry once
export function migrateLegacyAuthIfNeeded(): void {
  try {
    const legacy = localStorage.getItem("boltverse-auth-user-v1");
    if (!legacy) return;
    const u = JSON.parse(legacy) as AuthUser;
    if (!u?.id || !u?.displayName) return;
    if (!getAccountById(u.id)) {
      upsertAccount({
        ...u,
        lastLoginAt: u.lastLoginAt || Date.now(),
        createdAt: u.createdAt || Date.now(),
      });
    }
    if (!getSessionUserId()) setSessionUserId(u.id);
    localStorage.removeItem("boltverse-auth-user-v1");
  } catch {
    /* ignore */
  }
}
