import Link from "next/link";
import { getCategories } from "@/lib/catalog";
import { site } from "@/lib/site";

export default function Footer() {
  const categories = getCategories();
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white">
      <div className="container-x grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-extrabold text-brand-800">🧺 {site.name}</p>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{site.description}</p>
        </div>
        <div>
          <h2 className="font-semibold text-stone-800">Danh mục</h2>
          <ul className="mt-3 space-y-2 text-sm text-stone-600">
            {categories.map((c) => <li key={c.id}><Link href={`/danh-muc/${c.slug}`} className="hover:text-brand-700">{c.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-stone-800">Hỗ trợ</h2>
          <ul className="mt-3 space-y-2 text-sm text-stone-600">
            <li><Link href="/tra-cuu-don-hang" className="hover:text-brand-700">Tra cứu đơn hàng</Link></li>
            <li><Link href="/gio-hang" className="hover:text-brand-700">Giỏ hàng</Link></li>
            <li>Đổi trả trong 24h nếu sản phẩm không tươi</li>
          </ul>
        </div>
        <address className="not-italic">
          <h2 className="font-semibold text-stone-800">Liên hệ</h2>
          <ul className="mt-3 space-y-2 text-sm text-stone-600">
            <li>📍 {site.address}</li>
            <li>📞 <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-brand-700">{site.phone}</a></li>
            <li>✉️ <a href={`mailto:${site.email}`} className="hover:text-brand-700">{site.email}</a></li>
            <li>🕖 6:00 – 21:00 hằng ngày</li>
          </ul>
        </address>
      </div>
      <p className="border-t border-stone-100 py-4 text-center text-xs text-stone-500">© {new Date().getFullYear()} {site.name}. Bảo lưu mọi quyền.</p>
    </footer>
  );
}
