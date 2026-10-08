"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Nút lên đầu trang – hiện khi đã cuộn xa. */
export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let frame = 0;
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; setShow(window.scrollY > 900); }); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);
  return (
    <button type="button" aria-label="Lên đầu trang" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-4 z-30 grid h-11 w-11 place-items-center rounded-full bg-white text-brand-700 shadow-lg ring-1 ring-stone-200 transition-all duration-300 hover:bg-brand-600 hover:text-white bottom-[calc(140px+env(safe-area-inset-bottom))] md:bottom-6 md:right-6 ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}>
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
