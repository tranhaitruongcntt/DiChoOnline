"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ReceiptText } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Tổng quan", Icon: LayoutDashboard },
  { href: "/admin/don-hang", label: "Đơn hàng", Icon: ReceiptText, badge: true },
  { href: "/admin/san-pham", label: "Sản phẩm", Icon: Package },
];

export default function AdminNav({ pending }: { pending: number }) {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 lg:mt-6 lg:flex-col" aria-label="Menu quản trị">
      {NAV.map(({ href, label, Icon, badge }) => {
        const on = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link key={href} href={href} aria-current={on ? "page" : undefined}
            className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${on ? "bg-brand-50 text-brand-700" : "text-stone-600 hover:bg-stone-50 hover:text-brand-700"}`}>
            {on && <span className="absolute inset-y-1.5 left-0 hidden w-1 rounded-full bg-brand-600 lg:block" />}
            <Icon className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">{label}</span>
            {badge && pending > 0 && (
              <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-amber-500 px-1.5 text-[11px] font-bold text-white" title={`${pending} đơn chờ xác nhận`}>{pending}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
