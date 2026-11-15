import Reveal from './Reveal';

export default function SectionHeading({ eyebrow, title, desc, align = 'left', className = '', titleClassName = '' }) {
  const centered = align === 'center';
  return (
    <div className={`${centered ? 'mx-auto flex flex-col items-center text-center' : ''} ${className}`}>
      {eyebrow && (
        <Reveal>
          <p className="eyebrow flex items-center gap-3">
            <span className="h-px w-6 bg-accent/60" aria-hidden="true" />
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={80}>
        <h2
          className={`mt-5 max-w-3xl text-balance text-[clamp(1.9rem,4.4vw,3.4rem)] font-extralight leading-[1.06] tracking-[-0.035em] text-zinc-50 ${titleClassName}`}
        >
          {title}
        </h2>
      </Reveal>
      {desc && (
        <Reveal delay={160}>
          <p className={`mt-5 max-w-xl text-pretty text-sm leading-relaxed text-zinc-500 sm:text-[15px] ${centered ? 'mx-auto' : ''}`}>
            {desc}
          </p>
        </Reveal>
      )}
    </div>
  );
}
