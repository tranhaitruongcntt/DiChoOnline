"use client";

import { useActionState } from "react";
import { changeStatusAction } from "../actions";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/format";

export default function StatusForm({ id, options }: { id: number; options: OrderStatus[] }) {
  const [state, action, pending] = useActionState(changeStatusAction, {});
  if (!options.length) return <p className="mt-3 text-sm text-stone-500">Đơn hàng đã kết thúc, không thể đổi trạng thái.</p>;
  return (
    <form action={action} className="mt-3 space-y-3" onSubmit={(e) => {
      const s = new FormData(e.currentTarget).get("status");
      if (s === "cancelled" && !confirm("Huỷ đơn hàng này? Tồn kho sẽ được hoàn lại.")) e.preventDefault();
    }}>
      <input type="hidden" name="id" value={id} />
      <div className="grid gap-2">
        {options.map((s, i) => (
          <label key={s} className="flex cursor-pointer items-center gap-2 rounded-lg border border-stone-200 p-2.5 text-sm has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
            <input type="radio" name="status" value={s} defaultChecked={i === 0} className="accent-brand-600" />
            {ORDER_STATUSES[s].label}
          </label>
        ))}
      </div>
      <input name="note" maxLength={300} placeholder="Ghi chú (tuỳ chọn)" className="input" />
      {state.error && <p role="alert" className="text-sm text-rose-600">{state.error}</p>}
      {state.ok && <p className="text-sm text-brand-700">✓ Đã cập nhật</p>}
      <button className="btn-primary w-full" disabled={pending}>{pending ? "Đang lưu…" : "Cập nhật"}</button>
    </form>
  );
}
