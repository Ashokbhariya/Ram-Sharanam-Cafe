const { chromium } = require('playwright');
const OUT = process.env.SHOTS || require('os').tmpdir() + '/rsc-shots';
require('fs').mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || 'http://127.0.0.1:4173';
const routes = ['/', '/menu', '/story', '/gallery', '/visit', '/cart', '/checkout', '/track', '/privacy', '/terms', '/nope'];
const sizes = [{ n: 'desk', w: 1440, h: 900 }, { n: 'mob', w: 390, h: 844 }];

(async () => {
  const browser = await chromium.launch();
  for (const s of sizes) {
    const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h } });
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
    page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
    page.on('requestfailed', (r) => errs.push('reqfail: ' + r.url()));
    await page.addInitScript(() => { try { sessionStorage.setItem('rsc-intro-seen', '1'); } catch {} });
    for (const r of routes) {
      await page.goto(BASE + r, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      // scroll through to trigger lazy/scroll animations
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += 500) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(60); }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      const info = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
        h1: [...document.querySelectorAll('h1')].map((e) => e.textContent.trim().slice(0, 50)),
        height: document.documentElement.scrollHeight,
      }));
      console.log(s.n, r, JSON.stringify(info));
      await page.screenshot({ path: `${OUT}/${s.n}${r.replace(/\//g, '_') || '_home'}.png`, fullPage: true });
    }
    console.log(s.n, 'ERRORS', errs.length ? errs : 'none');
    await ctx.close();
  }
  await browser.close();
})();
