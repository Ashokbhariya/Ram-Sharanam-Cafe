import { CATEGORIES, type CategoryId, type MenuItem } from '../data/menu';
import { MenuItemCard } from './MenuItemCard';

export function MenuGrid({ items, category, query }: { items: MenuItem[]; category: CategoryId | 'all'; query: string }) {
  if (items.length === 0)
    return (
      <div className="empty" role="status">
        <h2>No dishes found</h2>
        <p className="muted">Nothing matches “{query}”{category !== 'all' ? ' in this category' : ''}. Try another word, like “dosa” or “coffee”.</p>
      </div>
    );
  // Grouped view when browsing "All" without a search
  if (category === 'all' && !query.trim())
    return (
      <>
        {CATEGORIES.map((c) => {
          const list = items.filter((i) => i.category === c.id);
          if (!list.length) return null;
          return (
            <section key={c.id} className="menu-group" aria-labelledby={`g-${c.id}`}>
              <div className="menu-group__head"><h2 id={`g-${c.id}`}>{c.label}</h2><p className="muted">{c.blurb}</p></div>
              <div className="dish-grid">{list.map((i) => <MenuItemCard key={i.id} item={i} />)}</div>
            </section>
          );
        })}
      </>
    );
  return <div className="dish-grid">{items.map((i) => <MenuItemCard key={i.id} item={i} />)}</div>;
}
