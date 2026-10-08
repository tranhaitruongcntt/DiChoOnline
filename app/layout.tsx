import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Be_Vietnam_Pro, Lexend } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const font = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-be-vietnam",
});

// Font tiêu đề: hình học, bo tròn, hỗ trợ đầy đủ dấu tiếng Việt
const display = Lexend({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} – ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: ["đi chợ online", "thực phẩm sạch", "rau củ tươi", "giao hàng nhanh", "siêu thị online", "TP.HCM"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: site.locale, siteName: site.name, url: "/", title: site.name, description: site.description },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#1a7e4f", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Đọc headers để trang luôn render động → Next.js gắn nonce CSP cho mọi script.
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang="vi" className={`${font.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        {/* Áp dụng cỡ chữ người dùng đã chọn trước khi hiển thị để tránh nháy giao diện */}
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: `try{var f=localStorage.getItem("dicho_font");if(f==="112.5%"||f==="125%")document.documentElement.style.fontSize=f}catch(e){}` }} />
      </head>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
