import { copyText } from '../lib/format';
import { CONFIG, ZALO } from '../lib/storeConfig';
import { useShop } from '../Store';
import Accordion from '../components/Accordion';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { IconChat, IconClock, IconCopy, IconMail, IconPhone, IconPin, IconShield, IconTruck } from '../components/Icons';

const FAQ = [
  {
    q: 'Người mới nên bắt đầu với kính nào?',
    a: 'Với quan sát Mặt Trăng và hành tinh, gương D114 f900 hoặc D150 f750 là lựa chọn cân bằng giữa khẩu độ và trọng lượng. Nếu chỉ muốn thử trước, bộ kit D76 full bộ là điểm bắt đầu tiết kiệm.',
  },
  {
    q: 'Có được xem hàng trực tiếp không?',
    a: 'Shop chủ yếu bán online và hẹn xem hàng qua Zalo. Bạn có thể yêu cầu video quay cận sản phẩm hoặc buổi quan sát thử trước khi chốt.',
  },
  {
    q: 'Thời gian giao hàng bao lâu?',
    a: 'Sản phẩm có sẵn giao trong 2–5 ngày làm việc. Cấu hình chế tạo riêng cần 7–21 ngày tuỳ linh kiện; thời gian cụ thể được xác nhận trước khi đặt.',
  },
  {
    q: 'Thanh toán và đặt cọc thế nào?',
    a: 'Bạn có thể chọn COD, chuyển khoản 100% hoặc đặt cọc 30%. Với đơn chế tạo riêng, khoản cọc giữ chỗ linh kiện và bắt đầu gia công.',
  },
  {
    q: 'Sau khi nhận, được hỗ trợ gì?',
    a: 'Shop hướng dẫn căn chỉnh quang trục, sử dụng chân đế và tracking qua Zalo. Chi tiết in 3D hao mòn có thể đặt in thay thế.',
  },
];

const INFO = [
  { Icon: IconPin, title: 'Khu vực', text: CONFIG.CONTACT.area },
  { Icon: IconClock, title: 'Giờ hỗ trợ', text: ZALO.hours },
  { Icon: IconTruck, title: 'Vận chuyển', text: 'Toàn quốc · kiểm tra hàng trước khi thanh toán' },
  { Icon: IconShield, title: 'Bảo hành', text: 'Hỗ trợ kỹ thuật và căn chỉnh sau bán' },
];

export default function Contact() {
  const { notify, openConsult } = useShop();

  const copy = async (value, label) => {
    const ok = await copyText(value);
    notify(ok ? `Đã sao chép ${label}.` : `${label}: ${value}`);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Liên hệ"
        title="Nói chuyện về bầu trời."
        desc="Câu hỏi về cấu hình, tồn kho hay thời gian hoàn thiện — nhắn Zalo để trao đổi trực tiếp với shop."
      />

      <section className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-accent/[0.12] via-white/[0.03] to-transparent p-7 sm:p-9">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/20 blur-[70px]" aria-hidden="true" />
              <div className="relative">
                <div className="flex items-center gap-4">
                  {ZALO.avatar ? (
                    <img src={ZALO.avatar} alt="" className="h-14 w-14 rounded-full object-cover" />
                  ) : (
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-violet text-xl font-semibold text-ink-950">
                      {ZALO.name.charAt(0)}
                    </span>
                  )}
                  <div>
                    <p className="flex items-center gap-2 text-base font-medium text-white">
                      {ZALO.name}
                      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-emerald-300/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => copy(ZALO.phone, 'số Zalo')}
                      className="mt-1 flex items-center gap-1.5 text-[11.5px] text-zinc-400 transition hover:text-white"
                    >
                      Zalo · {ZALO.phone} <IconCopy className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <p className="mt-6 text-[12.5px] leading-relaxed text-zinc-400">{ZALO.intro}</p>

                <div className="mt-6 space-y-3 border-t border-white/[0.08] pt-5 text-[11.5px] text-zinc-500">
                  <p className="flex items-center gap-2.5">
                    <IconClock className="h-4 w-4 text-accent/70" /> {ZALO.hours}
                  </p>
                  <p className="flex items-center gap-2.5">
                    <IconPin className="h-4 w-4 text-accent/70" /> {CONFIG.CONTACT.area}
                  </p>
                  {CONFIG.CONTACT.email && (
                    <p className="flex items-center gap-2.5">
                      <IconMail className="h-4 w-4 text-accent/70" />
                      <a href={`mailto:${CONFIG.CONTACT.email}`} className="hover:text-white">
                        {CONFIG.CONTACT.email}
                      </a>
                    </p>
                  )}
                </div>

                <div className="mt-7 flex flex-col gap-2.5">
                  <a href={ZALO.link} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
                    <IconChat className="h-4 w-4" /> Nhắn Zalo
                  </a>
                  <div className="grid grid-cols-2 gap-2.5">
                    <a href={`tel:${ZALO.phone}`} className="btn-ghost justify-center px-4 py-2.5 text-[12px]">
                      <IconPhone className="h-3.5 w-3.5" /> Gọi shop
                    </a>
                    <button type="button" onClick={() => openConsult(null)} className="btn-ghost justify-center px-4 py-2.5 text-[12px]">
                      Tư vấn 1:1
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {INFO.map(({ Icon, title, text }, index) => (
                <Reveal key={title} delay={index * 70} className="rounded-[24px] border border-white/[0.07] bg-white/[0.02] p-5">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-400">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-zinc-500">{title}</p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-zinc-300">{text}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200} className="mt-4 rounded-[24px] border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Thông tin chuyển khoản</p>
                  <p className="mt-2 text-[13px] text-zinc-200">
                    {CONFIG.BANK.name} · {CONFIG.BANK.owner}
                  </p>
                  <p className="mt-1 text-lg font-light tabular-nums tracking-wide text-white">{CONFIG.BANK.number}</p>
                </div>
                <button type="button" onClick={() => copy(CONFIG.BANK.number, 'số tài khoản')} className="btn-dark">
                  <IconCopy className="h-4 w-4" /> Sao chép
                </button>
              </div>
              <p className="mt-4 text-[11px] leading-relaxed text-zinc-600">
                Nội dung chuyển khoản: <span className="text-zinc-400">VXO + số điện thoại</span>. Đơn đặt cọc 30% sẽ được giữ chỗ linh kiện.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-x pt-20 sm:pt-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-accent/60" /> Hỏi đáp
            </p>
            <h2 className="mt-5 text-balance text-3xl font-extralight tracking-tight text-zinc-50 sm:text-4xl">
              Những câu hỏi thường gặp.
            </h2>
            <p className="mt-4 max-w-sm text-[12.5px] leading-relaxed text-zinc-500">
              Không thấy câu trả lời? Nhắn Zalo, shop sẽ phản hồi trong khung giờ hỗ trợ.
            </p>
          </div>
          <div className="lg:col-span-8">
            <Accordion items={FAQ} />
          </div>
        </div>
      </section>
    </div>
  );
}
