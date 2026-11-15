# VXO ASTRO — website thiết bị thiên văn

Website bán gương parabol, kính phản xạ DIY và phụ kiện in 3D. Giao diện tối giản
theo phong cách thiên văn (đen — trắng — xám khói, accent xanh tím nhẹ), React 18 +
Tailwind CSS, dữ liệu sản phẩm lấy từ Google Sheet.

## Tính năng

- **Sản phẩm từ Google Sheet** — thêm/sửa giá, mô tả, ảnh, tồn kho, nhãn không cần code.
- **Tuỳ chọn phụ thuộc** — D76 chỉ f700/f900, D114 chỉ f900, D150 f550/f750 (thêm f900 sau này
  chỉ bằng một cụm trong ô `tuy_chon`). Giá cộng thêm hoặc giá tuyệt đối theo cấu hình.
- **Tồn kho** — còn hàng / còn N sản phẩm / hết hàng; giỏ hàng chặn vượt tồn.
- **Ảnh không giới hạn** — nhiều ảnh mỗi sản phẩm, lightbox zoom/kéo/thumbnail/bàn phím.
- **Tư vấn Zalo** — sản phẩm đánh dấu `tu_van` mở hồ sơ Zalo kèm tin nhắn gợi ý đã copy.
- **Giỏ hàng & thanh toán** — COD, cọc 30%, chuyển khoản; ghi đơn vào Google Sheet qua
  Apps Script, hoặc gửi Zalo nếu chưa cấu hình.
- **Yêu cầu chế tạo** — form riêng, ghi tab `Requests`.
- **Trang**: Trang chủ, Sản phẩm, Về chúng tôi, Yêu cầu, Liên hệ, 404.
- **Chuyển động** — starfield parallax, sao băng, reveal khi cuộn, count-up, hover mượt,
  tôn trọng `prefers-reduced-motion`.

## Chạy dự án

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # xuất dist/index.html (single file) + config.js + images
npm run preview  # xem thử bản build
```

Yêu cầu Node 18+.

## Cấu trúc

```
public/config.js          Cấu hình thương hiệu, Zalo, ngân hàng, link Sheet/GAS (sửa không cần build)
public/images/            Ảnh demo (thay bằng ảnh thật)
apps-script/Code.gs       Apps Script nhận đơn + yêu cầu
src/lib/products.js       Parser CSV, tuỳ chọn phụ thuộc, giá, tồn kho
src/lib/data.js           Dữ liệu demo khi chưa nối Sheet
src/Store.jsx             Giỏ hàng, lightbox, Zalo, toast (localStorage)
src/components/           Header, Hero, ProductCard, Options, Lightbox, Checkout, ...
src/pages/                Home, Shop, About, Request, Contact, NotFound
```

## Kết nối Google Sheet

Xem [GOOGLE-SHEET-GUIDE.md](GOOGLE-SHEET-GUIDE.md) — gồm mẫu 13 cột, cú pháp tuỳ chọn,
cách dùng ảnh Google Drive, xuất CSV công khai, deploy Apps Script và đưa web lên hosting.

## Mới học code? Bắt đầu từ đây

Web chỉ có **3 nguồn dữ liệu**, không có database phức tạp:

1. `public/config.js` — chữ nghĩa, số điện thoại, ngân hàng, link. Sửa như sửa file văn bản.
2. **Google Sheet** — toàn bộ sản phẩm (tên, giá, ảnh, tồn kho, tuỳ chọn). Sửa như sửa bảng tính.
3. `apps-script/Code.gs` — nơi đơn hàng đổ về (2 tab `Orders` / `Requests` trong Sheet).

Muốn sửa gì thì mở file đó:

| Muốn đổi… | Mở file |
| --- | --- |
| Tên shop, hotline, số tài khoản, giờ mở cửa | `public/config.js` |
| Câu chữ trang chủ (tiêu đề lớn, khẩu hiệu) | `public/config.js` → mục `HERO`, `STATS` |
| Sản phẩm, giá, ảnh, còn/hết hàng | Google Sheet (tab `SanPham`) |
| Màu chữ, khoảng cách, hiệu ứng | `src/styles.css` |
| Bố cục một trang | `src/pages/` (Home, Shop, About, Request, Contact) |
| Một khối giao diện (thẻ sản phẩm, giỏ hàng…) | `src/components/` |
| Cách đọc Sheet / tính giá tuỳ chọn | `src/lib/products.js` |

Quy ước đọc code: component = một khối giao diện; `useShop()` = lấy dữ liệu từ kho chung
(`src/Store.jsx`); class Tailwind (`px-4`, `rounded-2xl`…) = trang trí, đổi số là đổi kiểu.

## Ghi chú

- `dist/config.js` được copy từ `public/config.js`: đổi hotline/Zalo/ngân hàng chỉ cần sửa
  file này trên hosting.
- Link Zalo lấy từ `ZALO.link` trong config; để trống thì tự sinh từ `ZALO.phone`
  (`src/lib/storeConfig.js`).
