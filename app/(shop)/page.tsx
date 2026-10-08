import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, CreditCard, Flame, RefreshCw, ShieldCheck, Truck, type LucideIcon } from "lucide-react";
import HeroCarousel, { type Slide } from "@/components/HeroCarousel";
import Countdown from "@/components/Countdown";
import CategoryCard from "@/components/CategoryCard";
import { ProductGrid } from "@/components/ProductCard";
import { getCategories, getDeals, getFeaturedProducts } from "@/lib/catalog";

const SLIDES: Slide[] = [
  {
    image: "/images/banners/slide-rau-cu.webp",
    eyebrow: "Tươi mới mỗi sáng",
    title: ["Đi chợ online,", "tươi ngon", " tận nhà"],
    desc: "Rau củ, trái cây, thịt cá tươi sạch có nguồn gốc rõ ràng. Đặt trước 18:00, giao nhanh trong 2 giờ khắp TP.HCM.",
    cta: { label: "Mua sắm ngay", href: "/danh-muc" },
    cta2: { label: "Xem ưu đãi", href: "/khuyen-mai" },
  },
  {
    image: "/images/banners/slide-hai-san.webp",
    eyebrow: "Đánh bắt trong ngày",
    title: ["Hải sản tươi sống", "chuẩn vị biển"],
    desc: "Tôm sú Cà Mau, mực Phan Thiết, cá hồi Na Uy – ướp đá giữ lạnh, giao tận bếp nhà bạn.",
    cta: { label: "Chọn hải sản", href: "/danh-muc/hai-san" },
  },
  {
    image: "/images/banners/slide-trai-cay.webp",
    eyebrow: "Mùa nào thức nấy",
    title: ["Trái cây ngọt lịm,", "chín tự nhiên"],
    desc: "Xoài cát Hoà Lộc, bưởi da xanh, nho Ninh Thuận và trái cây nhập khẩu chính ngạch.",
    cta: { label: "Xem trái cây", href: "/danh-muc/trai-cay" },
  },
  {
    image: "/images/banners/slide-giao-hang.webp",
    eyebrow: "Miễn phí giao hàng",
    title: ["Giao nhanh 2 giờ,", "freeship", " từ 300K"],
    desc: "Không cần tài khoản, chỉ cần số điện thoại. Kiểm tra hàng rồi mới thanh toán.",
    cta: { label: "Đặt hàng ngay", href: "/danh-muc" },
    cta2: { label: "Tra cứu đơn", href: "/tra-cuu-don-hang" },
  },
];

const PROMOS = [
  { href: "/danh-muc/rau-cu", image: "/images/products/ca-rot-da-lat.webp", tag: "Rau củ Đà Lạt", title: "Rau sạch mỗi sáng", sub: "Chuẩn VietGAP, thu hoạch trong ngày", bg: "from-lime-100 to-emerald-50", accent: "text-emerald-700" },
  { href: "/danh-muc/hai-san", image: "/images/products/ca-hoi-na-uy.webp", tag: "Hải sản", title: "Cá hồi Na Uy", sub: "Nhập khẩu bằng đường hàng không", bg: "from-sky-100 to-cyan-50", accent: "text-sky-700" },
  { href: "/khuyen-mai", image: "/images/products/tao-envy-new-zealand.webp", tag: "Giảm giá", title: "Trái cây nhập khẩu", sub: "Ưu đãi mới mỗi ngày", bg: "from-rose-100 to-orange-50", accent: "text-rose-700" },
];

export default function HomePage() {
  const categories = getCategories();
  const featured = getFeaturedProducts(10);
  const deals = getDeals(5);

  return (
    <>
      <HeroCarousel slides={SLIDES} />

      <section aria-label="Cam kết" className="container-x relative z-20 -mt-10">
        <ul className="card grid animate-fade-up grid-cols-2 gap-x-3 gap-y-5 p-4 text-sm [animation-delay:300ms] sm:gap-4 sm:p-5 md:grid-cols-4">
          {([
            [Truck, "Giao nhanh 2 giờ", "Miễn phí từ 300K"],
            [ShieldCheck, "Nguồn gốc rõ ràng", "Chuẩn VietGAP"],
            [RefreshCw, "Đổi trả 24h", "Nếu không tươi"],
            [CreditCard, "Thanh toán linh hoạt", "COD hoặc chuyển khoản"],
          ] as [LucideIcon, string, string][]).map(([Icon, t, d]) => (
            <li key={t} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:gap-3 sm:text-left">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700"><Icon className="h-5 w-5" aria-hidden /></span>
              <span className="leading-snug"><strong className="block text-stone-800">{t}</strong><span className="text-xs text-stone-500 sm:text-sm">{d}</span></span>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-x mt-10" aria-label="Chương trình khuyến mãi">
        <ul className="grid gap-4 md:grid-cols-3">
          {PROMOS.map((p) => (
            <li key={p.href} className="reveal">
              <Link href={p.href} className={`group relative flex h-40 items-center overflow-hidden rounded-3xl bg-gradient-to-br ${p.bg} p-6 ring-1 ring-black/5 transition-shadow hover:shadow-lg`}>
                <div className="relative z-10 max-w-[58%]">
                  <span className={`text-xs font-bold uppercase tracking-wider ${p.accent}`}>{p.tag}</span>
                  <p className="mt-1 font-display text-xl font-bold leading-tight text-stone-900">{p.title}</p>
                  <p className="mt-1 text-sm text-stone-600">{p.sub}</p>
                  <span className={`mt-3 inline-flex items-center gap-1 text-sm font-semibold ${p.accent}`}>Mua ngay <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </div>
                <div className="absolute -right-6 top-1/2 h-40 w-40 -translate-y-1/2 overflow-hidden rounded-full shadow-xl ring-8 ring-white/60 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3">
                  <Image src={p.image} alt="" fill sizes="160px" className="object-cover" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-x mt-14" aria-labelledby="dm">
        <div className="flex items-end justify-between gap-4">
          <h2 id="dm" className="reveal text-2xl font-bold text-stone-800 sm:text-3xl">Danh mục sản phẩm</h2>
          <Link href="/danh-muc" className="hidden items-center gap-1 text-sm font-semibold text-brand-700 hover:underline sm:flex">Tất cả danh mục <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <li key={c.id} className="reveal"><CategoryCard c={c} /></li>
          ))}
        </ul>
      </section>

      {deals.length > 0 && (
        <section id="uu-dai" className="container-x mt-14 scroll-mt-40" aria-labelledby="ud">
          <div className="reveal overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 ring-1 ring-amber-100">
            <div className="flex flex-col gap-4 bg-gradient-to-r from-rose-500 to-orange-500 px-5 py-4 text-white sm:flex-row sm:items-center sm:px-8">
              <h2 id="ud" className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
                <Flame className="h-7 w-7 animate-pulse" aria-hidden /> Flash Sale
              </h2>
              <div className="flex items-center gap-3 text-sm sm:ml-6">
                <span className="flex items-center gap-1.5 text-white/90"><Clock className="h-4 w-4" /> Kết thúc sau</span>
                <Countdown />
              </div>
              <Link href="/khuyen-mai" className="flex items-center gap-1 text-sm font-semibold hover:underline sm:ml-auto">Xem tất cả <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="p-4 sm:p-6"><ProductGrid products={deals} /></div>
          </div>
        </section>
      )}

      <section className="container-x mt-14" aria-labelledby="nb">
        <div className="flex items-end justify-between gap-4">
          <h2 id="nb" className="reveal text-2xl font-bold text-stone-800 sm:text-3xl">Sản phẩm nổi bật</h2>
          <Link href="/danh-muc" className="hidden items-center gap-1 text-sm font-semibold text-brand-700 hover:underline sm:flex">Xem thêm <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-5"><ProductGrid products={featured} /></div>
      </section>

      <section className="container-x mt-16" aria-label="Giao hàng nhanh">
        <div className="reveal relative overflow-hidden rounded-3xl">
          <Image src="/images/banners/banner-giao-nhanh.webp" alt="" fill sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-white/30" />
          <div className="relative mx-auto flex max-w-xl flex-col items-center px-6 py-14 text-center sm:py-20">
            <span className="badge bg-brand-600 text-white">Đặt trước 18:00</span>
            <p className="mt-4 font-display text-3xl font-bold leading-tight text-stone-900 sm:text-4xl">Nhận hàng chỉ trong <span className="text-brand-700">2 giờ</span></p>
            <p className="mt-3 rounded-2xl bg-white/80 px-4 py-2 text-stone-700 backdrop-blur">Nhân viên chọn kỹ từng món, đóng gói giữ lạnh và giao tận tay khắp TP. Hồ Chí Minh.</p>
            <Link href="/danh-muc" className="btn-primary mt-6 px-7 py-3 text-base">Đi chợ ngay <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="container-x mt-16" aria-labelledby="gt">
        <div className="card reveal grid gap-6 p-6 md:grid-cols-2 md:p-10">
          <div>
            <h2 id="gt" className="text-2xl font-bold text-stone-800 sm:text-3xl">Vì sao chọn Đi Chợ Online?</h2>
            <div className="prose-vi mt-4">
              <p>Đi Chợ Online kết nối trực tiếp với hơn 50 nông trại và cơ sở đánh bắt đạt chuẩn, giúp bạn mua <strong>thực phẩm tươi sạch</strong> với giá như ngoài chợ mà không cần ra khỏi nhà.</p>
              <p>Mỗi đơn hàng được nhân viên lựa chọn kỹ, đóng gói sạch sẽ, giữ lạnh và giao tận tay trong vòng 2 giờ tại TP. Hồ Chí Minh.</p>
            </div>
            <Link href="/gioi-thieu" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">Tìm hiểu thêm về chúng tôi <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <ol className="grid gap-3 text-sm">
            {[
              ["1", "Chọn sản phẩm", "Hàng trăm mặt hàng tươi sống & thiết yếu."],
              ["2", "Đặt hàng", "Không cần tài khoản – chỉ cần số điện thoại."],
              ["3", "Nhận hàng", "Kiểm tra hàng rồi mới thanh toán."],
            ].map(([n, t, d]) => (
              <li key={n} className="flex gap-4 rounded-2xl bg-stone-50 p-4 transition-colors hover:bg-brand-50/60">
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
