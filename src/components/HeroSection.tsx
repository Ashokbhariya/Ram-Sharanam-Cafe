import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { gsap } from '../hooks/useMotion';
import { useIntro } from '../context/IntroContext';
import { MaskLines } from './ui';

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { active } = useIntro();
  useLayoutEffect(() => {
    if (active || !ref.current) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(ref);
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.from(q('.line-inner'), { yPercent: 115, duration: 1.1, stagger: 0.14 })
        .from(q('.hero__fade'), { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.1 }, 0.5)
        .from(q('.hero__plate'), { scale: 0.82, rotate: -14, autoAlpha: 0, duration: 1.5 }, 0.1);
      gsap.to(q('.hero__plate'), { rotate: 8, yPercent: 6, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 0.6 } });
    }, ref);
    return () => mm.revert();
  }, [active]);

  return (
    <section ref={ref} className="hero" aria-labelledby="hero-title">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="eyebrow eyebrow--light hero__fade">Ram Sharanam Cafe · Near 22 Godam, Jaipur</p>
          <MaskLines as="h1" lines={['NOT JUST A MEAL.', 'A SOUTH INDIAN MOOD.']} className="display hero__title" dataLines={false} />
          <span id="hero-title" className="sr-only">Not just a meal. A South Indian mood.</span>
          <p className="hero__lead hero__fade">Discover the flavours, textures, and comfort of South Indian cuisine at Ram Sharanam Cafe.</p>
          <div className="hero__btns hero__fade">
            <Link to="/menu" className="btn btn--yellow">Explore the menu <ArrowRight size={18} aria-hidden /></Link>
            <Link to="/visit" className="btn btn--outline-light">Visit us</Link>
          </div>
        </div>
        <div className="hero__art" aria-hidden="false">
          <img className="hero__plate" src="/art/scene-hero.webp" alt="Illustration of a masala dosa, idlis, a vada, sambar and chutneys on a steel plate" />
        </div>
      </div>
      <p className="hero__tag hero__fade">A Little South. A Lot of Soul.</p>
    </section>
  );
}

export function Marquee() {
  const words = ['CRISP', 'SOFT', 'SOULFUL', 'DOSA', 'IDLI', 'SAMBAR', 'FILTER COFFEE', 'CHUTNEY'];
  const row = words.map((w, i) => <span key={i}>{w}<i aria-hidden>✦</i></span>);
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">{row}{row}{row}</div>
    </div>
  );
}
