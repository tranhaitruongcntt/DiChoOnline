const GRADIENTS: Record<string, string> = {
  "rau-cu": "from-lime-100 via-emerald-50 to-green-100",
  "trai-cay": "from-orange-100 via-amber-50 to-rose-100",
  "thit-tuoi": "from-rose-100 via-red-50 to-orange-100",
  "hai-san": "from-sky-100 via-cyan-50 to-blue-100",
  "trung-sua": "from-yellow-100 via-amber-50 to-stone-100",
  "do-kho-gia-vi": "from-amber-100 via-orange-50 to-yellow-100",
};

export default function ProductVisual({
  icon, image, name, category, size = "md",
}: { icon: string; image?: string | null; name: string; category: string; size?: "md" | "lg" }) {
  const g = GRADIENTS[category] ?? "from-stone-100 to-stone-50";
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={name} loading="lazy" decoding="async" className="aspect-square w-full rounded-xl object-cover" />;
  }
  return (
    <div role="img" aria-label={name} className={`grid aspect-square w-full place-items-center rounded-xl bg-gradient-to-br ${g}`}>
      <span aria-hidden className={`${size === "lg" ? "text-[9rem]" : "text-6xl"} drop-shadow-sm transition-transform duration-300 group-hover:scale-110`}>
        {icon}
      </span>
    </div>
  );
}
