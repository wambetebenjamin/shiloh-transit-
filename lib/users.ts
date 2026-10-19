import { createHash } from "crypto";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

const globalUsers = globalThis as unknown as {
  __shilohUsers?: Map<string, StoredUser>;
};

function store(): Map<string, StoredUser> {
  if (!globalUsers.__shilohUsers) {
    globalUsers.__shilohUsers = new Map();
    const demoEmail = "passenger@shilohtransit.co.ke";
    globalUsers.__shilohUsers.set(demoEmail, {
      id: "usr_demo_001",
      name: "Wanjiku Kamau",
      email: demoEmail,
      passwordHash: hashPassword(demoEmail, "RideWithConfidence1!"),
    });
  }
  return globalUsers.__shilohUsers;
}

export function hashPassword(email: string, password: string): string {
  return createHash("sha256").update(`${email.toLowerCase()}::${password}`).digest("hex");
}

export function verifyUser(
  email: string,
  password: string
): { id: string; name: string; email: string } | null {
  const user = store().get(email.toLowerCase().trim());
  if (!user) return null;
  if (user.passwordHash !== hashPassword(user.email, password)) return null;
  return { id: user.id, name: user.name, email: user.email };
}

export function findUserByEmail(email: string): StoredUser | null {
  return store().get(email.toLowerCase().trim()) ?? null;
}

export function createUser(
  name: string,
  email: string,
  password: string
): { id: string; name: string; email: string } | null {
  const normalized = email.toLowerCase().trim();
  if (store().has(normalized)) return null;
  const user: StoredUser = {
    id: `usr_${Date.now().toString(36)}`,
    name: name.trim(),
    email: normalized,
    passwordHash: hashPassword(normalized, password),
  };
  store().set(normalized, user);
  return { id: user.id, name: user.name, email: user.email };
}
