import { Check } from "lucide-react";

const STEPS = ["Giỏ hàng", "Thông tin giao hàng", "Hoàn tất"];

export default function CheckoutSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="flex items-center gap-2 text-sm" aria-label="Các bước đặt hàng">
      {STEPS.map((label, i) => {
        const n = i + 1, done = n < current, active = n === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2 last:flex-none" aria-current={active ? "step" : undefined}>
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors ${done ? "bg-brand-600 text-white" : active ? "bg-brand-600 text-white ring-4 ring-brand-100" : "bg-stone-200 text-stone-500"}`}>
              {done ? <Check className="h-4 w-4" /> : n}
            </span>
            <span className={`whitespace-nowrap ${active ? "font-semibold text-stone-900" : done ? "text-brand-700" : "text-stone-400"} ${active ? "" : "hidden sm:inline"}`}>{label}</span>
            {n < STEPS.length && <span className={`h-0.5 flex-1 rounded-full ${done ? "bg-brand-500" : "bg-stone-200"}`} />}
          </li>
        );
      })}
    </ol>
  );
}
