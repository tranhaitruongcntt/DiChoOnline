"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, LayoutGrid, PackageSearch, Search, ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";

const ITEMS = [
  { href: "/", label: "Trang chủ", Icon: House, match: (p: string) => p === "/" },
  { href: "/danh-muc", label: "Danh mục", Icon: LayoutGrid, match: (p: string) => p.startsWith("/danh-muc") },
  { href: "/tim-kiem", label: "Tìm kiếm", Icon: Search, match: (p: string) => p.startsWith("/tim-kiem") },
  { href: "/gio-hang", label: "Giỏ hàng", Icon: ShoppingCart, match: (p: string) => p.startsWith("/gio-hang") || p.startsWith("/thanh-toan") },
  { href: "/tra-cuu-don-hang", label: "Đơn hàng", Icon: PackageSearch, match: (p: string) => p.startsWith("/tra-cuu") },
];

/** Thanh điều hướng cố định ở đáy màn hình – chỉ hiện trên điện thoại. */
export default function MobileNav() {
  const pathname = usePathname();
  const { count, ready } = useCart();
  return (
    <nav aria-label="Điều hướng nhanh" className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <ul className="grid grid-cols-5">
        {ITEMS.map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? "page" : undefined}
                className={`relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors ${active ? "text-brand-700" : "text-stone-500"}`}>
                {active && <span className="absolute inset-x-5 top-0 h-0.5 animate-fade-in rounded-full bg-brand-600" />}
                <span className="relative">
                  <Icon className={`h-[22px] w-[22px] transition-transform duration-200 ${active ? "scale-110" : ""}`} strokeWidth={active ? 2.2 : 1.8} aria-hidden />
                  {href === "/gio-hang" && ready && count > 0 && (
                    <span key={count} className="absolute -right-2.5 -top-1.5 grid h-4 min-w-4 animate-pop place-items-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
