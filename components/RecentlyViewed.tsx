"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { History, X } from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import { ProductIcon } from "./icons";
import { RECENT_VIEW_KEY, type RecentProduct } from "./RecentTracker";
import { formatPrice } from "@/lib/format";

/** Dải "Bạn đã xem gần đây" – chỉ hiện khi khách đã xem sản phẩm nào đó. */
export default function RecentlyViewed() {
  const [list, setList] = useState<RecentProduct[]>([]);
  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(RECENT_VIEW_KEY) || "[]");
      if (Array.isArray(v)) setList(v.filter((p) => Number.isInteger(p?.id) && typeof p?.slug === "string").slice(0, 12));
    } catch { /* bỏ qua */ }
  }, []);
  if (!list.length) return null;
  const clear = () => { try { localStorage.removeItem(RECENT_VIEW_KEY); } catch { /* bỏ qua */ } setList([]); };

  return (
    <section className="container-x mt-14 animate-fade-in" aria-labelledby="da-xem">
      <div className="flex items-end justify-between gap-4">
        <h2 id="da-xem" className="flex items-center gap-2 text-2xl font-bold text-stone-800 sm:text-3xl"><History className="h-6 w-6 text-brand-600" /> Bạn đã xem gần đây</h2>
        <button type="button" onClick={clear} className="flex items-center gap-1 text-sm text-stone-500 hover:text-rose-600"><X className="h-4 w-4" /> Xoá lịch sử</button>
      </div>
      <ul className="-mx-4 mt-5 flex snap-x gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        {list.map((p) => (
          <li key={p.id} className="card flex w-40 shrink-0 snap-start flex-col p-2.5 sm:w-44">
            <Link href={`/san-pham/${p.slug}`} className="group relative block aspect-square overflow-hidden rounded-xl bg-stone-100">
              {p.image ? <Image src={p.image} alt={p.name} fill sizes="176px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                : <span className="grid h-full place-items-center"><ProductIcon name={p.icon} className="h-10 w-10 text-brand-600" /></span>}
            </Link>
            <Link href={`/san-pham/${p.slug}`} className="mt-2 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-stone-800 hover:text-brand-700">{p.name}</Link>
            <p className="mt-1 font-display text-[15px] font-bold text-brand-700">{formatPrice(p.price)}<span className="text-xs font-normal text-stone-500"> /{p.unit}</span></p>
            <div className="mt-auto pt-2"><AddToCartButton product={p} /></div>
          </li>
        ))}
      </ul>
    </section>
  );
}
