import { useEffect, useRef } from 'react';

/* Vạch tiến trình cuộn: ghi thẳng vào style, không setState mỗi frame */
export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${height > 0 ? Math.min(1, window.scrollY / height) : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[110] h-px bg-white/[0.04]" aria-hidden="true">
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-accent/40 via-accent to-accent-violet"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}