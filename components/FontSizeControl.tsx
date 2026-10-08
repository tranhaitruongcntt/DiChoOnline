"use client";

import { useEffect, useState } from "react";

export const FONT_KEY = "dicho_font";
export const FONT_LEVELS = [
  { v: "100%", label: "Chữ thường", short: "A" },
  { v: "112.5%", label: "Chữ lớn", short: "A+" },
  { v: "125%", label: "Chữ rất lớn", short: "A++" },
] as const;

/** Chỉnh cỡ chữ toàn trang (phù hợp người lớn tuổi). Lưu lựa chọn trên trình duyệt. */
export default function FontSizeControl({ tone = "dark", compact = false }: { tone?: "dark" | "light"; compact?: boolean }) {
  const [level, setLevel] = useState(0);
  useEffect(() => {
    try { const i = FONT_LEVELS.findIndex((l) => l.v === localStorage.getItem(FONT_KEY)); if (i >= 0) setLevel(i); } catch { /* bỏ qua */ }
  }, []);
  const apply = (i: number) => {
    setLevel(i);
    document.documentElement.style.fontSize = FONT_LEVELS[i].v;
    try { localStorage.setItem(FONT_KEY, FONT_LEVELS[i].v); } catch { /* bỏ qua */ }
  };
  if (compact) {
    const next = (level + 1) % FONT_LEVELS.length;
    return (
      <button type="button" onClick={() => apply(next)} aria-label={`Cỡ chữ: ${FONT_LEVELS[level].label}. Bấm để đổi sang ${FONT_LEVELS[next].label}`}
        className="flex items-center gap-1 rounded-md bg-white/15 px-2 py-0.5 font-semibold">
        <span className="text-[11px]">A</span><span className="text-[14px] leading-none">A</span>
        {level > 0 && <span className="text-[10px]">{FONT_LEVELS[level].short.slice(1)}</span>}
      </button>
    );
  }
  const base = tone === "dark" ? "text-brand-50/80 hover:bg-white/15" : "text-stone-600 hover:bg-stone-100";
  const on = tone === "dark" ? "bg-white text-brand-800" : "bg-brand-600 text-white";
  return (
    <div role="group" aria-label="Cỡ chữ" className="flex items-center gap-1">
      <span className={`mr-0.5 ${tone === "dark" ? "text-brand-50/80" : "text-stone-500"}`}>Cỡ chữ</span>
      {FONT_LEVELS.map((l, i) => (
        <button key={l.v} type="button" onClick={() => apply(i)} aria-pressed={level === i} aria-label={l.label} title={l.label}
          className={`grid h-6 min-w-6 place-items-center rounded-md px-1 font-bold leading-none transition-colors ${level === i ? on : base}`}
          style={{ fontSize: `${11 + i * 2}px` }}>
          {l.short}
        </button>
      ))}
    </div>
  );
}
