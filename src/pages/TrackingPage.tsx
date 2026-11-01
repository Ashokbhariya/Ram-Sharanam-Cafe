import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Bike } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useReducedMotion } from '../hooks/useMotion';
import { MOCK_RIDER, ROUTE_ANIMATION_MS, SAMPLE_ORDER, STAGE_DWELL_MS, STAGE_ETA_MIN, TRACKING_STAGES } from '../data/orders';
import { formatINR } from '../data/site';
import { MockTrackingMap } from '../components/MockTrackingMap';
import { StatusTimeline } from '../components/StatusTimeline';
import { DemoBanner, PageHero } from '../components/ui';

export default function TrackingPage() {
  const { id } = useParams();
  const { get, latest } = useOrders();
  const reduced = useReducedMotion();
  const found = id ? get(id) : latest;
  const isSample = !found && !id;
  const order = found ?? (isSample ? SAMPLE_ORDER : undefined);

  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(!reduced);
  const [t, setT] = useState(0);
  const raf = useRef(0);

  // auto-advance
  useEffect(() => {
    if (!playing || stage >= 5) return;
    const h = window.setTimeout(() => setStage((s) => Math.min(5, s + 1)), reduced && stage === 4 ? 2500 : STAGE_DWELL_MS[stage]);
    return () => window.clearTimeout(h);
  }, [playing, stage, reduced]);
  useEffect(() => { if (stage >= 5) setPlaying(false); }, [stage]);

  // rider route progress
  useEffect(() => {
    cancelAnimationFrame(raf.current);
    if (stage < 4) return setT(0);
    if (stage >= 5) return setT(1);
    if (reduced) return setT(0.5);
    const start = performance.now();
    const tick = (now: number) => { const p = Math.min(1, (now - start) / ROUTE_ANIMATION_MS); setT(p); if (p < 1) raf.current = requestAnimationFrame(tick); };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [stage, reduced]);

  if (!order) return (
    <><PageHero eyebrow="Tracking" title={['ORDER NOT', 'FOUND.']} />
      <div className="wrap page-body"><div className="empty"><p className="muted">That demo order isn’t saved in this browser.</p><Link to="/track" className="btn btn--green">View a sample order</Link></div></div></>
  );

  const eta = stage < 4 ? STAGE_ETA_MIN[stage] : stage === 4 ? Math.max(1, Math.round(12 * (1 - t))) : 0;
  const go = (n: number) => { setPlaying(false); setStage(Math.max(0, Math.min(5, n))); };
  const cur = TRACKING_STAGES[stage];

  return (
    <>
      <PageHero eyebrow={isSample ? 'Sample order · simulation' : 'Demo order · simulation'} title={['WHERE’S MY', 'DOSA?']} />
      <div className="wrap page-body">
        <DemoBanner>Everything on this page is simulated: the map, the rider, the route and the times. No real delivery is happening and no device location is used.</DemoBanner>
        <div className="track">
          <div className="track__map">
            <MockTrackingMap stage={stage} routeProgress={t} />
            <div className="sim" role="group" aria-label="Simulation controls">
              <p className="sim__title">Demo control</p>
              <div className="sim__btns">
                <button type="button" className="btn btn--sm btn--ghost" onClick={() => go(stage - 1)} disabled={stage === 0}><ChevronLeft size={16} aria-hidden /> Previous</button>
                <button type="button" className="btn btn--sm btn--green" onClick={() => { if (stage >= 5) { setStage(0); } setPlaying((p) => !p); }} aria-pressed={playing}>
                  {playing ? <><Pause size={16} aria-hidden /> Pause</> : <><Play size={16} aria-hidden /> {stage >= 5 ? 'Replay' : 'Auto-play'}</>}
                </button>
                <button type="button" className="btn btn--sm btn--ghost" onClick={() => go(stage + 1)} disabled={stage === 5}>Next <ChevronRight size={16} aria-hidden /></button>
                <button type="button" className="btn btn--sm btn--ghost" onClick={() => go(0)}><RotateCcw size={16} aria-hidden /> Reset</button>
              </div>
              <div className="sim__stages" role="group" aria-label="Jump to stage">
                {TRACKING_STAGES.map((s, i) => <button type="button" key={s.id} className={i === stage ? 'is-on' : ''} onClick={() => go(i)} aria-label={`Stage ${i + 1}: ${s.label}`} aria-pressed={i === stage}>{i + 1}</button>)}
              </div>
            </div>
          </div>
          <div className="track__side">
            <section className="panel status" aria-live="polite">
              <p className="eyebrow">Order {order.id}{isSample && ' (sample)'}</p>
              <h2 data-testid="status">{cur.label}</h2>
              <p>{cur.detail}</p>
              <p className="eta"><strong data-testid="eta">{stage >= 5 ? 'Delivered' : `~${eta} min`}</strong><span className="muted small"> {stage >= 5 ? '' : 'estimated arrival · '}simulated</span></p>
            </section>
            <section className="panel rider" aria-label="Rider (mock)">
              <Bike aria-hidden />
              <div><h3>{MOCK_RIDER.name}</h3><p className="muted small">{MOCK_RIDER.vehicle}<br />{MOCK_RIDER.note}</p>
                <p className="small">{stage >= 4 ? (stage === 5 ? 'Delivered' : 'On the way') : stage === 3 ? 'Arriving at the restaurant' : 'Not yet assigned'}</p></div>
            </section>
            <section className="panel"><h3>Delivery address</h3><p>{order.customer.name}<br />{order.customer.address}{order.customer.landmark ? <><br />Landmark: {order.customer.landmark}</> : null}</p></section>
          </div>
        </div>
        <div className="two-col two-col--even">
          <section className="panel"><h2 className="h-sm">Status timeline</h2><StatusTimeline stage={stage} /></section>
          <section className="panel"><h2 className="h-sm">Your items</h2>
            <ul className="mini-lines">{order.lines.map((l) => <li key={l.key}><span>{l.qty} × {l.name}{l.choices.length > 0 && <small className="muted"> {l.choices.join(', ')}</small>}</span><b>{formatINR(l.unitPrice * l.qty)}</b></li>)}</ul>
            <p className="totals__grand"><span>Total</span> <b>{formatINR(order.total)}</b></p>
          </section>
        </div>
      </div>
    </>
  );
}
