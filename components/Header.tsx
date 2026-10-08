import Link from "next/link";
import { Headset, ShoppingBasket, Truck } from "lucide-react";
import SearchBox from "./SearchBox";
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
      <div className="container-x flex flex-wrap items-center gap-x-2 gap-y-2.5 py-2.5 sm:gap-x-5 md:flex-nowrap md:py-3">
        <MobileDrawer categories={menu} phone={site.phone} />
        <Link href="/" className="group flex shrink-0 items-center gap-2" aria-label={`${site.name} – Trang chủ`}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"><ShoppingBasket className="h-5 w-5" aria-hidden /></span>
          <span className="leading-tight">
            <span className="font-display block text-lg font-bold tracking-tight text-brand-800">Đi Chợ Online</span>
            <span className="hidden text-[11px] text-stone-500 sm:block">Tươi mỗi ngày · Giao 2 giờ</span>
          </span>
        </Link>
        <SearchBox />
        <a href={tel} className="group hidden items-center gap-2.5 lg:flex">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-100"><Headset className="h-5 w-5" aria-hidden /></span>
          <span className="leading-tight">
            <span className="block text-[11px] text-stone-500">Hotline 6:00 – 21:00</span>
            <span className="font-display block font-bold text-stone-800 group-hover:text-brand-700">{site.phone}</span>
          </span>
        </a>
        <div className="ml-auto md:ml-0"><CartButton /></div>
      </div>
      <MegaMenu categories={menu} maxDiscount={maxDiscount} />
    </header>
  );
}
