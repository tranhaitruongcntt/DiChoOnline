"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CircleCheck, X } from "lucide-react";
import { useCart } from "./CartProvider";

/** Thông báo nhỏ góc dưới khi thêm sản phẩm vào giỏ. */
export default function CartToast() {
  const { lastAdded } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lastAdded) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(t);
  }, [lastAdded]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(132px+env(safe-area-inset-bottom))] z-50 flex justify-center px-4 md:bottom-6 md:justify-end md:px-6">
      {visible && lastAdded && (
        <div key={lastAdded.at} className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-center gap-3 rounded-2xl bg-stone-900/95 p-3 pr-2 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur">
          {lastAdded.image?.startsWith("/") ? (
            <Image src={lastAdded.image} alt="" width={48} height={48} className="h-12 w-12 shrink-0 rounded-xl object-cover" />
          ) : (
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-600"><CircleCheck className="h-6 w-6" /></span>
          )}
          <div className="min-w-0 flex-1 text-sm">
            <p className="flex items-center gap-1.5 font-semibold text-brand-300"><CircleCheck className="h-4 w-4" aria-hidden /> Đã thêm vào giỏ</p>
            <p className="truncate text-white/80">{lastAdded.name}</p>
          </div>
          <Link href="/gio-hang" className="shrink-0 rounded-xl bg-white px-3 py-2 text-xs font-bold text-stone-900 transition hover:bg-brand-50">Xem giỏ</Link>
          <button type="button" onClick={() => setVisible(false)} aria-label="Đóng thông báo" className="shrink-0 rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
}
