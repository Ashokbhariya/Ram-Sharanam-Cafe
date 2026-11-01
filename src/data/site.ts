// ============================================================
// SITE CONFIG — edit here. Anything marked PLACEHOLDER must be
// replaced with verified details from the restaurant owner.
// ============================================================
export const site = {
  name: 'Ram Sharanam Cafe',
  tagline: 'A Little South. A Lot of Soul.',
  subTagline: 'Discover the comfort of South Indian flavours, one delicious bite at a time.',
  addressLines: ['Near 22 Godam', 'Jaipur, Rajasthan, India'],
  // PLACEHOLDER: a search link only — replace with the verified Google Maps place URL when available.
  directionsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Ram Sharanam Cafe near 22 Godam Jaipur'),
  phone: '[Phone number — to be added]',
  email: '[Email — to be added]',
  // PLACEHOLDER: opening hours were not supplied.
  hours: [
    { day: 'Monday – Friday', hours: 'To be confirmed' },
    { day: 'Saturday', hours: 'To be confirmed' },
    { day: 'Sunday', hours: 'To be confirmed' },
  ],
  socials: [] as { label: string; url: string }[], // none supplied
  deliveryFee: 40, // ₹, flat demo fee
  estimatedWindow: '35–45 min',
};

export const formatINR = (n: number) =>
  '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);
