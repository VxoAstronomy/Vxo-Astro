const DEFAULT_CONFIG = {
  BRAND: {
    name: 'VXO',
    suffix: 'ASTRO',
    tagline: 'Thiết bị & phụ kiện quan sát thiên văn',
    intro:
      'Kính phản xạ DIY và hệ thống goto, tracking OnStep — chế tác thủ công, giúp dễ dàng hơn trong việc vươn tới vì sao.',
  },
  GAS_URL: 'https://script.google.com/macros/s/AKfycbxewpeQrMTUWVmvmC1WeCo2aC7hxrrfR3mCXogeWrPo1U4YO3lVyLfK3Nh_IxsZg30y/exec',
  SHEET_CSV_URL: 'https://docs.google.com/spreadsheets/d/1E1nS4srdBKXDNHPTIqxclX_JFNK66G5pR4PpsgckH7w/gviz/tq?tqx=out:csv&sheet=SanPham',
  DEPOSIT_RATE: 0.3,
  BANK: { name: 'MB Bank', number: '0832321798', owner: 'Nguyen Bao Vinh' },
  ZALO: {
    name: 'Vxo Shop',
    phone: '0368783039 - 0832321798',
    link: '',
    avatar: '',
    intro: 'Shop phụ kiện in 3D thiên văn, dịch vụ DIY làm hệ thống thiên văn.',
    hours: '14:50 – 21:00 hằng ngày',
  },
  CONTACT: {
    phone: '0368783039',
    email: '',
    area: 'Giao hàng toàn quốc · Hẹn xem hàng qua Zalo',
    facebook: '',
    instagram: '',
    youtube: '',
  },
  HERO: {
    eyebrow: 'THIẾT BỊ QUAN SÁT THIÊN VĂN · IN 3D & THỦ CÔNG',
    title1: 'KHÁM PHÁ',
    title2: 'BẦU TRỜI ĐÊM',
    sub: 'Gương parabol, kính phản xạ DIY và hệ tracking OnStep — chế tác thủ công, căn chỉnh tỉ mỉ cho người quan sát bầu trời.',
  },
  STATS: [
    { value: 9, suffix: '+', label: 'Sản phẩm bàn giao' },
    { value: 63, suffix: '', label: 'Tỉnh thành giao hàng' },
    { value: 7, suffix: '+', label: 'Tháng kinh nghiệm' },
    { value: 24, suffix: '/7', label: 'Tư vấn qua Zalo' },
  ],
  SHIPPING_NOTE: 'Miễn phí tư vấn 1:1 · Kiểm tra hàng trước khi thanh toán',
};

function isPlainObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

function merge(base, override) {
  if (!isPlainObject(base)) return override === undefined ? base : override;
  const out = { ...base };
  if (!isPlainObject(override)) return out;
  for (const [key, value] of Object.entries(override)) {
    out[key] = isPlainObject(base[key]) ? merge(base[key], value) : value;
  }
  return out;
}

const raw = typeof window !== 'undefined' && window.CONFIG ? window.CONFIG : {};
export const CONFIG = merge(DEFAULT_CONFIG, raw);

const zaloPhone = String(CONFIG.ZALO.phone || '').replace(/[^\d]/g, '');
export const ZALO = {
  ...CONFIG.ZALO,
  phone: zaloPhone || CONFIG.ZALO.phone,
  link: CONFIG.ZALO.link && !CONFIG.ZALO.link.includes('036873039')
    ? CONFIG.ZALO.link
    : `https://zalo.me/${zaloPhone}`,
};

export const HAS_GAS =
  typeof CONFIG.GAS_URL === 'string' &&
  CONFIG.GAS_URL.startsWith('https://script.google.com/') &&
  !CONFIG.GAS_URL.includes('YOUR_DEPLOYMENT_ID');

export const HAS_SHEET = Boolean(String(CONFIG.SHEET_CSV_URL || '').trim());

export const asset = (path) => `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, '')}`;
