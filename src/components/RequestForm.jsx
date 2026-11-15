import { useState } from 'react';
import { copyText, isPhone } from '../lib/format';
import { CONFIG, HAS_GAS, ZALO } from '../lib/storeConfig';
import { useShop } from '../Store';
import { IconArrowRight, IconChat, IconCheck } from './Icons';

const TYPES = ['Gương cầu/para', 'Kính phản xạ DIY', 'Hệ thống tracking OnStep', 'Bộ kit / phụ kiện in 3D', 'Khác'];
const BUDGETS = ['Dưới 2 triệu', '2 – 3 triệu', 'Chưa xác định'];

const EMPTY = () => ({ name: '', phone: '', zalo: '', type: TYPES[0], budget: BUDGETS[1], message: '', website: '' });

export default function RequestForm() {
  const { notify } = useShop();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(null);

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Vui lòng nhập họ tên.';
    if (!isPhone(form.phone)) next.phone = 'Số điện thoại chưa đúng.';
    if (form.message.trim().length < 10) next.message = 'Mô tả thêm mục tiêu hoặc cấu hình bạn cần (ít nhất 10 ký tự).';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const requestText = () =>
    [
      `${CONFIG.BRAND.name} ${CONFIG.BRAND.suffix} — Yêu cầu chế tạo`,
      `Họ tên: ${form.name.trim()}`,
      `SĐT: ${form.phone.trim()}`,
      form.zalo.trim() ? `Zalo: ${form.zalo.trim()}` : '',
      `Loại: ${form.type}`,
      `Ngân sách: ${form.budget}`,
      `Nội dung: ${form.message.trim()}`,
    ]
      .filter(Boolean)
      .join('\n');

  const viaZalo = async () => {
    const win = window.open(ZALO.link, '_blank', 'noopener,noreferrer');
    const ok = await copyText(requestText());
    notify(ok ? 'Đã sao chép yêu cầu — dán vào Zalo để gửi shop.' : 'Đã mở Zalo — gửi nội dung yêu cầu cho shop.');
    setSent({ id: null, via: 'zalo', copied: ok, opened: Boolean(win) });
  };

  const submit = async (event) => {
    event.preventDefault();
    if (form.website) return;
    if (!validate()) return;

    if (!HAS_GAS) {
      await viaZalo();
      return;
    }

    const requestId = 'YC' + Date.now().toString(36).toUpperCase();
    const payload = {
      action: 'request',
      requestId,
      createdAt: new Date().toISOString(),
      customer: { name: form.name.trim(), phone: form.phone.trim(), zalo: form.zalo.trim() },
      projectType: form.type,
      budget: form.budget,
      message: form.message.trim(),
      source: 'website',
    };

    setLoading(true);
    try {
      await fetch(CONFIG.GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      setSent({ id: requestId, via: 'gas' });
      setForm(EMPTY());
      setErrors({});
    } catch {
      setErrors({ submit: 'Không gửi được yêu cầu. Thử lại hoặc nhắn Zalo để shop hỗ trợ.' });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] p-7 text-center sm:p-10">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-emerald-300/25 bg-emerald-400/10 text-emerald-300">
          <IconCheck className="h-7 w-7" />
        </div>
        <h2 className="mt-6 text-2xl font-extralight tracking-tight text-white">
          {sent.via === 'gas' ? 'Đã nhận yêu cầu' : 'Yêu cầu đã sẵn sàng gửi'}
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-[12.5px] leading-relaxed text-zinc-500">
          {sent.via === 'gas'
            ? `Mã yêu cầu ${sent.id}. Shop sẽ phản hồi trong 24 giờ qua số điện thoại hoặc Zalo bạn cung cấp.`
            : 'Nội dung yêu cầu đã được sao chép. Dán vào cuộc trò chuyện Zalo vừa mở để shop nhận thông tin.'}
        </p>
        <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <a href={ZALO.link} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <IconChat className="h-4 w-4" /> Mở Zalo
          </a>
          <button type="button" onClick={() => setSent(null)} className="btn-ghost">
            Tạo yêu cầu khác
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-[28px] border border-white/[0.08] bg-gradient-to-b from-white/[0.045] to-white/[0.012] p-6 sm:p-8" noValidate>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Biểu mẫu</p>
          <h2 className="mt-3 text-2xl font-extralight tracking-tight text-white">Mô tả cấu hình bạn cần</h2>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-[9px] uppercase tracking-[0.16em] text-zinc-500">
          ~24h phản hồi
        </span>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="rq-name">Họ và tên</label>
          <input id="rq-name" value={form.name} onChange={set('name')} className={`field ${errors.name ? 'field-error' : ''}`} placeholder="Nguyễn Văn A" autoComplete="name" />
          {errors.name && <p className="mt-1.5 text-xs text-rose-300">{errors.name}</p>}
        </div>
        <div>
          <label className="label" htmlFor="rq-phone">Số điện thoại</label>
          <input id="rq-phone" value={form.phone} onChange={set('phone')} className={`field ${errors.phone ? 'field-error' : ''}`} placeholder="0901234567" type="tel" autoComplete="tel" />
          {errors.phone && <p className="mt-1.5 text-xs text-rose-300">{errors.phone}</p>}
        </div>
        <div>
          <label className="label" htmlFor="rq-zalo">Zalo <span className="text-zinc-600">(nếu khác SĐT)</span></label>
          <input id="rq-zalo" value={form.zalo} onChange={set('zalo')} className="field" placeholder="0368783039" />
        </div>
        <div>
          <label className="label" htmlFor="rq-type">Bạn cần gì?</label>
          <select id="rq-type" value={form.type} onChange={set('type')} className="field">
            {TYPES.map((type) => (
              <option key={type} className="bg-ink-900">{type}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="rq-budget">Ngân sách dự kiến</label>
          <select id="rq-budget" value={form.budget} onChange={set('budget')} className="field">
            {BUDGETS.map((budget) => (
              <option key={budget} className="bg-ink-900">{budget}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="rq-message">Mô tả yêu cầu</label>
          <textarea
            id="rq-message"
            value={form.message}
            onChange={set('message')}
            rows={4}
            className={`field resize-none ${errors.message ? 'field-error' : ''}`}
            placeholder="Ví dụ: cần gương D150 f750 + đế Dobsonian, quan sát tinh vân từ sân thượng TP.HCM…"
          />
          {errors.message && <p className="mt-1.5 text-xs text-rose-300">{errors.message}</p>}
        </div>
      </div>

      <input
        type="text"
        name="website"
        value={form.website}
        onChange={set('website')}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {errors.submit && (
        <p className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-4 py-3 text-xs text-rose-200">{errors.submit}</p>
      )}

      <div className="mt-7 space-y-3">
        {HAS_GAS ? (
          <button type="submit" disabled={loading} className="btn-primary w-full shine">
            {loading ? 'Đang gửi…' : <>Gửi yêu cầu <IconArrowRight className="h-4 w-4" /></>}
          </button>
        ) : (
          <button type="button" onClick={submit} className="btn-primary w-full shine">
            <IconChat className="h-4 w-4" /> Gửi yêu cầu qua Zalo
          </button>
        )}
        <p className="text-center text-[10.5px] leading-relaxed text-zinc-600">
          Thông tin chỉ dùng để tư vấn. Shop không gọi ngoài khung giờ {ZALO.hours}.
        </p>
      </div>
    </form>
  );
}
