import { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFocusTrapDialog } from '../hooks/useMotion';
import { CartLines, Totals } from './CartParts';
import { FoodImage } from './ui';

export function CartDrawer() {
  const { drawerOpen, setDrawerOpen, lines, subtotal, deliveryFee, total } = useCart();
  const nav = useNavigate();
  const close = useCallback(() => setDrawerOpen(false), [setDrawerOpen]);
  const ref = useFocusTrapDialog(drawerOpen, close);
  const go = (to: string) => { close(); nav(to); };
  return (
    <dialog ref={ref} className="drawer" aria-labelledby="drawer-title" onClick={(e) => { if (e.target === ref.current) close(); }}>
      <div className="drawer__panel">
        <div className="drawer__head">
          <h2 id="drawer-title">Your cart</h2>
          <button type="button" className="icon-btn" onClick={close} aria-label="Close cart"><X size={24} aria-hidden /></button>
        </div>
        <p className="demo-chip">Demo — orders aren’t sent to the restaurant</p>
        {lines.length === 0 ? (
          <div className="empty empty--small">
            <FoodImage src="/art/idli.webp" alt="" tint="#F3E4C0" className="empty__img" />
            <p>Your cart is empty.</p>
            <button type="button" className="btn btn--green" onClick={() => go('/menu')}>Browse the menu</button>
          </div>
        ) : (
          <>
            <div className="drawer__scroll"><CartLines /></div>
            <div className="drawer__foot">
              <Totals subtotal={subtotal} deliveryFee={deliveryFee} total={total} />
              <div className="drawer__btns">
                <Link className="btn btn--ghost" to="/cart" onClick={close}>View cart</Link>
                <Link className="btn btn--red" to="/checkout" onClick={close}>Checkout</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
