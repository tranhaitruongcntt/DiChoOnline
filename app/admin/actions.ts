"use server";

import { redirect } from "next/navigation";
import { audit, checkCredentials, createSession, destroySession, getAdmin } from "@/lib/auth";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { clientIp, hashIp } from "@/lib/request";

export async function loginAction(_: unknown, fd: FormData): Promise<{ error?: string }> {
  const username = String(fd.get("username") ?? "").trim().slice(0, 50);
  const password = String(fd.get("password") ?? "").slice(0, 200);
  const ip = await clientIp();
  const ipKey = `login-ip:${ip}`;
  const userKey = `login-user:${username.toLowerCase()}`;

  const a = rateLimit(ipKey, 10, 15 * 60 * 1000);
  const b = rateLimit(userKey, 5, 15 * 60 * 1000);
  if (!a.ok || !b.ok) {
    audit(null, "login_blocked", username, hashIp(ip));
    return { error: `Đăng nhập sai quá nhiều lần. Thử lại sau ${Math.ceil(Math.max(a.retryAfterSec, b.retryAfterSec) / 60)} phút.` };
  }
  if (!username || !password) return { error: "Vui lòng nhập đầy đủ thông tin." };

  const admin = checkCredentials(username, password);
  if (!admin) {
    audit(null, "login_failed", username, hashIp(ip));
    return { error: "Tên đăng nhập hoặc mật khẩu không đúng." };
  }
  resetRateLimit(userKey);
  await destroySession(); // chống session fixation
  await createSession(admin.id);
  audit(admin.id, "login", "", hashIp(ip));
  redirect("/admin");
}

export async function logoutAction() {
  const admin = await getAdmin();
  if (admin) audit(admin.id, "logout");
  await destroySession();
  redirect("/admin/login");
}
