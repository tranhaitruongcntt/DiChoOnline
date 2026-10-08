import Image from "next/image";

/** Banner đầu trang dùng chung cho các trang nội dung. */
export default function PageHero({ image, eyebrow, title, desc, children }: { image: string; eyebrow?: string; title: string; desc?: string; children?: React.ReactNode }) {
  return (
    <header className="relative mt-4 animate-fade-up overflow-hidden rounded-3xl bg-brand-900 text-white">
      <Image src={image} alt="" fill priority sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/80 to-brand-900/10" />
      <div className="relative max-w-2xl p-6 sm:p-12">
        {eyebrow && <span className="badge bg-white/15 text-white ring-1 ring-white/30">{eyebrow}</span>}
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">{title}</h1>
        {desc && <p className="mt-3 text-white/85 sm:text-lg">{desc}</p>}
        {children}
      </div>
    </header>
  );
}
