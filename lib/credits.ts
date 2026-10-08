import credits from "./image-credits.json";

export type ImageCredit = { title: string; artist: string; license: string; licenseUrl: string; source: string };
const all = credits as Record<string, ImageCredit>;

/** Thông tin tác giả/giấy phép của ảnh demo (chỉ áp dụng khi sản phẩm đang dùng ảnh demo mặc định). */
export function creditFor(slug: string, image: string | null): ImageCredit | null {
  return image === `/images/products/${slug}.webp` ? all[slug] ?? null : null;
}
export const allCredits = () => Object.entries(all);
