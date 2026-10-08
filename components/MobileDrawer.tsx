"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, Clock, Menu, Phone, ShoppingBasket, X } from "lucide-react";
import { ProductIcon } from "./icons";
import { NAV_LINKS, isActive } from "./nav-links";
import type { MenuCategory } from "@/lib/catalog";

/** Nút ☰ và menu trượt từ trái cho điện thoại. */
export default function MobileDrawer({ categories, phone }: { categories: MenuCategory[]; phone: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="Mở menu" aria-expanded={open}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-stone-700 transition-colors hover:bg-stone-100 md:hidden">
        <Menu className="h-6 w-6" />
      </button>
      {mounted && createPortal(
        <div className={`fixed inset-0 z-[60] md:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
          <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-stone-900/50 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
          <aside role="dialog" aria-modal="true" aria-label="Menu"
            className={`absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex items-center justify-between border-b border-stone-100 p-4">
              <Link href="/" className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-white"><ShoppingBasket className="h-5 w-5" /></span>
                <span className="font-display text-lg font-bold text-brand-800">Đi Chợ Online</span>
              </Link>
              <button type="button" onClick={() => setOpen(false)} aria-label="Đóng menu" className="grid h-9 w-9 place-items-center rounded-lg text-stone-500 hover:bg-stone-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain p-4">
              <p className="px-2 text-xs font-semibold uppercase tracking-wider text-stone-400">Danh mục</p>
              <ul className="mt-2 space-y-1">
                {categories.map((c, i) => (
                  <li key={c.id} style={{ transitionDelay: open ? `${80 + i * 35}ms` : "0ms" }}
                    className={`transition-all duration-300 ${open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"}`}>
                    <Link href={`/danh-muc/${c.slug}`} className={`flex items-center gap-3 rounded-xl px-2 py-2.5 font-medium ${pathname === `/danh-muc/${c.slug}` ? "bg-brand-50 text-brand-700" : "text-stone-700 hover:bg-stone-50"}`}>
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50"><ProductIcon name={c.icon} className="h-5 w-5 text-brand-600" /></span>
                      <span className="flex-1">{c.name}</span>
                      <span className="text-xs text-stone-400">{c.product_count}</span>
                      <ChevronRight className="h-4 w-4 text-stone-300" />
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-6 px-2 text-xs font-semibold uppercase tracking-wider text-stone-400">Khám phá</p>
              <ul className="mt-2 space-y-1">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 font-medium ${isActive(pathname, l.href) ? "bg-brand-50 text-brand-700" : "text-stone-700 hover:bg-stone-50"}`}>
                      {l.label}
                      {"hot" in l && <span className="rounded bg-rose-500 px-1.5 py-px text-[10px] font-bold uppercase text-white">Hot</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 border-t border-stone-100 bg-stone-50 p-4 text-sm">
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="btn-primary w-full"><Phone className="h-4 w-4" /> Gọi {phone}</a>
              <p className="flex items-center justify-center gap-1.5 text-stone-500"><Clock className="h-4 w-4" /> Mở cửa 6:00 – 21:00 hằng ngày</p>
            </div>
          </aside>
        </div>,
        document.body,
      )}
    </>
  );
}
