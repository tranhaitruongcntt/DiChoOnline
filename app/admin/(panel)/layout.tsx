import { LayoutDashboard, LogOut, Package, ReceiptText, ShoppingBasket, Store } from "lucide-react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "../actions";

const NAV = [
  { href: "/admin", label: "Tổng quan", Icon: LayoutDashboard },
  { href: "/admin/don-hang", label: "Đơn hàng", Icon: ReceiptText },
  { href: "/admin/san-pham", label: "Sản phẩm", Icon: Package },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="lg:grid lg:grid-cols-[230px_1fr]">
      <aside className="border-b border-stone-200 bg-white lg:sticky lg:top-0 lg:h-dvh lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-2 p-4 lg:block">
          <Link href="/admin" className="flex items-center gap-2 font-extrabold text-brand-800"><span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white"><ShoppingBasket className="h-4 w-4" aria-hidden /></span> Quản trị</Link>
          <nav className="flex gap-1 lg:mt-6 lg:flex-col">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-brand-50 hover:text-brand-700">
                <n.Icon className="h-4 w-4" aria-hidden /><span className="hidden sm:inline">{n.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="hidden border-t border-stone-100 p-4 text-sm lg:absolute lg:bottom-0 lg:block lg:w-full">
          <p className="text-stone-500">Đăng nhập: <strong className="text-stone-700">{admin.username}</strong></p>
          <form action={logoutAction}><button className="mt-2 flex items-center gap-1.5 text-rose-600 hover:underline"><LogOut className="h-4 w-4" aria-hidden />Đăng xuất</button></form>
          <Link href="/" className="mt-1 flex items-center gap-1.5 text-stone-500 hover:text-brand-700"><Store className="h-4 w-4" aria-hidden />Xem cửa hàng</Link>
        </div>
      </aside>
      <div className="min-w-0 p-4 sm:p-6 lg:p-8">
        <form action={logoutAction} className="mb-4 text-right text-sm lg:hidden"><button className="text-rose-600">Đăng xuất ({admin.username})</button></form>
        {children}
      </div>
    </div>
  );
}
