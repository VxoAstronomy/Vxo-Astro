import { useEffect } from 'react';
import { money } from '../lib/format';
import { useLockBody } from '../lib/hooks';
import { navigate } from '../lib/useHashRoute';
import { ZALO } from '../lib/storeConfig';
import { useShop } from '../Store';
import { IconChat, IconCheck, IconClose } from './Icons';

export default function SuccessModal() {
  const { done, setDone } = useShop();
  const open = Boolean(done);
  useLockBody(open);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === 'Escape' && setDone(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setDone]);

  if (!done) return null;

  const close = () => setDone(null);

  return (
    <div className="fixed inset-0 z-[95] grid place-items-center bg-black/80 p-4 backdrop-blur-md overlay-enter" role="dialog" aria-modal="true" aria-label="Đặt hàng thành công">
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-ink-900/95 p-7 text-center shadow-card panel-enter sm:p-9">
        <button
          type="button"
          onClick={close}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-zinc-500 transition hover:bg-white/5 hover:text-white"
          aria-label="Đóng"
        >
          <IconClose className="h-4 w-4" />
        </button>

        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-emerald-300/25 bg-emerald-400/10 text-emerald-300">
          <IconCheck className="h-7 w-7" />
        </div>

        <h2 className="mt-6 text-2xl font-extralight tracking-tight text-white">Đã nhận đơn hàng</h2>
        <p className="mt-3 text-[12.5px] leading-relaxed text-zinc-500">
          Shop sẽ gọi xác nhận qua số <span className="text-zinc-200">{done.customer?.phone}</span> trong thời gian sớm nhất.
        </p>

        <div className="mt-6 space-y-2.5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 text-left text-[12px]">
          <div className="flex justify-between gap-4">
            <span className="text-zinc-500">Mã đơn</span>
            <span className="font-medium tracking-wide text-zinc-200">{done.orderId}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-zinc-500">Tổng tiền</span>
            <span className="font-medium text-white">{money(done.total)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-zinc-500">Thanh toán</span>
            <span className="text-right text-zinc-300">{done.paymentMethod}</span>
          </div>
        </div>

        {done.depositAmount > 0 && !done.transactionCode && (
          <p className="mt-3 rounded-xl border border-accent/25 bg-accent/[0.06] px-4 py-3 text-left text-[11.5px] leading-relaxed text-zinc-400">
            Bạn chọn thanh toán trước {money(done.depositAmount)}. Nhớ chuyển khoản rồi gửi{' '}
            <span className="text-zinc-200">mã giao dịch</span> (xem trong Lịch sử giao dịch của app ngân hàng) qua Zalo
            để shop giữ đơn nhé.
          </p>
        )}

        <button
          type="button"
          onClick={() => {
            close();
            navigate('san-pham');
          }}
          className="btn-primary mt-6 w-full"
        >
          Tiếp tục xem sản phẩm
        </button>
        <a
          href={ZALO.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center justify-center gap-2 rounded-full py-2.5 text-[12px] text-zinc-500 transition hover:text-accent-soft"
        >
          <IconChat className="h-4 w-4" /> Theo dõi đơn qua Zalo
        </a>
      </div>
    </div>
  );
}
