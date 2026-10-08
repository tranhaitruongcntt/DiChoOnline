"use client";

import { useEffect, useState } from "react";

/** Đếm ngược tới 23:59:59 hôm nay (giờ Việt Nam). */
function remaining() {
  const now = new Date();
  const vn = new Date(now.getTime() + (now.getTimezoneOffset() + 420) * 60000);
  const end = new Date(vn); end.setHours(23, 59, 59, 999);
  return Math.max(0, Math.floor((end.getTime() - vn.getTime()) / 1000));
}

export default function Countdown({ className = "" }: { className?: string }) {
  const [sec, setSec] = useState<number | null>(null);
  useEffect(() => {
    setSec(remaining());
    const t = setInterval(() => setSec(remaining()), 1000);
    return () => clearInterval(t);
  }, []);
  const parts = sec === null ? ["--", "--", "--"] : [Math.floor(sec / 3600), Math.floor((sec % 3600) / 60), sec % 60].map((v) => String(v).padStart(2, "0"));
  return (
    <div className={`flex items-center gap-1.5 ${className}`} role="timer" aria-label="Thời gian ưu đãi còn lại">
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="grid h-9 min-w-9 place-items-center rounded-lg bg-stone-900 px-1.5 font-display text-base font-bold tabular-nums text-white shadow-inner">
            <span key={p} className="animate-fade-in">{p}</span>
          </span>
          {i < 2 && <span className="font-bold text-stone-900">:</span>}
        </span>
      ))}
    </div>
  );
}
