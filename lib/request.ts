import "server-only";
import { headers } from "next/headers";
import { createHash } from "node:crypto";

export async function clientIp(): Promise<string> {
  const h = await headers();
  // Chỉ tin X-Forwarded-For khi chạy sau reverse proxy đáng tin (Nginx, Vercel...). Lấy IP đầu tiên.
  return (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "unknown").trim();
}

/** Băm IP trước khi lưu để hạn chế lưu dữ liệu cá nhân. */
export const hashIp = (ip: string) =>
  createHash("sha256").update(`${process.env.IP_SALT || "dicho"}:${ip}`).digest("hex").slice(0, 32);
