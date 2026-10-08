import Link from "next/link";
import { Headset, Search, ShoppingBasket, Truck } from "lucide-react";
import { ProductIcon } from "./icons";
import CartButton from "./CartButton";
import MegaMenu from "./MegaMenu";
import MobileDrawer from "./MobileDrawer";
import { getDeals, getMenuData } from "@/lib/catalog";
import { site } from "@/lib/site";

export default function Header() {
  const menu = getMenuData();
  const maxDiscount = Math.max(0, ...getDeals(20).map((d) => Math.round((1 - d.price / (d.compare_price ?? d.price)) * 100)));
  const tel = `tel:${site.phone.replace(/\s/g, "")}`;
  return (
    <header className="header-elevate sticky top-0 z-40 border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
      <div className="bg-brand-700 text-center text-xs text-brand-50">
        <p className="container-x flex items-center justify-center gap-1.5 py-1.5"><Truck className="h-3.5 w-3.5" aria-hidden /> Miễn phí giao hàng cho đơn từ 300.000đ<span className="hidden sm:inline">&nbsp;· Đặt trước 18:00 giao trong ngày</span></p>
      </div>
      <div className="container-x flex items-center gap-2 py-3 sm:gap-5">
        <MobileDrawer categories={menu} phone={site.phone} />
        <Link href="/" className="group flex shrink-0 items-center gap-2" aria-label={`${site.name} – Trang chủ`}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"><ShoppingBasket className="h-5 w-5" aria-hidden /></span>
          <span className="hidden leading-tight sm:block">
            <span className="font-display block text-lg font-bold tracking-tight text-brand-800">Đi Chợ Online</span>
            <span className="block text-[11px] text-stone-500">Tươi mỗi ngày · Giao 2 giờ</span>
          </span>
        </Link>
        <form action="/tim-kiem" method="get" role="search" className="relative flex-1">
          <label htmlFor="q" className="sr-only">Tìm sản phẩm</label>
          <input id="q" name="q" type="search" maxLength={80} placeholder="Tìm rau, thịt, cá, trái cây…" className="input rounded-full bg-stone-100 pl-10 focus:bg-white" />
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden />
        </form>
        <a href={tel} className="group hidden items-center gap-2.5 lg:flex">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-100"><Headset className="h-5 w-5" aria-hidden /></span>
          <span className="leading-tight">
            <span className="block text-[11px] text-stone-500">Hotline 6:00 – 21:00</span>
            <span className="font-display block font-bold text-stone-800 group-hover:text-brand-700">{site.phone}</span>
          </span>
        </a>
        <CartButton />
      </div>
      <MegaMenu categories={menu} maxDiscount={maxDiscount} />
      <nav aria-label="Danh mục" className="border-t border-stone-100 md:hidden">
        <ul className="container-x flex gap-1 overflow-x-auto py-2 text-sm [scrollbar-width:none]">
          {menu.map((c) => (
            <li key={c.id}>
              <Link href={`/danh-muc/${c.slug}`} className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-stone-600 transition-colors duration-200 hover:bg-brand-50 hover:text-brand-700">
                <ProductIcon name={c.icon} className="h-4 w-4 text-brand-600" />{c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
