import { IconChat, IconCheck, IconClock, IconShield, IconWrench } from '../components/Icons';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import RequestForm from '../components/RequestForm';
import { ZALO } from '../lib/storeConfig';
import { useShop } from '../Store';

const OFFERS = [
  'Gương parabol kích thước riêng',
  'Kính phản xạ DIY theo ngân sách',
  'Hệ tracking OnStep cho chân xích đạo',
  'Chi tiết in 3D và phụ kiện thay thế',
  'Nâng cấp focuser, spider, mirror cell',
];

const NOTES = [
  { Icon: IconClock, title: '7 – 21 ngày', text: 'Thời gian hoàn thiện tuỳ cấu hình và linh kiện.' },
  { Icon: IconWrench, title: 'Căn chỉnh trước giao', text: 'Kiểm tra quang trục và chạy thử thực tế.' },
  { Icon: IconShield, title: 'Hỗ trợ sau bán', text: 'Hướng dẫn và xử lý sự cố qua Zalo.' },
];

export default function Request() {
  const { openConsult } = useShop();

  return (
    <div>
      <PageHeader
        eyebrow="Yêu cầu"
        title="Một cấu hình riêng cho bầu trời của bạn."
        desc="Không phải mọi nhu cầu đều khớp với sản phẩm có sẵn. Mô tả mục tiêu quan sát, shop sẽ đề xuất cấu hình và báo giá cụ thể."
      />

      <section className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">Shop nhận chế tạo</p>
              <ul className="mt-6 space-y-3.5">
                {OFFERS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[13px] text-zinc-400">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-accent/30 bg-accent/[0.08] text-accent-soft">
                      <IconCheck className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={120} className="mt-10 rounded-[26px] border border-white/[0.08] bg-gradient-to-br from-accent/[0.09] to-transparent p-6">
              <p className="text-[9px] uppercase tracking-[0.3em] text-accent-soft/80">Trao đổi trực tiếp</p>
              <h2 className="mt-3 text-xl font-extralight tracking-tight text-white">Chưa biết bắt đầu từ đâu?</h2>
              <p className="mt-2.5 text-[12px] leading-relaxed text-zinc-500">
                Nhắn Zalo mô tả mục tiêu — Mặt Trăng, hành tinh, tinh vân hay chụp ảnh. Shop sẽ gợi ý cấu hình tối thiểu
                đủ dùng thay vì bán dư.
              </p>
              <button type="button" onClick={() => openConsult(null)} className="btn-primary mt-5 w-full">
                <IconChat className="h-4 w-4" /> Tư vấn qua Zalo
              </button>
              <p className="mt-3 text-center text-[10px] text-zinc-600">{ZALO.name} · {ZALO.hours}</p>
            </Reveal>

            <div className="mt-8 space-y-4">
              {NOTES.map(({ Icon, title, text }, index) => (
                <Reveal key={title} delay={180 + index * 80} className="flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-zinc-400">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[12.5px] font-medium text-zinc-200">{title}</p>
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-zinc-500">{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <RequestForm />
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
