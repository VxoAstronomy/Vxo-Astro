const nf = new Intl.NumberFormat('vi-VN');

export const money = (n) => `${nf.format(Math.round(Number(n) || 0))} ₫`;

export const toNumber = (value) => {
  const digits = String(value ?? '').replace(/[^\d-]/g, '');
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
};

export const isPhone = (value) => /^(0|\+84)\d{9,10}$/.test(String(value).replace(/[\s.-]/g, ''));

export const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const imgFallback =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <defs><radialGradient id="g" cx="50%" cy="38%" r="65%">
        <stop offset="0" stop-color="#23233a"/><stop offset="1" stop-color="#08080c"/>
      </radialGradient></defs>
      <rect width="800" height="600" fill="url(#g)"/>
      <circle cx="400" cy="280" r="86" fill="none" stroke="#96a5ff" stroke-opacity=".55" stroke-width="1.5"/>
      <ellipse cx="400" cy="280" rx="155" ry="40" fill="none" stroke="#c3caff" stroke-opacity=".35" stroke-width="1.2" transform="rotate(-24 400 280)"/>
      <circle cx="512" cy="196" r="5" fill="#c3caff" fill-opacity=".8"/>
    </svg>`,
  );

/** Ảnh lỗi: thử lại bằng link thumbnail Drive, sau đó mới dùng placeholder */
export const handleImageError = (event) => {
  const img = event.currentTarget;
  const fallback = img.dataset.fallback;
  if (fallback === '1') {
    img.src = imgFallback;
    return;
  }
  const driveId = (img.src.match(/googleusercontent\.com\/d\/([\w-]{10,})/) || [])[1];
  if (driveId) {
    img.dataset.fallback = '1';
    img.src = `https://drive.google.com/thumbnail?id=${driveId}&sz=w1600`;
    return;
  }
  img.dataset.fallback = '1';
  img.src = imgFallback;
};
