import { applicableValues, normalizeSelection, visibleGroups } from '../lib/products';

const short = (n) => {
  if (n >= 1000000) {
    const v = n / 1000000;
    return `${Number.isInteger(v) ? v : v.toFixed(1).replace('.', ',')}tr`;
  }
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return String(n);
};

/* Mobile: mỗi nhóm một dropdown gọn. Desktop: hàng nút bấm như cũ. */
export default function Options({ product, selection, onChange }) {
  const groups = visibleGroups(product, selection);
  if (!groups.length) return null;

  const pick = (group, label) =>
    onChange(normalizeSelection(product, { ...selection, [group.name]: label }));

  return (
    <div className="space-y-2 sm:space-y-3.5">
      {groups.map((group) => {
        const values = applicableValues(group, selection);
        const active = selection[group.name];
        return (
          <div key={`${group.name}-${group.parent ? selection[group.parent] : ''}`} className="fade-in">
            <div className="flex items-center gap-2 sm:block">
              <p className="w-16 shrink-0 truncate text-[8px] font-medium uppercase tracking-[0.18em] text-zinc-500 sm:w-auto sm:text-[9px] sm:tracking-[0.22em]">
                {group.name}
                {group.parent && (
                  <span className="ml-1.5 hidden normal-case tracking-normal text-zinc-600 sm:inline">
                    · {selection[group.parent]}
                  </span>
                )}
              </p>
              <select
                value={active || ''}
                onChange={(event) => pick(group, event.target.value)}
                aria-label={group.name}
                className="field flex-1 rounded-xl px-2.5 py-2 text-[11px] sm:hidden"
              >
                {values.map((value) => (
                  <option key={`${value.parent || ''}-${value.label}`} value={value.label} className="bg-ink-900">
                    {value.label}
                    {value.add > 0 ? ` (+${short(value.add)})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2 hidden flex-wrap gap-1.5 sm:flex" role="group" aria-label={group.name}>
              {values.map((value) => {
                const isActive = active === value.label;
                return (
                  <button
                    key={`${value.parent || ''}-${value.label}`}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => pick(group, value.label)}
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