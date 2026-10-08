export const site = {
  name: "Đi Chợ Online",
  shortName: "DiChoOnline",
  tagline: "Thực phẩm tươi sạch giao tận nhà trong 2 giờ",
  description:
    "Đi Chợ Online – siêu thị thực phẩm tươi sạch: rau củ, trái cây, thịt cá, hải sản, đồ khô. Nguồn gốc rõ ràng, giá chợ, giao nhanh trong 2 giờ tại TP. Hồ Chí Minh.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, ""),
  phone: process.env.NEXT_PUBLIC_STORE_PHONE || "1900 1234",
  email: process.env.NEXT_PUBLIC_STORE_EMAIL || "hotro@dichoonline.vn",
  address: process.env.NEXT_PUBLIC_STORE_ADDRESS || "123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
  locale: "vi_VN",
  freeShipThreshold: 300_000,
  shippingFee: 20_000,
} as const;

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
