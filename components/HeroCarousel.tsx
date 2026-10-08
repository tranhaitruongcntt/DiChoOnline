"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type Slide = {
  image: string;
  eyebrow: string;
  title: [string, string, string?]; // [phần đầu, phần nhấn mạnh, phần cuối]
  desc: string;
  cta: { label: string; href: string };
  cta2?: { label: string; href: string };
};

const DURATION = 6000;

/** Băng chuyền banner: tự chạy, tạm dừng khi rê chuột/focus, vuốt trên điện thoại, tôn trọng reduced-motion. */
export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const touchX = useRef<number | null>(null);
  const n = slides.length;
  const go = useCallback((i: number) => setIndex(((i % n) + n) % n), [n]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);
  useEffect(() => {
    if (paused || reduced) return;
    const t = setTimeout(() => go(index + 1), DURATION);
    return () => clearTimeout(t);
  }, [index, paused, reduced, go]);

  return (
    <section aria-roledescription="carousel" aria-label="Chương trình nổi bật"
      className="relative h-[460px] overflow-hidden bg-brand-900 text-white sm:h-[500px] lg:h-[540px]"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}>
      {slides.map((s, i) => {
        const on = i === index;
        const Heading = i === 0 ? "h1" : "p";
        return (
          <div key={s.image} role="group" aria-roledescription="slide" aria-label={`${i + 1} / ${n}`} aria-hidden={!on}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${on ? "z-10 opacity-100" : "z-0 opacity-0"}`}>
            <Image src={s.image} alt="" fill priority={i === 0} sizes="100vw"
              className={`object-cover transition-transform ease-out ${on ? "scale-100 duration-[7000ms]" : "scale-110 duration-0"}`} />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-900/70 to-brand-900/5" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 via-transparent to-transparent sm:hidden" />
            {on && (
              <div className="container-x relative flex h-full flex-col justify-center pb-10">
                <div className="max-w-xl">
                  <span className="badge animate-fade-up bg-white/15 text-white ring-1 ring-white/30">{s.eyebrow}</span>
                  <Heading className="mt-4 animate-fade-up font-display text-4xl font-bold leading-[1.12] tracking-tight [animation-delay:90ms] sm:text-5xl xl:text-[3.5rem]">
                    {s.title[0]}<br /><span className="text-accent-400">{s.title[1]}</span>{s.title[2] ?? ""}
                  </Heading>
                  <p className="mt-4 max-w-lg animate-fade-up text-base text-white/85 [animation-delay:180ms] sm:text-lg">{s.desc}</p>
                  <div className="mt-7 flex animate-fade-up flex-wrap gap-3 [animation-delay:270ms]">
                    <Link href={s.cta.href} tabIndex={on ? 0 : -1} className="btn bg-white px-6 py-3 text-base text-brand-800 shadow-lg hover:bg-brand-50">{s.cta.label}</Link>
                    {s.cta2 && <Link href={s.cta2.href} tabIndex={on ? 0 : -1} className="btn px-6 py-3 text-base text-white ring-1 ring-white/50 hover:bg-white/10">{s.cta2.label}</Link>}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="absolute inset-x-0 bottom-14 z-20 sm:bottom-16">
        <div className="container-x flex items-center gap-3">
          <div className="flex gap-2">
            {slides.map((s, i) => (
              <button key={s.image} type="button" onClick={() => go(i)} aria-label={`Chuyển tới banner ${i + 1}`} aria-current={i === index}
                className="relative h-1.5 w-8 overflow-hidden rounded-full bg-white/30 transition-all hover:bg-white/50 sm:w-12">
                {i === index && (
                  <span key={`${index}-${paused}`} className="absolute inset-y-0 left-0 rounded-full bg-white"
                    style={reduced || paused ? { width: "100%" } : { animation: `progress ${DURATION}ms linear both` }} />
                )}
              </button>
            ))}
          </div>
          <div className="ml-auto hidden gap-2 sm:flex">
            <button type="button" onClick={() => go(index - 1)} aria-label="Banner trước" className="grid h-10 w-10 place-items-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur transition hover:bg-white/25"><ChevronLeft className="h-5 w-5" /></button>
            <button type="button" onClick={() => go(index + 1)} aria-label="Banner sau" className="grid h-10 w-10 place-items-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur transition hover:bg-white/25"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
