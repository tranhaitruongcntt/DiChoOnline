import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import { getDb } from "./db";
import { DUMMY_HASH, verifyPassword } from "./password";

const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 giờ
export const SESSION_COOKIE = process.env.NODE_ENV === "production" ? "__Host-dicho_admin" : "dicho_admin";

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

export type Admin = { id: number; username: string };

export function checkCredentials(username: string, password: string): Admin | null {
  const row = getDb()
    .prepare("SELECT id, username, password_hash FROM admins WHERE username = ?")
    .get(username) as { id: number; username: string; password_hash: string } | undefined;
  const ok = verifyPassword(password, row?.password_hash ?? DUMMY_HASH);
  return ok && row ? { id: row.id, username: row.username } : null;
}

export async function createSession(adminId: number) {
  const db = getDb();
  const token = randomBytes(32).toString("base64url");
  const now = Date.now();
  const ua = ((await headers()).get("user-agent") || "").slice(0, 200);
  db.prepare("DELETE FROM sessions WHERE expires_at < ?").run(now);
  db.prepare("INSERT INTO sessions (token_hash, admin_id, user_agent, created_at, expires_at) VALUES (?, ?, ?, ?, ?)")
    .run(sha256(token), adminId, ua, now, now + SESSION_TTL_MS);
  db.prepare("UPDATE admins SET last_login_at = datetime('now') WHERE id = ?").run(adminId);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function getAdmin(): Promise<Admin | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  const row = getDb()
    .prepare(
      `SELECT a.id, a.username FROM sessions s JOIN admins a ON a.id = s.admin_id
       WHERE s.token_hash = ? AND s.expires_at > ?`,
    )
    .get(sha256(token), Date.now()) as Admin | undefined;
  return row ?? null;
}

/** Dùng ở mọi trang/action quản trị – không chỉ dựa vào middleware. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) getDb().prepare("DELETE FROM sessions WHERE token_hash = ?").run(sha256(token));
  jar.delete(SESSION_COOKIE);
}

export function audit(adminId: number | null, action: string, detail = "", ipHash: string | null = null) {
  getDb().prepare("INSERT INTO audit_log (admin_id, action, detail, ip_hash) VALUES (?, ?, ?, ?)").run(adminId, action, detail.slice(0, 500), ipHash);
}
