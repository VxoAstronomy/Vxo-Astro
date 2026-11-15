import { asset } from '../lib/storeConfig';
import { useShop } from '../Store';
import { IconArrowRight, IconChat } from './Icons';
import Reveal from './Reveal';

export default function CtaBand({
  image = asset('images/cta-observatory.jpg'),
  eyebrow = 'Bắt đầu quan sát',
  title = 'Bầu trời đêm đang chờ bạn.',
  desc = 'Chọn một chiếc kính phù hợp, hoặc để shop tư vấn cấu hình theo mục tiêu quan sát của bạn.',
  primaryLabel = 'Xem sản phẩm',
  primaryHref = '#/san-pham',
}) {
  const { openConsult } = useShop();
  return (
    <section className="container-x">
      <Reveal className="group relative overflow-hidden rounded-[32px] border border-white/10">
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-45 transition-transform duration-[2.4s] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/20" />
        <div className="relative flex min-h-[360px] flex-col justify-end p-7 sm:min-h-[420px] sm:p-12">
          <p className="eyebrow flex items-center gap-3">
            <span className="h-px w-8 bg-accent/60" /> {eyebrow}
          </p>
          <h2 className="mt-5 max-w-xl text-balance text-[clamp(1.9rem,4.6vw,3.4rem)] font-extralight leading-[1.05] tracking-[-0.035em] text-white">
            {title}
          </h2>
          <p className="mt-4 max-w-md text-[12.5px] leading-relaxed text-zinc-400 sm:text-sm">{desc}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={primaryHref} className="btn-primary shine group/btn">
              {primaryLabel}
              <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </a>
            <button type="button" onClick={() => openConsult(null)} className="btn-ghost">
              <IconChat className="h-4 w-4 text-accent-soft" /> Nhắn Zalo
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
