import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ArrowRight, SkipForward } from 'lucide-react';
import { gsap } from '../hooks/useMotion';

/**
 * Cinematic opening: CRISP. → SOFT. → SOULFUL. → brand card.
 * ~8s, skippable (button or Esc), never shown with reduced motion, and any
 * animation error falls straight through to the site.
 */
export function IntroSequence({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const closing = useRef(false);

  const finish = () => {
    if (closing.current) return;
    closing.current = true;
    tlRef.current?.kill();
    const el = root.current;
    if (!el) return onDone();
    gsap.to(el, { autoAlpha: 0, duration: 0.55, ease: 'power2.inOut', onComplete: onDone });
  };

  useEffect(() => {
    const app = document.getElementById('root') as (HTMLElement & { inert: boolean }) | null;
    if (app) app.inert = true;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') finish(); };
    window.addEventListener('keydown', onKey);
    root.current?.querySelector<HTMLElement>('.intro__skip')?.focus();

    const failSafe = window.setTimeout(() => { if (!closing.current && !tlRef.current) onDone(); }, 1500);
    let ctx: gsap.Context | undefined;
    try {
      ctx = gsap.context(() => {
        const q = gsap.utils.selector(root);
        const [s1, s2, s3] = q('.scene');
        gsap.set([s2, s3], { clipPath: 'inset(100% 0% 0% 0%)' });
        gsap.ticker.lagSmoothing(0);
        gsap.set(q('.intro-final'), { autoAlpha: 0 });
        gsap.set(q('.scene .line-inner'), { yPercent: 115 });
        gsap.set(q('.scene-art'), { clipPath: 'circle(0% at 50% 50%)' });
        gsap.set(q('.scene-art img'), { scale: 1.3, rotate: -8 });
        gsap.set(q('.scene-caption'), { autoAlpha: 0, y: 14 });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tlRef.current = tl;
        const scene = (el: Element, at: number, wipe: boolean) => {
          if (wipe) tl.to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.85, ease: 'power4.inOut' }, at);
          const w = el.querySelector('.line-inner'), art = el.querySelector('.scene-art'), img = el.querySelector('.scene-art img'), cap = el.querySelector('.scene-caption');
          const t = at + (wipe ? 0.45 : 0.1);
          tl.to(w, { yPercent: 0, duration: 0.9 }, t)
            .to(art, { clipPath: 'circle(75% at 50% 50%)', duration: 1.15, ease: 'power3.inOut' }, t)
            .to(img, { scale: 1, rotate: 0, duration: 1.6 }, t)
            .to(cap, { autoAlpha: 1, y: 0, duration: 0.6 }, t + 0.5);
        };
        scene(s1, 0.1, false);
        scene(s2, 2.5, true);
        scene(s3, 4.9, true);
        // final brand card
        tl.to(q('.scene--soulful .scene-word .line-inner'), { yPercent: -115, duration: 0.6, ease: 'power3.in' }, 7.2)
          .to(q('.scene--soulful .scene-caption'), { autoAlpha: 0, duration: 0.3 }, 7.2)
          .to(q('.scene--soulful .scene-art'), { opacity: 0.28, duration: 0.8 }, 7.2)
          .to(q('.scene--soulful .scene-art img'), { scale: 0.88, duration: 1.2 }, 7.2)
          .to(q('.intro-final'), { autoAlpha: 1, duration: 0.5 }, 7.6)
          .from(q('.intro-final > *'), { y: 30, autoAlpha: 0, stagger: 0.12, duration: 0.8 }, 7.7)
          .add(() => { root.current?.setAttribute('data-ready', 'true'); }, 8.4);
        void s1;
      }, root);
    } catch { onDone(); }
    return () => {
      window.clearTimeout(failSafe);
      window.removeEventListener('keydown', onKey);
      ctx?.revert();
      if (app) app.inert = false;
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div ref={root} className="intro" role="dialog" aria-modal="true" aria-label="Ram Sharanam Cafe introduction">
      <button type="button" className="intro__skip" onClick={finish}>Skip intro <SkipForward size={16} aria-hidden /></button>

      <section className="scene scene--crisp" aria-label="Scene 1: crisp">
        <div className="scene-word" aria-hidden><span className="line"><span className="line-inner">CRISP.</span></span></div>
        <div className="scene-art"><img src="/art/scene-crunch.webp" alt="A golden masala dosa" /></div>
        <p className="scene-caption">01 / 03 — Golden. Lacy. Loud.</p>
      </section>
      <section className="scene scene--soft" aria-label="Scene 2: soft">
        <div className="scene-word" aria-hidden><span className="line"><span className="line-inner">SOFT.</span></span></div>
        <div className="scene-art"><img src="/art/idli.webp" alt="Idlis with coconut chutney and sambar" /></div>
        <p className="scene-caption">02 / 03 — Steamed. Fluffy. Gentle.</p>
      </section>
      <section className="scene scene--soulful" aria-label="Scene 3: soulful">
        <div className="scene-word" aria-hidden><span className="line"><span className="line-inner">SOULFUL.</span></span></div>
        <div className="scene-art"><img src="/art/scene-hero.webp" alt="Dosa, idli, vada, chutneys and sambar together" /></div>
        <p className="scene-caption">03 / 03 — Everything, together.</p>
        <div className="intro-final">
          <h2>RAM SHARANAM CAFE</h2>
          <p>South Indian comfort, served with character.</p>
          <div className="intro-final__btns">
            <Link to="/menu" className="btn btn--yellow" onClick={finish}>EXPLORE THE MENU <ArrowRight size={18} aria-hidden /></Link>
            <Link to="/visit" className="btn btn--outline-light" onClick={finish}>VISIT US</Link>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}
