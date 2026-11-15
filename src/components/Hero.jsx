import { useEffect, useRef } from 'react';
import { CONFIG, asset } from '../lib/storeConfig';
import { useShop } from '../Store';
import { IconArrowRight, IconChat, IconSparkle } from './Icons';
import PhoneLinks from './PhoneLinks';
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
  const sectionRef = useRef(null);
  const glowRef = useRef(null);

  /* Vùng sáng đi theo con trỏ: chỉ dịch chuyển bằng transform (GPU),
     không vẽ lại gradient toàn màn hình mỗi lần di chuột. */
  useEffect(() => {
    const section = sectionRef.current;
    const glow = glowRef.current;
    if (!section || !glow) return undefined;

    const place = (x, y) => {
      glow.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
    };
    const rect = section.getBoundingClientRect();
    let x = rect.width * 0.62;
    let y = rect.height * 0.38;
    let tx = x;
    let ty = y;
    let raf = 0;
    place(x, y);

    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    const step = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      place(x, y);
      raf = Math.abs(tx - x) > 0.4 || Math.abs(ty - y) > 0.4 ? requestAnimationFrame(step) : 0;
    };
    const onMove = (event) => {
      const r = section.getBoundingClientRect();
      tx = event.clientX - r.left;
      ty = event.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(step);
    };
    section.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      section.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-28 sm:pb-24"
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-0 top-0 h-[600px] w-[600px] rounded-full opacity-70 will-change-transform"
        style={{ background: 'radial-gradient(circle, rgba(120,135,255,0.10), transparent 62%)' }}
        aria-hidden="true"
      />

      <div className="container-x relative z-10 grid items-center gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7 xl:col-span-7">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <IconSparkle className="h-3.5 w-3.5 text-accent-soft/80" />
              {HERO.eyebrow}
            </p>
          </Reveal>

          <Reveal delay={110}>
            <h1 className="display mt-7 text-[clamp(2.5rem,7.4vw,6rem)] text-zinc-50">
              <span className="block whitespace-nowrap text-glow">{HERO.title1}</span>
              <span className="ink-clip block whitespace-nowrap bg-gradient-to-r from-zinc-300 via-accent-soft to-zinc-500 bg-clip-text text-transparent">
                {HERO.title2}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <p className="mt-7 max-w-xl text-pretty text-sm leading-relaxed text-zinc-400 sm:text-base">
              {HERO.sub}
            </p>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#/san-pham" className="btn-primary shine group">
                Xem sản phẩm
                <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <button type="button" onClick={() => openConsult(null)} className="btn-ghost group">
                <IconChat className="h-4 w-4 text-accent-soft" />
                Nhận tư vấn 1:1
              </button>
            </div>
          </Reveal>

          <Reveal delay={420}>
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/[0.07] pt-6 text-[11px] text-zinc-500">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_8px_2px_rgba(52,211,153,0.3)]" />
                Đang nhận đơn
              </span>
              <a href={`tel:${zalo.phone}`} className="transition-colors hover:text-zinc-200">
                Hotline {zalo.phone}
              </a>
              <span>{zalo.hours}</span>
            </div>
          </Reveal>
        </div>

        <div className="relative lg:col-span-5 xl:col-span-5">
          <div className="relative mx-auto aspect-square w-[86%] max-w-[560px] sm:w-[72%] lg:w-full">
            <div className="absolute inset-[6%] rounded-full bg-accent/10 blur-[90px]" aria-hidden="true" />
            <div className="orbit-ring absolute inset-[4%] animate-spin-slow opacity-60" aria-hidden="true" />
            <div
              className="orbit-ring absolute inset-[16%] opacity-40"
              style={{ transform: 'rotate(14deg)' }}
              aria-hidden="true"
            />
            <img
              src={asset('images/hero-moon.jpg')}
              alt="Mặt Trăng lưỡi liềm"
              className="moon-mask moon animate-float relative z-10 h-full w-full object-contain"
              draggable="false"
            />
            <div className="absolute bottom-[8%] right-[3%] flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-zinc-600">
              <span className="h-px w-10 bg-white/20" />
              Mặt Trăng · 384.400 km
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex">
        <span className="text-[9px] uppercase tracking-[0.4em] text-zinc-600">Cuộn xuống</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <span className="absolute left-0 top-0 h-4 w-px animate-[scrollLine_2.4s_ease-in-out_infinite] bg-accent" />
        </span>
      </div>
    </section>
  );
}
