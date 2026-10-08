"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      {state.error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 ring-1 ring-rose-200">{state.error}</p>}
      <div>
        <label htmlFor="username" className="label">Tên đăng nhập</label>
        <input id="username" name="username" required maxLength={50} autoComplete="username" className="input" />
      </div>
      <div>
        <label htmlFor="password" className="label">Mật khẩu</label>
        <input id="password" name="password" type="password" required maxLength={200} autoComplete="current-password" className="input" />
      </div>
      <button className="btn-primary w-full py-3" disabled={pending}>{pending ? "Đang đăng nhập…" : "Đăng nhập"}</button>
    </form>
  );
}
