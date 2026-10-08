// Khung xương hiển thị tức thì khi chuyển trang trong cửa hàng
export default function Loading() {
  return (
    <div className="container-x py-8" aria-busy="true" aria-label="Đang tải">
      <div className="skeleton h-4 w-48" />
      <div className="skeleton mt-5 h-28 w-full rounded-3xl" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="card p-3">
            <div className="skeleton aspect-square w-full" />
            <div className="skeleton mt-3 h-3 w-1/3" />
            <div className="skeleton mt-2 h-4 w-4/5" />
            <div className="skeleton mt-3 h-5 w-1/2" />
            <div className="skeleton mt-3 h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
