import { CATEGORIES, type CategoryId } from '../data/menu';

export function MenuCategoryNavigation({ active, onSelect, counts }: { active: CategoryId | 'all'; onSelect: (c: CategoryId | 'all') => void; counts: Record<string, number> }) {
  const all: { id: CategoryId | 'all'; label: string }[] = [{ id: 'all', label: 'All' }, ...CATEGORIES];
  return (
    <nav className="cat-nav" aria-label="Menu categories">
      <ul>
        {all.map((c) => (
          <li key={c.id}>
            <button type="button" className={active === c.id ? 'is-active' : ''} aria-pressed={active === c.id} onClick={() => onSelect(c.id)}>
              {c.label}<span className="cat-nav__n">{counts[c.id] ?? 0}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
