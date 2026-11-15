import Reveal from './Reveal';

export default function PageHeader({ eyebrow, title, desc, children }) {
  return (
    <header className="container-x relative pb-12 pt-36 sm:pb-16 sm:pt-44">
      <div className="pointer-events-none absolute -top-24 left-0 h-64 w-64 rounded-full bg-accent/10 blur-[100px]" aria-hidden="true" />
      {eyebrow && (
        <Reveal>
          <p className="eyebrow flex items-center gap-3">
            <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={90}>
        <h1 className="display mt-6 max-w-4xl text-balance text-[clamp(2.7rem,7vw,5.6rem)] text-glow">{title}</h1>
      </Reveal>
      {desc && (
        <Reveal delay={180}>
          <p className="mt-6 max-w-2xl text-pretty text-sm leading-relaxed text-zinc-500 sm:text-base">{desc}</p>
        </Reveal>
      )}
      {children && (
        <Reveal delay={260}>
          <div className="mt-8">{children}</div>
        </Reveal>
      )}
    </header>
  );
}
