import type { MenuItem } from '../data/menu';
import { formatINR } from '../data/site';
import { AddButton } from './AddButton';
import { FoodImage } from './ui';

export function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <article className={`dish ${item.available ? '' : 'dish--off'}`}>
      <FoodImage src={item.image} alt={`Illustration of ${item.name}`} tint={item.tint} className="dish__img" />
      <div className="dish__body">
        <div className="dish__top">
          <h3>{item.name}</h3>
          <p className="dish__price">{formatINR(item.price)}</p>
        </div>
        <p className="dish__desc">{item.description}</p>
        {item.dietary && item.dietary.length > 0 && <ul className="chips" aria-label="Dietary labels">{item.dietary.map((d) => <li key={d}>{d}</li>)}</ul>}
        {!item.available && <p className="dish__note">{item.unavailableNote ?? 'Currently unavailable'}</p>}
        <AddButton item={item} className="dish__add" />
      </div>
    </article>
  );
}
