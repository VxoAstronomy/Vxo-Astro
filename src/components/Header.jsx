import { useEffect, useState } from 'react';
import { useLockBody } from '../lib/hooks';
import { navigate } from '../lib/useHashRoute';
import { useShop } from '../Store';
import Logo from './Logo';
import { IconArrowUpRight, IconCart, IconChat, IconClose, IconMenu } from './Icons';

export const NAV = [
  { key: 'home', label: 'Trang chủ', href: '#/' },
  { key: 'san-pham', label: 'Sản phẩm', href: '#/san-pham' },
  { key: 've-chung-toi', label: 'Về chúng tôi', href: '#/ve-chung-toi' },
  { key: 'yeu-cau', label: 'Yêu cầu', href: '#/yeu-cau' },
  { key: 'lien-he', label: 'Liên hệ', href: '#/lien-he' },
];

export default function Header({ route }) {
  const { count, setCartOpen, openConsult, zalo } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  useLockBody(menu);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenu(false);
  }, [route]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'border-b border-white/[0.07] bg-ink-950/70 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="container-x flex h-[74px] items-center justify-between gap-6">
          <Logo onClick={() => setMenu(false)} />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Điều hướng chính">
            {NAV.map((item) => {
              const active = route === item.key;
              return (
                <a
                  key={item.key}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative rounded-full px-4 py-2 text-[13px] transition-colors duration-300 ${
                    active ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-4 -bottom-0.5 h-px origin-center bg-gradient-to-r from-transparent via-accent to-transparent transition-transform duration-300 ${
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.02] text-zinc-300 transition-all duration-300 hover:border-white/25 hover:text-white"
              aria-label={`Mở giỏ hàng (${count} sản phẩm)`}
            >
              <IconCart className="h-[18px] w-[18px]" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-ink-950">
                  {count}
                </span>
              )}
            </button>

            <a
              href={zalo.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[13px] text-zinc-200 transition-all duration-300 hover:border-accent/40 hover:bg-accent/10 sm:inline-flex"
            >
              <IconChat className="h-4 w-4 text-accent-soft" />
              Zalo
            </a>

            <button
              type="button"
              onClick={() => setMenu(true)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.02] text-zinc-300 transition hover:text-white lg:hidden"
              aria-label="Mở menu"
              aria-expanded={menu}
            >
              <IconMenu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-ink-950/95 backdrop-blur-2xl overlay-enter" />
          <div className="relative flex h-full flex-col overflow-y-auto overscroll-contain">
            <div className="container-x flex h-[74px] items-center justify-between">
              <Logo onClick={() => setMenu(false)} />
              <button
                type="button"
                onClick={() => setMenu(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-300"
                aria-label="Đóng menu"
              >
                <IconClose className="h-5 w-5" />
              </button>
            </div>

            <nav className="container-x mt-8 flex flex-1 flex-col gap-1" aria-label="Menu di động">
              {NAV.map((item, index) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setMenu(false)}
                  className={`group flex items-center justify-between border-b border-white/[0.06] py-5 transition-colors ${
                    route === item.key ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-baseline gap-4">
                    <span className="text-[10px] tabular-nums tracking-widest text-zinc-600">
                      0{index + 1}
                    </span>
                    <span className="text-2xl font-extralight tracking-tight">{item.label}</span>
                  </span>
                  <IconArrowUpRight className="h-4 w-4 text-zinc-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))}
            </nav>

            <div className="container-x space-y-4 pb-10 pt-8">
              <button
                type="button"
                onClick={() => {
                  setMenu(false);
                  setCartOpen(true);
                }}
                className="btn-ghost w-full"
              >
                <IconCart className="h-4 w-4" /> Giỏ hàng ({count})
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenu(false);
                  openConsult(null);
                }}
                className="btn-primary w-full"
              >
                <IconChat className="h-4 w-4" /> Tư vấn qua Zalo
              </button>
              <p className="pt-2 text-center text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                {zalo.hours}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
