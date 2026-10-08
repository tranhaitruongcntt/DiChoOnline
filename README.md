# Đi Chợ Online

Website đi chợ online (thực phẩm tươi sạch) xây bằng **React / Next.js 15**, có trang quản trị đơn hàng bảo mật và tối ưu SEO cho Google.

## Tính năng

**Cửa hàng**
- Trang chủ, danh mục, chi tiết sản phẩm, tìm kiếm không dấu tiếng Việt, sắp xếp
- Giỏ hàng (lưu trên trình duyệt), đặt hàng không cần tài khoản, chọn khung giờ giao, COD hoặc chuyển khoản
- Miễn phí giao hàng theo ngưỡng, tra cứu đơn bằng **mã đơn + số điện thoại**
- Giao diện responsive, thân thiện mobile, hỗ trợ trợ năng (a11y)

**Tiện ích cho mọi lứa tuổi**
- Chỉnh cỡ chữ A / A+ / A++ (ghi nhớ trên trình duyệt), tìm kiếm bằng giọng nói tiếng Việt
- Ô tìm kiếm gợi ý tức thì, lịch sử tìm kiếm; giỏ hàng xem nhanh; tăng/giảm số lượng ngay trên thẻ sản phẩm
- Ghi nhớ thông tin giao hàng (chỉ lưu trên máy khách), mua lại đơn cũ, sản phẩm đã xem gần đây
- Hotline đặt hộ hiển thị rõ cho người không quen mua online; menu trượt và thanh điều hướng đáy trên điện thoại

**Quản trị (`/admin`)**
- Dashboard: đơn hôm nay, doanh thu, biểu đồ 7 ngày, cảnh báo sắp hết hàng
- Quản lý đơn: lọc theo trạng thái, tìm kiếm, phân trang, đổi trạng thái theo quy trình
  (Chờ xác nhận → Đã xác nhận → Đang giao → Hoàn thành / Huỷ – huỷ sẽ hoàn tồn kho), ghi chú nội bộ, lịch sử xử lý
- Quản lý sản phẩm: thêm/sửa giá, giá gốc, tồn kho, ẩn/hiện, nổi bật, **tải ảnh sản phẩm lên** (tự cắt vuông, nén WebP, xoá metadata)

Giao diện dùng bộ icon SVG [lucide-react](https://lucide.dev) (không dùng emoji).

## Bảo mật
- Mật khẩu admin băm bằng **scrypt** + so sánh thời gian hằng (chống dò tài khoản)
- Phiên đăng nhập lưu phía server (chỉ lưu SHA-256 của token), cookie `__Host-`, `HttpOnly`, `Secure`, `SameSite=Strict`, hết hạn sau 8 giờ; tạo phiên mới mỗi lần đăng nhập
- Giới hạn số lần đăng nhập sai (theo IP và theo tài khoản), giới hạn tần suất đặt hàng/tra cứu, honeypot chống bot
- Mọi trang và action quản trị đều xác thực lại phía server (không chỉ dựa vào middleware)
- **Giá luôn tính lại từ CSDL**, kiểm tra và trừ tồn kho trong transaction
- Kiểm tra dữ liệu đầu vào bằng **zod**, truy vấn SQL tham số hoá (chống SQL injection)
- **CSP có nonce** cho từng request, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy
- Server Actions có sẵn chống CSRF (kiểm tra Origin) + cookie SameSite=Strict
- Nhật ký thao tác admin (audit log), IP được băm trước khi lưu
- Trang quản trị gắn `noindex` + `X-Robots-Tag` và bị chặn trong robots.txt

## SEO
- Render phía server (SSR), HTML đầy đủ nội dung cho Googlebot
- URL tiếng Việt thân thiện: `/danh-muc/rau-cu`, `/san-pham/xoai-cat-hoa-loc`
- Title/description riêng cho từng trang, canonical, Open Graph, Twitter Card, `lang="vi"`
- Dữ liệu có cấu trúc **schema.org**: `GroceryStore`, `WebSite` + `SearchAction`, `Product` + `Offer`, `BreadcrumbList`, `ItemList`
- `sitemap.xml` tự động (lastmod theo ngày cập nhật sản phẩm), `robots.txt`, `manifest.webmanifest`
- Trang mỏng/trùng lặp (tìm kiếm, giỏ hàng, thanh toán) đặt `noindex`
- Hỗ trợ mã xác minh Google Search Console qua biến `GOOGLE_SITE_VERIFICATION`
- Font tự host, JS nhẹ (~108 kB lần tải đầu)

## Chạy dự án

Yêu cầu **Node.js ≥ 22.13** (dùng SQLite tích hợp sẵn của Node, không cần cài CSDL riêng).

```bash
npm install
cp .env.example .env          # sửa NEXT_PUBLIC_SITE_URL theo tên miền thật
npm run create-admin -- admin # nhập mật khẩu ≥ 12 ký tự
npm run dev                   # http://localhost:3000
```

Dữ liệu mẫu (6 danh mục, 27 sản phẩm) được nạp tự động lần chạy đầu tiên vào `./data/dicho.db`.

Ảnh sản phẩm mẫu nằm trong `public/images/products/`: 25 ảnh chụp từ [Pexels](https://www.pexels.com/license/) (miễn phí dùng thương mại, danh sách nguồn ở trang `/nguon-anh`), riêng *ba rọi* và *mực ống* đang dùng ảnh minh hoạ. Thay ảnh bất kỳ lúc nào qua trang quản trị.

Production:
```bash
npm run build
npm start
```

## Đưa lên production
1. Chạy sau reverse proxy có **HTTPS** (Nginx/Caddy/Cloudflare). Cookie admin chỉ hoạt động qua HTTPS.
2. Đặt `NEXT_PUBLIC_SITE_URL` đúng tên miền (ảnh hưởng canonical, sitemap).
3. Đặt `IP_SALT` là chuỗi ngẫu nhiên.
4. Sao lưu định kỳ thư mục `data/` (gồm CSDL và ảnh đã tải lên trong `data/uploads/`).
5. Khai báo `https://<tên-miền>/sitemap.xml` trong Google Search Console.
6. Giới hạn tần suất hiện lưu trong bộ nhớ – nếu chạy nhiều instance, chuyển sang Redis (`lib/rate-limit.ts`).

## Cấu trúc
```
app/(shop)/        Cửa hàng: trang chủ, danh mục, sản phẩm, giỏ hàng, thanh toán, tra cứu
app/admin/         Trang quản trị (đăng nhập, dashboard, đơn hàng, sản phẩm)
app/sitemap.ts     Sitemap · app/robots.ts Robots
components/        Thành phần giao diện
lib/               CSDL, xác thực, đơn hàng, danh mục, giới hạn tần suất
db/schema.sql      Lược đồ CSDL
middleware.ts      CSP nonce + chặn sớm /admin
scripts/           Tạo tài khoản quản trị
```
