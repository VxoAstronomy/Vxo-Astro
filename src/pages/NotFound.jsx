import { IconArrowRight, IconChevronLeft } from '../components/Icons';
import { useHashRoute } from '../lib/useHashRoute';
import { asset } from '../lib/storeConfig';

export default function NotFound() {
  useHashRoute();
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 pb-24 pt-32 text-center">
      <img
        src={asset('images/hero-moon.jpg')}
        alt=""
        aria-hidden="true"
        className="moon-mask pointer-events-none absolute right-[8%] top-[18%] hidden w-[240px] opacity-25 mix-blend-screen lg:block"
      />
      <p className="eyebrow">Lạc khỏi quỹ đạo</p>
      <p className="outline-number mt-4 select-none text-[clamp(7rem,22vw,15rem)] font-extralight leading-none tracking-[-0.08em]">
        404
      </p>
      <h1 className="mt-2 text-2xl font-extralight tracking-tight text-zinc-100 sm:text-3xl">Trang không tồn tại</h1>
      <p className="mt-4 max-w-md text-[12.5px] leading-relaxed text-zinc-500">
        Đường dẫn này đã trôi khỏi tầm quan sát. Quay về trang chủ hoặc xem danh mục sản phẩm.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href="#/" className="btn-primary">
          <IconChevronLeft className="h-4 w-4" /> Về trang chủ
        </a>
        <a href="#/san-pham" className="btn-ghost">
          Xem sản phẩm <IconArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
