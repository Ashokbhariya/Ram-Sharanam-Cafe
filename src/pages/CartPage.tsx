import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartLines, EmptyCart, Totals } from '../components/CartParts';
import { DemoBanner, PageHero } from '../components/ui';

export default function CartPage() {
  const { lines, subtotal, deliveryFee, total, clear } = useCart();
  return (
    <>
      <PageHero eyebrow="Your order" title={['YOUR CART.']} />
      <div className="wrap page-body">
        <DemoBanner />
        {lines.length === 0 ? <EmptyCart /> : (
          <div className="two-col">
            <div><CartLines /><button type="button" className="link-btn" onClick={clear}>Clear cart</button></div>
            <aside className="panel" aria-label="Order summary">
              <h2>Summary</h2>
              <Totals subtotal={subtotal} deliveryFee={deliveryFee} total={total} />
              <Link to="/checkout" className="btn btn--red btn--block">Proceed to checkout</Link>
              <Link to="/menu" className="btn btn--ghost btn--block">Add more dishes</Link>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
