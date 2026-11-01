import { PageHero } from '../components/ui';
export default function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const t = kind === 'privacy' ? 'Privacy' : 'Terms';
  return (
    <>
      <PageHero eyebrow="Legal" title={[t.toUpperCase() + '.']} />
      <div className="wrap page-body prose">
        <p><strong>Placeholder page.</strong> This website is a frontend prototype. Final {t.toLowerCase()} text must be supplied or approved by the restaurant owner and a legal adviser before launch.</p>
        <p>In this demo, cart and demo-order data is stored only in your own browser (localStorage). No data is sent to any server, no payment details are collected and no real orders are placed.</p>
      </div>
    </>
  );
}
