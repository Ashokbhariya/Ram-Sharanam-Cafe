import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { story } from '../data/content';
import { useScrollEffects } from '../hooks/useMotion';
import { FoodImage, PageHero } from '../components/ui';

export default function StoryPage() {
  const ref = useRef<HTMLDivElement>(null);
  useScrollEffects(ref);
  return (
    <div ref={ref}>
      <PageHero eyebrow={story.eyebrow} title={['SOUTH INDIAN', 'COMFORT, SERVED', 'WITH CHARACTER.']}><p>{story.intro}</p></PageHero>
      <section className="section wrap story-page">
        <div className="story-page__grid">
          <FoodImage src="/art/scene-hero.webp" alt="Illustration of a full South Indian plate" tint="#183F32" className="story-page__img" />
          <div>{story.paragraphs.map((p, i) => <p key={i} className="lead" data-reveal>{p}</p>)}
            <p className="note" data-reveal>Editable placeholder copy: this text lives in <code>src/data/content.ts</code>. No history, dates or awards have been invented.</p></div>
        </div>
      </section>
      <section className="pillars" aria-label="What to expect">
        {story.pillars.map((p, i) => (
          <article key={p.word} className={`pillar pillar--${i + 1}`} data-reveal>
            <FoodImage src={p.image} alt="" tint={p.tint} className="pillar__img" />
            <h2>{p.word}</h2><p>{p.text}</p>
          </article>
        ))}
      </section>
      <section className="section wrap atmos">
        <h2 className="h-xl" data-reveal>The atmosphere.</h2>
        <p className="muted" data-reveal>Placeholder illustrations — swap in real photographs of the dining room, the counter and the kitchen.</p>
        <div className="atmos__row">
          {['amb-lamp', 'amb-kolam', 'amb-banana-leaf', 'amb-spices'].map((n) => <FoodImage key={n} src={`/art/${n}.webp`} alt="Ambience placeholder illustration" className="atmos__img" />)}
        </div>
        <Link to="/menu" className="btn btn--red">See what’s on the menu</Link>
      </section>
    </div>
  );
}
