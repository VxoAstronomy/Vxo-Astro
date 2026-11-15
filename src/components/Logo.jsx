import { CONFIG } from '../lib/storeConfig';
import { navigate } from '../lib/useHashRoute';

export default function Logo({ className = '', onClick }) {
  const { name, suffix } = CONFIG.BRAND;
  return (
    <a
      href="#/"
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        navigate('home');
      }}
      className={`group inline-flex items-center gap-3 ${className}`}
      aria-label={`${name} ${suffix} — trang chủ`}
    >
      <span className="relative grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/[0.03] transition-colors duration-500 group-hover:border-accent/50">
        <svg viewBox="0 0 32 32" className="h-6 w-6 text-accent-soft" fill="none" aria-hidden="true">
          <circle cx="16" cy="16" r="6.4" stroke="currentColor" strokeWidth="1.1" />
          <ellipse
            cx="16"
            cy="16"
            rx="12.5"
            ry="3.6"
            stroke="currentColor"
            strokeOpacity=".65"
            strokeWidth=".9"
            transform="rotate(-26 16 16)"
          />
          <circle cx="26.2" cy="9.4" r="1.5" fill="currentColor" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-[0.26em] text-zinc-50">{name}</span>
        <span className="mt-1 text-[8px] font-medium uppercase tracking-[0.42em] text-zinc-500">{suffix}</span>
      </span>
    </a>
  );
}
