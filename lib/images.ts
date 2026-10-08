import "server-only";
import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp, { type Metadata } from "sharp";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const UPLOAD_URL_PREFIX = "/anh/";
export const UPLOAD_NAME_RE = /^[a-f0-9]{32}\.webp$/;
const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp", "avif", "heif"]);

export const uploadDir = () => path.resolve(path.dirname(process.env.DATABASE_PATH || "./data/dicho.db"), "uploads");

export class ImageError extends Error {}

/**
 * Lưu ảnh sản phẩm: kiểm tra định dạng thật bằng sharp (không tin MIME/đuôi file của trình duyệt),
 * xoay đúng chiều, cắt vuông 1000px, mã hoá lại sang WebP → loại bỏ metadata (GPS…) và mọi nội dung lạ trong file.
 */
export async function saveProductImage(file: File): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) throw new ImageError("Ảnh tối đa 5MB.");
  const input = Buffer.from(await file.arrayBuffer());
  let meta: Metadata;
  try {
    meta = await sharp(input, { limitInputPixels: 40_000_000 }).metadata();
  } catch {
    throw new ImageError("File không phải ảnh hợp lệ.");
  }
  if (!meta.format || !ALLOWED_FORMATS.has(meta.format)) throw new ImageError("Chỉ nhận ảnh JPG, PNG, WebP, AVIF.");
  if ((meta.width ?? 0) < 300 || (meta.height ?? 0) < 300) throw new ImageError("Ảnh quá nhỏ (tối thiểu 300×300px).");

  const output = await sharp(input, { limitInputPixels: 40_000_000 })
    .rotate()
    .resize(1000, 1000, { fit: "cover", position: "attention" })
    .webp({ quality: 82 })
    .toBuffer();
  const name = `${randomBytes(16).toString("hex")}.webp`;
  await fs.mkdir(uploadDir(), { recursive: true });
  await fs.writeFile(path.join(uploadDir(), name), output, { flag: "wx" });
  return `${UPLOAD_URL_PREFIX}${name}`;
}

/** Xoá ảnh đã tải lên trước đó (chỉ với ảnh nằm trong thư mục uploads). */
export async function deleteUploadedImage(url: string | null) {
  if (!url?.startsWith(UPLOAD_URL_PREFIX)) return;
  const name = url.slice(UPLOAD_URL_PREFIX.length);
  if (!UPLOAD_NAME_RE.test(name)) return;
  await fs.rm(path.join(uploadDir(), name), { force: true });
}
