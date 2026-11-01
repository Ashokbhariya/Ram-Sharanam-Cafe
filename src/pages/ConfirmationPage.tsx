import { Link, useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { formatINR, site } from '../data/site';
import { Totals } from '../components/CartParts';
import { StatusTimeline } from '../components/StatusTimeline';
import { DemoBanner, PageHero } from '../components/ui';

export default function ConfirmationPage() {
  const { id } = useParams();
  const { get } = useOrders();
  const o = id ? get(id) : undefined;
  if (!o) return (
    <><PageHero eyebrow="Order" title={['ORDER NOT', 'FOUND.']} />
      <div className="wrap page-body"><div className="empty"><p className="muted">We couldn’t find that demo order in this browser.</p><Link to="/menu" className="btn btn--green">Back to the menu</Link></div></div></>
  );
  return (
    <>
      <PageHero eyebrow="Demo order confirmed" title={['THANK YOU.']} />
      <div className="wrap page-body">
        <DemoBanner>This is a demonstration confirmation. No real order was sent to Ram Sharanam Cafe and no payment was taken.</DemoBanner>
        <div className="two-col">
          <div className="panel">
            <p className="confirm__ok"><CheckCircle2 aria-hidden /> Demo order placed</p>
            <p>Order number</p>
            <p className="confirm__id" data-testid="order-id">{o.id}</p>
            <p>Estimated delivery window (simulated): <strong>{site.estimatedWindow}</strong></p>
            <p className="muted small">Payment: {o.payment === 'cod' ? 'Cash on delivery (demo)' : 'Online payment (demo)'} · Deliver to {o.customer.name}, {o.customer.address}{o.customer.landmark ? `, near ${o.customer.landmark}` : ''}</p>
            <h2 className="h-sm">Simulated delivery timeline</h2>
            <StatusTimeline stage={0} />
            <Link to={`/track/${o.id}`} className="btn btn--red">Track this demo order</Link>
          </div>
          <aside className="panel" aria-label="Order summary">
            <h2>Order summary</h2>
            <ul className="mini-lines">{o.lines.map((l) => <li key={l.key}><span>{l.qty} × {l.name}{l.choices.length > 0 && <small className="muted"> {l.choices.join(', ')}</small>}</span><b>{formatINR(l.unitPrice * l.qty)}</b></li>)}</ul>
            <Totals subtotal={o.subtotal} deliveryFee={o.deliveryFee} total={o.total} />
          </aside>
        </div>
      </div>
    </>
  );
}
