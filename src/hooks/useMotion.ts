import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useReducedMotion() {
  const [r, setR] = useState(prefersReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const h = () => setR(mq.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return r;
}

/**
 * Scroll-driven reveals for a page/section. Markup hooks:
 *  [data-reveal]            fade + rise when scrolled into view
 *  [data-lines]             children `.line > .line-inner` slide up from a mask
 *  [data-parallax="-12"]    vertical drift (percent) while its parent scrolls through
 *  [data-zoom]              image eases from scale 1.18 → 1
 * Everything is visible by default (no-JS / reduced motion) and only hidden by GSAP at runtime.
 */
export function useScrollEffects(scope: RefObject<HTMLElement | null>, enabled = true) {
  useLayoutEffect(() => {
    if (!enabled || !scope.current) return;
    const root = scope.current;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      try {
        root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.fromTo(el, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
        });
        root.querySelectorAll<HTMLElement>('[data-lines]').forEach((el) => {
          gsap.fromTo(el.querySelectorAll('.line-inner'), { yPercent: 115 }, { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.12,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
        });
        root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
          const v = parseFloat(el.dataset.parallax || '-10');
          gsap.fromTo(el, { yPercent: -v }, { yPercent: v, ease: 'none',
            scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
        });
        root.querySelectorAll<HTMLElement>('[data-zoom]').forEach((el) => {
          gsap.fromTo(el, { scale: 1.18 }, { scale: 1, ease: 'none',
            scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'center center', scrub: 0.6 } });
        });
      } catch { /* animation failure must never hide content */ root.querySelectorAll<HTMLElement>('[data-reveal],.line-inner').forEach((e) => gsap.set(e, { clearProps: 'all' })); }
    });
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => { window.clearTimeout(refresh); mm.revert(); };
  }, [scope, enabled]);
}

export function useFocusTrapDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current; if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  useEffect(() => {
    const d = ref.current; if (!d) return;
    const h = () => onClose();
    d.addEventListener('close', h);
    return () => d.removeEventListener('close', h);
  }, [onClose]);
  return ref;
}
