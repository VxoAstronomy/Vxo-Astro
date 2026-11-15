/* Đọc bảng sản phẩm từ CSV của Google Sheet thành object cho web.
   Cột tiếng Việt không dấu (ten, gia, tuy_chon…) → xem GOOGLE-SHEET-GUIDE.md.
   File này chỉ đọc & tính giá, không gọi mạng — dễ test, dễ sửa. */
import { toNumber } from './format';

/* ---------- CSV ---------- */
export function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  const src = String(text ?? '').replace(/^\uFEFF/, '');

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += ch;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => String(c).trim() !== ''));
}

const headerKey = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');

/* ---------- Ảnh ---------- */
export function imageUrl(raw) {
  const url = String(raw || '').trim();
  if (!url) return '';
  const drive = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=|uc\?export=\w+&id=|thumbnail\?id=)([\w-]{10,})/);
  if (drive) return `https://lh3.googleusercontent.com/d/${drive[1]}=w1600`;
  const lh3 = url.match(/lh3\.googleusercontent\.com\/d\/([\w-]{10,})/);
  if (lh3) return `https://lh3.googleusercontent.com/d/${lh3[1]}=w1600`;
  return url;
}

const splitList = (raw) =>
  String(raw || '')
    .split(/[|\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

function parseImages(raw) {
  const list = splitList(raw).map(imageUrl).filter((u) => /^(https?:|data:|\/)/i.test(u));
  return list.length ? list : [''];
}

/* ---------- Tuỳ chọn ----------
   Nhóm:            Tên nhóm: A=0 | B=150000 | C==250000
   Nhóm phụ thuộc:  Tiêu cự ? Đường kính: 76mm/700mm=0 | 114mm/900mm=0
   =  : cộng thêm vào giá     (additive)
   == : đặt giá tuyệt đối      (absolute, ghi đè các cộng dồn trước đó)
*/
function parseOptionValue(raw) {
  let text = String(raw || '').trim();
  if (!text) return null;

  let label = text;
  let add = 0;
  let abs = null;

  const absoluteAt = text.indexOf('==');
  if (absoluteAt >= 0) {
    label = text.slice(0, absoluteAt);
    abs = toNumber(text.slice(absoluteAt + 2));
  } else {
    const equalAt = text.lastIndexOf('=');
    if (equalAt > 0) {
      label = text.slice(0, equalAt);
      add = toNumber(text.slice(equalAt + 1));
    }
  }

  label = label.trim();
  let parent = null;
  const slashAt = label.indexOf('/');
  if (slashAt > 0) {
    parent = label.slice(0, slashAt).trim();
    label = label.slice(slashAt + 1).trim();
  }
  if (!label) return null;

  return { label, parent, add, abs };
}

export function parseOptions(raw) {
  const groups = [];
  for (const chunk of String(raw || '').split(';')) {
    const text = chunk.trim();
    if (!text) continue;
    const colonAt = text.indexOf(':');
    if (colonAt < 1) continue;

    const head = text.slice(0, colonAt).trim();
    const [namePart, parentPart] = head.split('?').map((s) => s.trim());
    if (!namePart || groups.some((g) => g.name === namePart)) continue;

    const values = text
      .slice(colonAt + 1)
      .split('|')
      .map(parseOptionValue)
      .filter(Boolean);

    if (!values.length) continue;
    groups.push({ name: namePart, parent: parentPart || null, values });
  }
  return groups.filter((g) => !g.parent || groups.some((p) => p.name === g.parent));
}

/* ---------- Sản phẩm ---------- */
export function parseProducts(text) {
  const rows = parseCSV(text);
  if (rows.length < 2) return [];

  const header = rows[0].map(headerKey);
  const at = (row, key) => {
    const index = header.indexOf(key);
    return index >= 0 ? String(row[index] ?? '').trim() : '';
  };

  return rows
    .slice(1)
    .map((row, index) => {
      const name = at(row, 'ten');
      const price = toNumber(at(row, 'gia'));
      if (!name || price <= 0) return null;

      const hidden = /^(0|false|no|an|ẩn|khong|không)$/i.test(at(row, 'hien_thi'));
      if (hidden) return null;

      const stockRaw = at(row, 'ton_kho').toLowerCase();
      const unlimited = !stockRaw || /^(-|∞|inf|khong gioi han|không giới hạn|con hang|còn hàng)$/.test(stockRaw);
      const stock = unlimited ? null : /^(het|hết)$/.test(stockRaw) ? 0 : Math.max(0, toNumber(stockRaw));

      return {
        id: at(row, 'id') || String(index + 1),
        cat: at(row, 'danh_muc') || 'Khác',
        name,
        price,
        images: parseImages(at(row, 'anh')),
        desc: at(row, 'mo_ta'),
        specs: splitList(at(row, 'thong_so')),
        options: parseOptions(at(row, 'tuy_chon')),
        stock,
        badge: at(row, 'nhan'),
        consult: /^(1|true|x|yes|co|có|tu van|tư vấn)$/i.test(at(row, 'tu_van')),
        featured: /^(1|true|x|yes|co|có)$/i.test(at(row, 'noi_bat')),
      };
    })
    .filter(Boolean);
}

export function applicableValues(group, selection) {
  if (!group.parent) return group.values;
  const parentValue = selection?.[group.parent];
  if (!parentValue) return [];
  return group.values.filter((v) => !v.parent || v.parent === parentValue);
}

export function selectedValue(group, selection) {
  return applicableValues(group, selection).find((v) => v.label === selection?.[group.name]);
}

export function normalizeSelection(product, selection = {}) {
  const next = { ...selection };
  for (const group of product.options || []) {
    const values = applicableValues(group, next);
    if (!values.length) {
      delete next[group.name];
      continue;
    }
    if (!values.some((v) => v.label === next[group.name])) next[group.name] = values[0].label;
  }
  return next;
}

export function defaultSelection(product) {
  return normalizeSelection(product, {});
}

export function visibleGroups(product, selection) {
  return (product.options || []).filter((g) => applicableValues(g, selection).length > 0);
}

export function priceOf(product, selection) {
  let total = Number(product.price) || 0;
  for (const group of product.options || []) {
    const value = selectedValue(group, selection);
    if (!value) continue;
    if (value.abs !== null && value.abs !== undefined) total = value.abs;
    else total += Number(value.add) || 0;
  }
  return Math.max(0, total);
}

export function priceRange(product) {
  if (!product.options?.length) return [product.price, product.price];

  let min = Infinity;
  let max = -Infinity;
  let combos = 0;

  const walk = (index, selection) => {
    if (combos > 2000) return;
    if (index >= product.options.length) {
      const value = priceOf(product, selection);
      if (value < min) min = value;
      if (value > max) max = value;
      combos++;
      return;
    }
    const group = product.options[index];
    const values = applicableValues(group, selection);
    if (!values.length) {
      walk(index + 1, selection);
      return;
    }
    for (const value of values) walk(index + 1, { ...selection, [group.name]: value.label });
  };

  walk(0, {});
  if (!Number.isFinite(min)) return [product.price, product.price];
  return [min, max];
}

export function variantText(product, selection) {
  return (product.options || [])
    .map((g) => selection?.[g.name])
    .filter(Boolean)
    .join(' · ');
}

export const cartKey = (product, selection) =>
  `${product.id}|${(product.options || []).map((g) => selection?.[g.name] || '').join('|')}`;

export function stockInfo(product) {
  if (product.stock === null || product.stock === undefined) {
    return { label: 'Còn hàng', tone: 'ok', remaining: null };
  }
  if (product.stock <= 0) return { label: 'Hết hàng', tone: 'out', remaining: 0 };
  return {
    label: `Còn ${product.stock} sản phẩm`,
    tone: product.stock <= 3 ? 'low' : 'ok',
    remaining: product.stock,
  };
}

export const isAvailable = (product) => product.stock === null || product.stock > 0;
