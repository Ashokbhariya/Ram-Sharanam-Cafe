import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, RotateCcw } from 'lucide-react';
import { site } from '../data/site';
import { useIntro } from '../context/IntroContext';
import { Wordmark } from './ui';

export function SiteFooter() {
  const { replay } = useIntro();
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__grid">
        <div className="site-footer__brand">
          <Wordmark light />
          <p className="site-footer__tag">{site.tagline}</p>
          <button type="button" className="link-btn link-btn--light" onClick={replay}><RotateCcw size={15} aria-hidden /> Replay intro</button>
        </div>
        <nav aria-label="Footer" className="site-footer__col">
          <h2>Explore</h2>
          <Link to="/">Home</Link><Link to="/story">Our Story</Link><Link to="/menu">Menu</Link>
          <Link to="/#specialities">Specialities</Link><Link to="/gallery">Gallery</Link><Link to="/visit">Visit Us</Link>
        </nav>
        <nav aria-label="Ordering demo" className="site-footer__col">
          <h2>Order (demo)</h2>
          <Link to="/menu">Full menu</Link><Link to="/cart">Cart</Link><Link to="/checkout">Checkout</Link><Link to="/track">Track a demo order</Link>
        </nav>
        <address className="site-footer__col">
          <h2>Find us</h2>
          <p><MapPin size={16} aria-hidden /> {site.addressLines.join(', ')}</p>
          <p><Phone size={16} aria-hidden /> {site.phone}</p>
          <p><Mail size={16} aria-hidden /> {site.email}</p>
          {site.socials.length > 0 ? site.socials.map((s) => <a key={s.url} href={s.url}>{s.label}</a>) : <p className="muted small">Social links to be added.</p>}
        </address>
      </div>
      <div className="wrap site-footer__legal">
        <p>© {new Date().getFullYear()} {site.name}. Website prototype — menu, prices, hours and contact details are placeholders.</p>
        <p><Link to="/privacy">Privacy</Link> · <Link to="/terms">Terms</Link></p>
      </div>
    </footer>
  );
}
