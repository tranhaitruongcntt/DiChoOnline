import Link from "next/link";
import { ProductGrid } from "@/components/ProductCard";
import { getCategories, getDeals, getFeaturedProducts } from "@/lib/catalog";

export default function HomePage() {
  const categories = getCategories();
  const featured = getFeaturedProducts(10);
  const deals = getDeals(5);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-500 text-white">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl" />
        <div className="container-x relative grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="badge bg-white/15 text-white ring-1 ring-white/30">🌿 Tươi mới mỗi sáng</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Đi chợ online,<br /> <span className="text-accent-400">tươi ngon</span> tận cửa nhà
            </h1>
            <p className="mt-4 max-w-lg text-lg text-brand-50/90">
              Rau củ, trái cây, thịt cá tươi sạch có nguồn gốc rõ ràng. Đặt trước 18:00, giao nhanh trong 2 giờ khắp TP.HCM.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/danh-muc/rau-cu" className="btn bg-white px-6 py-3 text-base text-brand-800 shadow-lg hover:bg-brand-50">Mua sắm ngay</Link>
              <a href="#uu-dai" className="btn px-6 py-3 text-base text-white ring-1 ring-white/50 hover:bg-white/10">Xem ưu đãi</a>
            </div>
          </div>
          <div aria-hidden className="hidden grid-cols-3 gap-4 md:grid">
            {["🥬", "🍅", "🥕", "🍉", "🦐", "🥩", "🥭", "🥚", "🍇"].map((e, i) => (
              <div key={e} className={`grid aspect-square place-items-center rounded-3xl bg-white/15 text-6xl shadow-lg ring-1 ring-white/20 backdrop-blur ${i % 2 ? "translate-y-4" : ""}`}>{e}</div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Cam kết" className="container-x -mt-8 relative z-10">
        <ul className="card grid grid-cols-2 gap-4 p-5 text-sm md:grid-cols-4">
          {[
            ["🚚", "Giao nhanh 2 giờ", "Miễn phí từ 300K"],
            ["🌱", "Nguồn gốc rõ ràng", "Chuẩn VietGAP"],
            ["🔄", "Đổi trả 24h", "Nếu không tươi"],
            ["💳", "Thanh toán linh hoạt", "COD hoặc chuyển khoản"],
          ].map(([i, t, d]) => (
            <li key={t} className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-xl" aria-hidden>{i}</span>
              <span><strong className="block text-stone-800">{t}</strong><span className="text-stone-500">{d}</span></span>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-x mt-14" aria-labelledby="dm">
        <h2 id="dm" className="text-2xl font-bold text-stone-800">Danh mục sản phẩm</h2>
        <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={`/danh-muc/${c.slug}`} className="card group flex flex-col items-center gap-2 p-4 text-center transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-4xl transition group-hover:scale-110" aria-hidden>{c.icon}</span>
                <span className="text-sm font-semibold text-stone-700">{c.name}</span>
                <span className="text-xs text-stone-400">{c.product_count} sản phẩm</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {deals.length > 0 && (
        <section id="uu-dai" className="container-x mt-14 scroll-mt-40" aria-labelledby="ud">
          <div className="rounded-3xl bg-gradient-to-r from-amber-50 to-rose-50 p-5 ring-1 ring-amber-100 sm:p-8">
            <h2 id="ud" className="text-2xl font-bold text-stone-800">🔥 Ưu đãi hôm nay</h2>
            <p className="mt-1 text-sm text-stone-600">Giá tốt nhất trong tuần – số lượng có hạn.</p>
            <div className="mt-5"><ProductGrid products={deals} /></div>
          </div>
        </section>
      )}

      <section className="container-x mt-14" aria-labelledby="nb">
        <h2 id="nb" className="text-2xl font-bold text-stone-800">Sản phẩm nổi bật</h2>
        <div className="mt-5"><ProductGrid products={featured} /></div>
      </section>

      <section className="container-x mt-16" aria-labelledby="gt">
        <div className="card grid gap-6 p-6 md:grid-cols-2 md:p-10">
          <div>
            <h2 id="gt" className="text-2xl font-bold text-stone-800">Vì sao chọn Đi Chợ Online?</h2>
            <div className="prose-vi mt-4">
              <p>Đi Chợ Online kết nối trực tiếp với hơn 50 nông trại và cơ sở đánh bắt đạt chuẩn, giúp bạn mua <strong>thực phẩm tươi sạch</strong> với giá như ngoài chợ mà không cần ra khỏi nhà.</p>
              <p>Mỗi đơn hàng được nhân viên lựa chọn kỹ, đóng gói sạch sẽ, giữ lạnh và giao tận tay trong vòng 2 giờ tại TP. Hồ Chí Minh.</p>
            </div>
          </div>
          <ol className="grid gap-3 text-sm">
            {[
              ["1", "Chọn sản phẩm", "Hơn 500 mặt hàng tươi sống & thiết yếu."],
              ["2", "Đặt hàng", "Không cần tài khoản – chỉ cần số điện thoại."],
              ["3", "Nhận hàng", "Kiểm tra hàng rồi mới thanh toán."],
            ].map(([n, t, d]) => (
              <li key={n} className="flex gap-4 rounded-2xl bg-stone-50 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-600 font-bold text-white">{n}</span>
                <span><strong className="block text-stone-800">{t}</strong><span className="text-stone-500">{d}</span></span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
