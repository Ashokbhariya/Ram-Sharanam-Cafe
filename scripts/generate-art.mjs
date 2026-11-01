// Generates the original SVG food/ambience illustrations in /public/art.
// These are PLACEHOLDER ILLUSTRATIONS (no stock photography could be downloaded while building).
// Replace any file in public/art with real photography and keep the same file name (or update src/data/menu.ts).
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('public/art');
fs.mkdirSync(OUT, { recursive: true });

function rng(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = (n) => Math.round(n * 10) / 10;

const DEFS = `
<filter id="shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="26" stdDeviation="26" flood-color="#1b0f06" flood-opacity=".42"/></filter>
<filter id="soft" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="9" stdDeviation="9" flood-color="#2b1708" flood-opacity=".38"/></filter>
<filter id="blur8"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="blur20"><feGaussianBlur stdDeviation="20"/></filter>
<filter id="crisp" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.028 0.075" numOctaves="4" seed="7" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.36  0 0 0 0 0.17  0 0 0 0 0.03  6 0 0 0 -3.3" result="spots"/>
  <feComposite in="spots" in2="SourceGraphic" operator="in"/>
</filter>
<filter id="crispFine" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="3" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.30  0 0 0 0 0.14  0 0 0 0 0.02  5 0 0 0 -2.65" result="spots"/>
  <feComposite in="spots" in2="SourceGraphic" operator="in"/>
</filter>
<filter id="grainY" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="11" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.32  0 0 0 0 0.1  1.4 0 0 0 -0.55" result="g"/>
  <feComposite in="g" in2="SourceGraphic" operator="in"/>
</filter>
<linearGradient id="steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7F8F9"/><stop offset=".5" stop-color="#C9CED3"/><stop offset="1" stop-color="#8F969D"/></linearGradient>
<radialGradient id="steelIn" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#F0F2F4"/><stop offset=".7" stop-color="#D0D5DA"/><stop offset="1" stop-color="#B3B9BF"/></radialGradient>
<linearGradient id="steelDark" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#D8DCE0"/><stop offset="1" stop-color="#7C838A"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7CD62"/><stop offset=".5" stop-color="#E6A532"/><stop offset="1" stop-color="#B96F1A"/></linearGradient>
<radialGradient id="idli" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#FCF5E6"/><stop offset="1" stop-color="#E7D8B6"/></radialGradient>
<radialGradient id="vada" cx=".4" cy=".32" r=".9"><stop offset="0" stop-color="#EBAA4A"/><stop offset=".6" stop-color="#C97A1F"/><stop offset="1" stop-color="#8A4710"/></radialGradient>
<radialGradient id="sambar" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#E69533"/><stop offset=".7" stop-color="#C5651E"/><stop offset="1" stop-color="#9B4414"/></radialGradient>
<radialGradient id="coconut" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#FFFFFA"/><stop offset="1" stop-color="#E8E1C8"/></radialGradient>
<radialGradient id="redch" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#DE5334"/><stop offset="1" stop-color="#A52A16"/></radialGradient>
<radialGradient id="greench" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#9DCB62"/><stop offset="1" stop-color="#5B8F2E"/></radialGradient>
<radialGradient id="rasam" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#D1642F"/><stop offset="1" stop-color="#8C2E14"/></radialGradient>
<radialGradient id="curd" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#EFEADC"/></radialGradient>
<radialGradient id="coffee" cx=".42" cy=".38" r=".75"><stop offset="0" stop-color="#7A4A26"/><stop offset=".7" stop-color="#4A2A14"/><stop offset="1" stop-color="#2B170A"/></radialGradient>
<radialGradient id="chai" cx=".42" cy=".38" r=".75"><stop offset="0" stop-color="#D9A56A"/><stop offset=".7" stop-color="#B57B42"/><stop offset="1" stop-color="#8A5628"/></radialGradient>
<radialGradient id="mound" cx=".4" cy=".3" r=".85"><stop offset="0" stop-color="#FFFBE6"/><stop offset=".6" stop-color="#F2DD99"/><stop offset="1" stop-color="#D9B861"/></radialGradient>
<radialGradient id="leaf" cx=".4" cy=".35" r=".9"><stop offset="0" stop-color="#4E9A45"/><stop offset="1" stop-color="#1F5E2C"/></radialGradient>
<radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFD98A" stop-opacity=".95"/><stop offset="1" stop-color="#FFD98A" stop-opacity="0"/></radialGradient>
`;

const svg = (body, { bg = null, defs = '' } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200"><defs>${DEFS}${defs}</defs>${bg ? `<rect width="1200" height="1200" fill="${bg}"/>` : ''}${body}</svg>`;

// ---------- primitives ----------
const plate = (cx, cy, r) => `
<g filter="url(#shadow)"><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#steel)"/></g>
<circle cx="${cx}" cy="${cy}" r="${r * 0.94}" fill="url(#steelIn)"/>
<circle cx="${cx}" cy="${cy}" r="${r * 0.94}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3"/>
<circle cx="${cx}" cy="${cy}" r="${r * 0.8}" fill="none" stroke="#7d848b" stroke-opacity=".25" stroke-width="3"/>
<circle cx="${cx}" cy="${cy}" r="${r * 0.79}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
<path d="M ${cx - r * 0.7} ${cy - r * 0.45} A ${r * 0.85} ${r * 0.85} 0 0 1 ${cx - r * 0.1} ${cy - r * 0.84}" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="10" stroke-linecap="round" filter="url(#blur8)"/>`;

const leafShape = (x, y, rot, s, fill = '#3E7A33') =>
  `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"><path d="M0 ${-s} C ${s * 0.65} ${-s * 0.4} ${s * 0.65} ${s * 0.4} 0 ${s} C ${-s * 0.65} ${s * 0.4} ${-s * 0.65} ${-s * 0.4} 0 ${-s}Z" fill="${fill}"/><path d="M0 ${-s} L0 ${s}" stroke="#1d4a1b" stroke-width="1.6" opacity=".6"/></g>`;

function scatter(rand, n, R, fn, minR = 0) {
  let o = '';
  for (let i = 0; i < n; i++) {
    const a = rand() * Math.PI * 2;
    const d = Math.sqrt(minR * minR + rand() * (R * R - minR * minR));
    o += fn(Math.cos(a) * d, Math.sin(a) * d, i);
  }
  return o;
}

// bowl contents, drawn around (0,0) with radius r
function bowlContent(kind, r, seed = 1) {
  const rand = rng(seed);
  const dot = (fill, rr, op = 1) => (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rr * (0.6 + rand() * 0.8))}" fill="${fill}" opacity="${op}"/>`;
  let o = '';
  switch (kind) {
    case 'sambar':
      o += `<circle r="${r}" fill="url(#sambar)"/>`;
      o += scatter(rand, 26, r * 0.82, dot('#EDB955', r * 0.07, 0.9));
      o += scatter(rand, 8, r * 0.7, (x, y) => `<rect x="${f(x)}" y="${f(y)}" width="${r * 0.2}" height="${r * 0.07}" rx="${r * 0.03}" fill="#8FB04E" transform="rotate(${f(rand() * 180)} ${f(x)} ${f(y)})"/>`);
      o += scatter(rand, 6, r * 0.7, dot('#C93A22', r * 0.09, 0.9));
      o += scatter(rand, 14, r * 0.8, dot('#6b2d0e', r * 0.02, 0.8));
      o += leafShape(r * 0.2, -r * 0.1, 40, r * 0.17) + leafShape(-r * 0.25, r * 0.2, -30, r * 0.15);
      o += `<ellipse cx="${-r * 0.3}" cy="${-r * 0.4}" rx="${r * 0.35}" ry="${r * 0.12}" fill="#fff" opacity=".22" transform="rotate(-25)"/>`;
      break;
    case 'coconut':
      o += `<circle r="${r}" fill="url(#coconut)"/>`;
      o += scatter(rand, 26, r * 0.85, dot('#5C9632', r * 0.035, 0.85));
      o += scatter(rand, 10, r * 0.6, dot('#222', r * 0.03, 0.9), r * 0.25);
      o += `<path d="M ${-r * 0.4} ${-r * 0.1} q ${r * 0.3} ${-r * 0.3} ${r * 0.6} ${r * 0.05}" stroke="#B5261E" stroke-width="${r * 0.07}" fill="none" stroke-linecap="round"/>`;
      o += leafShape(r * 0.25, r * 0.25, 20, r * 0.15);
      break;
    case 'red':
      o += `<circle r="${r}" fill="url(#redch)"/>`;
      o += scatter(rand, 30, r * 0.85, dot('#F0A07A', r * 0.025, 0.7));
      o += `<ellipse cx="${-r * 0.25}" cy="${-r * 0.35}" rx="${r * 0.4}" ry="${r * 0.12}" fill="#fff" opacity=".25" transform="rotate(-25)"/>`;
      break;
    case 'green':
      o += `<circle r="${r}" fill="url(#greench)"/>`;
      o += scatter(rand, 30, r * 0.85, dot('#E8F4C8', r * 0.025, 0.6));
      o += `<ellipse cx="${-r * 0.25}" cy="${-r * 0.35}" rx="${r * 0.4}" ry="${r * 0.12}" fill="#fff" opacity=".25" transform="rotate(-25)"/>`;
      break;
    case 'rasam':
      o += `<circle r="${r}" fill="url(#rasam)"/>`;
      o += scatter(rand, 20, r * 0.8, dot('#2b1004', r * 0.025, 0.85));
      o += leafShape(0, 0, 15, r * 0.16) + `<circle r="${r * 0.2}" fill="#7a2410" opacity=".35"/>`;
      break;
    case 'curd':
      o += `<circle r="${r}" fill="url(#curd)"/>`;
      o += scatter(rand, 8, r * 0.7, dot('#c9c0aa', r * 0.04, 0.6));
      o += `<ellipse cx="${-r * 0.25}" cy="${-r * 0.35}" rx="${r * 0.4}" ry="${r * 0.12}" fill="#fff" opacity=".8" transform="rotate(-25)"/>`;
      break;
    case 'curry':
      o += `<circle r="${r}" fill="#C9A23A"/>` + `<circle r="${r}" fill="url(#sambar)" opacity=".4"/>`;
      o += scatter(rand, 10, r * 0.75, (x, y) => `<rect x="${f(x)}" y="${f(y)}" width="${r * 0.22}" height="${r * 0.22}" rx="${r * 0.05}" fill="#D96A27" transform="rotate(${f(rand() * 90)} ${f(x)} ${f(y)})"/>`);
      o += scatter(rand, 9, r * 0.75, dot('#5E9E3B', r * 0.09, 0.95));
      break;
    case 'payasam':
      o += `<circle r="${r}" fill="#F4E3B2"/>`;
      o += scatter(rand, 20, r * 0.8, dot('#E1A85A', r * 0.05, 0.9));
      o += scatter(rand, 16, r * 0.8, dot('#6A3B14', r * 0.04, 0.8));
      o += `<ellipse cx="${-r * 0.25}" cy="${-r * 0.35}" rx="${r * 0.4}" ry="${r * 0.12}" fill="#fff" opacity=".5" transform="rotate(-25)"/>`;
      break;
    case 'coffee':
      o += `<circle r="${r}" fill="url(#coffee)"/>`;
      o += `<circle r="${r * 0.86}" fill="none" stroke="#C99A62" stroke-opacity=".55" stroke-width="${r * 0.14}" filter="url(#blur8)"/>`;
      o += scatter(rand, 40, r * 0.85, dot('#E2BE8C', r * 0.03, 0.75), r * 0.45);
      break;
    case 'pickle':
      o += `<circle r="${r}" fill="#7A2A12"/>`;
      o += scatter(rand, 16, r * 0.8, dot('#D05A1E', r * 0.1, 0.9));
      o += scatter(rand, 8, r * 0.8, dot('#E8B230', r * 0.05, 0.9));
      break;
  }
  return o;
}

let KC = 0;
const katori = (cx, cy, r, kind, seed = 1) => {
  const cid = 'kc' + ++KC;
  return `<g transform="translate(${cx} ${cy})">
  <g filter="url(#soft)"><circle r="${r}" fill="url(#steel)"/></g>
  <circle r="${r * 0.9}" fill="url(#steelDark)"/>
  <circle r="${r * 0.82}" fill="url(#steelIn)"/>
  <clipPath id="${cid}"><circle r="${r * 0.76}"/></clipPath><g clip-path="url(#${cid})">${bowlContent(kind, r * 0.76, seed)}</g>
  <circle r="${r * 0.76}" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="4"/>
  <circle r="${r * 0.97}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2.5"/>
</g>`;
};
const kClip = () => '';

const idli = (cx, cy, r, podi = false) => {
  const rand = rng(Math.floor(cx + cy));
  return `<g transform="translate(${cx} ${cy})">
  <g filter="url(#soft)"><circle r="${r}" fill="url(#idli)"/></g>
  <circle r="${r * 0.92}" fill="none" stroke="#E9DAB8" stroke-width="3" opacity=".7"/>
  <ellipse cx="${-r * 0.2}" cy="${-r * 0.28}" rx="${r * 0.38}" ry="${r * 0.2}" fill="#fff" opacity=".7" transform="rotate(-30)" filter="url(#blur8)"/>
  ${scatter(rand, 16, r * 0.8, (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1.5 + rand() * 2.5)}" fill="#DCC9A0" opacity=".7"/>`)}
  ${podi ? scatter(rand, 70, r * 0.75, (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1.5 + rand() * 3)}" fill="${rand() > 0.5 ? '#8A3A14' : '#B5561E'}" opacity=".85"/>`) : ''}
</g>`;
};

const vada = (cx, cy, r, rot = 0) => `<g transform="translate(${cx} ${cy}) rotate(${rot})">
  <g filter="url(#soft)"><circle r="${r}" fill="url(#vada)"/></g>
  <g filter="url(#crispFine)"><circle r="${r}" fill="#000"/></g>
  <circle r="${r * 0.3}" fill="url(#steelIn)"/>
  <circle r="${r * 0.3}" fill="none" stroke="#5a2f0b" stroke-width="${r * 0.08}" opacity=".55"/>
  <circle r="${r * 0.3}" fill="none" stroke="#F0B45E" stroke-width="${r * 0.04}" opacity=".7" transform="scale(1.18)"/>
  <ellipse cx="${-r * 0.38}" cy="${-r * 0.5}" rx="${r * 0.4}" ry="${r * 0.14}" fill="#fff" opacity=".35" transform="rotate(-30)" filter="url(#blur8)"/>
</g>`;

// folded / rolled dosa lying across the plate
function dosa({ cx, cy, len = 760, thick = 250, rot = -14, potato = true, red = false, seed = 5 }) {
  const L = len / 2, T = thick;
  const rand = rng(seed);
  const body = `M ${-L} 0 C ${-L * 0.6} ${-T * 0.38} ${L * 0.2} ${-T * 0.58} ${L} ${-T * 0.5} C ${L * 1.06} ${-T * 0.2} ${L * 1.06} ${T * 0.2} ${L} ${T * 0.5} C ${L * 0.2} ${T * 0.58} ${-L * 0.6} ${T * 0.38} ${-L} 0 Z`;
  let ridges = '';
  for (let i = 0; i < 26; i++) {
    const x = -L * 0.9 + (i / 25) * L * 1.7;
    const h = T * (0.18 + 0.36 * Math.sin((i / 25) * Math.PI * 0.8 + 0.5));
    ridges += `<path d="M ${f(x)} ${f(-h)} q ${f(8 + rand() * 12)} ${f(h)} ${f(rand() * 6 - 3)} ${f(h * 2)}" stroke="#8A4C0E" stroke-opacity="${f(0.16 + rand() * 0.18)}" stroke-width="${f(2 + rand() * 3)}" fill="none" stroke-linecap="round"/>`;
  }
  let redStreaks = '';
  if (red) {
    for (let i = 0; i < 9; i++) {
      const x = L * 0.2 + rand() * L * 0.75;
      const y = (rand() - 0.5) * T * 0.7;
      redStreaks += `<path d="M ${f(x)} ${f(y)} q ${f(30 + rand() * 40)} ${f(-14 - rand() * 14)} ${f(70 + rand() * 60)} ${f(rand() * 22 - 8)}" stroke="#B83218" stroke-width="${f(7 + rand() * 7)}" stroke-opacity=".75" fill="none" stroke-linecap="round"/>`;
    }
  }
  let filling = '';
  if (potato) {
    filling = `<g transform="translate(${L * 1.0} 0)">
      <ellipse rx="${T * 0.15}" ry="${T * 0.5}" fill="#5a3207" opacity=".85"/>
      <ellipse rx="${T * 0.11}" ry="${T * 0.43}" fill="#F0C85A"/>
      ${scatter(rand, 36, T * 0.4, (x, y) => `<circle cx="${f(x * 0.25)}" cy="${f(y)}" r="${f(5 + rand() * 9)}" fill="${['#F5D470', '#E8B93E', '#F9E19A', '#D9A12A'][Math.floor(rand() * 4)]}"/>`)}
      ${scatter(rand, 7, T * 0.35, (x, y) => `<circle cx="${f(x * 0.2)}" cy="${f(y)}" r="5" fill="#3b7a2b"/>`)}
      ${scatter(rand, 8, T * 0.4, (x, y) => `<circle cx="${f(x * 0.2 + 26)}" cy="${f(y)}" r="${f(7 + rand() * 9)}" fill="#F3CD62"/>`)}
    </g>`;
  }
  return `<g transform="translate(${cx} ${cy}) rotate(${rot})">
  <g filter="url(#shadow)"><path d="${body}" fill="url(#gold)"/></g>
  <path d="${body}" fill="url(#gold)"/>
  <g filter="url(#crisp)"><path d="${body}" fill="#000"/></g>
  <g clip-path="url(#dosaClip${seed})">${ridges}${redStreaks}</g>
  <path d="M ${-L * 0.85} ${-T * 0.08} C ${-L * 0.3} ${-T * 0.38} ${L * 0.3} ${-T * 0.44} ${L * 0.9} ${-T * 0.36}" stroke="#FFF1B8" stroke-opacity=".7" stroke-width="${T * 0.07}" fill="none" stroke-linecap="round" filter="url(#blur8)"/>
  <path d="${body}" fill="none" stroke="#7a3f0a" stroke-opacity=".5" stroke-width="3"/>
  ${filling}
</g>`;
}
const dosaClip = (len, thick, seed) => {
  const L = len / 2, T = thick;
  return `<clipPath id="dosaClip${seed}"><path d="M ${-L} 0 C ${-L * 0.6} ${-T * 0.38} ${L * 0.2} ${-T * 0.58} ${L} ${-T * 0.5} C ${L * 1.06} ${-T * 0.2} ${L * 1.06} ${T * 0.2} ${L} ${T * 0.5} C ${L * 0.2} ${T * 0.58} ${-L * 0.6} ${T * 0.38} ${-L} 0 Z"/></clipPath>`;
};

function roundDosa(cx, cy, r, seed = 9) {
  const rand = rng(seed);
  let holes = '';
  for (let i = 0; i < 360; i++) {
    const a = rand() * Math.PI * 2, d = Math.sqrt(rand()) * r * 0.97;
    const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
    holes += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(5 + rand() * 9)}" ry="${f(4 + rand() * 7)}" transform="rotate(${f(rand() * 180)} ${f(x)} ${f(y)})" fill="#7a4410" opacity="${f(0.25 + rand() * 0.3)}"/><ellipse cx="${f(x - 1)}" cy="${f(y - 2)}" rx="${f(3 + rand() * 5)}" ry="${f(2 + rand() * 4)}" fill="#FBE29A" opacity=".6"/>`;
  }
  return `<g filter="url(#shadow)"><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#gold)"/></g>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#gold)"/>
  <clipPath id="rd${seed}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
  <g clip-path="url(#rd${seed})">${holes}</g>
  <g filter="url(#crisp)"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#000"/></g>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#7a3f0a" stroke-opacity=".5" stroke-width="4"/>
  <ellipse cx="${cx - r * 0.3}" cy="${cy - r * 0.45}" rx="${r * 0.4}" ry="${r * 0.12}" fill="#FFF1B8" opacity=".5" transform="rotate(-30 ${cx} ${cy})" filter="url(#blur20)"/>`;
}

function uttapam(cx, cy, r, mix = 'onion', seed = 4) {
  const rand = rng(seed);
  const tom = mix === 'tomato' ? 38 : mix === 'mixed' ? 18 : 6;
  const oni = mix === 'tomato' ? 8 : 34;
  const chi = mix === 'mixed' ? 22 : 12;
  return `<g filter="url(#shadow)"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#E7C27A"/></g>
  <radialGradient id="ut${seed}" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#F8E4B2"/><stop offset=".75" stop-color="#E6BB6B"/><stop offset="1" stop-color="#C98F3A"/></radialGradient>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#ut${seed})"/>
  <g filter="url(#crispFine)"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#000"/></g>
  <g transform="translate(${cx} ${cy})">
   ${scatter(rand, oni, r * 0.86, (x, y) => `<path d="M ${f(x)} ${f(y)} q 12 -16 28 -2 q -10 8 -28 2" fill="#EBC1CB" stroke="#B5557A" stroke-width="2.4" transform="rotate(${f(rand() * 360)} ${f(x)} ${f(y)})"/>`)}
   ${scatter(rand, tom, r * 0.86, (x, y) => `<rect x="${f(x)}" y="${f(y)}" width="${f(16 + rand() * 12)}" height="${f(14 + rand() * 10)}" rx="5" fill="#D6402A" transform="rotate(${f(rand() * 360)} ${f(x)} ${f(y)})"/><circle cx="${f(x + 6)}" cy="${f(y + 5)}" r="2.5" fill="#F7A590"/>`)}
   ${scatter(rand, chi, r * 0.86, (x, y) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="9" ry="4" fill="#5F9E36" transform="rotate(${f(rand() * 360)} ${f(x)} ${f(y)})"/>`)}
   ${scatter(rand, 26, r * 0.88, (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(2 + rand() * 3)}" fill="#2F6B2B"/>`)}
  </g>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#7a3f0a" stroke-opacity=".4" stroke-width="3"/>`;
}

// grains of rice
function riceMound(cx, cy, R, base, seed = 2, lobe = 0.0) {
  const rand = rng(seed);
  let g = '';
  for (let i = 0; i < 1100; i++) {
    const a = rand() * Math.PI * 2, d = Math.sqrt(rand()) * R * (1 + lobe * Math.sin(a * 5));
    const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
    const shade = base[Math.floor(rand() * base.length)];
    g += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(7 + rand() * 3)}" ry="${f(2.6 + rand())}" transform="rotate(${f(rand() * 180)} ${f(x)} ${f(y)})" fill="${shade}" stroke="#00000014" stroke-width=".8"/>`;
  }
  return `<g filter="url(#soft)"><circle cx="${cx}" cy="${cy}" r="${R}" fill="${base[0]}"/></g>${g}
  <ellipse cx="${cx - R * 0.3}" cy="${cy - R * 0.4}" rx="${R * 0.4}" ry="${R * 0.14}" fill="#fff" opacity=".18" transform="rotate(-30 ${cx} ${cy})" filter="url(#blur20)"/>`;
}

const peanut = (x, y) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="12" ry="8.5" fill="#DDA66B" stroke="#a96d33" stroke-width="2" transform="rotate(${f((x * 7 + y * 3) % 180)} ${f(x)} ${f(y)})"/>`;

const cashew = (x, y, r) => `<path d="M ${x} ${y} q 16 -22 34 -6 q 6 14 -8 24 q 8 -14 -26 -18Z" fill="#E9C48C" stroke="#B88945" stroke-width="2" transform="rotate(${r} ${x} ${y})"/>`;

// ---------- compositions ----------
function dosaScene({ variant = 'masala', closeup = false } = {}) {
  const seed = variant === 'plain' ? 6 : variant === 'mysore' ? 8 : 5;
  const opts = {
    masala: { potato: true, red: false },
    plain: { potato: false, red: false, len: 940, thick: 250 },
    mysore: { potato: true, red: true },
  }[variant];
  const len = opts.len ?? 900, thick = opts.thick ?? 330;
  const clips = dosaClip(len, thick, seed) + kClip();
  const body = `${plate(600, 600, 540)}
  <defs>${clips}</defs>
  ${katori(300, 905, 128, 'sambar', 1)}
  ${katori(600, 965, 120, 'coconut', 2)}
  ${katori(900, 905, 112, variant === 'mysore' ? 'green' : 'red', 3)}
  ${dosa({ cx: 590, cy: 470, len, thick, rot: -12, seed, ...opts })}`;
  return svg(body);
}

function roundDosaScene() {
  return svg(`${plate(600, 600, 540)}<defs>${kClip('sambar', 1, 100) + kClip('coconut', 2, 100) + kClip('red', 3, 90)}</defs>
  ${roundDosa(600, 560, 400)}
  ${katori(250, 990, 100, 'sambar', 1)}${katori(600, 1040, 96, 'coconut', 2)}${katori(950, 990, 90, 'red', 3)}`);
}

function idliScene({ kind = 'plate', podi = false } = {}) {
  const defs = kClip('sambar', 1, 150) + kClip('coconut', 2, 112) + kClip('red', 3, 100) + kClip('sambar', 4, 120);
  let body = plate(600, 600, 540) + `<defs>${defs}</defs>`;
  if (kind === 'mini') {
    body += katori(600, 600, 330, 'sambar', 4);
    const rand = rng(77);
    for (let i = 0; i < 13; i++) { const a = rand() * 6.28, d = Math.sqrt(rand()) * 210; body += idli(600 + Math.cos(a) * d, 600 + Math.sin(a) * d, 62); }
    body += katori(210, 960, 100, 'coconut', 2) + katori(980, 960, 92, 'red', 3);
  } else {
    body += idli(430, 410, 150, podi) + idli(720, 380, 150, podi) + idli(560, 640, 150, podi);
    body += katori(300, 880, 112, 'coconut', 2) + katori(600, 960, 120, 'sambar', 1) + katori(900, 860, 100, 'red', 3);
    body += `<g transform="translate(870 560)">${leafShape(0, 0, 30, 36)}${leafShape(50, 40, -20, 30)}</g>`;
  }
  return svg(body);
}

function vadaScene({ sambar = false } = {}) {
  const defs = kClip('sambar', 1, 112) + kClip('coconut', 2, 108) + kClip('red', 3, 96) + kClip('sambar', 5, 240);
  let body = plate(600, 600, 540) + `<defs>${defs}</defs>`;
  if (sambar) {
    body += katori(600, 560, 330, 'sambar', 5);
    body += vada(500, 520, 130, 10) + vada(720, 600, 130, -20);
    body += katori(230, 960, 100, 'coconut', 2) + katori(970, 960, 90, 'red', 3);
  } else {
    body += vada(410, 440, 160, 10) + vada(740, 470, 160, -20) + vada(560, 700, 160, 40);
    body += katori(280, 900, 112, 'sambar', 1) + katori(590, 980, 104, 'coconut', 2) + katori(910, 900, 96, 'red', 3);
  }
  return svg(body);
}

function uttapamScene(mix) {
  const defs = kClip('sambar', 1, 100) + kClip('coconut', 2, 100) + kClip('red', 3, 90);
  return svg(`${plate(600, 600, 540)}<defs>${defs}</defs>${uttapam(600, 540, 390, mix, mix === 'tomato' ? 12 : mix === 'mixed' ? 13 : 4)}
  ${katori(250, 990, 100, 'sambar', 1)}${katori(600, 1050, 96, 'coconut', 2)}${katori(950, 990, 90, 'red', 3)}`);
}

function pongalScene(kind = 'pongal') {
  const rand = rng(21);
  const base = kind === 'pongal' ? ['#F6E7B0', '#EBD487', '#FFF5CF'] : ['#F4D77C', '#E8BD52', '#FBE9A8'];
  const defs = kClip('sambar', 1, 112) + kClip('coconut', 2, 108);
  let body = plate(600, 600, 540) + `<defs>${defs}</defs>`;
  body += `<g transform="translate(600 520)"><g filter="url(#soft)"><circle r="320" fill="url(#steel)"/></g><circle r="292" fill="url(#steelDark)"/><circle r="272" fill="url(#steelIn)"/></g>`;
  body += riceMound(600, 520, 250, base, 3, 0.04);
  if (kind === 'pongal') {
    body += `<circle cx="600" cy="470" r="78" fill="#F3C34A" opacity=".9"/><circle cx="600" cy="470" r="78" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3"/><ellipse cx="578" cy="448" rx="26" ry="10" fill="#fff" opacity=".6" transform="rotate(-25 578 448)"/>`;
    body += scatter(rand, 22, 220, (x, y) => `<circle cx="${f(600 + x)}" cy="${f(520 + y)}" r="${f(4 + rand() * 3)}" fill="#1b1b1b"/>`, 40);
    body += scatter(rand, 8, 200, (x, y) => cashew(f(600 + x), f(520 + y), f(rand() * 360)), 40);
  } else {
    body += scatter(rand, 30, 220, (x, y) => `<circle cx="${f(600 + x)}" cy="${f(520 + y)}" r="${f(5 + rand() * 4)}" fill="${['#D9532E', '#5F9E36', '#F0A12E'][Math.floor(rand() * 3)]}" opacity=".9"/>`, 30);
    body += scatter(rand, 10, 220, (x, y) => `<circle cx="${f(600 + x)}" cy="${f(520 + y)}" r="3.5" fill="#1b1b1b"/>`, 40);
  }
  body += leafShape(470, 420, 30, 34) + leafShape(740, 600, -40, 32) + leafShape(560, 650, 70, 30);
  body += katori(260, 960, 108, 'sambar', 1) + katori(600, 1030, 100, 'coconut', 2) + katori(940, 960, 96, 'red', 3).replace('k3red', 'k3red');
  return svg(body.replace('</defs>', kClip('red', 3, 96) + '</defs>'));
}

function riceScene(kind) {
  const rand = rng(31);
  let body = plate(600, 600, 540);
  if (kind === 'lemon' || kind === 'tamarind') {
    const base = kind === 'lemon' ? ['#F7E05B', '#EFD13E', '#FBEA84'] : ['#9A5A2B', '#7C4220', '#B27140'];
    // papad
    body += `<g transform="translate(870 300)"><g filter="url(#soft)"><circle r="110" fill="#F2E3BE"/></g>${scatter(rand, 30, 100, (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(2 + rand() * 4)}" fill="#C79A52" opacity=".7"/>`)}<circle r="110" fill="none" stroke="#C79A52" stroke-width="3" opacity=".6"/></g>`;
    body += riceMound(560, 570, 330, base, 14, 0.06);
    body += scatter(rand, 34, 310, (x, y) => peanut(f(560 + x), f(570 + y)));
    body += scatter(rand, 28, 300, (x, y) => `<circle cx="${f(560 + x)}" cy="${f(570 + y)}" r="4" fill="#161616"/>`);
    body += scatter(rand, 6, 300, (x, y) => `<ellipse cx="${f(560 + x)}" cy="${f(570 + y)}" rx="26" ry="7" fill="#B5261E" transform="rotate(${f(rand() * 180)} ${f(560 + x)} ${f(570 + y)})"/>`);
    body += scatter(rand, 8, 300, (x, y) => leafShape(f(560 + x), f(570 + y), f(rand() * 360), 24));
    if (kind === 'lemon') {
      body += `<g transform="translate(250 900)"><g filter="url(#soft)"><circle r="92" fill="#F5D93A"/></g><circle r="78" fill="#FBF0A0"/>${Array.from({ length: 8 }, (_, i) => `<path d="M0 0 L${f(Math.cos(i * 0.785) * 74)} ${f(Math.sin(i * 0.785) * 74)}" stroke="#F5D93A" stroke-width="3"/>`).join('')}<circle r="8" fill="#F5D93A"/></g>`;
    }
    body += `<defs>${kClip('pickle', 6, 80)}</defs>` + katori(930, 900, 80, 'pickle', 6);
  } else {
    // curd rice
    body += `<g transform="translate(600 560)"><g filter="url(#soft)"><circle r="360" fill="url(#steel)"/></g><circle r="330" fill="url(#steelDark)"/><circle r="310" fill="url(#steelIn)"/></g>`;
    body += riceMound(600, 560, 285, ['#FFFFFF', '#F6F2E7', '#FBF8EE'], 15, 0.03);
    body += `<ellipse cx="600" cy="560" rx="285" ry="285" fill="url(#curd)" opacity=".55"/>`;
    body += scatter(rand, 30, 250, (x, y) => `<circle cx="${f(600 + x)}" cy="${f(560 + y)}" r="${f(8 + rand() * 3)}" fill="#C41E3A"/><circle cx="${f(600 + x - 3)}" cy="${f(560 + y - 3)}" r="3" fill="#F7A0AE"/>`);
    body += scatter(rand, 36, 250, (x, y) => `<circle cx="${f(600 + x)}" cy="${f(560 + y)}" r="3.5" fill="#161616"/>`);
    body += scatter(rand, 8, 240, (x, y) => leafShape(f(600 + x), f(560 + y), f(rand() * 360), 24));
    body += scatter(rand, 6, 230, (x, y) => `<ellipse cx="${f(600 + x)}" cy="${f(560 + y)}" rx="14" ry="5" fill="#5F9E36" transform="rotate(${f(rand() * 180)} ${f(600 + x)} ${f(560 + y)})"/>`);
    body += `<defs>${kClip('pickle', 6, 80) + kClip('sambar', 7, 90)}</defs>` + katori(250, 940, 90, 'sambar', 7) + katori(950, 940, 84, 'pickle', 6);
  }
  return svg(body);
}

function thaliScene() {
  const rand = rng(41);
  const kinds = ['sambar', 'rasam', 'curd', 'curry', 'payasam', 'coconut'];
  let defs = '';
  let body = plate(600, 600, 560);
  const pos = [];
  for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i * Math.PI * 2) / 6 + 0.26; pos.push([600 + Math.cos(a) * 345, 600 + Math.sin(a) * 345]); }
  kinds.forEach((k, i) => (defs += kClip(k, 10 + i, 98)));
  body += `<defs>${defs}</defs>`;
  kinds.forEach((k, i) => (body += katori(f(pos[i][0]), f(pos[i][1]), 98, k, 10 + i)));
  body += riceMound(600, 600, 150, ['#FFFFFF', '#F5F0E3', '#FBF8EE'], 16, 0.05);
  body += `<circle cx="600" cy="600" r="30" fill="#E8B230" opacity=".85"/>`;
  body += `<g transform="translate(655 520)"><ellipse rx="70" ry="64" fill="#EBC27A" stroke="#B78535" stroke-width="3"/>${scatter(rand, 12, 55, (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="3" fill="#B78535" opacity=".7"/>`)}</g>`;
  body += `<g transform="translate(540 690)"><ellipse rx="50" ry="44" fill="#F3D79B" stroke="#B78535" stroke-width="3"/></g>`;
  return svg(body);
}

function comboScene(kind) {
  let defs = kClip('sambar', 1, 105) + kClip('coconut', 2, 100) + kClip('red', 3, 90);
  let body = plate(600, 600, 540);
  if (kind === 'tiffin') {
    defs += dosaClip(620, 210, 5);
    body += `<defs>${defs}</defs>`;
    body += dosa({ cx: 600, cy: 330, len: 620, thick: 210, rot: -6, seed: 5 });
    body += idli(380, 640, 100) + idli(570, 660, 100) + vada(790, 640, 105, 14);
    body += katori(280, 940, 105, 'sambar', 1) + katori(600, 990, 100, 'coconut', 2) + katori(920, 940, 90, 'red', 3);
  } else {
    defs += dosaClip(700, 230, 6);
    body += `<defs>${defs}</defs>`;
    body += dosa({ cx: 600, cy: 360, len: 700, thick: 230, rot: -8, potato: false, seed: 6 });
    body += idli(400, 680, 118) + idli(640, 680, 118);
    body += katori(230, 920, 105, 'sambar', 1) + katori(600, 1000, 100, 'coconut', 2) + katori(960, 920, 90, 'red', 3);
  }
  return svg(body);
}

function drinkScene(kind) {
  const rand = rng(51);
  let body = '';
  if (kind === 'buttermilk') {
    body += `<g transform="translate(600 600)"><g filter="url(#shadow)"><circle r="400" fill="url(#steel)"/></g><circle r="372" fill="url(#steelIn)"/><circle r="372" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>
    <circle r="300" fill="url(#steelDark)"/><circle r="276" fill="#F8F5EA"/><circle r="276" fill="url(#curd)"/>
    ${scatter(rand, 22, 240, (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(3 + rand() * 4)}" fill="#6a8f3a" opacity=".8"/>`)}
    ${scatter(rand, 28, 250, (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(6 + rand() * 6)}" fill="#fff" opacity=".7" stroke="#e6dfc9"/>`)}
    ${leafShape(60, -40, 40, 52, '#4E9A45')}${leafShape(-70, 50, -30, 46, '#3E8A3A')}</g>`;
  } else {
    const kindFill = kind === 'chai' ? 'chai' : 'coffee';
    body += `<g transform="translate(600 600)">
    <g filter="url(#shadow)"><circle r="470" fill="url(#steel)"/></g><circle r="440" fill="url(#steelIn)"/><circle r="440" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>
    <circle r="395" fill="none" stroke="#7d848b" stroke-opacity=".3" stroke-width="3"/>
    <g filter="url(#soft)"><circle r="270" fill="url(#steel)"/></g>
    <circle r="250" fill="url(#steelDark)"/><circle r="232" fill="url(#steelIn)"/>
    <circle r="205" fill="url(#${kindFill})"/>
    <circle r="205" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="5"/>
    ${scatter(rand, 70, 190, (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(2 + rand() * 6)}" fill="${kind === 'chai' ? '#F3D9AE' : '#D8B07C'}" opacity="${f(0.35 + rand() * 0.45)}" stroke="#fff" stroke-opacity=".3"/>`, 60)}
    <ellipse cx="-70" cy="-90" rx="90" ry="26" fill="#fff" opacity=".35" transform="rotate(-30)" filter="url(#blur8)"/>
    <path d="M 205 0 q 150 -20 190 40 q -10 40 -60 36" stroke="url(#steelDark)" stroke-width="22" fill="none" stroke-linecap="round" opacity="0"/>
    </g>
    ${kind === 'chai' ? `<g transform="translate(980 260)">${Array.from({ length: 5 }, (_, i) => `<ellipse rx="26" ry="9" fill="#2F4A22" transform="rotate(${i * 72})" cx="26"/>`).join('')}<circle r="8" fill="#6a3b14"/></g>` : `<g transform="translate(220 930)"><rect x="-44" y="-44" width="88" height="88" rx="14" fill="#F4EBD6" stroke="#cdbf9f" stroke-width="3" transform="rotate(12)"/><rect x="-44" y="-44" width="88" height="88" rx="14" fill="#fff" opacity=".4" transform="rotate(12) translate(-6 -6) scale(.8)"/></g>`}`;
  }
  return svg(body);
}

// Hero / scene compositions
function heroScene() {
  const defs = dosaClip(820, 270, 5) + kClip('sambar', 1, 112) + kClip('coconut', 2, 108) + kClip('red', 3, 96);
  let body = plate(600, 600, 570) + `<defs>${defs}</defs>`;
  body += dosa({ cx: 600, cy: 360, len: 820, thick: 270, rot: -10, seed: 5 });
  body += idli(360, 700, 112) + idli(560, 740, 112) + vada(780, 720, 118, 12);
  body += katori(260, 960, 110, 'sambar', 1) + katori(600, 1020, 104, 'coconut', 2) + katori(940, 960, 96, 'red', 3);
  return svg(body);
}

// close-up crunch: dosa filling most of canvas
function crunchScene() {
  const defs = dosaClip(1500, 520, 5);
  return svg(`<defs>${defs}</defs>${dosa({ cx: 560, cy: 620, len: 1500, thick: 520, rot: -18, seed: 5 })}`);
}
function comfortScene() {
  const defs = kClip('sambar', 1, 200) + kClip('coconut', 2, 170) + kClip('red', 3, 150);
  return svg(`<defs>${defs}</defs>${plate(600, 640, 600)}${idli(400, 420, 230)}${idli(780, 520, 230)}${katori(330, 900, 190, 'coconut', 2)}${katori(760, 940, 200, 'sambar', 1)}`);
}

// ---------- ambience ----------
function kolam() {
  const rand = rng(61);
  let o = `<rect width="1200" height="1200" fill="#4A2E24"/><rect width="1200" height="1200" filter="url(#grainY)" opacity=".5"/><g transform="translate(600 600)" fill="none" stroke="#FFF8EC" stroke-width="5" stroke-linecap="round" opacity=".95">`;
  for (let i = 0; i < 8; i++) o += `<ellipse cx="0" cy="-210" rx="70" ry="150" transform="rotate(${i * 45})"/>`;
  for (let i = 0; i < 8; i++) o += `<ellipse cx="0" cy="-370" rx="52" ry="110" transform="rotate(${i * 45 + 22.5})"/>`;
  o += `<circle r="80"/><circle r="40"/>`;
  for (let r = 1; r <= 3; r++) for (let i = 0; i < 8 * r; i++) { const a = (i / (8 * r)) * Math.PI * 2; o += `<circle cx="${f(Math.cos(a) * (430 + r * 55))}" cy="${f(Math.sin(a) * (430 + r * 55))}" r="${r === 1 ? 6 : 4}" fill="#FFF8EC" stroke="none"/>`; }
  o += `</g>`;
  void rand;
  return svg(o);
}
function bananaLeaf() {
  const rand = rng(71);
  let veins = '';
  for (let i = -14; i <= 14; i++) veins += `<path d="M ${i * 40} -480 L ${i * 40 + (i > 0 ? 80 : -80)} 560" stroke="#174d24" stroke-opacity=".28" stroke-width="2" transform="translate(0 0)"/>`;
  let o = `<rect width="1200" height="1200" fill="#E7B83F"/><rect width="1200" height="1200" filter="url(#grainY)" opacity=".4"/>
  <g transform="translate(600 600) rotate(-14)"><g filter="url(#shadow)"><path d="M -560 -330 Q 0 -480 560 -330 Q 640 0 560 330 Q 0 480 -560 330 Q -640 0 -560 -330Z" fill="url(#leaf)"/></g>
  <clipPath id="bl"><path d="M -560 -330 Q 0 -480 560 -330 Q 640 0 560 330 Q 0 480 -560 330 Q -640 0 -560 -330Z"/></clipPath><g clip-path="url(#bl)">${veins}</g><path d="M -600 0 L 600 0" stroke="#14461f" stroke-width="6" opacity=".5"/>
  ${riceMound(-60, 20, 190, ['#FFFFFF', '#F6F2E7', '#FBF8EE'], 18, 0.04)}`;
  const dots = [['#C5651E', -380, -150], ['#D9532E', 200, -230], ['#5F9E36', 330, -60], ['#E8B230', 280, 180], ['#8C2E14', -340, 170], ['#F4E3B2', 20, 240], ['#D6402A', 120, -250]];
  dots.forEach(([c, x, y]) => (o += `<g filter="url(#soft)"><ellipse cx="${x}" cy="${y}" rx="${f(60 + rand() * 25)}" ry="${f(46 + rand() * 20)}" fill="${c}"/></g>`));
  o += `</g>`;
  return svg(o);
}
function spices() {
  const rand = rng(81);
  const items = [['#E7B83F', 'turmeric'], ['#B5261E', 'chilli'], ['#2A2218', 'mustard'], ['#C79A52', 'coriander'], ['#8A5C2B', 'cumin'], ['#6D9A3B', 'cardamom']];
  let o = `<rect width="1200" height="1200" fill="#242320"/><rect width="1200" height="1200" filter="url(#grainY)" opacity=".4"/>`;
  items.forEach(([c], i) => {
    const cx = 260 + (i % 3) * 340, cy = 360 + Math.floor(i / 3) * 440;
    o += `<g filter="url(#shadow)"><circle cx="${cx}" cy="${cy}" r="150" fill="url(#steel)"/></g><circle cx="${cx}" cy="${cy}" r="132" fill="url(#steelDark)"/><circle cx="${cx}" cy="${cy}" r="116" fill="url(#steelIn)"/>`;
    o += `<circle cx="${cx}" cy="${cy}" r="104" fill="${c}"/>`;
    o += scatter(rand, 90, 100, (x, y) => `<circle cx="${f(cx + x)}" cy="${f(cy + y)}" r="${f(3 + rand() * 4)}" fill="${c}" stroke="#00000030" stroke-width="1.2" opacity="${f(0.7 + rand() * 0.3)}"/>`);
    o += `<ellipse cx="${cx - 34}" cy="${cy - 40}" rx="48" ry="14" fill="#fff" opacity=".22" transform="rotate(-30 ${cx} ${cy})" filter="url(#blur8)"/>`;
  });
  return svg(o);
}
function lamp() {
  let o = `<rect width="1200" height="1200" fill="#183F32"/><rect width="1200" height="1200" filter="url(#grainY)" opacity=".35"/>
  <circle cx="600" cy="520" r="520" fill="url(#glow)"/>
  <g transform="translate(600 640)">
   <g filter="url(#shadow)"><path d="M -300 0 Q -300 190 0 210 Q 300 190 300 0 Q 150 -40 0 -40 Q -150 -40 -300 0Z" fill="url(#gold)"/></g>
   <path d="M -300 0 Q -150 -40 0 -40 Q 150 -40 300 0 Q 150 28 0 28 Q -150 28 -300 0Z" fill="#F7CD62"/>
   <ellipse cy="-8" rx="250" ry="28" fill="#6b3a05" opacity=".75"/>
   <path d="M -230 90 Q 0 150 230 90" stroke="#fff" stroke-opacity=".4" stroke-width="10" fill="none" stroke-linecap="round" filter="url(#blur8)"/>
   <path d="M 0 -20 Q -70 -150 0 -330 Q 70 -150 0 -20Z" fill="#FFB938"/><path d="M 0 -30 Q -34 -120 0 -240 Q 34 -120 0 -30Z" fill="#FFF1B8"/>
  </g>
  ${Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2; return `<ellipse cx="${f(600 + Math.cos(a) * 420)}" cy="${f(930 + Math.sin(a) * 90)}" rx="46" ry="22" fill="${i % 2 ? '#E7B83F' : '#E07A1F'}" transform="rotate(${f((a * 180) / Math.PI)} ${f(600 + Math.cos(a) * 420)} ${f(930 + Math.sin(a) * 90)})" opacity=".95"/>`; }).join('')}`;
  return svg(o);
}

// ---------- write ----------
const files = {
  'dosa.svg': dosaScene({ variant: 'masala' }),
  'plain-dosa.svg': dosaScene({ variant: 'plain' }),
  'mysore-dosa.svg': dosaScene({ variant: 'mysore' }),
  'rava-dosa.svg': roundDosaScene(),
  'idli.svg': idliScene(),
  'mini-idli.svg': idliScene({ kind: 'mini' }),
  'podi-idli.svg': idliScene({ podi: true }),
  'vada.svg': vadaScene(),
  'sambar-vada.svg': vadaScene({ sambar: true }),
  'uttapam-onion.svg': uttapamScene('onion'),
  'uttapam-tomato.svg': uttapamScene('tomato'),
  'uttapam-mixed.svg': uttapamScene('mixed'),
  'pongal.svg': pongalScene('pongal'),
  'upma.svg': pongalScene('upma'),
  'lemon-rice.svg': riceScene('lemon'),
  'tamarind-rice.svg': riceScene('tamarind'),
  'curd-rice.svg': riceScene('curd'),
  'thali.svg': thaliScene(),
  'combo-tiffin.svg': comboScene('tiffin'),
  'combo-dosa-idli.svg': comboScene('dosa-idli'),
  'filter-coffee.svg': drinkScene('coffee'),
  'masala-chai.svg': drinkScene('chai'),
  'buttermilk.svg': drinkScene('buttermilk'),
  'scene-hero.svg': heroScene(),
  'scene-crunch.svg': crunchScene(),
  'scene-comfort.svg': comfortScene(),
  'amb-kolam.svg': kolam(),
  'amb-banana-leaf.svg': bananaLeaf(),
  'amb-spices.svg': spices(),
  'amb-lamp.svg': lamp(),
};
for (const [name, content] of Object.entries(files)) fs.writeFileSync(path.join(OUT, name), content);
console.log(`Wrote ${Object.keys(files).length} SVG files to ${OUT}`);
