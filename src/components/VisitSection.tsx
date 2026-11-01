import { useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { site } from '../data/site';
import { useScrollEffects } from '../hooks/useMotion';
import { MaskLines } from './ui';

export function LocationMap() {
  return (
    <figure className="locmap">
      <svg viewBox="0 0 640 440" role="img" aria-label="Stylised map placeholder showing a pin for Ram Sharanam Cafe">
        <rect width="640" height="440" fill="#EFE6D2" />
        <g fill="#DCE6C8"><rect x="40" y="40" width="150" height="110" rx="14" /><rect x="430" y="270" width="170" height="120" rx="14" /></g>
        <g fill="#E4D8BC"><rect x="230" y="40" width="120" height="70" rx="8" /><rect x="40" y="200" width="110" height="150" rx="8" /><rect x="380" y="60" width="200" height="90" rx="8" /><rect x="220" y="260" width="150" height="120" rx="8" /></g>
        <g stroke="#fff" strokeWidth="16" fill="none" strokeLinecap="round"><path d="M0 180 H640" /><path d="M200 0 V440" /><path d="M0 400 C200 360 420 420 640 240" /><path d="M400 0 V440" /></g>
        <g stroke="#fff" strokeWidth="7" fill="none"><path d="M0 100 H200" /><path d="M400 330 H640" /></g>
        <g transform="translate(300 180)">
          <circle r="46" fill="#C84B38" opacity=".18" /><circle r="26" fill="#C84B38" opacity=".28" />
          <path d="M0 -34 C-20 -34 -30 -20 -30 -6 C-30 14 0 36 0 36 C0 36 30 14 30 -6 C30 -20 20 -34 0 -34Z" fill="#C84B38" stroke="#fff" strokeWidth="3" />
          <circle cy="-8" r="9" fill="#FFF8EC" />
        </g>
      </svg>
      <figcaption>Map placeholder — not to scale. Use “Get directions” for a live map.</figcaption>
    </figure>
  );
}

export function VisitSection() {
  const ref = useRef<HTMLElement>(null);
  useScrollEffects(ref);
  return (
    <section ref={ref} className="section visit" aria-labelledby="visit-h">
      <div className="wrap visit__grid">
        <div>
          <p className="eyebrow eyebrow--light" data-reveal>Visit us</p>
          <MaskLines lines={['Come hungry.']} className="h-xl" />
          <span id="visit-h" className="sr-only">Visit Ram Sharanam Cafe</span>
          <address className="visit__addr" data-reveal>
            <strong>{site.name}</strong><br />
            <MapPin size={18} aria-hidden /> {site.addressLines[0]},<br />{site.addressLines[1]}.
          </address>
          <p className="muted-light" data-reveal>Opening hours, phone number and exact address will be added once confirmed.</p>
          <a className="btn btn--yellow" href={site.directionsUrl} target="_blank" rel="noopener noreferrer" data-reveal><Navigation size={18} aria-hidden /> Get directions<span className="sr-only"> (opens Google Maps in a new tab)</span></a>
        </div>
        <div data-reveal><LocationMap /></div>
      </div>
    </section>
  );
}
