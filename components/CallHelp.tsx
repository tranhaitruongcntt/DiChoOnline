import { Headset } from "lucide-react";
import { site } from "@/lib/site";

/** Khung hỗ trợ đặt hàng qua điện thoại – dành cho người không quen mua online. */
export default function CallHelp({ className = "" }: { className?: string }) {
  return (
    <a href={`tel:${site.phone.replace(/\s/g, "")}`}
      className={`group flex items-center gap-3 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200 transition-colors hover:bg-amber-100 ${className}`}>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-amber-400 text-stone-900 transition-transform group-hover:scale-110"><Headset className="h-5 w-5" /></span>
      <span className="text-sm leading-snug text-stone-700">
        <strong className="block text-stone-900">Không quen đặt online?</strong>
        Gọi <span className="font-bold text-brand-700">{site.phone}</span> – nhân viên đặt hàng giúp bạn (6:00–21:00).
      </span>
    </a>
  );
}
