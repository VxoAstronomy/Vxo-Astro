import { useEffect, useRef, useState } from 'react';
import { CONFIG, asset } from '../lib/storeConfig';
import { useShop } from '../Store';
import { IconArrowRight, IconChat, IconSparkle } from './Icons';
import Reveal from './Reveal';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const MOON_DISTANCE_KM = 384400;

/* Keyframes riêng của Hero (tiền tố hero-) nên không cần sửa tailwind.config.
   Khi người dùng bật "giảm chuyển động" thì toàn bộ animation bị tắt,
   mọi phần tử hiện ngay ở trạng thái cuối. */
const CSS = `
@keyframes hero-line-in {
  from { transform: translate3d(0, 105%, 0) skewY(3deg); opacity: 0; filter: blur(8px); }
  to   { transform: none; opacity: 1; filter: blur(0); }
}
@keyframes hero-moon-in {
  from { opacity: 0; transform: scale(0.86) translate3d(0, 24px, 0); filter: blur(16px); }
  to   { opacity: 1; transform: none; filter: blur(0); }
}
@keyframes hero-ring-in {
  from { opacity: 0; transform: scale(0.72); }
  to   { opacity: 1; transform: none; }
}
@keyframes hero-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes hero-rule { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes hero-orbit { to { transform: rotate(360deg); } }
@keyframes hero-sheen {
  0%, 55% { background-position: 100% 0, 0 0; }
  100%    { background-position: 0% 0, 0 0; }
}
.hero-line  { animation: hero-line-in 1.15s ${EASE} both; will-change: transform, opacity, filter; }
.hero-moon  { animation: hero-moon-in 1.8s ${EASE} 0.15s both; }
.hero-ring  { animation: hero-ring-in 1.6s ${EASE} both; }
.hero-fade  { animation: hero-fade 1.2s ease-out both; }
.hero-rule  { transform-origin: right center; animation: hero-rule 1.2s ${EASE} 1.2s both; }
.hero-title2.hero-sheen {
  background-image:
    linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.85) 50%, transparent 60%),
    linear-gradient(to right, var(--tw-gradient-stops));
  background-size: 250% 100%, 100% 100%;
  background-repeat: no-repeat;
  background-position: 100% 0, 0 0;
  animation: hero-sheen 7s ease-in-out 2.4s infinite;
}
@media (prefers-reduced-motion: reduce) {
  .hero-line, .hero-moon, .hero-ring, .hero-fade, .hero-rule, .hero-title2.hero-sheen,
  .hero-orbit { animation: none !important; }
}
`;

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/* Bầu trời sao: canvas nhẹ, sao nhấp nháy + thỉnh thoảng một sao băng.
   Tự dừng khi ra khỏi màn hình; DPR giới hạn 2. */
function Starfield({ reduced }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    let w = 0;
    let h = 0;
    let stars = [];
    let shoot = null;
    let raf = 0;
    let visible = true;
    let last = 0;
    let nextShoot = 3500;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(170, (w * h) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.1 + 0.25,
        a: Math.random() * 0.5 + 0.25,
        s: Math.random() * 1.4 + 0.4,
        p: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (t) => {
      const dt = Math.min(t - last || 16, 50);
      last = t;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#e4e8ff';
      for (const s of stars) {
        const tw = reduced ? 1 : 0.55 + 0.45 * Math.sin(t * 0.001 * s.s + s.p);
        ctx.globalAlpha = s.a * tw;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (reduced) return;

      if (!shoot && t > nextShoot) {
        shoot = { x: w * (0.5 + Math.random() * 0.45), y: h * Math.random() * 0.3, age: 0 };
      }
      if (shoot) {
        const vx = -0.46;
        const vy = 0.22;
        shoot.x += vx * dt;
        shoot.y += vy * dt;
        shoot.age += dt;
        const k = shoot.age / 950;
        if (k >= 1) {
          shoot = null;
          nextShoot = t + 7000 + Math.random() * 6000;
        } else {
          const a = Math.sin(Math.PI * k);
          const g = ctx.createLinearGradient(shoot.x, shoot.y, shoot.x - vx * 170, shoot.y - vy * 170);
          g.addColorStop(0, `rgba(230,235,255,${0.9 * a})`);
          g.addColorStop(1, 'rgba(230,235,255,0)');
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.4;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(shoot.x, shoot.y);
          ctx.lineTo(shoot.x - vx * 170, shoot.y - vy * 170);
          ctx.stroke();
        }
      }
    };

    const loop = (t) => {
      if (!visible) {
        raf = 0;
        return;
      }
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    resize();
    draw(0);
    if (!reduced) raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      resize();
      draw(last);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf && !reduced) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduced]);

  return (
    <div
      className="pointer-events-none absolute -inset-6 z-0"
      style={{
        transform: 'translate3d(calc(var(--mx, 0) * -10px), calc(var(--my, 0) * -10px), 0)',
        WebkitMaskImage: 'linear-gradient(to bottom, #000 55%, transparent)',
        maskImage: 'linear-gradient(to bottom, #000 55%, transparent)',
      }}
      aria-hidden="true"
    >
      <canvas ref={ref} className="h-full w-full" />
    </div>
  );
}

/* Số km đếm lên khi vào trang: một khoảnh khắc nhỏ gắn với chủ đề. */
function Distance({ km, reduced }) {
  const [v, setV] = useState(reduced ? km : 0);

  useEffect(() => {
    if (reduced) {
      setV(km);
      return undefined;
    }
    let raf = 0;
    let start;
    const timer = setTimeout(() => {
      const tick = (now) => {
        start ??= now;
        const p = Math.min((now - start) / 2200, 1);
        setV(Math.round(km * (1 - (1 - p) ** 4)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, 900);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [km, reduced]);

  return <span className="tabular-nums">{new Intl.NumberFormat('vi-VN').format(v)} km</span>;
}

/* Nút "hút" nhẹ về phía con trỏ, chỉ trên thiết bị có chuột. */
function Magnetic({ children, strength = 0.22, disabled }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
    };
    const onLeave = () => {
      el.style.transform = '';
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [strength, disabled]);

  return (
    <span
      ref={ref}
      className="inline-block will-change-transform"
      style={{ transition: `transform 0.5s ${EASE}` }}
    >
      {children}
    </span>
  );
}

/* Mỗi dòng tiêu đề trượt lên từ sau một "mặt nạ" chỉ cắt ở cạnh dưới,
   nên không cắt ngang chữ và không làm hỏng dấu tiếng Việt. */
function MaskLine({ delay, children }) {
  return (
    <span
      className="block whitespace-nowrap"
      style={{
        paddingBlock: '0.22em',
        marginBlock: '-0.22em',
        clipPath: 'inset(-0.4em -100vw 0 -0.4em)',
      }}
    >
      <span className="hero-line block" style={{ animationDelay: `${delay}ms` }}>
        {children}
      </span>
    </span>
  );
}

export default function Hero() {
  const { openConsult, zalo } = useShop();
  const { HERO } = CONFIG;
  const reduced = useReducedMotion();
  const sectionRef = useRef(null);
  const glowRef = useRef(null);

  /* Một vòng lặp duy nhất điều khiển: vùng sáng theo con trỏ, parallax (--mx, --my)
     và tiến độ cuộn (--sp). Chỉ ghi CSS variables + transform, không gây reflow;
     vòng lặp tự nghỉ khi mọi giá trị đã ổn định. */
  useEffect(() => {
    const section = sectionRef.current;
    const glow = glowRef.current;
    if (!section || !glow) return undefined;

    const rect = section.getBoundingClientRect();
    const s = {
      x: 0, y: 0, tx: 0, ty: 0,
      gx: rect.width * 0.62, gy: rect.height * 0.38,
      gtx: rect.width * 0.62, gty: rect.height * 0.38,
      sp: 0, tsp: 0, raf: 0,
    };

    const apply = () => {
      glow.style.transform = `translate3d(${s.gx - 300}px, ${s.gy - 300}px, 0)`;
      section.style.setProperty('--mx', s.x.toFixed(4));
      section.style.setProperty('--my', s.y.toFixed(4));
      section.style.setProperty('--sp', s.sp.toFixed(4));
    };

    const frame = () => {
      s.x += (s.tx - s.x) * 0.07;
      s.y += (s.ty - s.y) * 0.07;
      s.gx += (s.gtx - s.gx) * 0.14;
      s.gy += (s.gty - s.gy) * 0.14;
      s.sp += (s.tsp - s.sp) * 0.18;
      apply();
      const busy =
        Math.abs(s.tx - s.x) > 0.001 || Math.abs(s.ty - s.y) > 0.001 ||
        Math.abs(s.gtx - s.gx) > 0.4 || Math.abs(s.gty - s.gy) > 0.4 ||
        Math.abs(s.tsp - s.sp) > 0.001;
      s.raf = busy ? requestAnimationFrame(frame) : 0;
    };
    const kick = () => {
      if (!s.raf) s.raf = requestAnimationFrame(frame);
    };

    apply();
    if (reduced) return undefined;

    const onMove = (e) => {
      const r = section.getBoundingClientRect();
      s.gtx = e.clientX - r.left;
      s.gty = e.clientY - r.top;
      s.tx = (s.gtx / r.width) * 2 - 1;
      s.ty = (s.gty / r.height) * 2 - 1;
      kick();
    };
    const onLeave = () => {
      s.tx = 0;
      s.ty = 0;
      kick();
    };
    const onScroll = () => {
      const r = section.getBoundingClientRect();
      s.tsp = Math.min(Math.max(-r.top / r.height, 0), 1);
      kick();
    };

    const fine = window.matchMedia('(pointer: fine)').matches;
    if (fine) {
      section.addEventListener('pointermove', onMove, { passive: true });
      section.addEventListener('pointerleave', onLeave);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(s.raf);
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-28 sm:pb-24"
    >
      <style>{CSS}</style>

      <Starfield reduced={reduced} />

      <div
        ref={glowRef}
        className="pointer-events-none absolute left-0 top-0 z-0 h-[600px] w-[600px] rounded-full opacity-70 will-change-transform"
        style={{ background: 'radial-gradient(circle, rgba(120,135,255,0.10), transparent 62%)' }}
        aria-hidden="true"
      />

      <div className="container-x relative z-10 grid items-center gap-16 lg:grid-cols-12">
        {/* Cột chữ: trôi nhẹ lên và mờ dần khi cuộn xuống */}
        <div
          className="lg:col-span-7 xl:col-span-7"
          style={{
            transform: 'translate3d(0, calc(var(--sp, 0) * -36px), 0)',
            opacity: 'calc(1 - var(--sp, 0) * 1.3)',
          }}
        >
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <IconSparkle className="h-3.5 w-3.5 text-accent-soft/80" />
              {HERO.eyebrow}
            </p>
          </Reveal>

          <h1 className="display mt-7 text-[clamp(2.5rem,7.4vw,6rem)] text-zinc-50">
            <MaskLine delay={180}>
              <span className="text-glow">{HERO.title1}</span>
            </MaskLine>
            <MaskLine delay={320}>
              <span className="hero-title2 hero-sheen inline-block bg-gradient-to-r from-zinc-300 via-accent-soft to-zinc-500 bg-clip-text text-transparent">
                {HERO.title2}
              </span>
            </MaskLine>
          </h1>

          <Reveal delay={260}>
            <p className="mt-7 max-w-xl text-pretty text-sm leading-relaxed text-zinc-400 sm:text-base">
              {HERO.sub}
            </p>
          </Reveal>

          <Reveal delay={360}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic disabled={reduced}>
                <a href="#/san-pham" className="btn-primary shine group">
                  Xem sản phẩm
                  <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Magnetic>
              <Magnetic disabled={reduced} strength={0.16}>
                <button type="button" onClick={() => openConsult(null)} className="btn-ghost group">
                  <IconChat className="h-4 w-4 text-accent-soft transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
                  Nhận tư vấn 1:1
                </button>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={460}>
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/[0.07] pt-6 text-[11px] text-zinc-500">
              <span className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60 motion-reduce:animate-none" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400/90 shadow-[0_0_8px_2px_rgba(52,211,153,0.3)]" />
                </span>
                Đang nhận đơn
              </span>
              <a href={`tel:${zalo.phone}`} className="transition-colors hover:text-zinc-200">
                Hotline {zalo.phone}
              </a>
              <span>{zalo.hours}</span>
            </div>
          </Reveal>
        </div>

        {/* Cột Mặt Trăng: 3 lớp độ sâu parallax khác nhau */}
        <div className="relative lg:col-span-5 xl:col-span-5" style={{ perspective: '1100px' }}>
          <div className="relative mx-auto aspect-square w-[86%] max-w-[560px] sm:w-[72%] lg:w-full">
            {/* lớp xa: quầng sáng + vòng quỹ đạo, dịch ngược chiều con trỏ */}
            <div
              className="absolute inset-0"
              style={{
                transform:
                  'translate3d(calc(var(--mx, 0) * -12px), calc(var(--my, 0) * -12px + var(--sp, 0) * 30px), 0)',
              }}
              aria-hidden="true"
            >
              <div className="hero-fade absolute inset-[6%] rounded-full bg-accent/10 blur-[90px]" />
              <div className="hero-ring absolute inset-0" style={{ animationDelay: '0.35s' }}>
                <div className="orbit-ring absolute inset-[4%] animate-spin-slow opacity-60" />
                <div
                  className="orbit-ring absolute inset-[16%] opacity-40"
                  style={{ transform: 'rotate(14deg)' }}
                />
                {/* vệ tinh chạy trên vòng quỹ đạo ngoài */}
                <div
                  className="hero-orbit absolute inset-[4%]"
                  style={{ animation: 'hero-orbit 32s linear infinite' }}
                >
                  <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-soft shadow-[0_0_14px_3px_rgba(150,160,255,0.55)]" />
                </div>
              </div>
            </div>

            {/* lớp gần: Mặt Trăng nghiêng 3D theo con trỏ */}
            <div
              className="absolute inset-0 z-10"
              style={{
                transform:
                  'translate3d(calc(var(--mx, 0) * 16px), calc(var(--my, 0) * 16px + var(--sp, 0) * 70px), 0) rotateX(calc(var(--my, 0) * -4deg)) rotateY(calc(var(--mx, 0) * 5deg))',
                willChange: 'transform',
              }}
            >
              <div className="hero-moon h-full w-full">
                <img
                  src={asset('images/hero-moon.jpg')}
                  alt="Mặt Trăng lưỡi liềm"
                  className="moon-mask moon animate-float relative h-full w-full object-contain"
                  draggable="false"
                />
              </div>
            </div>

            <div
              className="hero-fade absolute bottom-[8%] right-[3%] z-10 flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-zinc-600"
              style={{ animationDelay: '1.1s' }}
            >
              <span className="hero-rule h-px w-10 bg-white/20" />
              Mặt Trăng · <Distance km={MOON_DISTANCE_KM} reduced={reduced} />
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 sm:block"
        style={{ opacity: 'calc(1 - var(--sp, 0) * 6)' }}
      >
        <div className="hero-fade flex flex-col items-center gap-3" style={{ animationDelay: '1.8s' }}>
          <span className="text-[9px] uppercase tracking-[0.4em] text-zinc-600">Cuộn xuống</span>
          <span className="relative h-10 w-px overflow-hidden bg-white/10">
            <span className="absolute left-0 top-0 h-4 w-px animate-[scrollLine_2.4s_ease-in-out_infinite] bg-accent motion-reduce:animate-none" />
          </span>
        </div>
      </div>
    </section>
  );
}
