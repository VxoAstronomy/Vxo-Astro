/*
 * APPS SCRIPT NHẬN ĐƠN — dán vào script.google.com, gắn với Google Sheet của shop.
 * Luồng: khách bấm đặt hàng trên web → web gửi JSON tới URL Web App của script này
 * → script ghi MỘT DÒNG MỚI vào tab DonHang (hoặc YeuCau) của CHÍNH Sheet đó.
 * Không cần server riêng, không cần database — Sheet là kho chứa đơn.
 *
 * Cách dùng: mở Sheet → Tiện ích mở rộng → Apps Script → dán file này →
 * Triển khai → Ứng dụng web → "Bất kỳ ai" → sao chép URL dán vào CONFIG.GAS_URL.
 * Muốn nhận email mỗi đơn: điền NOTIFY_EMAIL bên dưới.
 */

const NOTIFY_EMAIL = ''; // ví dụ 'shop@gmail.com'; để trống = không gửi email

/* Ghi thẳng vào Sheet này dù project Apps Script được tạo từ menu Sheet hay tạo rời. */
const SHEET_ID = '1E1nS4srdBKXDNHPTIqxclX_JFNK66G5pR4PpsgckH7w';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.action === 'order') saveOrder(data);
    else if (data.action === 'request') saveRequest(data);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

/* Mở URL Web App bằng trình duyệt để thử: thấy {"ok":true,"status":"online"} là sống. */
function doGet() {
  return json({ ok: true, status: 'online' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* Tab chưa có thì tự tạo kèm hàng tiêu đề, khỏi phải kẻ tay. */
function sheetWith(name, headers) {
  const ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function saveOrder(d) {
  const c = d.customer || {};
  const items = (d.items || [])
    .map((it) => `${it.qty} x ${it.name}${it.options ? ` (${it.options})` : ''}`)
    .join('; ');
  const sh = sheetWith('DonHang', [
    'orderId', 'createdAt', 'ten', 'phone', 'dia_chi', 'ghi_chu',
    'san_pham', 'tong', 'thanh_toan', 'coc', 'con_lai', 'trang_thai_coc', 'ma_giao_dich',
  ]);
  sh.appendRow([
    d.orderId, d.createdAt, c.name, c.phone, c.address, c.note,
    items, d.total, d.paymentMethod, d.depositAmount, d.remaining, d.depositStatus, d.transactionCode,
  ]);
  notify(`Đơn mới ${d.orderId}`, `${items}\nTổng: ${d.total}\nThanh toán: ${d.paymentMethod}\nKhách: ${c.name} - ${c.phone}\nĐịa chỉ: ${c.address}`);
}

function saveRequest(d) {
  const c = d.customer || {};
  const sh = sheetWith('YeuCau', ['requestId', 'createdAt', 'ten', 'phone', 'zalo', 'loai', 'ngan_sach', 'noi_dung']);
  sh.appendRow([d.requestId, d.createdAt, c.name, c.phone, c.zalo, d.projectType, d.budget, d.message]);
  notify(`Yêu cầu mới ${d.requestId}`, `${d.projectType} - ${d.budget}\n${d.message}\nKhách: ${c.name} - ${c.phone}`);
}

function notify(subject, body) {
  if (!NOTIFY_EMAIL) return;
  MailApp.sendEmail(NOTIFY_EMAIL, `[VXO] ${subject}`, body);
}