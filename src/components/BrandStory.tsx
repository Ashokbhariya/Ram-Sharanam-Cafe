import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { story } from '../data/content';
import { site } from '../data/site';
import { useScrollEffects } from '../hooks/useMotion';
import { FoodImage, MaskLines } from './ui';

export function BrandStory() {
  const ref = useRef<HTMLElement>(null);
  useScrollEffects(ref);
  return (
    <section ref={ref} className="section story" aria-labelledby="story-h">
      <div className="wrap story__grid">
        <div className="story__media" data-reveal>
          <FoodImage src="/art/scene-comfort.webp" alt="Illustration of idlis with coconut chutney and sambar" tint="#F0D58A" className="story__img" />
          <FoodImage src="/art/amb-lamp.webp" alt="Illustration of a glowing brass lamp" className="story__img story__img--small" />
        </div>
        <div className="story__copy">
          <p className="eyebrow" data-reveal>Our Story</p>
          <MaskLines lines={['A Little South.', 'A Lot of Soul.']} className="h-xl" />
          <span id="story-h" className="sr-only">{site.tagline}</span>
          <p data-reveal className="lead">{site.subTagline}</p>
          <p data-reveal>{story.paragraphs[0]}</p>
          <p data-reveal className="muted small">Placeholder copy — the owner’s verified story goes here.</p>
          <Link data-reveal to="/story" className="btn btn--green">Read our story</Link>
        </div>
      </div>
    </section>
  );
}
