import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { MenuItem } from '../data/menu';
import { site } from '../data/site';

export interface CartLine {
  key: string; itemId: string; name: string; image: string; tint: string;
  unitPrice: number; qty: number; choices: string[];
}
interface Notice { id: number; text: string }
interface CartCtx {
  lines: CartLine[];
  count: number; subtotal: number; deliveryFee: number; total: number;
  add: (item: MenuItem, qty: number, choiceIds: Record<string, string[]>) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  drawerOpen: boolean; setDrawerOpen: (v: boolean) => void;
  notice: Notice | null;
}
const Ctx = createContext<CartCtx | null>(null);
const KEY = 'rsc-demo-cart-v1';

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    const v = raw ? JSON.parse(raw) : [];
    return Array.isArray(v) ? v : [];
  } catch { return []; }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(load);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* storage unavailable */ } }, [lines]);

  const add = useCallback<CartCtx['add']>((item, qty, choiceIds) => {
    const labels: string[] = []; let extra = 0; const idParts: string[] = [];
    for (const g of item.options ?? []) {
      for (const cid of choiceIds[g.id] ?? []) {
        const c = g.choices.find((x) => x.id === cid);
        if (c) { labels.push(c.label); extra += c.price; idParts.push(`${g.id}:${c.id}`); }
      }
    }
    const key = [item.id, ...idParts.sort()].join('|');
    setLines((prev) => {
      const ex = prev.find((l) => l.key === key);
      if (ex) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { key, itemId: item.id, name: item.name, image: item.image, tint: item.tint, unitPrice: item.price + extra, qty, choices: labels }];
    });
    setNotice({ id: Date.now(), text: `${qty} × ${item.name} added to cart` });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setNotice(null), 3200);
  }, []);

  const setQty = useCallback((key: string, qty: number) =>
    setLines((p) => (qty <= 0 ? p.filter((l) => l.key !== key) : p.map((l) => (l.key === key ? { ...l, qty: Math.min(qty, 20) } : l)))), []);
  const remove = useCallback((key: string) => setLines((p) => p.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartCtx>(() => {
    const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const deliveryFee = lines.length ? site.deliveryFee : 0;
    return { lines, count, subtotal, deliveryFee, total: subtotal + deliveryFee, add, setQty, remove, clear, drawerOpen, setDrawerOpen, notice };
  }, [lines, add, setQty, remove, clear, drawerOpen, notice]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useCart = () => { const c = useContext(Ctx); if (!c) throw new Error('CartProvider missing'); return c; };
