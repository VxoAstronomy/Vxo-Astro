import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

const STEPS = [
  { title: 'Tư vấn', text: 'Trao đổi mục tiêu quan sát, ngân sách và không gian sử dụng qua Zalo.' },
  { title: 'Thiết kế', text: 'Chốt khẩu độ, tiêu cự, chân đế và phụ kiện phù hợp với nhu cầu.' },
  { title: 'Chế tác', text: 'In 3D chi tiết, gia công gương và lắp ráp theo cấu hình đã chọn.' },
  { title: 'Căn chỉnh', text: 'Cân quang trục, kiểm tra thực tế và bàn giao kèm hướng dẫn sử dụng.' },
];

export default function Process() {
  return (
    <section className="container-x py-20 sm:py-24">
      <SectionHeading
        eyebrow="Quy trình"
        title="Từ ý tưởng đến đêm quan sát đầu tiên."
        desc="Bốn bước rõ ràng, minh bạch về thời gian và chi phí."
      />
      <div className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <span
          className="pointer-events-none absolute left-0 right-0 top-[18px] hidden h-px bg-gradient-to-r from-white/[0.02] via-white/15 to-white/[0.02] lg:block"
          aria-hidden="true"
        />
        {STEPS.map((step, index) => (
          <Reveal key={step.title} delay={index * 90} className="relative">
            <span className="relative z-10 inline-flex h-9 items-center rounded-full border border-white/10 bg-ink-950 px-3 text-[10px] tabular-nums tracking-[0.24em] text-accent-soft">
              0{index + 1}
            </span>
            <h3 className="mt-5 text-[15px] font-medium text-zinc-100">{step.title}</h3>
            <p className="mt-2 max-w-[260px] text-[12.5px] leading-relaxed text-zinc-500">{step.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
