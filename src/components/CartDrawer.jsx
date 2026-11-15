import { useEffect } from 'react';
import { handleImageError, money } from '../lib/format';
import { useLockBody } from '../lib/hooks';
import { navigate } from '../lib/useHashRoute';
import { useShop } from '../Store';
import { IconArrowRight, IconCart, IconClose, IconMinus, IconPlus, IconTrash } from './Icons';

export default function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    cartItems,
    count,
    total,
    incItem,
    decItem,
    removeItem,
    setCheckoutOpen,
  } = useShop();
  useLockBody(cartOpen);

  useEffect(() => {
    if (!cartOpen) return undefined;
    const onKey = (event) => event.key === 'Escape' && setCartOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  const goShop = () => {
    setCartOpen(false);
    navigate('san-pham');
  };

  return (
    <div className="fixed inset-0 z-[75]" role="dialog" aria-modal="true" aria-label="Giỏ hàng">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm overlay-enter"
        onClick={() => setCartOpen(false)}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-ink-900/95 backdrop-blur-2xl drawer-enter">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">Giỏ hàng</p>
            <h2 className="mt-1 text-lg font-light tracking-tight text-white">
              {count > 0 ? `${count} sản phẩm` : 'Chưa có sản phẩm'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-400 transition hover:border-white/30 hover:text-white"
            aria-label="Đóng giỏ hàng"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-white/[0.02] text-zinc-600">
                <IconCart className="h-7 w-7" />
              </span>
              <p className="mt-6 text-sm font-medium text-zinc-200">Giỏ hàng đang trống</p>
              <p className="mt-2 max-w-[240px] text-xs leading-relaxed text-zinc-500">
                Khám phá gương parabol, kính DIY và phụ kiện in 3D.
              </p>
              <button type="button" onClick={goShop} className="btn-primary mt-7">
                Xem sản phẩm <IconArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {cartItems.map((item) => (
                <li key={item.key} className="flex gap-4">
                  <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-800">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={handleImageError}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-zinc-100">{item.name}</p>
                        {item.variant && (
                          <p className="mt-0.5 truncate text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                            {item.variant}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-zinc-600 transition hover:bg-white/5 hover:text-rose-300"
                        aria-label={`Xóa ${item.name}`}
                      >
                        <IconTrash className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="flex items-center rounded-full border border-white/10 text-sm">
                        <button
                          type="button"
                          onClick={() => decItem(item.key)}
                          className="grid h-8 w-8 place-items-center rounded-full text-zinc-500 transition hover:text-white"
                          aria-label="Giảm số lượng"
                        >
                          <IconMinus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium text-zinc-200">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => incItem(item.key)}
                          className="grid h-8 w-8 place-items-center rounded-full text-zinc-500 transition hover:text-white"
                          aria-label="Tăng số lượng"
                        >
                          <IconPlus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-[13px] font-medium text-white">{money(item.price * item.qty)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-white/[0.07] px-6 py-5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">Tổng tiền</span>
              <span className="text-xl font-light tracking-tight text-white">{money(total)}</span>
            </div>
            <p className="mt-2 text-[10.5px] leading-relaxed text-zinc-600">
              Thanh toán COD, chuyển khoản hoặc đặt cọc 30%. Tư vấn trước khi chốt đơn qua Zalo.
            </p>
            <button
              type="button"
              onClick={() => {
                setCartOpen(false);
                setCheckoutOpen(true);
              }}
              className="btn-primary mt-5 w-full shine"
            >
              Tiến hành đặt hàng <IconArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(false)}
              className="mt-2 w-full rounded-full py-2.5 text-[12px] text-zinc-500 transition hover:text-zinc-200"
            >
              Tiếp tục xem sản phẩm
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
