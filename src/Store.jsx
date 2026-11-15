/* "Kho chung" của cả web (React Context).
   Luồng dữ liệu: public/config.js → link CSV Google Sheet → parseProducts()
   → danh sách sản phẩm → giỏ hàng (lưu localStorage) → đơn gửi Discord.
   Muốn đổi chữ/số/link: sửa config.js. Muốn đổi sản phẩm: sửa Google Sheet. */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CONFIG, HAS_SHEET, ZALO } from './lib/storeConfig';
import { SAMPLE_PRODUCTS } from './lib/data';
import {
  cartKey,
  defaultSelection,
  isAvailable,
  parseProducts,
  priceOf,
  variantText,
} from './lib/products';

const CART_KEY = 'vxo_cart_v2';
const PRODUCTS_KEY = 'vxo_products_v2';

/* Mạng chập chờn (4G/Wi-Fi yếu): thử lại một lần trước khi chịu thua. */
const fetchCsv = async (url, signal) => {
  try {
    return await fetch(url, { cache: 'no-store', signal });
  } catch (error) {
    if (signal.aborted) throw error;
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return fetch(url, { cache: 'no-store', signal });
  }
};

/* Mở web bằng cách nhấp đúp index.html (file://) thì Google chặn CORS.
   JSONP đi bằng thẻ <script> nên không bị chặn: đổi CSV thành JSON bọc trong callback. */
const tableToCsv = (table) => {
  const quote = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const lines = [(table.cols || []).map((col) => quote(col.label)).join(',')];
  for (const row of table.rows || []) {
    lines.push((row.c || []).map((cell) => quote(cell && cell.v)).join(','));
  }
  return lines.join('\n');
};

const fetchCsvJsonp = (baseUrl) =>
  new Promise((resolve, reject) => {
    const cb = `vxoSheet${Date.now()}`;
    const script = document.createElement('script');
    const done = (error, text) => {
      window.clearTimeout(timer);
      delete window[cb];
      script.remove();
      if (error) reject(error);
      else resolve(text);
    };
    const timer = window.setTimeout(() => done(new Error('JSONP timeout')), 15000);
    window[cb] = (data) => done(null, tableToCsv(data.table));
    script.onerror = () => done(new Error('JSONP error'));
    script.src = `${baseUrl.replace('tqx=out:csv', `tqx=out:json;responseHandler:${cb}`)}&_cb=${Date.now()}`;
    document.head.appendChild(script);
  });

const ShopContext = createContext(null);

const readCart = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(raw)
      ? raw.filter((c) => c && c.id && Number.isFinite(c.qty) && c.qty > 0).map((c) => ({ ...c, sel: c.sel || {} }))
      : [];
  } catch {
    return [];
  }
};

export function ShopProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(readCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [done, setDone] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [zaloPanel, setZaloPanel] = useState(false);
  const [zaloProduct, setZaloProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(0);

  const notify = useCallback((message) => {
    setToast({ message, id: Date.now() });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);
  /* ---------- Nạp sản phẩm từ Google Sheet (CSV công khai) ---------- */
  useEffect(() => {
    let alive = true;

    const load = async () => {
      let cached = [];
      try {
        cached = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
      } catch {
        cached = [];
      }

      if (!HAS_SHEET) {
        if (alive) {
          setProducts(SAMPLE_PRODUCTS);
          setLoading(false);
        }
        return;
      }

      if (Array.isArray(cached) && cached.length) setProducts(cached);

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15000);
      try {
        const base = CONFIG.SHEET_CSV_URL;
        const url = `${base}${base.includes('?') ? '&' : '?'}_cb=${Date.now()}`;
        const viaJsonp = window.location.protocol === 'file:';
        let text;
        try {
          if (viaJsonp) {
            text = await fetchCsvJsonp(base);
          } else {
            const res = await fetchCsv(url, controller.signal);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            text = await res.text();
          }
        } catch (error) {
          if (controller.signal.aborted || viaJsonp) throw error;
          text = await fetchCsvJsonp(base);
        }
        const list = parseProducts(text);
        if (!list.length) throw new Error('Sheet trống hoặc sai tên cột');
        if (!alive) return;
        setProducts(list);
        try {
          localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
        } catch {
          /* bỏ qua */
        }
      } catch (error) {
        if (!alive) return;
        if (!cached.length) setProducts(SAMPLE_PRODUCTS);
        console.warn('[VXO] Không tải được Google Sheet:', error.message);
        notify('Chưa tải được bảng sản phẩm — đang dùng dữ liệu tạm.');
      } finally {
        window.clearTimeout(timeout);
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [notify]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* bỏ qua */
    }
  }, [cart]);

  const cartItems = useMemo(
    () =>
      cart
        .map((line) => {
          const product = products.find((p) => String(p.id) === String(line.id));
          if (!product) return null;
          return {
            ...line,
            product,
            name: product.name,
            image: product.images?.[0] || '',
            variant: variantText(product, line.sel),
            price: priceOf(product, line.sel),
            stock: product.stock,
          };
        })
        .filter(Boolean),
    [cart, products],
  );

  /* Đếm theo cartItems: dòng mồ côi (id không còn trong Sheet) không tính vào badge */
  const count = useMemo(() => cartItems.reduce((sum, line) => sum + line.qty, 0), [cartItems]);
  const total = useMemo(() => cartItems.reduce((sum, line) => sum + line.price * line.qty, 0), [cartItems]);

  const cartQtyOf = useCallback(
    (id) => cart.filter((line) => String(line.id) === String(id)).reduce((sum, line) => sum + line.qty, 0),
    [cart],
  );

  const addToCart = useCallback(
    (product, selection, qty = 1) => {
      if (!product) return false;
      if (!isAvailable(product)) {
        notify('Sản phẩm này đang hết hàng.');
        return false;
      }
      const sel = selection || defaultSelection(product);
      const used = cartQtyOf(product.id);
      const cap = product.stock === null || product.stock === undefined ? Infinity : product.stock;
      const free = cap - used;
      if (free <= 0) {
        notify(`Bạn đã có ${used} sản phẩm trong giỏ — đã đạt số lượng còn lại.`);
        return false;
      }
      const amount = Math.min(qty, free);
      const key = cartKey(product, sel);
      setCart((current) => {
        const line = current.find((c) => c.key === key);
        if (line) return current.map((c) => (c.key === key ? { ...c, qty: c.qty + amount } : c));
        return [...current, { key, id: product.id, sel: { ...sel }, qty: amount }];
      });
      notify(amount < qty ? `Chỉ còn ${free} sản phẩm — đã thêm tối đa.` : 'Đã thêm vào giỏ hàng.');
      return true;
    },
    [cartQtyOf, notify],
  );

  const incItem = useCallback(
    (key) => {
      const line = cart.find((c) => c.key === key);
      const product = products.find((p) => String(p.id) === String(line?.id));
      if (!line || !product) return;
      if (product.stock !== null && product.stock !== undefined && cartQtyOf(product.id) >= product.stock) {
        notify(`Chỉ còn ${product.stock} sản phẩm.`);
        return;
      }
      setCart((current) => current.map((c) => (c.key === key ? { ...c, qty: c.qty + 1 } : c)));
    },
    [cart, products, cartQtyOf, notify],
  );

  const decItem = useCallback((key) => {
    setCart((current) =>
      current.flatMap((c) => {
        if (c.key !== key) return [c];
        return c.qty > 1 ? [{ ...c, qty: c.qty - 1 }] : [];
      }),
    );
  }, []);

  const removeItem = useCallback((key) => {
    setCart((current) => current.filter((c) => c.key !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const openLightbox = useCallback((product, index = 0) => {
    const images = (product.images || []).filter(Boolean);
    if (!images.length) return;
    setLightbox({ images, index: Math.min(index, images.length - 1), title: product.name });
  }, []);

  const openConsult = useCallback((product = null, selection = {}) => {
    setZaloPanel(false);
    setZaloProduct({ product: product || null, selection: selection || {} });
  }, []);

  const value = useMemo(
    () => ({
      config: CONFIG,
      zalo: ZALO,
      products,
      loading,
      cart,
      cartItems,
      count,
      total,
      cartOpen,
      setCartOpen,
      checkoutOpen,
      setCheckoutOpen,
      done,
      setDone,
      lightbox,
      setLightbox,
      openLightbox,
      zaloPanel,
      setZaloPanel,
      zaloProduct,
      openConsult,
      closeConsult: () => setZaloProduct(null),
      addToCart,
      incItem,
      decItem,
      removeItem,
      clearCart,
      cartQtyOf,
      notify,
      toast,
      setToast,
    }),
    [
      products,
      loading,
      cart,
      cartItems,
      count,
      total,
      cartOpen,
      checkoutOpen,
      done,
      lightbox,
      openLightbox,
      zaloPanel,
      zaloProduct,
      openConsult,
      addToCart,
      incItem,
      decItem,
      removeItem,
      clearCart,
      cartQtyOf,
      notify,
      toast,
    ],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used inside ShopProvider');
  return ctx;
}
