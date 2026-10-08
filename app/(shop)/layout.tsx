import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { CartProvider } from "@/components/CartProvider";
import CartToast from "@/components/CartToast";
import MobileNav from "@/components/MobileNav";
import BackToTop from "@/components/BackToTop";
import { absoluteUrl, site } from "@/lib/site";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow">Bỏ qua tới nội dung chính</a>
      <div className="flex min-h-dvh flex-col pb-[calc(57px+env(safe-area-inset-bottom))] md:pb-0">
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
      </div>
      <CartToast />
      <MobileNav />
      <BackToTop />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "GroceryStore",
            "@id": absoluteUrl("/#store"),
            name: site.name,
            url: site.url,
            logo: absoluteUrl("/icon.svg"),
            image: absoluteUrl("/icon.svg"),
            telephone: site.phone,
            email: site.email,
            priceRange: "₫₫",
            address: { "@type": "PostalAddress", streetAddress: site.address, addressLocality: "TP. Hồ Chí Minh", addressCountry: "VN" },
            openingHours: "Mo-Su 06:00-21:00",
            areaServed: "TP. Hồ Chí Minh",
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": absoluteUrl("/#website"),
            url: site.url,
            name: site.name,
            inLanguage: "vi-VN",
            potentialAction: {
              "@type": "SearchAction",
              target: { "@type": "EntryPoint", urlTemplate: `${site.url}/tim-kiem?q={search_term_string}` },
              "query-input": "required name=search_term_string",
            },
          },
        ]}
      />
    </CartProvider>
  );
}
