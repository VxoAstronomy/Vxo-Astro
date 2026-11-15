import { stockInfo } from '../lib/products';

const toneClass = {
  ok: 'text-emerald-300/90 border-emerald-400/20 bg-emerald-400/[0.06]',
  low: 'text-amber-200/90 border-amber-400/20 bg-amber-400/[0.06]',
  out: 'text-zinc-500 border-white/10 bg-white/[0.03]',
};

const dotClass = {
  ok: 'bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.25)]',
  low: 'bg-amber-300 shadow-[0_0_8px_2px_rgba(252,211,77,0.25)]',
  out: 'bg-zinc-600',
};

export default function StockBadge({ product, className = '', dotOnly = false }) {
  const info = stockInfo(product);
  if (dotOnly) {
    return (
      <span className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] ${toneClass[info.tone]} ${className}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${dotClass[info.tone]}`} />
        {info.label}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[8px] font-medium uppercase tracking-[0.14em] backdrop-blur-md sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-[9px] sm:tracking-[0.16em] ${toneClass[info.tone]} ${className}`}
    >
      <span className={`h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5 ${dotClass[info.tone]}`} />
      {info.label}
    </span>
  );
}
