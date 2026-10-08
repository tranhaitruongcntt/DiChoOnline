"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, LayoutGrid } from "lucide-react";
import { ProductIcon } from "./icons";
import { NAV_LINKS, isActive } from "./nav-links";
import { formatPrice } from "@/lib/format";
import type { MenuCategory } from "@/lib/catalog";

/** Thanh menu chính (desktop): nút "Danh mục sản phẩm" mở mega menu + các liên kết chính. */
export default function MegaMenu({ categories, maxDiscount }: { categories: MenuCategory[]; maxDiscount: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
    const i = categories.findIndex((c) => pathname === `/danh-muc/${c.slug}`);
    if (i >= 0) setActive(i);
  }, [pathname, categories]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      wrap.current?.querySelector<HTMLButtonElement>("button[aria-controls=mega-menu]")?.focus();
    };
    const onClick = (e: MouseEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, [open]);

  const enter = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(true), 80); };
  const leave = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(false), 180); };
  const cat = categories[active];

  return (
    <nav aria-label="Menu chính" className="hidden border-t border-stone-100 md:block">
      <div className="container-x relative flex items-center gap-1" ref={wrap}>
        <div onMouseEnter={enter} onMouseLeave={leave}>
          <button type="button" aria-expanded={open} aria-controls="mega-menu" onClick={() => setOpen((v) => !v)}
            className={`my-1.5 mr-3 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${open ? "bg-brand-700 text-white" : "bg-brand-600 text-white hover:bg-brand-700"}`}>
            <LayoutGrid className="h-4 w-4" aria-hidden /> Danh mục sản phẩm
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden />
          </button>

          {/* pt-3 làm "cầu nối" để rê chuột từ nút xuống bảng không bị đóng */}
          <div id="mega-menu" hidden={!open} className="absolute inset-x-4 top-full z-50 pt-3 sm:inset-x-6 lg:inset-x-8">
            <span aria-hidden className="absolute left-14 top-[7px] z-10 h-3 w-3 rotate-45 rounded-tl-sm border-l border-t border-stone-200 bg-stone-50" />
            <div className="grid animate-toast-in grid-cols-[240px_1fr_260px] overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl shadow-stone-900/15 ring-1 ring-black/[0.02]">
              <ul className="border-r border-stone-100 bg-stone-50/70 p-2">
                {categories.map((c, i) => (
                  <li key={c.id}>
                    <Link href={`/danh-muc/${c.slug}`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${i === active ? "bg-white text-brand-700 shadow-sm" : "text-stone-600 hover:text-brand-700"}`}>
                      <span className={`grid h-8 w-8 place-items-center rounded-lg ${i === active ? "bg-brand-50" : "bg-white"}`}><ProductIcon name={c.icon} className="h-4 w-4 text-brand-600" /></span>
                      <span className="flex-1">{c.name}</span>
                      <span className="text-xs text-stone-400">{c.product_count}</span>
                      <ChevronRight className={`h-4 w-4 transition-opacity ${i === active ? "opacity-100" : "opacity-0"}`} aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
              {cat && (
                <div key={cat.id} className="animate-fade-in p-5">
                  <div className="flex items-baseline justify-between">
                    <p className="font-display text-lg font-bold text-stone-900">{cat.name}</p>
                    <Link href={`/danh-muc/${cat.slug}`} className="text-sm font-medium text-brand-700 hover:underline">Xem tất cả {cat.product_count} sản phẩm →</Link>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-stone-500">{cat.description}</p>
                  <ul className="mt-4 grid grid-cols-4 gap-3">
                    {cat.products.map((p) => (
                      <li key={p.id}>
                        <Link href={`/san-pham/${p.slug}`} className="group block">
                          <span className="relative block aspect-square overflow-hidden rounded-xl bg-stone-100">
                            {p.image ? <Image src={p.image} alt="" fill sizes="140px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                              : <span className="grid h-full place-items-center"><ProductIcon name={p.icon} className="h-8 w-8 text-brand-600" /></span>}
                          </span>
                          <span className="mt-2 line-clamp-1 block text-sm font-medium text-stone-700 group-hover:text-brand-700">{p.name}</span>
                          <span className="text-sm font-bold text-brand-700">{formatPrice(p.price)}<span className="text-xs font-normal text-stone-400"> /{p.unit}</span></span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Link href="/khuyen-mai" className="group relative m-3 overflow-hidden rounded-xl">
                <Image src="/images/banners/menu-promo.webp" alt="" fill sizes="260px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <span className="badge bg-accent-400 text-stone-900">Ưu đãi</span>
                  <span className="mt-2 block font-display text-xl font-bold leading-tight">Giảm đến {maxDiscount}% hôm nay</span>
                  <span className="mt-1 block text-sm text-white/80">Xem ngay →</span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        <ul className="flex items-center gap-1 text-sm">
          {NAV_LINKS.map((l) => {
            const on = isActive(pathname, l.href);
            return (
              <li key={l.href}>
                <Link href={l.href} aria-current={on ? "page" : undefined}
                  className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium transition-colors ${on ? "text-brand-700" : "text-stone-600 hover:text-brand-700"}`}>
                  {l.label}
                  {"hot" in l && <span className="rounded bg-rose-500 px-1.5 py-px text-[10px] font-bold uppercase leading-4 text-white">Hot</span>}
                  <span className={`absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-600 transition-transform duration-300 ${on ? "scale-x-100" : "scale-x-0"}`} />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
