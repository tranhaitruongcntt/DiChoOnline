const vnd = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

export const formatPrice = (n: number) => vnd.format(n);

export const formatDateTime = (sqlUtc: string) =>
  new Date(sqlUtc.replace(" ", "T") + "Z").toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const ORDER_STATUSES = {
  pending: { label: "Chờ xác nhận", color: "bg-amber-100 text-amber-800" },
  confirmed: { label: "Đã xác nhận", color: "bg-sky-100 text-sky-800" },
  shipping: { label: "Đang giao", color: "bg-indigo-100 text-indigo-800" },
  completed: { label: "Hoàn thành", color: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Đã huỷ", color: "bg-rose-100 text-rose-800" },
} as const;

export type OrderStatus = keyof typeof ORDER_STATUSES;

export const PAYMENT_METHODS = {
  cod: "Thanh toán khi nhận hàng (COD)",
  bank: "Chuyển khoản ngân hàng",
} as const;

export const DELIVERY_SLOTS = [
  "Giao nhanh trong 2 giờ",
  "Sáng (8:00 – 11:00)",
  "Trưa (11:00 – 14:00)",
  "Chiều (14:00 – 17:00)",
  "Tối (17:00 – 20:00)",
] as const;

export const DISTRICTS = [
  "Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Quận 10", "Quận 11", "Quận 12",
  "Bình Thạnh", "Gò Vấp", "Phú Nhuận", "Tân Bình", "Tân Phú", "Bình Tân", "TP. Thủ Đức", "Nhà Bè", "Bình Chánh", "Hóc Môn",
] as const;
