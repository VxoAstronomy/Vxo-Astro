import { CONFIG, ZALO } from '../lib/storeConfig';
import Logo from './Logo';
import { IconArrowUpRight, IconClock, IconFacebook, IconInstagram, IconMail, IconPhone, IconPin, IconYoutube } from './Icons';

const YEAR = new Date().getFullYear();

export default function Footer() {
  const { BRAND, CONTACT } = CONFIG;
  const socials = [
    { href: CONTACT.facebook, label: 'Facebook', Icon: IconFacebook },
    { href: CONTACT.instagram, label: 'Instagram', Icon: IconInstagram },
    { href: CONTACT.youtube, label: 'YouTube', Icon: IconYoutube },
  ].filter((s) => s.href);

  return (
    <footer className="relative z-10 mt-24 border-t border-white/[0.07] bg-ink-950/60">
      <div className="container-x pb-10 pt-16 sm:pt-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-zinc-500">{BRAND.intro}</p>
            <div className="mt-7 flex items-center gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-zinc-400 transition hover:border-white/30 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
              <a
                href={ZALO.link}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-zinc-400 transition hover:border-accent/40 hover:text-accent-soft"
              >
                Zalo <IconArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Cửa hàng</p>
            <ul className="mt-5 space-y-3.5 text-sm">
              {[
                ['Sản phẩm', '#/san-pham'],
                ['Về chúng tôi', '#/ve-chung-toi'],
                ['Yêu cầu chế tạo', '#/yeu-cau'],
                ['Liên hệ', '#/lien-he'],
              ].map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="text-zinc-400 transition-colors hover:text-white">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Liên hệ</p>
            <ul className="mt-5 space-y-4 text-sm text-zinc-400">
              <li className="flex items-start gap-3">
                <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-accent/70" />
                <span>{CONTACT.area}</span>
              </li>
              <li className="flex items-start gap-3">
                <IconPhone className="mt-0.5 h-4 w-4 shrink-0 text-accent/70" />
                <a href={`tel:${ZALO.phone}`} className="transition-colors hover:text-white">
                  {ZALO.phone}
                </a>
              </li>
              {CONTACT.email && (
                <li className="flex items-start gap-3">
                  <IconMail className="mt-0.5 h-4 w-4 shrink-0 text-accent/70" />
                  <a href={`mailto:${CONTACT.email}`} className="transition-colors hover:text-white">
                    {CONTACT.email}
                  </a>
                </li>
              )}
              <li className="flex items-start gap-3">
                <IconClock className="mt-0.5 h-4 w-4 shrink-0 text-accent/70" />
                <span>{ZALO.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-6 text-[11px] text-zinc-600 sm:flex-row sm:items-center">
          <p>
            © {YEAR} {BRAND.name} {BRAND.suffix}. Chế tác cho người quan sát bầu trời.
          </p>
          <p className="uppercase tracking-[0.24em]">{CONFIG.SHIPPING_NOTE}</p>
        </div>
      </div>

      <div className="pointer-events-none relative select-none overflow-hidden" aria-hidden="true">
        <p className="-mb-[2.6vw] text-center text-[19vw] font-extralight leading-none tracking-[-0.06em] text-white/[0.028]">
          {BRAND.name}
        </p>
      </div>
    </footer>
  );
}
