import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// Định dạng: scrypt$N$r$p$saltBase64$hashBase64  (cùng định dạng với scripts/create-admin.mjs)
const N = 2 ** 15, R = 8, P = 1, KEYLEN = 64;
const MAXMEM = 64 * 1024 * 1024;

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password.normalize("NFKC"), salt, KEYLEN, { N, r: R, p: P, maxmem: MAXMEM });
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, saltB64, hashB64] = parts;
  const expected = Buffer.from(hashB64, "base64");
  const actual = scryptSync(password.normalize("NFKC"), Buffer.from(saltB64, "base64"), expected.length, {
    N: Number(n), r: Number(r), p: Number(p), maxmem: MAXMEM,
  });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// Hash giả để so sánh khi username không tồn tại → thời gian phản hồi đồng nhất (chống dò tài khoản).
export const DUMMY_HASH = hashPassword(randomBytes(16).toString("hex"));
