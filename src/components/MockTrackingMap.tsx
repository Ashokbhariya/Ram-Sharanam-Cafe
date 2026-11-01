import { useEffect, useRef, useState } from 'react';

/**
 * Presentational, SIMULATED map. It only needs a route progress (0–1) and a stage.
 * To connect a real provider later, keep this props contract and replace the <svg> body
 * with a map component that draws `riderPosition` and the route polyline.
 */
export interface TrackingMapProps { stage: number; routeProgress: number; originLabel?: string; destinationLabel?: string }

const ROUTE = 'M120 360 C190 360 200 290 270 290 L400 290 C470 290 470 190 540 190 L610 190 C660 190 670 120 690 90';

export function MockTrackingMap({ stage, routeProgress, originLabel = 'Restaurant', destinationLabel = 'Your address' }: TrackingMapProps) {
  const path = useRef<SVGPathElement>(null);
  const [pt, setPt] = useState({ x: 120, y: 360 });
  useEffect(() => {
    const p = path.current; if (!p) return;
    const q = p.getPointAtLength(p.getTotalLength() * Math.min(1, Math.max(0, routeProgress)));
    setPt({ x: q.x, y: q.y });
  }, [routeProgress]);
  const delivered = stage >= 5;
  return (
    <figure className="map">
      <svg viewBox="0 0 800 460" role="img" aria-label={`Simulated delivery map. Rider is ${Math.round(routeProgress * 100)} percent of the way along a sample route.`}>
        <rect width="800" height="460" fill="#EFE6D2" />
        <g fill="#D5E2BE"><rect x="30" y="30" width="170" height="120" rx="16" /><rect x="560" y="300" width="210" height="130" rx="16" /></g>
        <path d="M0 410 C120 380 260 440 420 400 S700 420 800 380 V460 H0Z" fill="#CFE0E6" />
        <g fill="#E3D6B8"><rect x="240" y="40" width="150" height="90" rx="8" /><rect x="40" y="190" width="130" height="110" rx="8" /><rect x="430" y="50" width="170" height="90" rx="8" /><rect x="620" y="170" width="140" height="90" rx="8" /><rect x="260" y="320" width="150" height="50" rx="8" /></g>
        <g stroke="#fff" strokeWidth="18" fill="none" strokeLinecap="round"><path d="M0 160 H800" /><path d="M215 0 V460" /><path d="M520 0 V460" /><path d="M0 300 H800" /></g>
        <path d={ROUTE} fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        <path ref={path} d={ROUTE} fill="none" stroke="#C84B38" strokeWidth="6" strokeLinecap="round" strokeDasharray="2 14" />
        <path d={ROUTE} fill="none" stroke="#183F32" strokeWidth="6" strokeLinecap="round" pathLength="1" strokeDasharray={`${routeProgress} 2`} />
        <g transform="translate(120 360)"><circle r="22" fill="#183F32" /><text y="6" textAnchor="middle" fontSize="18" fill="#E7B83F" fontWeight="700">R</text></g>
        <g transform="translate(690 90)">
          <path d="M0 -40 C-20 -40 -30 -26 -30 -12 C-30 8 0 32 0 32 C0 32 30 8 30 -12 C30 -26 20 -40 0 -40Z" fill="#C84B38" stroke="#fff" strokeWidth="3" />
          <circle cy="-12" r="9" fill="#FFF8EC" />
        </g>
        <text x="120" y="400" textAnchor="middle" fontSize="15" fontWeight="600" fill="#242320">{originLabel}</text>
        <text x="690" y="130" textAnchor="middle" fontSize="15" fontWeight="600" fill="#242320">{destinationLabel}</text>
        {stage >= 4 && (
          <g transform={`translate(${pt.x} ${pt.y})`} data-testid="rider-marker">
            {!delivered && <circle r="26" fill="#E7B83F" opacity=".35" className="map__pulse" />}
            <circle r="17" fill="#E7B83F" stroke="#183F32" strokeWidth="4" />
            <path d="M-7 3h10l3-6h-6M-7 3a3 3 0 1 0 .1 0M5 3a3 3 0 1 0 .1 0" fill="none" stroke="#183F32" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}
      </svg>
      <figcaption className="map__badge">SIMULATED MAP — sample route, no live GPS</figcaption>
    </figure>
  );
}
