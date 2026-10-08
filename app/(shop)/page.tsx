import { CreditCard, Flame, RefreshCw, ShieldCheck, Sprout, Truck, type LucideIcon } from "lucide-react";
import { ProductIcon } from "@/components/icons";
import { categoryTheme } from "@/components/ProductVisual";
import Link from "next/link";
import Image from "next/image";
import { ProductGrid } from "@/components/ProductCard";
import { getCategories, getDeals, getFeaturedProducts } from "@/lib/catalog";

const HERO = [
  { src: "/images/products/rau-muong-huu-co.webp" },
  { src: "/images/products/ca-chua-bi-da-lat.webp" },
  { src: "/images/products/ca-hoi-na-uy.webp" },
];

export default function HomePage() {
  const categories = getCategories();
  const featured = getFeaturedProducts(10);
  const deals = getDeals(5);
  const maxDiscount = Math.max(0, ...deals.map((d) => Math.round((1 - d.price / (d.compare_price ?? d.price)) * 100)));

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-500 text-white">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl" />
        <div className="container-x relative grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="badge animate-fade-up gap-1.5 bg-white/15 text-white ring-1 ring-white/30"><Sprout className="h-3.5 w-3.5" aria-hidden /> Tươi mới mỗi sáng</p>
            <h1 className="mt-4 animate-fade-up text-4xl font-bold leading-[1.15] tracking-tight [animation-delay:100ms] sm:text-5xl xl:text-[3.5rem]">
              Đi chợ online,<br /> <span className="text-accent-400">tươi ngon</span> tận nhà
            </h1>
            <p className="mt-5 max-w-lg animate-fade-up text-lg text-brand-50/90 [animation-delay:200ms]">
              Rau củ, trái cây, thịt cá tươi sạch có nguồn gốc rõ ràng. Đặt trước 18:00, giao nhanh trong 2 giờ khắp TP.HCM.
            </p>
            <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:300ms]">
              <Link href="/danh-muc/rau-cu" className="btn bg-white px-6 py-3 text-base text-brand-800 shadow-lg hover:bg-brand-50">Mua sắm ngay</Link>
              <a href="#uu-dai" className="btn px-6 py-3 text-base text-white ring-1 ring-white/50 hover:bg-white/10">Xem ưu đãi</a>
            </div>
            <div aria-hidden className="mt-8 grid animate-fade-up grid-cols-3 gap-3 [animation-delay:400ms] md:hidden">
              {HERO.map((h) => (
                <div key={h.src} className="relative aspect-square overflow-hidden rounded-2xl ring-2 ring-white/30">
                  <Image src={h.src} alt="" fill sizes="33vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div aria-hidden className="relative hidden animate-fade-in [animation-delay:150ms] md:block">
            <div className="grid grid-cols-2 gap-4">
              {HERO.map((h, i) => (
                <div key={h.src} style={{ animationDelay: `${i * -2.3}s` }} className={`relative animate-float overflow-hidden rounded-3xl shadow-2xl ring-4 ring-white/20 ${i === 0 ? "row-span-2 aspect-[3/4.2]" : "aspect-[4/3]"}`}>
                  <Image src={h.src} alt="" fill priority={i === 0} sizes="(min-width: 1280px) 300px, 25vw" className="object-cover" />
                </div>
              ))}
            </div>
            <div className="absolute -left-6 bottom-10 flex animate-fade-up items-center gap-3 rounded-2xl bg-white px-4 py-3 text-stone-800 shadow-xl [animation-delay:600ms]">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700"><Truck className="h-5 w-5" /></span>
              <span className="text-sm leading-tight"><strong className="block">Giao trong 2 giờ</strong><span className="text-stone-500">Toàn TP. Hồ Chí Minh</span></span>
            </div>
            {maxDiscount > 0 && <div className="absolute -right-3 top-6 animate-fade-up rounded-2xl bg-accent-400 px-4 py-2 text-sm font-bold text-stone-900 shadow-xl [animation-delay:750ms]">Giảm đến {maxDiscount}%</div>}
          </div>
        </div>
      </section>

      <section aria-label="Cam kết" className="container-x -mt-8 relative z-10">
        <ul className="card grid animate-fade-up grid-cols-2 gap-4 p-5 text-sm [animation-delay:450ms] md:grid-cols-4">
          {([
            [Truck, "Giao nhanh 2 giờ", "Miễn phí từ 300K"],
            [ShieldCheck, "Nguồn gốc rõ ràng", "Chuẩn VietGAP"],
            [RefreshCw, "Đổi trả 24h", "Nếu không tươi"],
            [CreditCard, "Thanh toán linh hoạt", "COD hoặc chuyển khoản"],
          ] as [LucideIcon, string, string][]).map(([Icon, t, d]) => (
            <li key={t} className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700"><Icon className="h-5 w-5" aria-hidden /></span>
              <span><strong className="block text-stone-800">{t}</strong><span className="text-stone-500">{d}</span></span>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-x mt-14" aria-labelledby="dm">
        <h2 id="dm" className="reveal text-2xl font-bold text-stone-800 sm:text-3xl">Danh mục sản phẩm</h2>
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <li key={c.id} className="reveal">
              <Link href={`/danh-muc/${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-stone-200 shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-lg">
                {c.cover ? (
                  <Image src={c.cover} alt="" fill sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <span className={`absolute inset-0 grid place-items-center bg-gradient-to-br ${categoryTheme(c.slug).bg}`}><ProductIcon name={c.icon} className={`h-12 w-12 ${categoryTheme(c.slug).fg}`} /></span>
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-3 text-white">
                  <span className="flex items-center gap-1.5 text-base font-bold"><ProductIcon name={c.icon} className="h-4 w-4" />{c.name}</span>
                  <span className="text-xs text-white/80">{c.product_count} sản phẩm</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {deals.length > 0 && (
        <section id="uu-dai" className="container-x mt-14 scroll-mt-40" aria-labelledby="ud">
          <div className="reveal rounded-3xl bg-gradient-to-r from-amber-50 to-rose-50 p-5 ring-1 ring-amber-100 sm:p-8">
            <h2 id="ud" className="flex items-center gap-2 text-2xl font-bold text-stone-800 sm:text-3xl"><Flame className="h-6 w-6 text-rose-500" aria-hidden /> Ưu đãi hôm nay</h2>
            <p className="mt-1 text-sm text-stone-600">Giá tốt nhất trong tuần – số lượng có hạn.</p>
            <div className="mt-5"><ProductGrid products={deals} /></div>
          </div>
        </section>
      )}

      <section className="container-x mt-14" aria-labelledby="nb">
        <h2 id="nb" className="reveal text-2xl font-bold text-stone-800 sm:text-3xl">Sản phẩm nổi bật</h2>
        <div className="mt-5"><ProductGrid products={featured} /></div>
      </section>

      <section className="container-x mt-16" aria-labelledby="gt">
        <div className="card reveal grid gap-6 p-6 md:grid-cols-2 md:p-10">
          <div>
            <h2 id="gt" className="text-2xl font-bold text-stone-800 sm:text-3xl">Vì sao chọn Đi Chợ Online?</h2>
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
