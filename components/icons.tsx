import {
  Amphora, Apple, Banana, Bean, Beef, Bone, Carrot, Cherry, Citrus, CookingPot, Croissant, Droplet, Drumstick, Egg, Fish,
  Grape, Ham, Leaf, LeafyGreen, Milk, Nut, Salad, Shell, ShoppingBasket, Shrimp, Soup, Sprout, Wheat, type LucideIcon,
} from "lucide-react";

/** Danh sách icon dùng cho sản phẩm/danh mục (lưu khoá dạng chuỗi trong CSDL). */
export const PRODUCT_ICONS = {
  "leafy-green": { label: "Rau lá", Icon: LeafyGreen },
  salad: { label: "Rau trộn / bông cải", Icon: Salad },
  sprout: { label: "Mầm / rau non", Icon: Sprout },
  leaf: { label: "Lá", Icon: Leaf },
  carrot: { label: "Củ", Icon: Carrot },
  bean: { label: "Đậu / khoai", Icon: Bean },
  cherry: { label: "Quả mọng", Icon: Cherry },
  apple: { label: "Táo / trái cây", Icon: Apple },
  citrus: { label: "Cam / bưởi / xoài", Icon: Citrus },
  grape: { label: "Nho", Icon: Grape },
  banana: { label: "Chuối", Icon: Banana },
  beef: { label: "Thịt bò", Icon: Beef },
  ham: { label: "Thịt heo", Icon: Ham },
  drumstick: { label: "Gia cầm", Icon: Drumstick },
  bone: { label: "Sườn", Icon: Bone },
  fish: { label: "Cá", Icon: Fish },
  shrimp: { label: "Tôm / mực", Icon: Shrimp },
  shell: { label: "Nghêu / sò", Icon: Shell },
  egg: { label: "Trứng", Icon: Egg },
  milk: { label: "Sữa", Icon: Milk },
  wheat: { label: "Gạo / ngũ cốc", Icon: Wheat },
  amphora: { label: "Nước mắm / nước chấm", Icon: Amphora },
  droplet: { label: "Dầu ăn", Icon: Droplet },
  nut: { label: "Hạt / gia vị", Icon: Nut },
  soup: { label: "Món nấu sẵn", Icon: Soup },
  "cooking-pot": { label: "Đồ bếp", Icon: CookingPot },
  croissant: { label: "Bánh", Icon: Croissant },
  basket: { label: "Khác", Icon: ShoppingBasket },
} satisfies Record<string, { label: string; Icon: LucideIcon }>;

export type ProductIconKey = keyof typeof PRODUCT_ICONS;
export const isProductIcon = (k: string): k is ProductIconKey => k in PRODUCT_ICONS;

export function ProductIcon({ name, className, strokeWidth = 1.75 }: { name: string; className?: string; strokeWidth?: number }) {
  const { Icon } = PRODUCT_ICONS[isProductIcon(name) ? name : "basket"];
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden />;
}
