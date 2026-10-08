import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Đăng nhập" };

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  const { n } = getDb().prepare("SELECT COUNT(*) AS n FROM admins").get() as { n: number };
  return (
    <main className="grid min-h-dvh place-items-center p-4">
      <div className="card w-full max-w-sm p-7">
        <p className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-2xl" aria-hidden>🔐</p>
        <h1 className="mt-4 text-center text-xl font-bold">Quản trị Đi Chợ Online</h1>
        {n === 0 ? (
          <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200">
            Chưa có tài khoản quản trị. Chạy <code className="font-mono">npm run create-admin -- &lt;tên&gt;</code> trên máy chủ để tạo.
          </p>
        ) : (
          <LoginForm />
        )}
      </div>
    </main>
  );
}
