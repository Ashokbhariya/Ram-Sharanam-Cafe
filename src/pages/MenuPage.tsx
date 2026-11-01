import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { CATEGORIES, MENU, isCategoryId, type CategoryId } from '../data/menu';
import { MenuCategoryNavigation } from '../components/MenuCategoryNavigation';
import { MenuGrid } from '../components/MenuGrid';
import { PageHero } from '../components/ui';

export default function MenuPage() {
  const [params, setParams] = useSearchParams();
  const catParam = params.get('cat');
  const category: CategoryId | 'all' = isCategoryId(catParam) ? catParam : 'all';
  const [q, setQ] = useState('');
  const results = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (catParam && results.current) {
      const y = results.current.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [catParam]);

  const matches = useMemo(() => {
    const s = q.trim().toLowerCase();
    return MENU.filter((m) => {
      if (!s) return true;
      const cat = CATEGORIES.find((c) => c.id === m.category)?.label ?? '';
      return `${m.name} ${m.description} ${cat}`.toLowerCase().includes(s);
    });
  }, [q]);
  const items = matches.filter((m) => category === 'all' || m.category === category);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: matches.length };
    for (const m of matches) c[m.category] = (c[m.category] ?? 0) + 1;
    return c;
  }, [matches]);

  const select = (c: CategoryId | 'all') => {
    const next = new URLSearchParams(params);
    if (c === 'all') next.delete('cat'); else next.set('cat', c);
    setParams(next, { replace: true });
  };

  return (
    <>
      <PageHero eyebrow="The menu" title={['EVERYTHING', 'FROM THE SOUTH.']}>
        <p>Dosas, idlis, vadas and more. <strong>Sample dishes and prices for this prototype — the restaurant’s real menu is to be confirmed.</strong></p>
      </PageHero>
      <div className="menu-tools">
        <div className="wrap menu-tools__in">
          <MenuCategoryNavigation active={category} onSelect={select} counts={counts} />
          <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="menu-search" className="sr-only">Search the menu</label>
            <Search size={18} aria-hidden />
            <input id="menu-search" type="search" placeholder="Search dosa, idli, coffee…" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
            {q && <button type="button" className="icon-btn" onClick={() => setQ('')} aria-label="Clear search"><X size={16} aria-hidden /></button>}
          </form>
        </div>
      </div>
      <div className="wrap menu-results" ref={results} id="menu-results">
        <p className="sr-only" role="status" aria-live="polite">{items.length} dish{items.length === 1 ? '' : 'es'} shown</p>
        <MenuGrid items={items} category={category} query={q} />
      </div>
    </>
  );
}
