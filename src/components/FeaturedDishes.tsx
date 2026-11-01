import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { getItem } from '../data/menu';
import { formatINR } from '../data/site';
import { useScrollEffects } from '../hooks/useMotion';
import { AddButton } from './AddButton';
import { FoodImage, MaskLines } from './ui';

const IDS = ['masala-dosa', 'mysore-masala-dosa', 'idli-sambar', 'medu-vada', 'onion-uttapam', 'pongal', 'south-indian-thali', 'filter-coffee'];

export function FeaturedDishes() {
  const ref = useRef<HTMLElement>(null);
  const items = IDS.map(getItem).filter((x): x is NonNullable<typeof x> => !!x);
  const [active, setActive] = useState(0);
  useScrollEffects(ref);
  const cur = items[active];
  return (
    <section ref={ref} id="specialities" className="section specs" aria-labelledby="specs-h">
      <div className="wrap">
        <p className="eyebrow eyebrow--light" data-reveal>Specialities</p>
        <MaskLines lines={['Signature', 'plates.']} className="h-xl" />
        <span id="specs-h" className="sr-only">Signature dishes</span>
        <p className="muted-light" data-reveal>Sample dishes and prices for the prototype — the restaurant’s real menu is to be confirmed.</p>
        <div className="specs__grid">
          <ol className="specs__list">
            {items.map((it, i) => (
              <li key={it.id} className={i === active ? 'is-active' : ''} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} data-reveal>
                <span className="specs__n" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                <FoodImage src={it.image} alt="" tint={it.tint} className="specs__thumb" />
                <div className="specs__txt">
                  <h3>{it.name}</h3>
                  <p>{it.description}</p>
                </div>
                <p className="specs__price">{formatINR(it.price)}</p>
                <AddButton item={it} className="specs__add" />
              </li>
            ))}
          </ol>
          <div className="specs__stage" aria-hidden="true">
            <div className="specs__sticky">
              <FoodImage key={cur.id} src={cur.image} alt="" tint={cur.tint} className="specs__big" />
              <p className="specs__cap">{cur.name}</p>
            </div>
          </div>
        </div>
        <Link to="/menu" className="btn btn--yellow specs__more" data-reveal>See the full menu <ArrowUpRight size={18} aria-hidden /></Link>
      </div>
    </section>
  );
}
