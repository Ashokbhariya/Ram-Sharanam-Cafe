import { Check } from 'lucide-react';
import { TRACKING_STAGES } from '../data/orders';

export function StatusTimeline({ stage }: { stage: number }) {
  return (
    <ol className="timeline" aria-label="Order status timeline (simulated)">
      {TRACKING_STAGES.map((s, i) => {
        const state = i < stage ? 'done' : i === stage ? 'current' : 'todo';
        return (
          <li key={s.id} className={`timeline__item is-${state}`} aria-current={state === 'current' ? 'step' : undefined}>
            <span className="timeline__dot" aria-hidden>{state === 'done' ? <Check size={14} /> : i + 1}</span>
            <div><h3>{s.label}<span className="sr-only">{state === 'done' ? ' — completed' : state === 'current' ? ' — current step' : ' — upcoming'}</span></h3>{state !== 'todo' && <p>{s.detail}</p>}</div>
          </li>
        );
      })}
    </ol>
  );
}
