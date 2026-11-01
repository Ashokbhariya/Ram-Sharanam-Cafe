const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:4173';
const SH = (process.env.SHOTS || require('os').tmpdir() + '/rsc-shots') + '/'; require('fs').mkdirSync(SH, { recursive: true });
let pass = 0, fail = 0;
const ok = (c, m, extra) => { if (c) { pass++; console.log('  PASS', m); } else { fail++; console.log('  FAIL', m, extra ?? ''); } };
const num = (s) => Number((s || '').replace(/[^\d.]/g, ''));

(async () => {
  const browser = await chromium.launch();
  const errs = [];
  const mk = async (opts = {}) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push('pageerror ' + e.message));
    return { ctx, page };
  };

  // ---------- 1. INTRO ----------
  console.log('INTRO');
  {
    const { ctx, page } = await mk();
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    ok(await page.locator('.intro').isVisible(), 'intro shows on first visit');
    ok(await page.getByRole('button', { name: /skip intro/i }).isVisible(), 'Skip Intro button visible');
    await page.waitForTimeout(1200); await page.screenshot({ path: SH + 'intro1.png' });
    await page.waitForTimeout(2800); await page.screenshot({ path: SH + 'intro2.png' });
    await page.waitForTimeout(2800); await page.screenshot({ path: SH + 'intro3.png' });
    await page.waitForTimeout(2400);
    ok(await page.locator('.intro-final h2').isVisible(), 'final brand card appears (~9s)');
    await page.screenshot({ path: SH + 'intro4.png' });
    ok(await page.locator('.intro').getByRole('link', { name: /explore the menu/i }).isVisible(), 'EXPLORE THE MENU CTA visible');
    ok(await page.locator('.intro').getByRole('link', { name: /^visit us$/i }).isVisible(), 'VISIT US CTA visible');
    await page.locator('.intro').getByRole('link', { name: /explore the menu/i }).click();
    await page.waitForTimeout(1000);
    ok(page.url().endsWith('/menu'), 'intro CTA navigates to /menu', page.url());
    ok((await page.locator('.intro').count()) === 0, 'intro removed after CTA');
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    ok((await page.locator('.intro').count()) === 0, 'intro not repeated in same session');
    await ctx.close();
  }
  {
    const { ctx, page } = await mk();
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /skip intro/i }).click();
    await page.waitForTimeout(900);
    ok((await page.locator('.intro').count()) === 0, 'Skip Intro dismisses overlay');
    ok(await page.getByRole('heading', { level: 1 }).first().isVisible(), 'hero h1 visible after skip');
    await page.evaluate(() => window.scrollTo(0, 600)); await page.waitForTimeout(200);
    ok((await page.evaluate(() => window.scrollY)) > 300, 'page scrolls after intro (no scroll lock)');
    await ctx.close();
  }
  {
    const { ctx, page } = await mk();
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.keyboard.press('Escape'); await page.waitForTimeout(900);
    ok((await page.locator('.intro').count()) === 0, 'Escape dismisses intro');
    await ctx.close();
  }

  // ---------- 2. REDUCED MOTION ----------
  console.log('REDUCED MOTION');
  {
    const { ctx, page } = await mk({ reducedMotion: 'reduce' });
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    ok((await page.locator('.intro').count()) === 0, 'no intro with prefers-reduced-motion');
    ok(await page.getByRole('heading', { level: 1 }).first().isVisible(), 'hero visible immediately');
    // content must be visible without scroll animations
    await page.evaluate(() => window.scrollTo(0, 2500)); await page.waitForTimeout(300);
    const hiddenSections = await page.evaluate(() => [...document.querySelectorAll('main h2')].filter((h) => { const s = getComputedStyle(h); return s.opacity === '0' || s.visibility === 'hidden'; }).length);
    ok(hiddenSections === 0, 'no headings stuck hidden under reduced motion', hiddenSections);
    await page.goto(BASE + '/track', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    ok((await page.getByTestId('status').textContent()).match(/placed/i), 'tracking does not auto-advance under reduced motion', await page.getByTestId('status').textContent());
    await ctx.close();
  }

  // ---------- 3-6. MAIN FLOW (desktop) ----------
  const { ctx, page } = await mk();
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('rsc-intro-seen')) sessionStorage.setItem('rsc-intro-seen', '1'); } catch {} });
  console.log('NAVIGATION');
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const navLinks = await page.locator('nav[aria-label="Primary"] a').evaluateAll((as) => as.map((a) => [a.textContent.trim(), a.getAttribute('href')]));
  console.log('   nav:', JSON.stringify(navLinks));
  for (const [label, href] of navLinks) {
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.locator('nav[aria-label="Primary"]').getByRole('link', { name: label, exact: true }).click();
    await page.waitForTimeout(700);
    const nf = await page.getByText(/page not found/i).count();
    ok(nf === 0, `nav "${label}" -> ${href} resolves`, page.url());
    if (href.includes('#')) {
      const id = href.split('#')[1];
      const y = await page.evaluate((id) => document.getElementById(id)?.getBoundingClientRect().top, id);
      ok(y !== undefined && Math.abs(y) < 300, `hash target #${id} scrolled into view`, y);
    }
  }
  // footer links
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const footHrefs = await page.locator('footer a[href^="/"]').evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute('href')))]);
  console.log('   footer internal:', footHrefs.join(' '));
  for (const h of footHrefs) {
    const r = await page.goto(BASE + h.split('#')[0], { waitUntil: 'networkidle' });
    ok((await page.getByText(/page not found/i).count()) === 0, `footer link ${h} resolves`);
  }
  // home category tiles
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const tiles = await page.locator('a[href^="/menu?cat="]').evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute('href')))]);
  ok(tiles.length >= 8, `home has ${tiles.length} category links to /menu?cat=`);
  await page.locator('a[href^="/menu?cat="]').first().evaluate((e) => e.scrollIntoView({ block: 'center' })); await page.waitForTimeout(1200);
  ok(await page.locator('a[href^="/menu?cat="]').first().isVisible(), 'category tile becomes visible on scroll');
  await page.locator('a[href^="/menu?cat="]').first().click(); await page.waitForTimeout(800);
  ok(/menu\?cat=/.test(page.url()), 'category tile navigates', page.url());

  console.log('MENU');
  await page.goto(BASE + '/menu', { waitUntil: 'networkidle' });
  const total = await page.locator('article.dish').count();
  ok(total >= 20, `menu has ${total} dishes`);
  await page.locator('.cat-nav button', { hasText: 'Idlis' }).click(); await page.waitForTimeout(400);
  const idliCards = await page.locator('article.dish h3').allTextContents();
  ok(idliCards.length > 0 && idliCards.length < total && idliCards.every((n) => /idli|sambar/i.test(n)), `Idlis filter -> ${idliCards.join(', ')}`);
  await page.locator('.cat-nav button', { hasText: /^All/ }).click();
  await page.locator('#menu-search').fill('coffee'); await page.waitForTimeout(300);
  const cof = await page.locator('article.dish h3').allTextContents();
  ok(cof.length > 0 && cof.every((n) => true) && cof.some((n) => /coffee/i.test(n)), `search "coffee" -> ${cof.join(', ')}`);
  await page.locator('#menu-search').fill('zzzqqq'); await page.waitForTimeout(300);
  ok((await page.locator('article.dish').count()) === 0, 'no-match search shows zero dishes');
  await page.screenshot({ path: SH + 'menu_empty.png' });
  await page.getByRole('button', { name: /clear search/i }).click();
  ok((await page.locator('article.dish').count()) === total, 'clear search restores all');
  const unavail = await page.locator('.dish--off').count();
  console.log('   unavailable items:', unavail);
  await page.goto(BASE + '/menu?cat=idlis', { waitUntil: 'networkidle' }); await page.waitForTimeout(500);
  ok((await page.locator('.cat-nav button.is-active').textContent()).startsWith('Idlis'), 'deep link ?cat=idlis activates category');

  console.log('CART');
  await page.goto(BASE + '/menu', { waitUntil: 'networkidle' });
  // simple add
  const simple = page.locator('article.dish').filter({ has: page.locator('button[aria-label^="Add "]') }).first();
  const simpleName = await simple.locator('h3').textContent();
  const simplePrice = num(await simple.locator('.dish__price').textContent());
  await simple.locator('button[aria-label^="Add "]').click();
  ok(await page.getByRole('button', { name: /open cart, 1 item/i }).count() === 1, `added "${simpleName}" -> header count 1`);
  // customise add (with an option that costs extra if any)
  const cust = page.locator('article.dish').filter({ has: page.locator('button[aria-label^="Customise"]') }).first();
  const custName = await cust.locator('h3').textContent();
  const custPrice = num(await cust.locator('.dish__price').textContent());
  await cust.locator('button[aria-label^="Customise"]').click();
  await page.waitForTimeout(300);
  const dlg = page.locator('dialog[open].modal');
  ok(await dlg.isVisible(), 'customiser dialog opens');
  await page.screenshot({ path: SH + 'customiser.png' });
  const checks = dlg.locator('input[type=checkbox]');
  let extra = 0;
  if (await checks.count()) {
    const row = dlg.locator('label.opt__row').filter({ has: page.locator('input[type=checkbox]') }).first();
    const priceTxt = await row.locator('span').last().textContent();
    await checks.first().check(); extra = num(priceTxt);
  }
  const addTxt = await dlg.getByRole('button', { name: /add to cart/i }).textContent();
  ok(num(addTxt) === custPrice + extra, `customiser total ${addTxt.trim()} == ${custPrice}+${extra}`);
  await dlg.getByRole('button', { name: /add to cart/i }).click(); await page.waitForTimeout(300);
  ok(await page.getByRole('button', { name: /open cart, 2 items/i }).count() === 1, 'cart count 2 after customised add');
  await page.getByRole('button', { name: /open cart/i }).click(); await page.waitForTimeout(400);
  const drawer = page.locator('dialog[open].drawer');
  ok(await drawer.isVisible(), 'cart drawer opens');
  await page.screenshot({ path: SH + 'drawer.png' });
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  ok(!(await drawer.isVisible().catch(() => false)), 'Escape closes drawer');
  // persistence
  await page.reload({ waitUntil: 'networkidle' });
  ok(await page.getByRole('button', { name: /open cart, 2 items/i }).count() === 1, 'cart persists across reload (localStorage)');
  await page.goto(BASE + '/cart', { waitUntil: 'networkidle' });
  const readTotals = async () => ({
    sub: num(await page.getByTestId('subtotal').first().textContent()),
    fee: num(await page.getByTestId('delivery').first().textContent()),
    tot: num(await page.getByTestId('total').first().textContent()),
  });
  let t = await readTotals();
  console.log('   totals', JSON.stringify(t));
  ok(t.sub === simplePrice + custPrice + extra, `subtotal ${t.sub} == ${simplePrice + custPrice + extra}`);
  ok(t.fee === 40, 'delivery fee 40 (configured)');
  ok(t.tot === t.sub + t.fee, `total ${t.tot} == subtotal+fee`);
  await page.screenshot({ path: SH + 'cart.png', fullPage: true });
  // qty increase
  const firstLine = page.locator('.cart-line').first();
  await firstLine.getByRole('button', { name: /increase/i }).click(); await page.waitForTimeout(200);
  t = await readTotals();
  ok(t.sub === simplePrice * 2 + custPrice + extra, `after qty+1 subtotal ${t.sub}`);
  ok(t.tot === t.sub + t.fee, 'total updates with qty');
  await firstLine.getByRole('button', { name: /decrease/i }).click(); await page.waitForTimeout(200);
  t = await readTotals();
  ok(t.sub === simplePrice + custPrice + extra, 'qty-1 restores subtotal');
  // remove one
  await page.getByRole('button', { name: new RegExp('Remove ' + simpleName.trim(), 'i') }).first().click(); await page.waitForTimeout(200);
  t = await readTotals();
  ok(t.sub === custPrice + extra, `remove line -> subtotal ${t.sub}`);

  console.log('CHECKOUT');
  await page.goto(BASE + '/checkout', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /place demo order/i }).click(); await page.waitForTimeout(300);
  ok(await page.locator('.error-summary').isVisible(), 'empty submit shows error summary');
  const errCount = await page.locator('.field .error').count();
  ok(errCount === 3, `3 inline errors (name, mobile, address): ${errCount}`);
  await page.screenshot({ path: SH + 'checkout_err.png', fullPage: true });
  await page.fill('#f-name', 'Asha Verma'); await page.fill('#f-mobile', '12345'); await page.fill('#f-address', 'short');
  await page.getByRole('button', { name: /place demo order/i }).click(); await page.waitForTimeout(200);
  ok(await page.locator('#f-mobile-e').isVisible(), 'invalid mobile rejected');
  ok(await page.locator('#f-address-e').isVisible(), 'short address rejected');
  ok((await page.locator('#f-name-e').count()) === 0, 'valid name has no error');
  await page.fill('#f-mobile', '98765 43210'); await page.fill('#f-address', '12 Test Street, C-Scheme, Jaipur'); await page.fill('#f-landmark', 'Near 22 Godam');
  await page.locator('.pay__opt', { hasText: /online payment/i }).click();
  ok(await page.locator('.pay__opt.is-on', { hasText: /online/i }).count() === 1, 'online payment selectable');
  ok((await page.locator('input[type=password], input[autocomplete*="cc-"]').count()) === 0, 'no card fields collected');
  await page.getByRole('button', { name: /place demo order/i }).click();
  await page.waitForURL(/\/order\/RSC/i, { timeout: 5000 }).catch(() => {});
  ok(/\/order\//.test(page.url()), 'redirects to confirmation', page.url());
  const orderId = page.url().split('/order/')[1];
  await page.waitForTimeout(500);
  const body = await page.locator('main').innerText();
  ok(body.includes(orderId), 'confirmation shows order id ' + orderId);
  ok(/demo/i.test(body), 'confirmation labelled as demo');
  ok(/35.45/.test(body), 'confirmation shows estimated window');
  await page.screenshot({ path: SH + 'confirm.png', fullPage: true });
  ok(await page.getByRole('button', { name: /open cart, 0 items/i }).count() === 1, 'cart cleared after order');

  console.log('TRACKING');
  await page.getByRole('link', { name: /track/i }).first().click(); await page.waitForTimeout(600);
  ok(/\/track\//.test(page.url()), 'tracking link navigates', page.url());
  ok((await page.locator('main').innerText()).includes(orderId), 'tracking shows order id');
  ok(/12 Test Street/.test(await page.locator('main').innerText()), 'tracking shows delivery address');
  await page.getByRole('button', { name: /pause/i }).click().catch(() => {});
  const labels = [];
  for (let i = 1; i <= 6; i++) {
    await page.getByRole('button', { name: new RegExp('^Stage ' + i + ':') }).click(); await page.waitForTimeout(250);
    labels.push((await page.getByTestId('status').textContent()).trim() + ' | ' + (await page.getByTestId('eta').textContent()).trim());
    if (i === 5) { await page.waitForTimeout(1200); await page.screenshot({ path: SH + 'track5.png', fullPage: false }); }
  }
  console.log('   stages:', labels.join('  ->  '));
  ok(labels.length === 6 && new Set(labels).size === 6, 'six distinct stages');
  ok(/delivered/i.test(labels[5]), 'stage 6 = delivered');
  await page.screenshot({ path: SH + 'track6.png', fullPage: true });
  await page.getByRole('button', { name: /reset/i }).click();
  ok(/placed/i.test(await page.getByTestId('status').textContent()), 'Reset returns to stage 1');
  // autoplay advance
  await page.getByRole('button', { name: /auto-play/i }).click();
  await page.waitForTimeout(5500);
  const st = await page.getByTestId('status').textContent();
  ok(!/placed/i.test(st), 'auto-play advances stage: ' + st);
  await page.goto(BASE + '/track/RSC-NOPE', { waitUntil: 'networkidle' });
  ok(/not\s+found/i.test((await page.locator('main').innerText()).replace(/\s+/g,' ')), 'unknown order id -> friendly not-found'); await page.screenshot({ path: SH + 'track_nf.png' });

  console.log('CONTACT');
  await page.goto(BASE + '/visit', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /send demo message/i }).click(); await page.waitForTimeout(200);
  ok((await page.locator('.error, [role=alert]').count()) > 0, 'empty contact form shows errors');
  const inputs = page.locator('form[aria-label^="Contact"] input, form[aria-label^="Contact"] textarea');
  await inputs.nth(0).fill('Test'); await inputs.nth(1).fill('test@example.com'); await inputs.nth(2).fill('Hello there, a demo message.');
  await page.getByRole('button', { name: /send demo message/i }).click(); await page.waitForTimeout(300);
  ok(await page.locator('.panel.success').isVisible(), 'contact success state shown');
  ok(/demo/i.test(await page.locator('.panel.success').innerText()), 'success clearly says demo');
  ok((await page.locator('a[href*="google.com/maps"]').count()) > 0, 'directions CTA present');

  console.log('GALLERY');
  await page.goto(BASE + '/gallery', { waitUntil: 'networkidle' });
  await page.locator('button[aria-label^="Enlarge"]').first().click(); await page.waitForTimeout(400);
  const lb = page.locator('dialog[open].lightbox');
  ok(await lb.isVisible(), 'lightbox opens');
  const cap1 = await lb.innerText();
  await page.keyboard.press('ArrowRight'); await page.waitForTimeout(300);
  ok((await lb.innerText()) !== cap1, 'ArrowRight advances lightbox');
  await page.screenshot({ path: SH + 'lightbox.png' });
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  ok(!(await lb.isVisible().catch(() => false)), 'Escape closes lightbox');
  await ctx.close();

  // ---------- MOBILE ----------
  console.log('MOBILE');
  {
    const { ctx, page } = await mk({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    await page.addInitScript(() => { try { sessionStorage.setItem('rsc-intro-seen', '1'); } catch {} });
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /open menu/i }).click(); await page.waitForTimeout(400);
    ok(await page.locator('dialog[open].mobile-nav').isVisible(), 'mobile nav opens');
    await page.screenshot({ path: SH + 'mobnav.png' });
    await page.locator('dialog[open].mobile-nav').getByRole('link', { name: /^menu$/i }).click(); await page.waitForTimeout(600);
    ok(page.url().endsWith('/menu'), 'mobile nav navigates', page.url());
    ok(!(await page.locator('dialog[open].mobile-nav').isVisible().catch(() => false)), 'mobile nav closes after navigation');
    const tgt = await page.evaluate(() => [...document.querySelectorAll('button,a')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.height < 36 || r.width < 36) && !e.closest('.sr-only'); }).slice(0, 8).map((e) => (e.getAttribute('aria-label') || e.textContent).trim().slice(0, 30) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height)));
    console.log('   small tap targets on /menu:', tgt.length ? tgt.join(' | ') : 'none');
    await page.screenshot({ path: SH + 'mobmenu.png' });
    await ctx.close();
  }

  console.log('\nCONSOLE ERRORS:', errs.length ? errs : 'none');
  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  await browser.close();
})();
