import { applicableValues, normalizeSelection, visibleGroups } from '../lib/products';

const short = (n) => {
  if (n >= 1000000) {
    const v = n / 1000000;
    return `${Number.isInteger(v) ? v : v.toFixed(1).replace('.', ',')}tr`;
  }
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return String(n);
};

export default function Options({ product, selection, onChange }) {
  const groups = visibleGroups(product, selection);
  if (!groups.length) return null;

  return (
    <div className="space-y-3.5">
      {groups.map((group) => {
        const values = applicableValues(group, selection);
        const active = selection[group.name];
        return (
          <div key={`${group.name}-${group.parent ? selection[group.parent] : ''}`} className="fade-in">
            <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-zinc-500">
              {group.name}
              {group.parent && (
                <span className="ml-1.5 normal-case tracking-normal text-zinc-600">· {selection[group.parent]}</span>
              )}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label={group.name}>
              {values.map((value) => {
                const isActive = active === value.label;
                return (
                  <button
                    key={`${value.parent || ''}-${value.label}`}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() =>
                      onChange(normalizeSelection(product, { ...selection, [group.name]: value.label }))
                    }
                    className={`inline-flex items-baseline gap-1 rounded-full border px-3 py-1.5 text-[11px] transition-all duration-300 ${
                      isActive
                        ? 'border-white/70 bg-zinc-50 text-ink-950'
                        : 'border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {value.label}
                    {value.add > 0 && (
                      <span className={`text-[9px] ${isActive ? 'text-ink-950/60' : 'text-zinc-600'}`}>
                        +{short(value.add)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
