import { IconLayers, IconShield, IconTelescope, IconWrench } from './Icons';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

const PILLARS = [
  {
    Icon: IconLayers,
    title: 'Thiết kế quang học',
    text: 'Tính toán khẩu độ, tiêu cự và khoảng hội tụ trước khi gia công. Mỗi cấu hình đi kèm một mục tiêu quan sát cụ thể.',
  },
  {
    Icon: IconTelescope,
    title: 'In 3D & chế tác',
    text: 'Chi tiết in PETG chịu thời tiết, kết hợp gương parabol tráng nhôm và phụ kiện kim loại chắc chắn.',
  },
  {
    Icon: IconWrench,
    title: 'Lắp ráp & căn chỉnh',
    text: 'Cân chỉnh quang trục, kiểm tra điểm hội tụ và chạy thử trước khi bàn giao. Sẵn sàng quan sát ngay.',
  },
  {
    Icon: IconShield,
    title: 'Đồng hành sau bán',
    text: 'Hướng dẫn sử dụng, xử lý trôi ảnh và nâng cấp tracking. Hỗ trợ 1:1 qua Zalo trong suốt quá trình dùng.',
  },
];

export default function Pillars() {
  return (
    <section className="container-x py-20 sm:py-28">
      <SectionHeading
        eyebrow="Grow with us"
        title="Không chỉ bán thiết bị. Chúng tôi giúp bạn quan sát."
        desc="Từ chọn gương, in chi tiết đến căn chỉnh quang học — mỗi bước đều có người hướng dẫn."
      />
      <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map(({ Icon, title, text }, index) => (
          <Reveal key={title} delay={index * 80} className="group border-t border-white/[0.08] pt-6">
            <div className="flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.02] text-zinc-400 transition-all duration-500 group-hover:border-accent/40 group-hover:text-accent-soft">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[10px] tabular-nums tracking-[0.24em] text-zinc-700">0{index + 1}</span>
            </div>
            <h3 className="mt-6 text-[15px] font-medium tracking-tight text-zinc-100">{title}</h3>
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-zinc-500">{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
