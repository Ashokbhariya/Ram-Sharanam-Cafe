import { useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Banknote, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { makeOrderId, type Customer, type Order } from '../data/orders';
import { Totals, EmptyCart } from '../components/CartParts';
import { DemoBanner, FoodImage, PageHero } from '../components/ui';
import { formatINR } from '../data/site';

type Errors = Partial<Record<keyof Customer, string>>;
const blank: Customer = { name: '', mobile: '', address: '', landmark: '', instructions: '' };

export function validate(c: Customer): Errors {
  const e: Errors = {};
  if (c.name.trim().length < 2) e.name = 'Please enter your full name (at least 2 characters).';
  const digits = c.mobile.replace(/[\s-]/g, '').replace(/^(\+91|0)/, '');
  if (!/^[6-9]\d{9}$/.test(digits)) e.mobile = 'Enter a valid 10-digit Indian mobile number, e.g. 98765 43210.';
  if (c.address.trim().length < 10) e.address = 'Please enter your full delivery address (house/flat, street, area).';
  return e;
}

export default function CheckoutPage() {
  const { lines, subtotal, deliveryFee, total, clear } = useCart();
  const { save } = useOrders();
  const nav = useNavigate();
  const [c, setC] = useState<Customer>(blank);
  const [pay, setPay] = useState<'online' | 'cod'>('cod');
  const [errors, setErrors] = useState<Errors>({});
  const summary = useRef<HTMLDivElement>(null);

  if (lines.length === 0) return (<><PageHero eyebrow="Checkout" title={['CHECKOUT.']} /><div className="wrap page-body"><EmptyCart /></div></>);

  const set = (k: keyof Customer) => (e: { target: { value: string } }) => { setC((p) => ({ ...p, [k]: e.target.value })); if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined })); };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err = validate(c);
    setErrors(err);
    if (Object.keys(err).length) { window.setTimeout(() => summary.current?.focus(), 0); return; }
    const order: Order = { id: makeOrderId(), placedAt: new Date().toISOString(), lines, subtotal, deliveryFee, total, payment: pay, customer: c };
    save(order); clear();
    nav(`/order/${order.id}`);
  };
  const field = (k: keyof Customer, label: string, props: React.InputHTMLAttributes<HTMLInputElement> & { area?: boolean } = {}, required = true, hint?: string) => {
    const id = `f-${k}`; const err = errors[k];
    const common = { id, name: k, value: c[k], onChange: set(k), 'aria-invalid': !!err, 'aria-describedby': [err ? `${id}-e` : '', hint ? `${id}-h` : ''].join(' ').trim() || undefined, 'aria-required': required || undefined };
    return (
      <div className={`field ${err ? 'has-error' : ''}`}>
        <label htmlFor={id}>{label}{!required && <span className="muted small"> (optional)</span>}</label>
        {props.area ? <textarea rows={3} {...common} /> : <input {...common} {...props} />}
        {hint && <p id={`${id}-h`} className="hint">{hint}</p>}
        {err && <p id={`${id}-e`} className="error">{err}</p>}
      </div>
    );
  };
  const errList = Object.entries(errors).filter(([, v]) => v);

  return (
    <>
      <PageHero eyebrow="Checkout" title={['ALMOST', 'THERE.']} />
      <div className="wrap page-body">
        <DemoBanner />
        <form className="two-col" onSubmit={submit} noValidate>
          <div className="checkout__main">
            {errList.length > 0 && (
              <div className="error-summary" role="alert" tabIndex={-1} ref={summary}>
                <h2>Please fix {errList.length} thing{errList.length > 1 ? 's' : ''}</h2>
                <ul>{errList.map(([k, v]) => <li key={k}><a href={`#f-${k}`}>{v}</a></li>)}</ul>
              </div>
            )}
            <fieldset className="panel">
              <legend>Delivery details</legend>
              {field('name', 'Full name', { autoComplete: 'name' })}
              {field('mobile', 'Mobile number', { type: 'tel', inputMode: 'tel', autoComplete: 'tel', placeholder: '98765 43210' }, true, 'Demo only — not stored anywhere except this browser.')}
              {field('address', 'Delivery address', { area: true })}
              {field('landmark', 'Landmark', { placeholder: 'e.g. near the temple' }, false)}
              {field('instructions', 'Delivery instructions', { area: true }, false)}
            </fieldset>
            <fieldset className="panel pay">
              <legend>Payment method <span className="muted small">(demonstration mode)</span></legend>
              <label className={`pay__opt ${pay === 'online' ? 'is-on' : ''}`}>
                <input type="radio" name="pay" checked={pay === 'online'} onChange={() => setPay('online')} />
                <CreditCard size={22} aria-hidden /><span><strong>Online payment</strong><small>Demo only. No card or UPI details are collected or processed.</small></span>
              </label>
              <label className={`pay__opt ${pay === 'cod' ? 'is-on' : ''}`}>
                <input type="radio" name="pay" checked={pay === 'cod'} onChange={() => setPay('cod')} />
                <Banknote size={22} aria-hidden /><span><strong>Cash on delivery</strong><small>Demo only. Nothing is charged.</small></span>
              </label>
            </fieldset>
          </div>
          <aside className="panel" aria-label="Order summary">
            <h2>Order summary</h2>
            <ul className="mini-lines">
              {lines.map((l) => (
                <li key={l.key}><FoodImage src={l.image} alt="" tint={l.tint} className="mini-lines__img" />
                  <span>{l.qty} × {l.name}{l.choices.length > 0 && <small className="muted"> {l.choices.join(', ')}</small>}</span><b>{formatINR(l.unitPrice * l.qty)}</b></li>
              ))}
            </ul>
            <Totals subtotal={subtotal} deliveryFee={deliveryFee} total={total} />
            <button type="submit" className="btn btn--red btn--block">Place Demo Order</button>
            <p className="small muted">Placing a demo order creates a sample order number in this browser only. The restaurant receives nothing.</p>
            <Link to="/cart" className="link-btn">Back to cart</Link>
          </aside>
        </form>
      </div>
    </>
  );
}
