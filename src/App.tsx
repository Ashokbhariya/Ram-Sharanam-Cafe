import { useCallback, useMemo, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { IntroContext } from './context/IntroContext';
import { prefersReducedMotion } from './hooks/useMotion';
import { IntroSequence } from './components/IntroSequence';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { CartDrawer } from './components/CartDrawer';
import { Toast } from './components/Toast';
import { ScrollManager } from './components/ScrollManager';
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import StoryPage from './pages/StoryPage';
import GalleryPage from './pages/GalleryPage';
import VisitPage from './pages/VisitPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import TrackingPage from './pages/TrackingPage';
import LegalPage from './pages/LegalPage';
import NotFound from './pages/NotFound';

const SEEN = 'rsc-intro-seen';
const seen = () => { try { return sessionStorage.getItem(SEEN) === '1'; } catch { return false; } };

export default function App() {
  const { pathname } = useLocation();
  const [introOn, setIntroOn] = useState(() => pathname === '/' && !seen() && !prefersReducedMotion());
  const done = useCallback(() => { try { sessionStorage.setItem(SEEN, '1'); } catch { /* ignore */ } setIntroOn(false); }, []);
  const replay = useCallback(() => { if (prefersReducedMotion()) return; window.scrollTo(0, 0); setIntroOn(true); }, []);
  const ctx = useMemo(() => ({ active: introOn, replay }), [introOn, replay]);

  return (
    <IntroContext.Provider value={ctx}>
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollManager />
      <SiteHeader />
      <main id="main" tabIndex={-1} key={pathname} className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/visit" element={<VisitPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:id" element={<ConfirmationPage />} />
          <Route path="/track" element={<TrackingPage />} />
          <Route path="/track/:id" element={<TrackingPage />} />
          <Route path="/privacy" element={<LegalPage kind="privacy" />} />
          <Route path="/terms" element={<LegalPage kind="terms" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <SiteFooter />
      <CartDrawer />
      <Toast />
      {introOn && <IntroSequence onDone={done} />}
    </IntroContext.Provider>
  );
}
