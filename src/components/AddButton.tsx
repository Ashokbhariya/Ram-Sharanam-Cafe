import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Plus, SlidersHorizontal, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFocusTrapDialog } from '../hooks/useMotion';
import type { MenuItem } from '../data/menu';
import { formatINR } from '../data/site';
import { FoodImage, QtyStepper } from './ui';

function defaults(item: MenuItem): Record<string, string[]> {
  const o: Record<string, string[]> = {};
  for (const g of item.options ?? []) o[g.id] = g.type === 'single' ? [g.choices[0].id] : [];
  return o;
}

export function ItemCustomizer({ item, open, onClose }: { item: MenuItem; open: boolean; onClose: () => void }) {
  const { add } = useCart();
  const [sel, setSel] = useState(() => defaults(item));
  const [qty, setQty] = useState(1);
  const ref = useFocusTrapDialog(open, onClose);
  useEffect(() => { if (open) { setSel(defaults(item)); setQty(1); } }, [open, item]);

  const unit = useMemo(() => {
    let p = item.price;
    for (const g of item.options ?? []) for (const id of sel[g.id] ?? []) p += g.choices.find((c) => c.id === id)?.price ?? 0;
    return p;
  }, [item, sel]);

  const toggle = (gid: string, cid: string, single: boolean) =>
    setSel((s) => ({ ...s, [gid]: single ? [cid] : s[gid].includes(cid) ? s[gid].filter((x) => x !== cid) : [...s[gid], cid] }));

  return (
    <dialog ref={ref} className="modal" aria-labelledby={`cz-${item.id}`} onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      <form method="dialog" className="modal__panel" onSubmit={(e) => { e.preventDefault(); add(item, qty, sel); onClose(); }}>
        <button type="button" className="icon-btn modal__close" onClick={onClose} aria-label="Close"><X size={22} aria-hidden /></button>
        <FoodImage src={item.image} alt="" tint={item.tint} className="modal__img" />
        <div className="modal__body">
          <h2 id={`cz-${item.id}`}>{item.name}</h2>
          <p className="muted">{item.description}</p>
          {(item.options ?? []).map((g) => (
            <fieldset key={g.id} className="opt">
              <legend>{g.label}{g.type === 'multi' && <span className="muted small"> (optional)</span>}</legend>
              {g.choices.map((c) => (
                <label key={c.id} className="opt__row">
                  <input type={g.type === 'single' ? 'radio' : 'checkbox'} name={`${item.id}-${g.id}`} checked={(sel[g.id] ?? []).includes(c.id)} onChange={() => toggle(g.id, c.id, g.type === 'single')} />
                  <span>{c.label}</span>
                  <span className="muted">{c.price ? `+${formatINR(c.price)}` : ''}</span>
                </label>
              ))}
            </fieldset>
          ))}
          <div className="modal__foot">
            <QtyStepper qty={qty} onChange={setQty} label={item.name} />
            <button type="submit" className="btn btn--red">Add to cart · {formatINR(unit * qty)}</button>
          </div>
        </div>
      </form>
    </dialog>
  );
}

export function AddButton({ item, className = '' }: { item: MenuItem; className?: string }) {
  const { add } = useCart();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const t = useRef<number | undefined>(undefined);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => () => window.clearTimeout(t.current), []);

  if (!item.available) return <button type="button" className={`btn btn--sm btn--disabled ${className}`} disabled>Unavailable</button>;
  const hasOpts = !!item.options?.length;
  const click = () => {
    if (hasOpts) return setOpen(true);
    add(item, 1, {});
    setDone(true); window.clearTimeout(t.current); t.current = window.setTimeout(() => setDone(false), 1400);
  };
  return (
    <>
      <button type="button" className={`btn btn--sm ${done ? 'btn--green' : 'btn--red'} ${className}`} onClick={click} aria-label={`${hasOpts ? 'Customise and add' : 'Add'} ${item.name}`}>
        {done ? <><Check size={16} aria-hidden /> Added</> : hasOpts ? <><SlidersHorizontal size={16} aria-hidden /> Customise</> : <><Plus size={16} aria-hidden /> Add</>}
      </button>
      {hasOpts && <ItemCustomizer item={item} open={open} onClose={close} />}
    </>
  );
}
