import { useEffect, useRef } from 'react';

/* Bầu sao nền: vẽ bằng canvas, chỉ chạy khi tab đang mở.
   Số sao và độ phân giải giới hạn theo thiết bị để máy yếu không giật. */
export default function Starfield() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduce = motionQuery.matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = 0;
    let height = 0;
    let stars = [];
    let meteor = null;
    let raf = 0;
    let resizeRaf = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const build = () => {
      const small = width < 640;
      const count = Math.min(small ? 110 : 190, Math.max(50, Math.round((width * height) / (small ? 16000 : 11000))));
      stars = Array.from({ length: count }, () => {
        const tone = Math.random();
        const color =
          tone > 0.9 ? '195,202,255' : tone > 0.78 ? '167,139,250' : tone > 0.62 ? '255,244,230' : '235,238,255';
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.15 + 0.25,
          base: Math.random() * 0.5 + 0.18,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.45 + 0.12,
          depth: Math.random() * 0.8 + 0.2,
          fill: `rgb(${color})`,
        };
      });
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (reduce) draw(0);
    };

    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(resize);
    };

    const draw = (time) => {
      const t = time / 1000;
      ctx.clearRect(0, 0, width, height);
      pointer.x += (pointer.tx - pointer.x) * 0.035;
      pointer.y += (pointer.ty - pointer.y) * 0.035;

      for (const star of stars) {
        const flicker = reduce ? 1 : 0.62 + 0.38 * Math.sin(t * star.speed + star.phase);
        ctx.globalAlpha = Math.min(1, star.base * flicker);
        ctx.fillStyle = star.fill;
        ctx.beginPath();
        ctx.arc(star.x + pointer.x * star.depth * 14, star.y + pointer.y * star.depth * 9, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (reduce) return;
      if (!meteor && Math.random() < 0.0022) {
        meteor = {
          x: Math.random() * width * 0.75,
          y: Math.random() * height * 0.35,
          vx: 7.5 + Math.random() * 4,
          vy: 2.6 + Math.random() * 1.6,
          life: 1,
        };
      }
      if (meteor) {
        const tailX = meteor.x - meteor.vx * 16;
        const tailY = meteor.y - meteor.vy * 16;
        const gradient = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(220,228,255,${0.55 * meteor.life})`);
        gradient.addColorStop(1, 'rgba(150,165,255,0)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
        meteor.life -= 0.014;
        if (meteor.life <= 0 || meteor.x > width + 40 || meteor.y > height + 40) meteor = null;
      }
    };

    const loop = (time) => {
      draw(time);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (!reduce && document.visibilityState === 'visible') raf = requestAnimationFrame(loop);
    };
    const stop = () => cancelAnimationFrame(raf);

    const onVisibility = () => (document.visibilityState === 'visible' ? start() : stop());
    const onMotion = () => {
      reduce = motionQuery.matches;
      if (reduce) {
        stop();
        draw(0);
      } else {
        start();
      }
    };
    const onPointer = (event) => {
      if (event.pointerType === 'touch') return;
      pointer.tx = (event.clientX / width - 0.5) * 2;
      pointer.ty = (event.clientY / height - 0.5) * 2;
    };

    resize();
    start();
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    motionQuery.addEventListener('change', onMotion);
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => {
      stop();
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      motionQuery.removeEventListener('change', onMotion);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90"
    />
  );
}