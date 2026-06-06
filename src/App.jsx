import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import PremiumHeader from './components/PremiumHeader';
import Footer from './components/Footer';
import WelcomeSplash from './components/WelcomeSplash';

import Home from './pages/Home';
import AboutIMS from './pages/AboutIMS';
import AboutBareilly from './pages/AboutBareilly';
import AboutYROC2027 from './pages/AboutYROC2027';
import Invitation from './pages/Invitation';
import Registration from './pages/Registration';
import Events from './pages/Events';
import Accommodation from './pages/Accommodation';
import Abstract from './pages/Abstract';
import Committee from './pages/Committee';
import Contact from './pages/Contact';
import Media from './pages/Media';
import Gallery from './pages/Gallery';

const AdminApp = lazy(() => import('./admin/AppAdmin'));

// Conference logos array
const conferenceLogos = [
  { src: '/logos/yroc-logo.png', alt: '13th YROC Conference' },
  { src: '/logos/sms-logo.png', alt: 'Sri Ram Murti Smarak Trust' },
  { src: '/logos/uparoi-logo.png', alt: 'UPAROI - Association of Radiation Oncologists of India' },
  { src: '/logos/arol-logo.png', alt: 'AROL - Association of Radiation Oncologists' }
];

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutIMS />} />
        <Route path="/about/bareilly" element={<AboutBareilly />} />
        <Route path="/about/yroc" element={<AboutYROC2027 />} />
        <Route path="/invitation" element={<Invitation />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/events" element={<Events />} />
        <Route path="/accommodation" element={<Accommodation />} />
        <Route path="/abstract" element={<Abstract />} />
        <Route path="/committee" element={<Committee />} />
        <Route path="/media" element={<Media />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');
    localStorage.removeItem('theme');
  }, []);

  useEffect(() => {
    const onScroll = () => {
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<div className="admin-loading">Loading admin panel...</div>}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route
          path="/*"
          element={
            <>
              <WelcomeSplash />
              <Navbar logos={conferenceLogos} />
              <div className="page-content">
                <AnimatedRoutes />
              </div>
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
