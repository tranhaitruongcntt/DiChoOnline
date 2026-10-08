export const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/khuyen-mai", label: "Khuyến mãi", hot: true },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/lien-he", label: "Liên hệ" },
  { href: "/tra-cuu-don-hang", label: "Tra cứu đơn hàng" },
] as const;

export const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
