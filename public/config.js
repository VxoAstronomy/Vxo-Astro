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

  /* URL Web App của Google Apps Script — nhận đơn hàng và yêu cầu chế tạo */
  GAS_URL: 'https://script.google.com/macros/s/AKfycbwCUMoQjZRmofSdBPKZp9p2dqaTgZV6zGYvwqKjOFydsEvBSri8B3dL77dVKBJCBnA/exec',

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
