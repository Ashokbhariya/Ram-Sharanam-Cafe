import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../data/site';
import { FoodImage, QtyStepper } from './ui';

export function CartLines() {
  const { lines, setQty, remove } = useCart();
  return (
    <ul className="cart-lines">
      {lines.map((l) => (
        <li key={l.key} className="cart-line">
          <FoodImage src={l.image} alt="" tint={l.tint} className="cart-line__img" />
          <div className="cart-line__body">
            <h3>{l.name}</h3>
            {l.choices.length > 0 && <p className="muted small">{l.choices.join(' · ')}</p>}
            <p className="small">{formatINR(l.unitPrice)} each</p>
            <div className="cart-line__row">
              <QtyStepper qty={l.qty} label={l.name} onChange={(n) => setQty(l.key, n)} />
              <button type="button" className="link-btn" onClick={() => remove(l.key)} aria-label={`Remove ${l.name} from cart`}><Trash2 size={16} aria-hidden /> Remove</button>
            </div>
          </div>
          <p className="cart-line__sub" aria-label={`Subtotal ${formatINR(l.unitPrice * l.qty)}`}>{formatINR(l.unitPrice * l.qty)}</p>
        </li>
      ))}
    </ul>
  );
}

export function Totals({ subtotal, deliveryFee, total }: { subtotal: number; deliveryFee: number; total: number }) {
  return (
    <dl className="totals">
      <div><dt>Subtotal</dt><dd data-testid="subtotal">{formatINR(subtotal)}</dd></div>
      <div><dt>Delivery fee <span className="muted small">(demo)</span></dt><dd data-testid="delivery">{formatINR(deliveryFee)}</dd></div>
      <div className="totals__grand"><dt>Total</dt><dd data-testid="total">{formatINR(total)}</dd></div>
    </dl>
  );
}

export function EmptyCart({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="empty">
      <FoodImage src="/art/idli.webp" alt="" tint="#F3E4C0" className="empty__img" />
      <h2>Your cart is empty</h2>
      <p className="muted">Add a dosa, some idlis or a hot filter coffee to get started.</p>
      <a className="btn btn--green" href="/menu" onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate(); } }}>Browse the menu</a>
    </div>
  );
}
