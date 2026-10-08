import Link from "next/link";
import { SORTS, type SortKey } from "@/lib/catalog";

export default function SortLinks({ basePath, current, extra = {} }: { basePath: string; current?: string; extra?: Record<string, string> }) {
  const active = (current && current in SORTS ? current : "noi-bat") as SortKey;
  return (
    <div className="-mx-4 flex w-[calc(100%+2rem)] items-center gap-2 overflow-x-auto px-4 pb-1 text-sm [scrollbar-width:none] sm:mx-0 sm:w-auto sm:flex-wrap sm:px-0 sm:pb-0">
      <span className="shrink-0 text-stone-500">Sắp xếp:</span>
      {(Object.keys(SORTS) as SortKey[]).map((k) => {
        const qs = new URLSearchParams({ ...extra, ...(k === "noi-bat" ? {} : { sap_xep: k }) }).toString();
        return (
          <Link key={k} href={`${basePath}${qs ? `?${qs}` : ""}`} rel="nofollow" scroll={false}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 font-medium transition ${k === active ? "bg-brand-600 text-white" : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-brand-400"}`}>
            {SORTS[k].label}
          </Link>
        );
      })}
    </div>
  );
}
