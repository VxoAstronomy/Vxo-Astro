import { useEffect } from 'react';
import { copyText } from '../lib/format';
import { ZALO } from '../lib/storeConfig';
import { useShop } from '../Store';
import { IconArrowUpRight, IconChat, IconClose, IconCopy, IconPhone } from './Icons';

export default function ZaloPanel() {
  const { zaloPanel, setZaloPanel, notify } = useShop();

  useEffect(() => {
    if (!zaloPanel) return undefined;
    const onKey = (event) => event.key === 'Escape' && setZaloPanel(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zaloPanel, setZaloPanel]);

  const copyPhone = async () => {
    const ok = await copyText(ZALO.phone);
    notify(ok ? 'Đã sao chép số Zalo.' : `Số Zalo: ${ZALO.phone}`);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {zaloPanel && (
        <div className="w-[calc(100vw-2rem)] max-w-[330px] overflow-hidden rounded-[26px] border border-white/10 bg-ink-900/95 shadow-card backdrop-blur-2xl panel-enter">
          <div className="flex items-center gap-3 px-5 pb-4 pt-5">
            {ZALO.avatar ? (
              <img src={ZALO.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
            ) : (
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-violet text-base font-semibold text-ink-950">
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
              <button
                type="button"
                onClick={copyPhone}
                className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-500 transition hover:text-zinc-200"
              >
                Zalo · {ZALO.phone} <IconCopy className="h-3 w-3" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setZaloPanel(false)}
              className="grid h-8 w-8 place-items-center rounded-full text-zinc-500 transition hover:bg-white/5 hover:text-white"
              aria-label="Đóng"
            >
              <IconClose className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4 border-t border-white/[0.07] px-5 py-4">
            <p className="text-[12.5px] leading-relaxed text-zinc-400">{ZALO.intro}</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">Hỗ trợ · {ZALO.hours}</p>
            <a
              href={ZALO.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center"
            >
              <IconChat className="h-4 w-4" /> Nhắn tin qua Zalo
            </a>
            <a
              href={`tel:${ZALO.phone}`}
              className="flex items-center justify-center gap-2 rounded-full py-2 text-[11px] text-zinc-500 transition hover:text-zinc-200"
            >
              <IconPhone className="h-3.5 w-3.5" /> Gọi {ZALO.phone}
            </a>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {!zaloPanel && (
          <span className="hidden rounded-full border border-white/10 bg-ink-900/80 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-zinc-400 backdrop-blur-md sm:inline-block">
            Tư vấn 1:1
          </span>
        )}
        <button
          type="button"
          onClick={() => setZaloPanel((open) => !open)}
          aria-label={zaloPanel ? 'Đóng cửa sổ Zalo' : 'Mở tư vấn Zalo'}
          aria-expanded={zaloPanel}
          className="relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-accent-soft to-accent text-ink-950 shadow-glow transition-transform duration-300 hover:scale-105"
        >
          <span className="absolute -inset-1 -z-10 rounded-full bg-accent/25 blur-lg animate-pulse-soft" aria-hidden="true" />
          {zaloPanel ? <IconClose className="h-6 w-6" /> : <IconChat className="h-6 w-6" />}
        </button>
      </div>
    </div>
  );
}
