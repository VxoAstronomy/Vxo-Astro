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
    <Reveal as="article" delay={(index % 3) * 90} className="product-card group flex flex-col overflow-hidden rounded-[26px] border border-white/[0.08] bg-gradient-to-b from-white/[0.045] to-white/[0.012]">
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

        <div className="pointer-events-none absolute left-4 top-4 flex flex-col items-start gap-2">
          <StockBadge product={product} />
          {product.badge && (
            <span className="rounded-full border border-white/15 bg-ink-950/60 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.16em] text-zinc-200 backdrop-blur-md">
              {product.badge}
            </span>
          )}
        </div>

        {images.length > 1 && (
          <span className="pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-ink-950/55 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-zinc-300 backdrop-blur-md">
            <IconZoom className="h-3 w-3" /> {images.length} ảnh
          </span>
        )}

        {!available && (
          <span className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/15 bg-ink-950/70 px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-zinc-300 backdrop-blur-md">
            Tạm hết hàng
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[9px] font-medium uppercase tracking-[0.24em] text-zinc-500">{product.cat}</p>
          {product.consult && (
            <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.16em] text-accent-soft/80">
              <IconChat className="h-3 w-3" /> Cần tư vấn
            </span>
          )}
        </div>

        <h3 className="mt-2.5 line-clamp-2 text-[15px] font-medium leading-snug tracking-tight text-zinc-50">
          {product.name}
        </h3>

        {product.desc && (
          <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-zinc-500">{product.desc}</p>
        )}

        {product.specs?.length > 0 && (
          <p className="mt-2.5 truncate text-[9.5px] uppercase tracking-[0.1em] text-zinc-600">
            {product.specs.slice(0, 2).join(' · ')}
          </p>
        )}

        <div className="mt-4 flex items-end justify-between gap-3">
          <p className="text-[19px] font-light tracking-tight text-white">{money(price)}</p>
          {max > price && (
            <p className="pb-0.5 text-[9.5px] text-zinc-600">tối đa {money(max)}</p>
          )}
        </div>

        <div className="mt-4">
          <Options product={product} selection={selection} onChange={setSelection} />
        </div>

        <div className="mt-auto pt-5">
          {!available ? (
            <button
              type="button"
              disabled
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[13px] text-zinc-600"
            >
              Tạm hết hàng · {info.label}
            </button>
          ) : product.consult ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => openConsult(product, selection)}
                className="group/btn flex flex-1 items-center justify-center gap-2 rounded-2xl bg-zinc-50 px-4 py-3 text-[13px] font-medium text-ink-950 transition-all duration-300 hover:bg-white hover:shadow-glow"
              >
                <IconChat className="h-4 w-4" />
                Tư vấn &amp; đặt hàng
              </button>
              <button
                type="button"
                onClick={handleAdd}
                aria-label="Thêm vào giỏ hàng"
                title="Thêm vào giỏ hàng"
                className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-300 transition hover:border-white/30 hover:text-white"
              >
                {added ? <IconCheck className="h-4 w-4 text-emerald-300" /> : <IconCart className="h-4 w-4" />}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-[13px] font-medium transition-all duration-300 ${
                added
                  ? 'bg-emerald-300 text-ink-950'
                  : 'bg-zinc-50 text-ink-950 hover:bg-white hover:shadow-glow'
              }`}
            >
              {added ? <IconCheck className="h-4 w-4" /> : <IconCart className="h-4 w-4" />}
              {added ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ hàng'}
            </button>
          )}
        </div>
      </div>
    </Reveal>
  );
}
