import { useRef } from 'react';
import { useScrollEffects } from '../hooks/useMotion';
import { MaskLines } from './ui';

export function FoodStorySection() {
  const ref = useRef<HTMLDivElement>(null);
  useScrollEffects(ref);
  return (
    <div ref={ref}>
      <section className="fstory fstory--crunch" aria-labelledby="crunch-h">
        <div className="wrap fstory__grid">
          <div className="fstory__copy">
            <p className="eyebrow eyebrow--light" data-reveal>01 · Crisp</p>
            <MaskLines lines={['THE ART OF', 'THE PERFECT', 'CRUNCH.']} className="display fstory__title" />
            <span id="crunch-h" className="sr-only">The art of the perfect crunch</span>
            <p data-reveal className="lead">Fermented batter, a hot griddle and patience. The edge shatters, the centre stays tender.</p>
          </div>
          <div className="fstory__media">
            <div className="fstory__frame"><img data-zoom data-parallax="6" src="/art/scene-crunch.webp" alt="Close-up illustration of a golden crisp dosa" /></div>
          </div>
        </div>
      </section>
      <section className="fstory fstory--comfort" aria-labelledby="comfort-h">
        <div className="wrap fstory__grid fstory__grid--rev">
          <div className="fstory__media">
            <div className="fstory__frame"><img data-zoom data-parallax="-6" src="/art/scene-comfort.webp" alt="Close-up illustration of idlis with coconut chutney and sambar" /></div>
          </div>
          <div className="fstory__copy">
            <p className="eyebrow" data-reveal>02 · Soft</p>
            <MaskLines lines={['THE COMFORT', 'OF EVERY BITE.']} className="display fstory__title" />
            <span id="comfort-h" className="sr-only">The comfort of every bite</span>
            <p data-reveal className="lead">Idli, chutney, sambar. Three simple things that taste like home, wherever home is.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
