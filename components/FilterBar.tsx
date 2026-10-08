import Link from "next/link";
import { Check, SlidersHorizontal, X } from "lucide-react";
import { PRICE_RANGES, type PriceRange } from "@/lib/catalog";

type Params = Record<string, string | undefined>;

const href = (base: string, params: Params, change: Params) => {
  const merged: Params = { ...params, ...change };
  const qs = new URLSearchParams(Object.entries(merged).filter(([, v]) => v) as [string, string][]).toString();
  return `${base}${qs ? `?${qs}` : ""}`;
};

/** Bộ lọc dạng chip (không cần JavaScript): khoảng giá, đang giảm giá, còn hàng. */
export default function FilterBar({ basePath, params }: { basePath: string; params: Params }) {
  const active = Boolean(params.gia || params.giam_gia || params.con_hang);
  const chip = (on: boolean) =>
    `flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${on ? "bg-brand-600 text-white shadow-sm" : "bg-white text-stone-600 ring-1 ring-stone-200 hover:text-brand-700 hover:ring-brand-300"}`;
  return (
    <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
      <span className="flex shrink-0 items-center gap-1.5 text-sm text-stone-500"><SlidersHorizontal className="h-4 w-4" /> Lọc:</span>
      {(Object.keys(PRICE_RANGES) as PriceRange[]).map((k) => {
        const on = params.gia === k;
        return <Link key={k} href={href(basePath, params, { gia: on ? undefined : k })} rel="nofollow" scroll={false} className={chip(on)}>{on && <Check className="h-3.5 w-3.5" />}{PRICE_RANGES[k].label}</Link>;
      })}
      <Link href={href(basePath, params, { giam_gia: params.giam_gia ? undefined : "1" })} rel="nofollow" scroll={false} className={chip(!!params.giam_gia)}>{params.giam_gia && <Check className="h-3.5 w-3.5" />}Đang giảm giá</Link>
      <Link href={href(basePath, params, { con_hang: params.con_hang ? undefined : "1" })} rel="nofollow" scroll={false} className={chip(!!params.con_hang)}>{params.con_hang && <Check className="h-3.5 w-3.5" />}Còn hàng</Link>
      {active && (
        <Link href={href(basePath, { sap_xep: params.sap_xep }, {})} rel="nofollow" scroll={false} className="flex shrink-0 items-center gap-1 text-sm font-medium text-rose-600 hover:underline"><X className="h-4 w-4" /> Bỏ lọc</Link>
      )}
    </div>
  );
}
