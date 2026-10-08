import fs from "node:fs/promises";
import path from "node:path";
import { UPLOAD_NAME_RE, uploadDir } from "@/lib/images";

// Phục vụ ảnh sản phẩm đã tải lên. Tên file được kiểm tra chặt → không thể đọc file ngoài thư mục uploads.
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!UPLOAD_NAME_RE.test(file)) return new Response("Not found", { status: 404 });
  try {
    const data = await fs.readFile(path.join(uploadDir(), file));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
