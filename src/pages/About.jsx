import CtaBand from '../components/CtaBand';
import PageHeader from '../components/PageHeader';
import Process from '../components/Process';
import Reveal from '../components/Reveal';
import Stats from '../components/Stats';
import { IconLayers, IconShield, IconSparkle, IconTelescope } from '../components/Icons';
import { asset } from '../lib/storeConfig';

const PRINCIPLES = [
  {
    Icon: IconTelescope,
    title: 'Quang học trước',
    text: 'Khẩu độ, tiêu cự và khoảng hội tụ được tính trước khi in. Không thêm chi tiết chỉ để trông phức tạp.',
  },
  {
    Icon: IconLayers,
    title: 'Vừa đủ & bền',
    text: 'PETG chịu ẩm, phụ kiện kim loại ở điểm chịu lực. Chi tiết hao mòn có thể in và thay riêng.',
  },
  {
    Icon: IconShield,
    title: 'Minh bạch',
    text: 'Giá, thời gian hoàn thiện và giới hạn của từng cấu hình được nói rõ trước khi bạn đặt.',
  },
];

export default function About() {
  return (
    <div>
      <PageHeader
        eyebrow="Về VXO"
        title="Chế tác cho người nhìn lên."
        desc="Một xưởng nhỏ làm gương parabol, kính phản xạ DIY và phụ kiện in 3D cho cộng đồng yêu thiên văn Việt Nam."
      />

      <section className="container-x pb-6">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-[30px] border border-white/10">
              <img
                src={asset('images/p-mirror.jpg')}
                alt="Gương parabol chế tác thủ công"
                className="aspect-[4/5] w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[9px] uppercase tracking-[0.28em] text-zinc-400">Gương parabol</p>
                <p className="mt-1.5 text-xl font-extralight text-white">203mm · f/4 · 28mm</p>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="h-px w-8 bg-accent/60" /> Câu chuyện
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-5 text-balance text-[clamp(1.9rem,4.6vw,3.3rem)] font-extralight leading-[1.08] tracking-[-0.03em] text-zinc-50">
                Bắt đầu từ một chiếc gương và bầu trời sau nhà.
              </h2>
            </Reveal>
            <div className="mt-6 space-y-4 text-pretty text-sm leading-relaxed text-zinc-500">
              <Reveal delay={150} as="p">
                VXO bắt đầu từ việc tự làm kính thiên văn: mua gương, in chi tiết, căn chỉnh và học cách nhìn bầu trời.
                Những khó khăn đó trở thành quy trình chế tác hôm nay.
              </Reveal>
              <Reveal delay={220} as="p">
                Chúng tôi tập trung vào những thứ thực sự ảnh hưởng đến trải nghiệm quan sát: gương tốt, cấu trúc ổn
                định, căn chỉnh chính xác và một người sẵn sàng trả lời khi bạn gặp khó.
              </Reveal>
              <Reveal delay={290} as="p">
                Không có nhà máy lớn. Chỉ có một xưởng nhỏ, vài chiếc máy in 3D, và tiêu chuẩn kiểm tra khắt khe trước
                khi mỗi sản phẩm được gửi đi.
              </Reveal>
            </div>

            <Reveal delay={360}>
              <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-4">
                <IconSparkle className="h-5 w-5 shrink-0 text-accent-soft" />
                <p className="text-[12px] leading-relaxed text-zinc-400">
                  “Không bán cấu hình mình chưa từng quan sát.” — nguyên tắc kiểm tra trước bàn giao.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-x py-20 sm:py-24">
        <div className="grid gap-8 border-t border-white/[0.08] pt-10 sm:grid-cols-3">
          {PRINCIPLES.map(({ Icon, title, text }, index) => (
            <Reveal key={title} delay={index * 90}>
              <span className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.02] text-accent-soft">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-[15px] font-medium text-zinc-100">{title}</h3>
              <p className="mt-2.5 max-w-xs text-[12.5px] leading-relaxed text-zinc-500">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <Process />

      <section className="container-x">
        <Stats />
      </section>

      <div className="pt-20 sm:pt-24">
        <CtaBand
          image={asset('images/p-kit.jpg')}
          eyebrow="Ghé xưởng"
          title="Cần một cấu hình riêng?"
          desc="Gửi mục tiêu quan sát và ngân sách — shop sẽ đề xuất cấu hình tối ưu, kèm thời gian hoàn thiện cụ thể."
          primaryLabel="Gửi yêu cầu chế tạo"
          primaryHref="#/yeu-cau"
        />
      </div>
    </div>
  );
}
