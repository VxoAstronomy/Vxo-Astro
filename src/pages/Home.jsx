import { useMemo } from 'react';
import { asset } from '../lib/storeConfig';
import { useShop } from '../Store';
import CtaBand from '../components/CtaBand';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Pillars from '../components/Pillars';
import ProductGrid from '../components/ProductGrid';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import Stats from '../components/Stats';
import { IconArrowRight, IconCheck } from '../components/Icons';

export default function Home() {
  const { products, loading } = useShop();
  const featured = useMemo(() => {
    const picks = products.filter((p) => p.featured);
    return (picks.length ? picks : products).slice(0, 3);
  }, [products]);

  return (
    <>
      <Hero />
      <Marquee />

      <section className="container-x py-20 sm:py-28">
        <div className="flex items-end justify-between gap-8">
          <SectionHeading
            eyebrow="Bộ sưu tập"
            title="Thiết bị cho mỗi đêm trời quang."
            desc="Gương parabol, kính phản xạ DIY và phụ kiện in 3D — chọn cấu hình ngay trên thẻ sản phẩm."
          />
          <a href="#/san-pham" className="link-underline hidden shrink-0 pb-2 sm:inline-flex">
            Xem tất cả <IconArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-12">
          <ProductGrid products={featured} loading={loading} />
        </div>

        <a href="#/san-pham" className="link-underline mt-10 inline-flex sm:hidden">
          Xem tất cả sản phẩm <IconArrowRight className="h-4 w-4" />
        </a>
      </section>

      <Pillars />

      <section className="container-x">
        <Stats />
      </section>

      <section className="container-x py-20 sm:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-[30px] border border-white/10">
              <img
                src={asset('images/p-telescope.jpg')}
                alt="Kính phản xạ DIY lắp ráp tại xưởng"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.28em] text-zinc-400">Chế tác tại xưởng</p>
                  <p className="mt-1 text-lg font-light text-white">Căn chỉnh từng quang trục</p>
                </div>
                <span className="rounded-full border border-white/15 bg-ink-950/50 px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-zinc-300 backdrop-blur">
                  Made by hand
                </span>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="h-px w-8 bg-accent/60" /> Về xưởng
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-5 text-balance text-[clamp(1.9rem,4.4vw,3.2rem)] font-extralight leading-[1.08] tracking-[-0.03em] text-zinc-50">
                Quy mô nhỏ. Kiểm tra từng chi tiết.
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 max-w-lg text-pretty text-sm leading-relaxed text-zinc-500">
                Mỗi chiếc kính rời xưởng đều được cân chỉnh thủ công và kiểm tra dưới bầu trời thật. Chúng tôi không bán
                cấu hình mình chưa từng quan sát.
              </p>
            </Reveal>
            <div className="mt-7 space-y-3">
              {[
                'Gương parabol tráng nhôm, phủ SiO₂ bảo vệ',
                'Chi tiết in 3D PETG chịu thời tiết',
                'Căn chỉnh quang học và chạy thử trước bàn giao',
              ].map((item, index) => (
                <Reveal key={item} delay={220 + index * 70} className="flex items-start gap-3 text-[12.5px] text-zinc-400">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-accent/30 bg-accent/[0.08] text-accent-soft">
                    <IconCheck className="h-3 w-3" />
                  </span>
                  {item}
                </Reveal>
              ))}
            </div>
            <Reveal delay={440}>
              <a href="#/ve-chung-toi" className="link-underline mt-8 inline-flex">
                Câu chuyện của VXO <IconArrowRight className="h-4 w-4" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
