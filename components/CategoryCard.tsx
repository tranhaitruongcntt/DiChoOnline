import Image from "next/image";
import Link from "next/link";
import { ProductIcon } from "./icons";
import { categoryTheme } from "./ProductVisual";
import type { Category } from "@/lib/catalog";

export default function CategoryCard({ c, sizes = "(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw" }: { c: Category; sizes?: string }) {
  return (
    <Link href={`/danh-muc/${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-stone-200 shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-lg">
      {c.cover ? (
        <Image src={c.cover} alt="" fill sizes={sizes} className="object-cover transition-transform duration-500 group-hover:scale-105" />
      ) : (
        <span className={`absolute inset-0 grid place-items-center bg-gradient-to-br ${categoryTheme(c.slug).bg}`}><ProductIcon name={c.icon} className={`h-12 w-12 ${categoryTheme(c.slug).fg}`} /></span>
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 p-3 text-white">
        <span className="flex items-center gap-1.5 text-base font-bold"><ProductIcon name={c.icon} className="h-4 w-4" />{c.name}</span>
        <span className="text-xs text-white/80">{c.product_count} sản phẩm</span>
      </span>
    </Link>
  );
}
