import { useEffect, useState } from 'react';

export const ROUTES = ['home', 'san-pham', 've-chung-toi', 'yeu-cau', 'lien-he'];

const read = () => {
  if (typeof window === 'undefined') return 'home';
  const raw = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  return ROUTES.includes(raw) ? raw : raw || 'home';
};

export function navigate(route) {
  const hash = route === 'home' ? '#/' : `#/${route}`;
  if (window.location.hash === hash) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  window.location.hash = hash;
}

export function useHashRoute() {
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [route]);

  return route;
}
