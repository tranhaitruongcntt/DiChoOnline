import Image from "next/image";
import { ProductIcon } from "./icons";

const THEMES: Record<string, { bg: string; fg: string }> = {
  "rau-cu": { bg: "from-lime-50 via-emerald-50 to-green-100", fg: "text-emerald-600" },
  "trai-cay": { bg: "from-orange-50 via-amber-50 to-rose-100", fg: "text-orange-500" },
  "thit-tuoi": { bg: "from-rose-50 via-red-50 to-orange-100", fg: "text-rose-500" },
  "hai-san": { bg: "from-sky-50 via-cyan-50 to-blue-100", fg: "text-sky-600" },
  "trung-sua": { bg: "from-yellow-50 via-amber-50 to-stone-100", fg: "text-amber-500" },
  "do-kho-gia-vi": { bg: "from-amber-50 via-orange-50 to-yellow-100", fg: "text-amber-700" },
};
export const categoryTheme = (slug: string) => THEMES[slug] ?? { bg: "from-stone-50 to-stone-100", fg: "text-brand-600" };

export default function ProductVisual({
  icon, image, name, category, size = "md", priority = false,
}: { icon: string; image?: string | null; name: string; category: string; size?: "sm" | "md" | "lg"; priority?: boolean }) {
  if (image) {
    return (
      <Image
        src={image} alt={name} width={800} height={800}
        sizes={size === "lg" ? "(min-width: 1024px) 50vw, 100vw" : size === "sm" ? "96px" : "(min-width: 1280px) 220px, (min-width: 640px) 30vw, 50vw"}
        priority={priority} unoptimized={!image.startsWith("/")}
        className="aspect-square w-full rounded-xl bg-stone-100 object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
    );
  }
  const t = categoryTheme(category);
  const ring = { sm: "w-3/4", md: "w-1/2", lg: "w-2/5" }[size];
  return (
    <div role="img" aria-label={name} className={`relative grid aspect-square w-full place-items-center overflow-hidden rounded-xl bg-gradient-to-br ${t.bg}`}>
      <div aria-hidden className="absolute -right-6 -top-6 h-1/2 w-1/2 rounded-full bg-white/40" />
      <div aria-hidden className="absolute -bottom-8 -left-8 h-1/2 w-1/2 rounded-full bg-white/30" />
      <div className={`relative grid aspect-square ${ring} place-items-center rounded-full bg-white/80 shadow-sm ring-1 ring-white transition-transform duration-300 group-hover:scale-105`}>
        <ProductIcon name={icon} className={`h-1/2 w-1/2 ${t.fg}`} strokeWidth={size === "sm" ? 2 : 1.5} />
      </div>
    </div>
  );
}
