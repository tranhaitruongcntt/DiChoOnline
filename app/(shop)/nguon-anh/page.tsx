import type { Metadata } from "next";
import { allCredits } from "@/lib/credits";

export const metadata: Metadata = {
  title: "Nguồn hình ảnh",
  description: "Ghi nhận tác giả và giấy phép của hình ảnh minh hoạ sản phẩm.",
  alternates: { canonical: "/nguon-anh" },
  robots: { index: false, follow: true },
};

export default function CreditsPage() {
  const rows = allCredits();
  return (
    <div className="container-x py-10">
      <h1 className="text-2xl font-bold text-stone-800">Nguồn hình ảnh</h1>
      <p className="mt-2 max-w-2xl text-stone-600">
        Ảnh sản phẩm minh hoạ được lấy từ Pexels theo Giấy phép Pexels (miễn phí cho mục đích thương mại). Chúng tôi xin cảm ơn các nhiếp ảnh gia.
      </p>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-stone-50 text-xs uppercase text-stone-500">
            <tr><th className="px-5 py-3">Sản phẩm</th><th className="px-5 py-3">Ảnh gốc</th><th className="px-5 py-3">Tác giả</th><th className="px-5 py-3">Giấy phép</th></tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map(([slug, c]) => (
              <tr key={slug}>
                <td className="px-5 py-3 font-mono text-xs text-stone-500">{slug}</td>
                <td className="px-5 py-3"><a href={c.source} rel="nofollow noopener" target="_blank" className="text-brand-700 hover:underline">{c.title}</a></td>
                <td className="px-5 py-3 text-stone-600">{c.artist || "Nhiếp ảnh gia Pexels"}</td>
                <td className="px-5 py-3">{c.licenseUrl ? <a href={c.licenseUrl} rel="nofollow noopener license" target="_blank" className="hover:underline">{c.license}</a> : c.license}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
