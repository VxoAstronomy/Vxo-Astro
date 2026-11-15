import { useMemo, useState } from 'react';
import { handleImageError, money } from '../lib/format';
import {
  defaultSelection,
  isAvailable,
  priceOf,
  priceRange,
  stockInfo,
} from '../lib/products';
import { useShop } from '../Store';
import { IconCart, IconChat, IconCheck, IconZoom } from './Icons';
import Options from './Options';
import Reveal from './Reveal';
import StockBadge from './StockBadge';

export default function ProductCard({ product, index = 0 }) {
  const [selection, setSelection] = useState(() => defaultSelection(product));
  const [added, setAdded] = useState(false);
  const { addToCart, openLightbox, openConsult } = useShop();

  const price = priceOf(product, selection);
  const [min, max] = useMemo(() => priceRange(product), [product]);
  const available = isAvailable(product);
  const info = stockInfo(product);
  const images = (product.images || []).filter(Boolean);

  const handleAdd = () => {
    const ok = addToCart(product, selection, 1);
    if (!ok) return;
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <Reveal as="article" delay={(index % 3) * 90} className="product-card group flex flex-col overflow-hidden rounded-[20px] border border-white/[0.08] bg-gradient-to-b from-white/[0.045] to-white/[0.012] sm:rounded-[26px]">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-800">
        <button
          type="button"
          onClick={() => openLightbox(product, 0)}
          className="absolute inset-0"
          aria-label={`Xem ảnh ${product.name}`}
        >
          <img
            src={images[0]}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={handleImageError}
            className={`card-img h-full w-full object-cover ${available ? '' : 'opacity-40 grayscale'}`}
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/5 to-transparent" aria-hidden="true" />
        </button>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5 sm:left-4 sm:top-4 sm:gap-2">
          <StockBadge product={product} />
          {product.badge && (
            <span className="rounded-full border border-white/15 bg-ink-950/60 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.16em] text-zinc-200 backdrop-blur-md">
              {product.badge}
            </span>
          )}
        </div>

        {images.length > 1 && (
          <span className="pointer-events-none absolute bottom-4 right-4 hidden items-center gap-1.5 rounded-full border border-white/15 bg-ink-950/55 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-zinc-300 backdrop-blur-md sm:inline-flex">
            <IconZoom className="h-3 w-3" /> {images.length} ảnh
          </span>
        )}

        {!available && (
          <span className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/15 bg-ink-950/70 px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-zinc-300 backdrop-blur-md">
            Tạm hết hàng
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-6">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <p className="truncate text-[8px] font-medium uppercase tracking-[0.2em] text-zinc-500 sm:text-[9px] sm:tracking-[0.24em]">{product.cat}</p>
          {product.consult && (
            <span className="inline-flex shrink-0 items-center gap-1 text-[8px] uppercase tracking-[0.14em] text-accent-soft/80 sm:text-[9px] sm:tracking-[0.16em]">
              <IconChat className="h-3 w-3" /> <span className="hidden sm:inline">Cần tư vấn</span>
            </span>
          )}
        </div>

        <h3 className="mt-2 line-clamp-2 text-[13px] font-medium leading-snug tracking-tight text-zinc-50 sm:mt-2.5 sm:text-[15px]">
          {product.name}
        </h3>

        {product.desc && (
          <p className="mt-2 hidden line-clamp-2 text-[12.5px] leading-relaxed text-zinc-500 sm:block">{product.desc}</p>
        )}

        {product.specs?.length > 0 && (
          <p className="mt-2.5 hidden truncate text-[9.5px] uppercase tracking-[0.1em] text-zinc-600 sm:block">
            {product.specs.slice(0, 2).join(' · ')}
          </p>
        )}

        <div className="mt-3 flex items-end justify-between gap-2 sm:mt-4 sm:gap-3">
          <p className="text-[15px] font-light tracking-tight text-white sm:text-[19px]">{money(price)}</p>
          {max > price && (
            <p className="hidden pb-0.5 text-[9.5px] text-zinc-600 sm:block">tối đa {money(max)}</p>
          )}
        </div>

        <div className="mt-3 sm:mt-4">
          <Options product={product} selection={selection} onChange={setSelection} />
        </div>

        <div className="mt-auto pt-3 sm:pt-5">
          {!available ? (
            <button
              type="button"
              disabled
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-2 py-2.5 text-[11px] text-zinc-600 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-[13px]"
            >
              <span className="sm:hidden">Hết hàng</span>
              <span className="hidden sm:inline">Tạm hết hàng · {info.label}</span>
            </button>
          ) : product.consult ? (
            <div className="flex gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => openConsult(product, selection)}
                className="group/btn flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-zinc-50 px-2 py-2.5 text-[12px] font-medium text-ink-950 transition-all duration-300 hover:bg-white hover:shadow-glow sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-[13px]"
              >
                <IconChat className="h-4 w-4" />
                <span className="sm:hidden">Tư vấn</span>
                <span className="hidden sm:inline">Tư vấn &amp; đặt hàng</span>
              </button>
              <button
                type="button"
                onClick={handleAdd}
                aria-label="Thêm vào giỏ hàng"
                title="Thêm vào giỏ hàng"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-300 transition hover:border-white/30 hover:text-white sm:h-[46px] sm:w-[46px] sm:rounded-2xl"
              >
                {added ? <IconCheck className="h-4 w-4 text-emerald-300" /> : <IconCart className="h-4 w-4" />}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-[12px] font-medium transition-all duration-300 sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-[13px] ${
                added
                  ? 'bg-emerald-300 text-ink-950'
                  : 'bg-zinc-50 text-ink-950 hover:bg-white hover:shadow-glow'
              }`}
            >
              {added ? <IconCheck className="h-4 w-4" /> : <IconCart className="h-4 w-4" />}
              <span className="sm:hidden">{added ? 'Đã thêm' : 'Thêm vào giỏ'}</span>
              <span className="hidden sm:inline">{added ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ hàng'}</span>
            </button>
          )}
        </div>
      </div>
    </Reveal>
  );
}
