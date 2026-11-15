import { useEffect, useState } from 'react';
import { copyText, isPhone, money } from '../lib/format';
import { useLockBody } from '../lib/hooks';
import { CONFIG, HAS_DISCORD, ZALO } from '../lib/storeConfig';
import { sendOrder } from '../lib/discord';
import { useShop } from '../Store';
import { IconChat, IconCheck, IconChevronDown, IconClose, IconCopy, IconPhone } from './Icons';
import PhoneLinks from './PhoneLinks';

const EMPTY = () => ({ name: '', phone: '', address: '', note: '', method: 'cod', txn: '' });

export default function Checkout() {
  const { checkoutOpen, setCheckoutOpen, cartItems, total, clearCart, setDone, notify } = useShop();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  useLockBody(checkoutOpen);

  useEffect(() => {
    if (!checkoutOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape' && !loading) setCheckoutOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [checkoutOpen, loading, setCheckoutOpen]);

  if (!checkoutOpen) return null;

  const rate = Number(CONFIG.DEPOSIT_RATE) || 0.3;
  const payNow =
    form.method === 'transfer'
      ? total
      : form.method === 'deposit'
        ? Math.round((total * rate) / 1000) * 1000
        : 0;
  const remaining = total - payNow;
  const methodLabel =
    form.method === 'transfer'
      ? 'Chuyển khoản trước (100%)'
      : form.method === 'deposit'
        ? `Đặt cọc ${Math.round(rate * 100)}%`
        : 'COD – Thanh toán khi nhận hàng';

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Vui lòng nhập họ và tên.';
    if (!isPhone(form.phone)) next.phone = 'Số điện thoại chưa đúng (ví dụ 0901234567).';
    if (form.address.trim().length < 8) next.address = 'Nhập địa chỉ đầy đủ: số nhà, đường, phường, tỉnh/thành.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildOrder = () => ({
    action: 'order',
    orderId: 'VXO' + Date.now().toString(36).toUpperCase(),
    createdAt: new Date().toISOString(),
    customer: { name: form.name.trim(), phone: form.phone.trim(), address: form.address.trim(), note: form.note.trim() },
    items: cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      options: item.variant,
      qty: item.qty,
      price: item.price,
      subtotal: item.price * item.qty,
    })),
    total,
    paymentMethod: methodLabel,
    depositAmount: payNow,
    remaining,
    depositStatus:
      form.method === 'cod' ? 'Không cần cọc' : form.txn.trim() ? 'Đã báo chuyển khoản' : 'Chờ chuyển khoản',
    transactionCode: form.txn.trim(),
  });

  const orderText = () => {
    const lines = cartItems.map(
      (item) => `• ${item.qty} × ${item.name}${item.variant ? ` (${item.variant})` : ''} — ${money(item.price * item.qty)}`,
    );
    return [
      `${CONFIG.BRAND.name} ${CONFIG.BRAND.suffix} — Đơn hàng mới`,
      ...lines,
      `Tổng: ${money(total)}`,
      `Thanh toán: ${methodLabel}`,
      form.name ? `Khách: ${form.name} — ${form.phone}` : '',
      form.address ? `Địa chỉ: ${form.address}` : '',
      form.note ? `Ghi chú: ${form.note}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  };

  const viaZalo = async () => {
    if (!cartItems.length) return;
    const copiedOk = await copyText(orderText());
    window.open(ZALO.link, '_blank', 'noopener,noreferrer');
    notify(copiedOk ? 'Đã sao chép đơn hàng — dán vào Zalo để gửi shop.' : 'Đã mở Zalo — gửi nội dung đơn cho shop.');
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!cartItems.length || !validate()) return;
    if (!HAS_DISCORD) {
      setErrors({ submit: 'Chưa cấu hình Discord webhook. Hãy gửi đơn qua Zalo hoặc dán DISCORD_WEBHOOK trong config.js.' });
      return;
    }
    const order = buildOrder();
    setLoading(true);
    setErrors({});
    try {
      await sendOrder(order);
      clearCart();
      setCheckoutOpen(false);
      setDone(order);
      setForm(EMPTY());
    } catch {
      setErrors({ submit: 'Không gửi được đơn tới Discord. Kiểm tra kết nối mạng rồi thử lại, hoặc đặt qua Zalo.' });
    } finally {
      setLoading(false);
    }
  };

  const copyBank = async () => {
    const ok = await copyText(CONFIG.BANK.number);
    setCopied(ok);
    notify(ok ? 'Đã sao chép số tài khoản.' : 'Không sao chép được — vui lòng nhập tay.');
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-[85] overflow-y-auto bg-black/80 p-3 backdrop-blur-md overlay-enter sm:p-6" role="dialog" aria-modal="true" aria-label="Đặt hàng">
      <div className="mx-auto my-3 grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-ink-900/95 shadow-card panel-enter lg:grid-cols-5">
        <form onSubmit={submit} className="space-y-7 p-6 sm:p-9 lg:col-span-3" noValidate>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Thanh toán</p>
              <h2 className="mt-3 text-2xl font-extralight tracking-tight text-white sm:text-3xl">Thông tin đặt hàng</h2>
            </div>
            <button
              type="button"
              onClick={() => setCheckoutOpen(false)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-zinc-400 transition hover:border-white/30 hover:text-white"
              aria-label="Đóng"
            >
              <IconClose className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="ck-name">Họ và tên</label>
              <input
                id="ck-name"
                value={form.name}
                onChange={set('name')}
                autoComplete="name"
                className={`field ${errors.name ? 'field-error' : ''}`}
                placeholder="Nguyễn Văn A"
              />
              {errors.name && <p className="mt-1.5 text-xs text-rose-300">{errors.name}</p>}
            </div>
            <div>
              <label className="label" htmlFor="ck-phone">Số điện thoại</label>
              <input
                id="ck-phone"
                value={form.phone}
                onChange={set('phone')}
                type="tel"
                autoComplete="tel"
                className={`field ${errors.phone ? 'field-error' : ''}`}
                placeholder="0901234567"
              />
              {errors.phone && <p className="mt-1.5 text-xs text-rose-300">{errors.phone}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="ck-address">Địa chỉ giao hàng</label>
              <textarea
                id="ck-address"
                value={form.address}
                onChange={set('address')}
                rows={2}
                autoComplete="street-address"
                className={`field resize-none ${errors.address ? 'field-error' : ''}`}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
              />
              {errors.address && <p className="mt-1.5 text-xs text-rose-300">{errors.address}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="ck-note">Ghi chú <span className="text-zinc-600">(không bắt buộc)</span></label>
              <textarea
                id="ck-note"
                value={form.note}
                onChange={set('note')}
                rows={2}
                className="field resize-none"
                placeholder="Thời gian nhận hàng, yêu cầu thêm…"
              />
            </div>
          </div>

          <fieldset>
            <legend className="label">Phương thức thanh toán</legend>
            <div className="grid gap-2.5">
              {[
                { id: 'cod', label: 'COD', hint: 'Thanh toán khi nhận hàng' },
                { id: 'deposit', label: `Đặt cọc ${Math.round(rate * 100)}%`, hint: 'Phần còn lại trả khi nhận' },
                { id: 'transfer', label: 'Chuyển khoản 100%', hint: 'Ưu tiên xử lý và giao nhanh' },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3.5 transition ${
                    form.method === method.id
                      ? 'border-accent/45 bg-accent/[0.07]'
                      : 'border-white/10 bg-white/[0.015] hover:border-white/25'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={form.method === method.id}
                    onChange={set('method')}
                    className="h-4 w-4 accent-[#96a5ff]"
                  />
                  <span className="min-w-0">
                    <span className="block text-[13px] font-medium text-zinc-100">{method.label}</span>
                    <span className="mt-0.5 block text-[11px] text-zinc-500">{method.hint}</span>
                  </span>
                  {method.id !== 'cod' && (
                    <span className="ml-auto text-[12px] tabular-nums text-zinc-400">{money(payNow)}</span>
                  )}
                </label>
              ))}
            </div>
          </fieldset>

          {form.method !== 'cod' && (
            <div className="fade-in space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-[12.5px]">
              <p className="text-zinc-400">
                Chuyển <span className="font-medium text-white">{money(payNow)}</span> đến:
              </p>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-ink-950/50 px-3.5 py-3">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                    {CONFIG.BANK.name} · {CONFIG.BANK.owner}
                  </p>
                  <p className="mt-1 text-base font-medium tabular-nums tracking-wide text-white">{CONFIG.BANK.number}</p>
                </div>
                <button
                  type="button"
                  onClick={copyBank}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-zinc-400 transition hover:border-white/30 hover:text-white"
                  aria-label="Sao chép số tài khoản"
                >
                  {copied ? <IconCheck className="h-4 w-4 text-emerald-300" /> : <IconCopy className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-500">
                Nội dung chuyển khoản: <span className="text-zinc-200">VXO + số điện thoại</span>. Chuyển xong, nhập mã
                giao dịch bên dưới để shop đối soát nhanh.
              </p>
              <label className="label !mb-1.5" htmlFor="ck-txn">Mã giao dịch (nếu có)</label>
              <input id="ck-txn" value={form.txn} onChange={set('txn')} className="field" placeholder="Ví dụ: FT2408123456" />
              <details className="group rounded-xl border border-white/[0.07] bg-ink-950/40 px-3.5 py-2.5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[11px] font-medium text-zinc-400 transition hover:text-zinc-200">
                  Mã giao dịch là gì? Lấy ở đâu, nhập lúc nào?
                  <IconChevronDown className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <ol className="mt-2.5 list-decimal space-y-1.5 pl-4 text-[11px] leading-relaxed text-zinc-500">
                  <li>
                    Mở app ngân hàng, chuyển đúng số tiền ở trên với nội dung{' '}
                    <span className="text-zinc-300">VXO + số điện thoại</span> của bạn.
                  </li>
                  <li>
                    Chuyển thành công, vào <span className="text-zinc-300">Lịch sử giao dịch</span> → bấm vào giao dịch
                    vừa chuyển → chép dòng <span className="text-zinc-300">Mã giao dịch / Số tham chiếu</span> (thường
                    bắt đầu bằng FT, MB, VC… kèm dãy số).
                  </li>
                  <li>
                    Dán mã vào ô trên <span className="text-zinc-300">trước khi bấm xác nhận đặt hàng</span>. Chưa tìm
                    thấy mã? Cứ để trống — shop sẽ đối soát và nhắn lại cho bạn.
                  </li>
                </ol>
              </details>
            </div>
          )}

          {errors.submit && (
            <p className="rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-4 py-3 text-xs leading-relaxed text-rose-200">
              {errors.submit}
            </p>
          )}

          {HAS_DISCORD ? (
            <>
              <button type="submit" disabled={loading} className="btn-primary w-full shine">
                {loading ? 'Đang gửi đơn…' : <>Xác nhận đặt hàng · {money(total)}</>}
              </button>
              <button type="button" onClick={viaZalo} className="w-full text-center text-[11px] text-zinc-500 transition hover:text-accent-soft">
                Hoặc gửi đơn qua Zalo
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={viaZalo} className="btn-primary w-full shine">
                <IconChat className="h-4 w-4" /> Gửi đơn qua Zalo · {money(total)}
              </button>
              <p className="text-center text-[10.5px] leading-relaxed text-zinc-600">
                Website chưa kết nối Discord. Đơn sẽ được sao chép và gửi qua Zalo.
              </p>
            </>
          )}

          <p className="flex flex-wrap items-center justify-center gap-2 text-[10px] uppercase tracking-[0.16em] text-zinc-600">
            <IconPhone className="h-3 w-3" /> Hỗ trợ <PhoneLinks className="text-zinc-400" /> · {ZALO.hours}
          </p>
        </form>

        <aside className="border-t border-white/[0.07] bg-white/[0.018] p-6 sm:p-9 lg:col-span-2 lg:border-l lg:border-t-0">
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Đơn hàng</h3>
          <ul className="mt-6 space-y-4">
            {cartItems.map((item) => (
              <li key={item.key} className="flex justify-between gap-4 text-[12.5px]">
                <span className="min-w-0">
                  <span className="block leading-snug text-zinc-200">
                    <span className="text-zinc-500">{item.qty} ×</span> {item.name}
                  </span>
                  {item.variant && <span className="mt-0.5 block text-[10px] text-zinc-500">{item.variant}</span>}
                </span>
                <span className="shrink-0 font-medium text-zinc-200">{money(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-7 space-y-3 border-t border-white/[0.07] pt-6 text-[12.5px]">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Tổng tiền</dt>
              <dd className="font-medium text-white">{money(total)}</dd>
            </div>
            {form.method !== 'cod' && (
              <div className="flex justify-between">
                <dt className="text-zinc-500">Thanh toán trước</dt>
                <dd className="font-medium text-accent-soft">{money(payNow)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-zinc-500">Còn lại khi nhận</dt>
              <dd className="text-zinc-300">{money(remaining)}</dd>
            </div>
          </dl>

          <div className="mt-8 rounded-2xl border border-white/[0.07] bg-ink-950/40 p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent-soft/80">Cam kết</p>
            <ul className="mt-3 space-y-2 text-[11.5px] leading-relaxed text-zinc-500">
              <li>Kiểm tra hàng trước khi thanh toán.</li>
              <li>Tư vấn cấu hình 1:1 qua Zalo.</li>
              <li>Hỗ trợ căn chỉnh sau khi nhận.</li>
            </ul>
          </div>

          <a
            href={ZALO.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center gap-3 rounded-2xl border border-white/[0.07] px-4 py-3 transition hover:border-accent/35 hover:bg-accent/[0.04]"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/10 text-accent-soft">
              <IconChat className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-[12px] font-medium text-zinc-200">Cần hỏi trước khi đặt?</span>
              <span className="block truncate text-[10.5px] text-zinc-500">{ZALO.name} · {ZALO.phone}</span>
            </span>
          </a>
        </aside>
      </div>
    </div>
  );
}
