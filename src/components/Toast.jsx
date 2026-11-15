import { useShop } from '../Store';
import { IconCheck } from './Icons';

export default function Toast() {
  const { toast } = useShop();
  if (!toast) return null;
  return (
    <div
      key={toast.id}
      className="fixed bottom-6 left-1/2 z-[100] w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-white/10 bg-ink-900/95 px-4 py-3 text-center text-[12px] text-zinc-200 shadow-card backdrop-blur-xl panel-enter"
      role="status"
      aria-live="polite"
    >
      <span className="inline-flex items-center gap-2">
        <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
          <IconCheck className="h-3 w-3" />
        </span>
        {toast.message}
      </span>
    </div>
  );
}
