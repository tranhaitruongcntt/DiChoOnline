import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[70dvh] place-items-center px-4 text-center">
      <div>
        <p className="text-7xl" aria-hidden>🥕</p>
        <h1 className="mt-4 text-3xl font-extrabold text-stone-900">Không tìm thấy trang</h1>
        <p className="mt-2 text-stone-600">Trang bạn tìm có thể đã bị xoá hoặc chưa từng tồn tại.</p>
        <Link href="/" className="btn-primary mt-6">Về trang chủ</Link>
      </div>
    </main>
  );
}
