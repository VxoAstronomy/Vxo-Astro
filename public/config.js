/*
 * CẤU HÌNH CỬA HÀNG — chỉnh file này rồi upload lại, KHÔNG cần build lại.
 * Chạy: mở website → F12 → Console → gõ CONFIG để kiểm tra.
 */
window.CONFIG = {
  BRAND: {
    name: 'VXO',
    suffix: 'astro',
    tagline: 'Thiết bị & phụ kiện quan sát thiên văn',
    intro:
      'Gương cầu/para, kính phản xạ DIY và hệ thống goto, tracking OnStep — chế tác thủ công, dễ dàng hơn với người bắt đầu.',
  },

  /* Webhook Discord — nơi nhận đơn hàng & yêu cầu chế tạo (kênh QUẢN LÝ ĐƠN HÀNG).
     Lấy link: Discord → Cài đặt kênh → Tích hợp → Webhook → Sao chép URL.
     Lưu ý: ai có link này đều gửi được vào kênh — đừng chia sẻ công khai. */
  DISCORD_WEBHOOK: 'https://discord.com/api/webhooks/1571477583806337096/Y72yKL3EwEPNoy9B209O0noo5XLXlckjzP0aak88C_Fecw1NeYtNRGc7fonlDMlfvmhh',

  /* Link CSV của tab "SanPham".
     Khuyến nghị: https://docs.google.com/spreadsheets/d/ID_SHEET/gviz/tq?tqx=out:csv&sheet=SanPham
     Để trống = dùng dữ liệu mẫu trong src/lib/data.js */
  SHEET_CSV_URL: 'https://docs.google.com/spreadsheets/d/1E1nS4srdBKXDNHPTIqxclX_JFNK66G5pR4PpsgckH7w/gviz/tq?tqx=out:csv&sheet=SanPham',

  DEPOSIT_RATE: 0.3,

  BANK: { name: 'MB Bank', number: '0832321798', owner: 'Nguyen Bao Vinh' },

  ZALO: {
    name: 'Vxo Shop',
    phone: '0368783039 - 0832321798',
    link: 'https://zalo.me/0368783039',
    avatar: '',
    intro: 'Shop phụ kiện in 3D thiên văn, dịch vụ DIY làm hệ thống thiên văn.',
    hours: '14:50 – 21:00 hằng ngày',
  },

  CONTACT: {
    phone: '0368783039 - 0832321798',
    email: '',
    area: 'Giao hàng toàn quốc · Hẹn xem hàng qua Zalo',
    facebook: '',
    instagram: '',
    youtube: '',
  },

  HERO: {
    eyebrow: 'THIẾT BỊ DIY THIÊN VĂN · IN 3D & THỦ CÔNG',
    title1: 'CHIÊM BAO',
    title2: 'BẦU TRỜI SAO',
    sub: 'Kính phản xạ DIY và hệ thống tracking, goto OnStep — chế tác thủ công, bắt tay khám phá bầu trời cùng VXO.',
  },

  STATS: [
    { value: 5, suffix: '+', label: 'Sản phẩm bàn giao' },
    { value: 63, suffix: '', label: 'Tỉnh thành giao hàng' },
    { value: 7, suffix: '+', label: 'Tháng kinh nghiệm' },
    { value: 24, suffix: '/7', label: 'Tư vấn qua Zalo' },
  ],

  SHIPPING_NOTE: 'Miễn phí tư vấn 1:1 · Kiểm tra hàng trước khi thanh toán',
};
