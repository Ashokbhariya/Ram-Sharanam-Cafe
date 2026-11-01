import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFocusTrapDialog } from '../hooks/useMotion';
import { Wordmark } from './ui';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/story', label: 'Our Story' },
  { to: '/menu', label: 'Menu' },
  { to: '/#specialities', label: 'Specialities', hash: true },
  { to: '/gallery', label: 'Gallery' },
  { to: '/visit', label: 'Visit Us' },
];

export function SiteHeader() {
  const { count, setDrawerOpen } = useCart();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const close = useCallback(() => setOpen(false), []);
  const dlg = useFocusTrapDialog(open, close);
  useEffect(() => setOpen(false), [pathname]);

  const link = (l: (typeof LINKS)[number], onClick?: () => void) =>
    l.hash ? (
      <Link key={l.to} to={l.to} onClick={onClick}>{l.label}</Link>
    ) : (
      <NavLink key={l.to} to={l.to} end={l.end} onClick={onClick}>{l.label}</NavLink>
    );

  return (
    <header className="site-header">
      <div className="site-header__bar">
        <Link to="/" className="site-header__brand" aria-label="Ram Sharanam Cafe — home"><Wordmark /></Link>
        <nav className="site-header__nav" aria-label="Primary">{LINKS.map((l) => link(l))}</nav>
        <div className="site-header__actions">
          <button type="button" className="icon-btn cart-btn" onClick={() => setDrawerOpen(true)} aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}>
            <ShoppingBag size={22} aria-hidden />
            {count > 0 && <span className="cart-btn__count" aria-hidden>{count}</span>}
          </button>
          <Link to="/menu" className="btn btn--red btn--sm site-header__order">Order Now</Link>
          <button type="button" className="icon-btn site-header__burger" onClick={() => setOpen(true)} aria-label="Open menu" aria-haspopup="dialog"><MenuIcon size={24} aria-hidden /></button>
        </div>
      </div>
      <dialog ref={dlg} className="mobile-nav" aria-label="Site menu">
        <div className="mobile-nav__top">
          <Wordmark light />
          <button type="button" className="icon-btn" onClick={close} aria-label="Close menu"><X size={26} aria-hidden /></button>
        </div>
        <nav aria-label="Mobile">
          {LINKS.map((l) => link(l, close))}
          <Link to="/menu" onClick={close} className="btn btn--yellow">Order Now</Link>
        </nav>
      </dialog>
    </header>
  );
}
