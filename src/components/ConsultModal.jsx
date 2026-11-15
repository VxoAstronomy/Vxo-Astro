import { useEffect, useState } from 'react';
import { copyText, handleImageError, money } from '../lib/format';
import { useLockBody } from '../lib/hooks';
import { priceOf, variantText } from '../lib/products';
import { ZALO } from '../lib/storeConfig';
import { useShop } from '../Store';
import { IconArrowUpRight, IconChat, IconCheck, IconClose, IconCopy, IconPhone } from './Icons';

export default function ConsultModal() {
  const { zaloProduct, closeConsult, notify } = useShop();
  const open = Boolean(zaloProduct);
  const [copied, setCopied] = useState(false);
  useLockBody(open);

  useEffect(() => {
    if (!open) return undefined;
    setCopied(false);
    const onKey = (event) => event.key === 'Escape' && closeConsult();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeConsult]);

  if (!zaloProduct) return null;

  const { product, selection } = zaloProduct;
  const variant = product ? variantText(product, selection) : '';
  const price = product ? priceOf(product, selection) : 0;
  const message = [
    `Xin chào ${ZALO.name},`,
    product
      ? `Mình đang quan tâm: ${product.name}${variant ? ` (${variant})` : ''}.`
      : 'Mình cần tư vấn thiết bị quan sát thiên văn.',
    product ? `Giá tham khảo: ${money(price)}.` : '',
    'Nhờ shop tư vấn thêm giúp mình.',
  ]
    .filter(Boolean)
    .join('\n');

  const copyMessage = async () => {
    const ok = await copyText(message);
    setCopied(ok);
    notify(ok ? 'Đã sao chép lời nhắn — dán vào Zalo để gửi shop.' : 'Không sao chép được, vui lòng nhắn trực tiếp.');
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[88] grid place-items-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md overlay-enter"
      role="dialog"
      aria-modal="true"
      aria-label="Tư vấn qua Zalo"
      onClick={(event) => event.target === event.currentTarget && closeConsult()}
    >
      <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-ink-900/95 shadow-card panel-enter">
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <IconChat className="h-3.5 w-3.5 text-accent-soft" /> Tư vấn 1:1
            </p>
            <h2 className="mt-3 text-xl font-light tracking-tight text-white">
              {product ? 'Sản phẩm cần tư vấn' : 'Nhận tư vấn thiết bị'}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeConsult}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-zinc-400 transition hover:border-white/30 hover:text-white"
            aria-label="Đóng"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-5">
          {product && (
            <div className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-ink-800">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  onError={handleImageError}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-zinc-100">{product.name}</p>
                {variant && <p className="mt-0.5 truncate text-[10px] uppercase tracking-[0.12em] text-zinc-500">{variant}</p>}
                <p className="mt-1 text-[13px] text-accent-soft">{money(price)}</p>
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center gap-3">
            {ZALO.avatar ? (
              <img src={ZALO.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
            ) : (
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-violet text-lg font-semibold text-ink-950">
                {ZALO.name.charAt(0)}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-sm font-medium text-zinc-100">
                {ZALO.name}
                <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-emerald-300/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online
                </span>
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-500">Zalo · {ZALO.phone}</p>
            </div>
            <a
              href={`tel:${ZALO.phone}`}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-zinc-400 transition hover:border-white/30 hover:text-white"
              aria-label={`Gọi ${ZALO.phone}`}
            >
              <IconPhone className="h-4 w-4" />
            </a>
          </div>

          <p className="mt-5 text-[12px] leading-relaxed text-zinc-500">
            {product
              ? 'Sản phẩm này cần tư vấn cấu hình trước khi đặt. Nhắn Zalo để shop kiểm tra tồn kho, thời gian hoàn thiện và gửi báo giá chi tiết.'
              : 'Nhắn Zalo để được tư vấn cấu hình, thời gian hoàn thiện và báo giá chi tiết.'}
          </p>

          <div className="mt-5 rounded-2xl border border-white/[0.07] bg-ink-950/50 p-4">
            <p className="text-[9px] uppercase tracking-[0.24em] text-zinc-500">Lời nhắn gợi ý</p>
            <pre className="mt-2.5 whitespace-pre-wrap font-sans text-[11.5px] leading-relaxed text-zinc-400">{message}</pre>
            <button
              type="button"
              onClick={copyMessage}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-zinc-300 transition hover:border-accent/40 hover:text-accent-soft"
            >
              {copied ? <IconCheck className="h-3.5 w-3.5 text-emerald-300" /> : <IconCopy className="h-3.5 w-3.5" />}
              {copied ? 'Đã sao chép' : 'Sao chép lời nhắn'}
            </button>
          </div>

          <a
            href={ZALO.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-5 w-full shine"
          >
            <IconChat className="h-4 w-4" /> Mở Zalo của shop
            <IconArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <p className="mt-3 text-center text-[10px] leading-relaxed text-zinc-600">
            Zalo không hỗ trợ điền sẵn tin nhắn. Bấm sao chép rồi dán vào cuộc trò chuyện.
          </p>
        </div>
      </div>
    </div>
  );
}
