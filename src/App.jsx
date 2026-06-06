import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

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

import WelcomeSplash from './components/WelcomeSplash';
import Chatbot from './components/Chatbot';
import MascotTransition from './components/MascotTransition';
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
  const [showSplash, setShowSplash] = React.useState(() => {
    return !sessionStorage.getItem('yroc_intro_played');
  });
  const [isTransitioning, setIsTransitioning] = React.useState(false);

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

  useEffect(() => {
    if (showSplash || isTransitioning) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSplash, isTransitioning]);

  const handleSplashComplete = () => {
    sessionStorage.setItem('yroc_intro_played', 'true');
    setShowSplash(false);
    setIsTransitioning(true);
  };

  return (
    <Router>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <WelcomeSplash onComplete={handleSplashComplete} key="splash" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <PremiumHeader />
            <Navbar logos={conferenceLogos} />
            {!isTransitioning && <Chatbot />}
            <div className="page-content">
              <Routes>
                <Route
                  path="/admin/*"
                  element={
                    <Suspense fallback={<div className="admin-loading">Loading admin panel...</div>}>
                      <AdminApp />
                    </Suspense>
                  }
                />
                <Route path="/*" element={<AnimatedRoutes />} />
              </Routes>
            </div>
            <Footer />
            {isTransitioning && (
              <MascotTransition
                onFinish={() => {
                  setIsTransitioning(false);
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Router>
  );
}

export default App;

