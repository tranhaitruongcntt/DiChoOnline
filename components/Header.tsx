import Link from "next/link";
import CartButton from "./CartButton";
import { getCategories } from "@/lib/catalog";
import { site } from "@/lib/site";

export default function Header() {
  const categories = getCategories();
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="bg-brand-700 text-center text-xs text-brand-50">
        <p className="container-x py-1.5">🚚 Miễn phí giao hàng cho đơn từ 300.000đ · Hotline <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="font-semibold underline-offset-2 hover:underline">{site.phone}</a></p>
      </div>
      <div className="container-x flex items-center gap-3 py-3 sm:gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label={`${site.name} – Trang chủ`}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-xl shadow-sm">🧺</span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-lg font-extrabold tracking-tight text-brand-800">Đi Chợ Online</span>
            <span className="block text-[11px] text-stone-500">Tươi mỗi ngày · Giao 2 giờ</span>
          </span>
        </Link>
        <form action="/tim-kiem" method="get" role="search" className="relative flex-1">
          <label htmlFor="q" className="sr-only">Tìm sản phẩm</label>
          <input id="q" name="q" type="search" maxLength={80} placeholder="Tìm rau, thịt, cá, trái cây…" className="input rounded-full bg-stone-100 pl-10 focus:bg-white" />
          <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
        </form>
        <Link href="/tra-cuu-don-hang" className="hidden text-sm font-medium text-stone-600 hover:text-brand-700 md:block">Tra cứu đơn</Link>
        <CartButton />
      </div>
      <nav aria-label="Danh mục" className="border-t border-stone-100">
        <ul className="container-x flex gap-1 overflow-x-auto py-2 text-sm [scrollbar-width:none]">
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={`/danh-muc/${c.slug}`} className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-stone-600 transition hover:bg-brand-50 hover:text-brand-700">
                <span aria-hidden>{c.icon}</span>{c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
