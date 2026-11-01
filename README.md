# Ram Sharanam Cafe — Frontend Prototype

A frontend-only website prototype for **Ram Sharanam Cafe** (South Indian cuisine, near 22 Godam, Jaipur), built to be shown to the restaurant owner.

**Stack:** React 19 · TypeScript · Vite · React Router · GSAP (+ScrollTrigger) · Lucide icons · plain CSS (design tokens in `src/styles/global.css`) · fonts bundled locally (Fraunces + Bricolage Grotesque), so it works offline.

> ⚠️ **This is a demonstration.** There is no backend. Orders, payments, the rider and the map are simulated in the browser. Nothing is sent to the restaurant. Menu items, prices, copy and artwork are sample content (see [Placeholders](#placeholders-and-mock-features-to-replace)).

---

## Run it

Requires Node 20+.

```bash
npm install
npm run dev        # http://localhost:5173  (hot reload)
```

Production build, which is what you should present from:

```bash
npm run build      # type-checks, then builds to dist/
npm run preview    # http://localhost:4173  (also reachable on your LAN)
```

## Presenting it to the owner

1. Run `npm run build && npm run preview` and open `http://localhost:4173` in a fresh window. The opening sequence plays once per browser session, which is why a fresh window matters. To replay it later, use the **Replay intro** link in the footer.
2. Suggested walkthrough (about 5 minutes):
   - **Intro:** CRISP. → SOFT. → SOULFUL. → brand card (~9 s). Show **Skip intro** (also `Esc`).
   - **Home:** hero → story → signature dishes → “The art of the perfect crunch” → category tiles → location.
   - **Menu:** click a category tile, use search (`coffee`), press **Customise** on a dosa, and add a few items.
   - **Cart:** open the drawer from the bag icon, change quantities and watch the subtotal, ₹40 demo delivery fee and total update. The cart survives a refresh.
   - **Checkout:** press *Place Demo Order* empty to show validation, fill it in, then place the order.
   - **Confirmation → Tracking:** use the **Demo control** panel (Previous / Auto-play / Next / jump to stage 1-6) to walk through all delivery stages. The rider marker moves along the route during “Rider on the way”.
   - **Gallery** (lightbox, arrow keys, `Esc`), **Visit Us** (hours, directions, demo contact form), and the mobile layout (resize the window under 860 px).
3. Tell the owner up front that the pictures are illustrations and the menu/prices are samples.
4. For a phone demo on the same Wi-Fi, `npm run preview` already listens on the LAN. Use the “Network” address it prints.

## Routes

| Route | Page |
|---|---|
| `/` | Home (intro, hero, story, dishes, editorial sections, category tiles, location) |
| `/menu` and `/menu?cat=idlis` | Full menu with category filter + search + customiser |
| `/story` | Our Story |
| `/gallery` | Gallery with lightbox |
| `/visit` | Visit Us / contact form |
| `/cart` → `/checkout` → `/order/:id` | Cart, checkout, order confirmation |
| `/track` and `/track/:id` | Simulated tracking (`/track` shows the last demo order, or a sample order) |
| `/privacy`, `/terms` | Short placeholder legal pages |

## Project structure

```
src/
  data/        site.ts (name, address, hours, delivery fee) · menu.ts (all dishes & categories)
               orders.ts (stages, mock rider, ETA, sample order) · content.ts (editable copy, gallery)
  context/     CartContext (localStorage) · OrderContext · IntroContext
  components/  SiteHeader · IntroSequence · HeroSection · BrandStory · FeaturedDishes · FoodStorySection
               MenuPreview · MenuCategoryNavigation · MenuGrid · MenuItemCard · AddButton (customiser)
               CartDrawer · CartParts · MockTrackingMap · StatusTimeline · VisitSection · GalleryGrid · SiteFooter …
  pages/       Home · MenuPage · CartPage · CheckoutPage · ConfirmationPage · TrackingPage · StoryPage
               GalleryPage · VisitPage · LegalPage · NotFound
  hooks/       useMotion (GSAP setup, reduced-motion, scroll reveals, dialog focus trap)
  styles/      global.css (tokens + all styles)
public/art/    generated illustrations (.svg source + .webp used by the site)
scripts/       generate-art.mjs (builds the SVG art) · rasterize-art.mjs (optional SVG → PNG/WebP)
qa/            browser test scripts (see Testing)
```

Menu content lives **only** in `src/data/menu.ts`; components never hard-code dishes. Each item has an id, name, category, description, image, price, availability (+ optional note), optional dietary labels and optional customisation groups.

## Editing common things

- **Name, address, phone, e-mail, hours, directions link, delivery fee, delivery window:** `src/data/site.ts`
- **Menu items, prices, availability, options:** `src/data/menu.ts`
- **Story / gallery captions / editorial copy:** `src/data/content.ts`
- **Replace artwork with real photography:** drop a file into `public/art/` using the same file name, or change the `image` path in `menu.ts` / `content.ts`. Use roughly square crops. Dish images with transparent backgrounds (`.webp`) sit on a tinted tile; photos with backgrounds work too.
- **Tracking timings / ETA / sample order:** `src/data/orders.ts`
- **Colours:** CSS variables at the top of `src/styles/global.css` (Coconut Cream `#FFF8EC`, Deep Leaf Green `#183F32`, Turmeric `#E7B83F`, Chilli Red `#C84B38`, Filter Coffee Brown `#4A2E24`, Warm Charcoal `#242320`).

## Accessibility and motion

Semantic landmarks, skip link, visible focus rings, labelled form fields with an error summary, native `<dialog>` for cart/customiser/lightbox/mobile nav (focus is trapped and `Esc` closes them), keyboard-operable lightbox (← → Esc), and `aria-live` status updates.

With `prefers-reduced-motion: reduce` the intro is not shown, scroll reveals are disabled, and tracking does not auto-advance (stages are still clickable). If GSAP fails, the intro closes itself within 1.5 s and the static site is shown. The `<noscript>` message covers JavaScript-off.

## Placeholders and mock features to replace

**Needs real data from the owner**

| Item | Where | Current state |
|---|---|---|
| Menu, prices, availability, descriptions | `src/data/menu.ts` | Suggested South Indian dishes with sample prices. **Not the restaurant’s actual menu.** Two items are marked unavailable only to demo that state. |
| Dietary labels | `menu.ts` `dietary` | Left **empty** on purpose. Add only verified labels. |
| Phone, e-mail | `site.ts` | `[… to be added]` |
| Opening hours | `site.ts` | “To be confirmed” |
| Exact address / map location | `site.ts` | Only “Near 22 Godam, Jaipur, Rajasthan, India”. The directions button is a Google Maps *search* link; replace it with the verified place URL. The map block is a placeholder. |
| Social links | `site.ts` `socials` | None supplied; footer says “to be added”. |
| Story, history, founding, awards | `content.ts`, `/story` | Placeholder copy only; no history is claimed. |
| Photography | `public/art/` | **Original generated illustrations**, not photographs (no stock photos could be downloaded while building). Gallery “ambience” tiles are illustrated stand-ins. Replace with real photos of the food and the space. |
| Privacy & Terms | `LegalPage.tsx` | Short placeholders, not legal text. Have them reviewed. |

**Simulated features (need a backend / third parties to be real)**

| Feature | Simulation | To make real |
|---|---|---|
| Orders | Order ID (`RSC-DEMO-#####`) created and stored in this browser’s `localStorage`; the restaurant receives nothing | Orders API + restaurant dashboard/notifications |
| Payments | “Online payment” and “Cash on delivery” are radio buttons only. No card/UPI fields exist | Payment gateway (e.g. Razorpay) |
| Delivery fee, ETA | Flat ₹40, fixed per-stage ETAs | Distance/zone pricing and real ETA service |
| Tracking | Six scripted stages, scripted rider, SVG “map” and route, driven by timers or the Demo control. No device GPS is used | Map provider SDK + live rider location feed. `MockTrackingMap` takes `stage` and `routeProgress` props so it can be swapped. |
| Rider | “Sample Rider”, no phone number | Courier/dispatch integration |
| Contact form | Validates and shows a “demo” confirmation; sends nothing | Form/e-mail service |

All simulated screens carry visible “demo / simulated” labels.

## Testing

`npm run build` type-checks and builds. Browser tests (Playwright + Chromium; not a project dependency):

```bash
npm install --no-save playwright && npx playwright install chromium
npm run preview &            # serves http://127.0.0.1:4173
node qa/audit.cjs            # all routes at 1440 px and 390 px: console errors, broken images, horizontal overflow
node qa/e2e.cjs              # intro, reduced motion, navigation, menu, cart maths, checkout, order, tracking, contact, gallery, mobile nav
```

Screenshots go to `$SHOTS` (default: a temp folder).

**Last run (against the production build):** `qa/e2e.cjs` 87 checks passed, 0 failed; `qa/audit.cjs` found no console errors, broken images or horizontal overflow on any of the 11 routes at 1440 px and 390 px. Not covered: Safari/Firefox, real touch devices, screen-reader testing and automated contrast auditing. Please check those on real devices before launch.
