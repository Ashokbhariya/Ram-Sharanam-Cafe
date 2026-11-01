import { useState } from 'react';
import { gallery } from '../data/content';
import { GalleryGrid } from '../components/GalleryGrid';
import { PageHero } from '../components/ui';

export default function GalleryPage() {
  const [kind, setKind] = useState<'all' | 'food' | 'ambience'>('all');
  const images = gallery.filter((g) => kind === 'all' || g.kind === kind);
  return (
    <>
      <PageHero eyebrow="Gallery" title={['A FEAST', 'FOR THE EYES.']}><p>Illustrated placeholders for now — click any tile to enlarge. Real photography can replace these files in <code>public/art</code>.</p></PageHero>
      <div className="wrap page-body">
        <div className="filter" role="group" aria-label="Filter gallery">
          {(['all', 'food', 'ambience'] as const).map((k) => <button key={k} type="button" className={kind === k ? 'is-active' : ''} aria-pressed={kind === k} onClick={() => setKind(k)}>{k === 'all' ? 'All' : k === 'food' ? 'Food' : 'Ambience'}</button>)}
        </div>
        <GalleryGrid key={kind} images={images} />
      </div>
    </>
  );
}
