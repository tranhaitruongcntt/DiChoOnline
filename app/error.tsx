"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  // Không hiển thị chi tiết lỗi cho người dùng (tránh lộ thông tin hệ thống)
  return (
    <main className="grid min-h-[60dvh] place-items-center px-4 text-center">
      <div>
        <h1 className="text-2xl font-bold">Đã có lỗi xảy ra</h1>
        <p className="mt-2 text-stone-600">Vui lòng thử lại sau ít phút.</p>
        <button onClick={reset} className="btn-primary mt-6">Thử lại</button>
      </div>
    </main>
  );
}
