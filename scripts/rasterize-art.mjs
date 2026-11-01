// Optional: renders public/art/*.svg to transparent PNG (then convert to .webp).
// Needs `npm i -D playwright`. The generated .webp files are already committed in public/art.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
const dir = path.resolve('public/art');
const size = 1000;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: size, height: size } });
for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.svg'))) {
  await p.goto("file://" + path.join(dir, f));
  await p.screenshot({ path: path.join(dir, f.replace('.svg', '.png')), omitBackground: true });
}
await b.close();
