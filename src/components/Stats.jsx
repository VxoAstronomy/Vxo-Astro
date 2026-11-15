import { useCountUp, useInView } from '../lib/hooks';
import { CONFIG } from '../lib/storeConfig';

function Stat({ stat, active }) {
  const value = useCountUp(stat.value, { start: active, duration: 1500 });
  return (
    <div className="flex flex-col items-start gap-2 px-1">
      <p className="text-3xl font-extralight tracking-tight text-zinc-50 sm:text-4xl">
        {value.toLocaleString('vi-VN')}
        <span className="text-accent-soft">{stat.suffix}</span>
      </p>
      <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">{stat.label}</p>
    </div>
  );
}

export default function Stats({ items = CONFIG.STATS }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  return (
    <div ref={ref} className="grid grid-cols-2 gap-x-6 gap-y-10 border-y border-white/[0.07] py-10 sm:grid-cols-4 sm:divide-x sm:divide-white/[0.07] sm:py-12">
      {items.map((stat, index) => (
        <div key={stat.label} className={index > 0 ? 'sm:pl-8' : ''}>
          <Stat stat={stat} active={inView} />
        </div>
      ))}
    </div>
  );
}
