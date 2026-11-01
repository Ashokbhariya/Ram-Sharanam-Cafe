import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryImage } from '../data/content';
import { useFocusTrapDialog } from '../hooks/useMotion';

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [idx, setIdx] = useState<number | null>(null);
  const close = useCallback(() => setIdx(null), []);
  const ref = useFocusTrapDialog(idx !== null, close);
  const n = images.length;
  const step = useCallback((d: number) => setIdx((i) => (i === null ? i : (i + d + n) % n)), [n]);
  useEffect(() => {
    if (idx === null) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [idx, step]);
  const cur = idx !== null ? images[idx] : null;
  return (
    <>
      <ul className="gallery">
        {images.map((g, i) => (
          <li key={g.id} className={`gallery__item gallery__item--${(i % 6) + 1}`}>
            <button type="button" onClick={() => setIdx(i)} aria-label={`Enlarge: ${g.caption}`} style={{ background: g.tint }}>
              <img src={g.src} alt={g.alt} loading="lazy" />
              <span className="gallery__cap">{g.caption}</span>
            </button>
          </li>
        ))}
      </ul>
      <dialog ref={ref} className="lightbox" aria-label="Image viewer" onClick={(e) => { if (e.target === ref.current) close(); }}>
        {cur && (
          <figure>
            <img src={cur.src} alt={cur.alt} />
            <figcaption>{cur.caption} <span className="muted-light">· {(idx as number) + 1} / {n}</span></figcaption>
          </figure>
        )}
        <button type="button" className="icon-btn lightbox__x" onClick={close} aria-label="Close image viewer"><X size={26} aria-hidden /></button>
        <button type="button" className="icon-btn lightbox__prev" onClick={() => step(-1)} aria-label="Previous image"><ChevronLeft size={30} aria-hidden /></button>
        <button type="button" className="icon-btn lightbox__next" onClick={() => step(1)} aria-label="Next image"><ChevronRight size={30} aria-hidden /></button>
      </dialog>
    </>
  );
}
