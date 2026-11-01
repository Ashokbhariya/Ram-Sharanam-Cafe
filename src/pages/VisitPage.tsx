import { useState, type FormEvent } from 'react';
import { Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import { site } from '../data/site';
import { LocationMap } from '../components/VisitSection';
import { DemoBanner, PageHero } from '../components/ui';

interface F { name: string; contact: string; message: string }
export default function VisitPage() {
  const [f, setF] = useState<F>({ name: '', contact: '', message: '' });
  const [err, setErr] = useState<Partial<F>>({});
  const [sent, setSent] = useState(false);
  const set = (k: keyof F) => (e: { target: { value: string } }) => { setF((p) => ({ ...p, [k]: e.target.value })); setErr((p) => ({ ...p, [k]: undefined })); };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const x: Partial<F> = {};
    if (f.name.trim().length < 2) x.name = 'Please tell us your name.';
    if (!/^\S+@\S+\.\S+$/.test(f.contact.trim()) && !/^[6-9]\d{9}$/.test(f.contact.replace(/[\s-]/g, '').replace(/^(\+91|0)/, ''))) x.contact = 'Enter a valid email address or 10-digit mobile number.';
    if (f.message.trim().length < 10) x.message = 'Please write a short message (at least 10 characters).';
    setErr(x);
    if (Object.keys(x).length === 0) setSent(true);
  };

  return (
    <>
      <PageHero eyebrow="Visit us" title={['COME', 'HUNGRY.']} />
      <div className="wrap page-body">
        <div className="two-col two-col--even">
          <div>
            <LocationMap />
            <address className="panel visit-info">
              <h2 className="h-sm">{site.name}</h2>
              <p><MapPin size={18} aria-hidden /> {site.addressLines.join(', ')}.</p>
              <p><Phone size={18} aria-hidden /> {site.phone}</p>
              <p><Mail size={18} aria-hidden /> {site.email}</p>
              <a className="btn btn--red" href={site.directionsUrl} target="_blank" rel="noopener noreferrer"><Navigation size={18} aria-hidden /> Get directions<span className="sr-only"> (opens Google Maps in a new tab)</span></a>
            </address>
            <section className="panel" aria-labelledby="hrs"><h2 id="hrs" className="h-sm"><Clock size={20} aria-hidden /> Opening hours</h2>
              <table className="hours"><tbody>{site.hours.map((h) => <tr key={h.day}><th scope="row">{h.day}</th><td>{h.hours}</td></tr>)}</tbody></table>
              <p className="muted small">Placeholder — hours not yet supplied. Edit in <code>src/data/site.ts</code>.</p></section>
          </div>
          <div>
            <DemoBanner>This contact form is a demonstration. Nothing is sent anywhere.</DemoBanner>
            {sent ? (
              <div className="panel success" role="status">
                <h2 className="h-sm">Thanks, {f.name.trim()}!</h2>
                <p>Demo submission received in this browser only — no message was sent to the restaurant.</p>
                <button type="button" className="btn btn--green" onClick={() => { setSent(false); setF({ name: '', contact: '', message: '' }); }}>Send another</button>
              </div>
            ) : (
              <form className="panel" onSubmit={submit} noValidate aria-label="Contact form (demo)">
                <h2 className="h-sm">Say hello</h2>
                {(['name', 'contact', 'message'] as const).map((k) => {
                  const label = k === 'name' ? 'Your name' : k === 'contact' ? 'Email or mobile number' : 'Message';
                  const common = { id: `c-${k}`, value: f[k], onChange: set(k), 'aria-invalid': !!err[k], 'aria-describedby': err[k] ? `c-${k}-e` : undefined };
                  return (
                    <div key={k} className={`field ${err[k] ? 'has-error' : ''}`}>
                      <label htmlFor={`c-${k}`}>{label}</label>
                      {k === 'message' ? <textarea rows={5} {...common} /> : <input {...common} autoComplete={k === 'name' ? 'name' : 'email'} />}
                      {err[k] && <p id={`c-${k}-e`} className="error">{err[k]}</p>}
                    </div>
                  );
                })}
                <button type="submit" className="btn btn--red">Send demo message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
