"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Clock, Loader2, Mic, Search, TrendingUp, X } from "lucide-react";
import { ProductIcon } from "./icons";
import { formatPrice } from "@/lib/format";

type Item = { slug: string; name: string; price: number; compare_price: number | null; unit: string; image: string | null; icon: string; category: string };

const RECENT_KEY = "dicho_recent_search";
const POPULAR = ["Rau muống", "Cá hồi", "Tôm sú", "Xoài", "Thịt bò", "Gạo ST25"];

const readRecent = (): string[] => { try { const v = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); return Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 5) : []; } catch { return []; } };
const saveRecent = (q: string) => { try { localStorage.setItem(RECENT_KEY, JSON.stringify([q, ...readRecent().filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 5))); } catch { /* bỏ qua */ } };

/** Ô tìm kiếm có gợi ý tức thì, lịch sử tìm kiếm và điều hướng bằng bàn phím. */
export default function SearchBox() {
  const router = useRouter();
  const id = useId();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const [listening, setListening] = useState(false);
  const [canVoice, setCanVoice] = useState(false);
  const wrap = useRef<HTMLFormElement>(null);
  const input = useRef<HTMLInputElement>(null);

  // Gọi API gợi ý (debounce 180ms, huỷ request cũ)
  useEffect(() => {
    const term = q.trim();
    setHi(-1);
    if (!term) { setItems([]); setLoading(false); return; }
    const ctrl = new AbortController();
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/goi-y?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        if (r.ok) setItems((await r.json()).items ?? []);
      } catch { /* bị huỷ hoặc lỗi mạng */ }
      finally { if (!ctrl.signal.aborted) setLoading(false); }
    }, 180);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [q]);

  useEffect(() => { setCanVoice(typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition)); }, []);

  // Tìm kiếm bằng giọng nói (tiếng Việt) – tiện cho người lớn tuổi, không cần gõ dấu
  const voice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "vi-VN";
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    setListening(true);
    setOpen(true);
    rec.onresult = (e) => {
      const text = Array.from(e.results).map((r) => r[0].transcript).join(" ").trim();
      setQ(text);
      if (e.results[e.results.length - 1].isFinal && text) go(text);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const go = (term: string) => {
    const t = term.trim();
    if (!t) return;
    saveRecent(t);
    setOpen(false);
    input.current?.blur();
    router.push(`/tim-kiem?q=${encodeURIComponent(t)}`);
  };
  const goProduct = (slug: string) => { saveRecent(q.trim() || slug); setOpen(false); input.current?.blur(); router.push(`/san-pham/${slug}`); };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setOpen(false); input.current?.blur(); return; }
    if (!items.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setHi((h) => (h + 1) % items.length); }
    if (e.key === "ArrowUp") { e.preventDefault(); setHi((h) => (h <= 0 ? items.length - 1 : h - 1)); }
    if (e.key === "Enter" && hi >= 0) { e.preventDefault(); goProduct(items[hi].slug); }
  };

  const term = q.trim();
  const listId = `${id}-list`;

  return (
    <form ref={wrap} action="/tim-kiem" method="get" role="search" onSubmit={(e) => { e.preventDefault(); go(q); }}
      className="relative order-last basis-full md:order-none md:flex-1 md:basis-auto">
      <label htmlFor={`${id}-q`} className="sr-only">Tìm sản phẩm</label>
      <input ref={input} id={`${id}-q`} name="q" type="search" maxLength={60} autoComplete="off" enterKeyHint="search"
        role="combobox" aria-expanded={open} aria-controls={listId} aria-autocomplete="list"
        aria-activedescendant={hi >= 0 ? `${id}-opt-${hi}` : undefined}
        value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => { setRecent(readRecent()); setOpen(true); }} onKeyDown={onKey}
        placeholder="Tìm rau, thịt, cá, trái cây…"
        className={`input rounded-full bg-stone-100 pl-10 pr-20 focus:bg-white ${open ? "md:rounded-b-none md:rounded-t-2xl" : ""}`} />
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden />
      <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
        {loading ? <Loader2 className="mx-1.5 h-4 w-4 animate-spin text-brand-600" aria-hidden />
          : q && <button type="button" onClick={() => { setQ(""); input.current?.focus(); }} aria-label="Xoá nội dung tìm kiếm" className="grid h-8 w-8 place-items-center rounded-full text-stone-400 hover:bg-stone-200 hover:text-stone-600"><X className="h-4 w-4" /></button>}
        {canVoice && (
          <button type="button" onClick={voice} aria-label={listening ? "Đang nghe…" : "Tìm bằng giọng nói"} title="Tìm bằng giọng nói"
            className={`relative grid h-8 w-8 place-items-center rounded-full transition-colors ${listening ? "bg-rose-500 text-white" : "text-brand-700 hover:bg-brand-50"}`}>
            {listening && <span className="absolute inset-0 animate-ping rounded-full bg-rose-400/60" />}
            <Mic className="relative h-4 w-4" />
          </button>
        )}
      </div>

      {open && (
        <div id={listId} className="absolute inset-x-0 top-full z-50 mt-1 animate-toast-in overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl shadow-stone-900/10 md:mt-0 md:rounded-t-none md:border-t-0">
          {listening && <p className="flex items-center gap-2 border-b border-stone-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"><Mic className="h-4 w-4" /> Đang nghe… hãy nói tên sản phẩm, ví dụ “cá hồi”</p>}
          {!term ? (
            <div className="space-y-4 p-4">
              {recent.length > 0 && (
                <div>
                  <p className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Tìm kiếm gần đây
                    <button type="button" onClick={() => { try { localStorage.removeItem(RECENT_KEY); } catch { /* bỏ qua */ } setRecent([]); }} className="normal-case tracking-normal text-brand-700 hover:underline">Xoá</button>
                  </p>
                  <ul className="mt-2">
                    {recent.map((r) => (
                      <li key={r}><button type="button" onClick={() => go(r)} className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm text-stone-700 hover:bg-stone-50"><Clock className="h-4 w-4 text-stone-400" />{r}</button></li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400"><TrendingUp className="h-3.5 w-3.5" /> Tìm nhiều nhất</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {POPULAR.map((k) => <button key={k} type="button" onClick={() => go(k)} className="rounded-full bg-stone-100 px-3 py-1.5 text-sm text-stone-600 transition-colors hover:bg-brand-50 hover:text-brand-700">{k}</button>)}
                </div>
              </div>
            </div>
          ) : (
            <>
              <ul role="listbox" aria-label="Gợi ý sản phẩm" className="max-h-[60vh] overflow-y-auto p-2">
                {items.map((it, i) => (
                  <li key={it.slug} id={`${id}-opt-${i}`} role="option" aria-selected={i === hi}>
                    <Link href={`/san-pham/${it.slug}`} onClick={(e) => { e.preventDefault(); goProduct(it.slug); }} onMouseEnter={() => setHi(i)}
                      className={`flex items-center gap-3 rounded-xl p-2 transition-colors ${i === hi ? "bg-brand-50" : ""}`}>
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                        {it.image ? <Image src={it.image} alt="" fill sizes="48px" className="object-cover" /> : <span className="grid h-full place-items-center"><ProductIcon name={it.icon} className="h-5 w-5 text-brand-600" /></span>}
                      </span>
                      <span className="min-w-0 flex-1">
                        <Highlight text={it.name} term={term} />
                        <span className="block text-xs text-stone-400">{it.category}</span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block font-display text-sm font-bold text-brand-700">{formatPrice(it.price)}</span>
                        <span className="block text-xs text-stone-400">/{it.unit}</span>
                      </span>
                    </Link>
                  </li>
                ))}
                {!loading && items.length === 0 && <li className="px-3 py-6 text-center text-sm text-stone-500">Không tìm thấy “{term}”. Thử từ khoá khác nhé.</li>}
              </ul>
              <button type="submit" className="flex w-full items-center justify-center gap-2 border-t border-stone-100 bg-stone-50 px-4 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50">
                <Search className="h-4 w-4" /> Xem tất cả kết quả cho “{term}”
              </button>
            </>
          )}
        </div>
      )}
    </form>
  );
}

/** Tô đậm phần khớp từ khoá (so khớp không dấu). */
function Highlight({ text, term }: { text: string; term: string }) {
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase();
  const i = norm(text).indexOf(norm(term));
  if (i < 0 || !term) return <span className="block truncate text-sm font-medium text-stone-800">{text}</span>;
  return (
    <span className="block truncate text-sm font-medium text-stone-800">
      {text.slice(0, i)}<mark className="rounded bg-accent-400/30 px-0.5 text-stone-900">{text.slice(i, i + term.length)}</mark>{text.slice(i + term.length)}
    </span>
  );
}

// Kiểu tối thiểu cho Web Speech API (chưa có trong lib DOM của TypeScript)
type VoiceResultEvent = { results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> };
type VoiceRecognizer = {
  lang: string; interimResults: boolean; maxAlternatives: number; start(): void;
  onresult: ((e: VoiceResultEvent) => void) | null; onerror: (() => void) | null; onend: (() => void) | null;
};
declare global {
  interface Window { SpeechRecognition?: new () => VoiceRecognizer; webkitSpeechRecognition?: new () => VoiceRecognizer }
}
