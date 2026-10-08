import { MapPinOff } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[70dvh] place-items-center px-4 text-center">
      <div>
        <MapPinOff className="mx-auto h-16 w-16 text-brand-300" strokeWidth={1.5} aria-hidden />
        <h1 className="mt-4 text-3xl font-extrabold text-stone-900">Không tìm thấy trang</h1>
        <p className="mt-2 text-stone-600">Trang bạn tìm có thể đã bị xoá hoặc chưa từng tồn tại.</p>
        <Link href="/" className="btn-primary mt-6">Về trang chủ</Link>
      </div>
    </main>
  );
}
