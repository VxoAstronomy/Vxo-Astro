/* Gửi đơn hàng / yêu cầu chế tạo tới kênh Discord của shop dưới dạng embed.
   Discord cho phép gọi thẳng từ trình duyệt (kể cả mở web bằng file://). */
import { CONFIG } from './storeConfig';
import { money } from './format';

const post = async (payload) => {
  const res = await fetch(CONFIG.DISCORD_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Discord HTTP ${res.status}`);
};

const field = (name, value, inline = false) => ({
  name,
  value: String(value ?? '').trim().slice(0, 1024) || '—',
  inline,
});

const BASE = { username: 'VXO astro · Quản lý đơn', allowed_mentions: { parse: [] } };

/* Màu theo hình thức thanh toán: COD = xanh accent, cọc = hổ phách, full = xanh lá. */
const orderColor = (order) => {
  if (order.depositAmount > 0 && order.remaining > 0) return 0xfbbf24;
  if (order.depositAmount > 0) return 0x34d399;
  return 0x96a5ff;
};

export const sendOrder = (order) => {
  const c = order.customer || {};
  const items = (order.items || [])
    .map((it) => `• ${it.qty} × ${it.name}${it.options ? ` (${it.options})` : ''} — ${money(it.subtotal)}`)
    .join('\n');
  return post({
    ...BASE,
    embeds: [
      {
        title: `Đơn mới ${order.orderId}`,
        color: orderColor(order),
        timestamp: order.createdAt,
        fields: [
          field('Khách hàng', `${c.name}\n${c.phone}`, true),
          field('Thời gian đặt', new Date(order.createdAt).toLocaleString('vi-VN'), true),
          field('Thanh toán', order.paymentMethod, true),
          field('Địa chỉ', c.address),
          field('Sản phẩm', items),
          field('Tổng đơn', money(order.total), true),
          field('Cọc trước', money(order.depositAmount), true),
          field('Còn lại', money(order.remaining), true),
          field('Mã giao dịch', order.transactionCode, true),
          field('Trạng thái cọc', order.depositStatus, true),
          field('Ghi chú', c.note),
        ],
        footer: { text: 'VXO astro — đơn gửi tự động từ website' },
      },
    ],
  });
};

export const sendRequest = (request) => {
  const c = request.customer || {};
  return post({
    ...BASE,
    embeds: [
      {
        title: `Yêu cầu chế tạo ${request.requestId}`,
        color: 0xa78bfa,
        timestamp: request.createdAt,
        fields: [
          field('Khách hàng', `${c.name}\n${c.phone}`, true),
          field('Zalo', c.zalo, true),
          field('Thời gian gửi', new Date(request.createdAt).toLocaleString('vi-VN'), true),
          field('Loại yêu cầu', request.projectType, true),
          field('Ngân sách', request.budget, true),
          field('Nội dung', request.message),
        ],
        footer: { text: 'VXO astro — yêu cầu gửi tự động từ website' },
      },
    ],
  });
};