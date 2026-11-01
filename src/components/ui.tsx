import { Minus, Plus } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

/** Food image on a tinted ground. Swap the `src` for real photography any time. */
export function FoodImage({ src, alt, tint, className = '', eager = false, style }: { src: string; alt: string; tint?: string; className?: string; eager?: boolean; style?: CSSProperties }) {
  return (
    <div className={`food-img ${className}`} style={{ background: tint, ...style }}>
      <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable={false} />
    </div>
  );
}

/** Headline split into masked lines (revealed by useScrollEffects via [data-lines]). */
export function MaskLines({ lines, as: Tag = 'h2', className = '', dataLines = true }: { lines: string[]; as?: 'h1' | 'h2' | 'h3' | 'p'; className?: string; dataLines?: boolean }) {
  return (
    <Tag className={`mask-lines ${className}`} {...(dataLines ? { 'data-lines': '' } : {})}>
      {lines.map((l, i) => (
        <span className="line" key={i}><span className="line-inner">{l}</span></span>
      ))}
    </Tag>
  );
}

export function QtyStepper({ qty, onChange, label, min = 1 }: { qty: number; onChange: (n: number) => void; label: string; min?: number }) {
  return (
    <div className="stepper" role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" onClick={() => onChange(qty - 1)} aria-label={`Decrease quantity of ${label}`} disabled={qty <= min && min > 0}><Minus size={16} aria-hidden /></button>
      <output aria-live="polite">{qty}</output>
      <button type="button" onClick={() => onChange(qty + 1)} aria-label={`Increase quantity of ${label}`} disabled={qty >= 20}><Plus size={16} aria-hidden /></button>
    </div>
  );
}

export function DemoBanner({ children }: { children?: ReactNode }) {
  return (
    <p className="demo-banner" role="note">
      <strong>Demo only.</strong> {children ?? 'This is a website prototype — nothing here is sent to the restaurant, no payment is taken and no delivery is arranged.'}
    </p>
  );
}

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string[]; children?: ReactNode }) {
  return (
    <header className="page-hero">
      <div className="wrap">
        <p className="eyebrow" data-reveal>{eyebrow}</p>
        <MaskLines as="h1" lines={title} className="display" />
        {children && <div className="page-hero__lead" data-reveal>{children}</div>}
      </div>
    </header>
  );
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className={`wordmark ${light ? 'wordmark--light' : ''}`}>
      <svg viewBox="0 0 48 48" width="34" height="34" aria-hidden="true" focusable="false">
        <circle cx="24" cy="24" r="23" fill="var(--leaf)" />
        <g fill="none" stroke="var(--turmeric)" strokeWidth="2.4" strokeLinecap="round">
          <circle cx="24" cy="24" r="4.5" fill="var(--turmeric)" />
          <path d="M24 7c5 6 5 11 0 14M24 41c-5-6-5-11 0-14M7 24c6-5 11-5 14 0M41 24c-6 5-11 5-14 0" />
        </g>
      </svg>
      <span className="wordmark__text"><span>Ram Sharanam</span><small>Cafe · Jaipur</small></span>
    </span>
  );
}
