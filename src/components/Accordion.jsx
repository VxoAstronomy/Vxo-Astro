import { useState } from 'react';
import { IconPlus } from './Icons';

export default function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.q} className={isOpen ? 'acc-open' : ''}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-white"
            >
              <span className="text-sm font-medium text-zinc-200 sm:text-[15px]">{item.q}</span>
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-zinc-400 transition-all duration-500 ${
                  isOpen ? 'rotate-45 border-accent/40 bg-accent/10 text-accent-soft' : ''
                }`}
              >
                <IconPlus className="h-4 w-4" />
              </span>
            </button>
            <div className="acc-body">
              <div>
                <p className="max-w-2xl pb-6 text-sm leading-relaxed text-zinc-500">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
