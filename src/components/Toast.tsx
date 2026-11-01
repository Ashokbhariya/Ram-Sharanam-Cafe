import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function Toast() {
  const { notice, setDrawerOpen } = useCart();
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {notice && (
        <div className="toast" key={notice.id}>
          <Check size={18} aria-hidden /> <span>{notice.text}</span>
          <button type="button" className="toast__btn" onClick={() => setDrawerOpen(true)}>View cart</button>
          <Link className="sr-only" to="/cart">Go to cart page</Link>
        </div>
      )}
    </div>
  );
}
