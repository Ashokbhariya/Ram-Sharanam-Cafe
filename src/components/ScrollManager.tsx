import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from '../hooks/useMotion';

export function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const t = window.setTimeout(() => {
        const el = document.getElementById(hash.slice(1));
        if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 70; window.scrollTo({ top: y, behavior: 'smooth' }); }
      }, 150);
      return () => window.clearTimeout(t);
    }
    window.scrollTo(0, 0);
    const r = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(r);
  }, [pathname, hash]);
  return null;
}
