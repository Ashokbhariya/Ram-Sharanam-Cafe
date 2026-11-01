import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES, MENU } from '../data/menu';
import { useScrollEffects } from '../hooks/useMotion';
import { FoodImage, MaskLines } from './ui';

export function MenuPreview() {
  const ref = useRef<HTMLElement>(null);
  useScrollEffects(ref);
  return (
    <section ref={ref} className="section mpreview" aria-labelledby="mp-h">
      <div className="wrap">
        <p className="eyebrow" data-reveal>The menu</p>
        <MaskLines lines={['Pick your', 'South.']} className="h-xl" />
        <span id="mp-h" className="sr-only">Menu categories</span>
        <ul className="tiles">
          {CATEGORIES.map((c, i) => (
            <li key={c.id} className={`tile tile--${i + 1}`} data-reveal>
              <Link to={`/menu?cat=${c.id}`} style={{ background: c.tint }} aria-label={`${c.label} — ${MENU.filter((m) => m.category === c.id).length} dishes`}>
                <FoodImage src={c.image} alt="" className="tile__img" />
                <span className="tile__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="tile__label">{c.label}<ArrowUpRight size={22} aria-hidden /></span>
                <span className="tile__blurb">{c.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
