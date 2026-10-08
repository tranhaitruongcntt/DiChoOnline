// Xuất ảnh minh hoạ demo ra public/images/products/<slug>.webp
// Chạy: node scripts/build-demo-images.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { ART } from "./demo-art.mjs";

const out = path.join(process.cwd(), "public", "images", "products");
fs.mkdirSync(out, { recursive: true });
for (const [slug, draw] of Object.entries(ART)) {
  const svg = draw();
  if (!svg) { console.warn("bỏ qua", slug); continue; }
  await sharp(Buffer.from(svg)).resize(800, 800).webp({ quality: 84 }).toFile(path.join(out, `${slug}.webp`));
}
console.log("Đã xuất", fs.readdirSync(out).length, "ảnh →", out);
