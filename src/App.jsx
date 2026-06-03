import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import AboutIMS from './pages/AboutIMS';
import AboutYROC2027 from './pages/AboutYROC2027';

import Invitation from './pages/Invitation';
import Registration from './pages/Registration';
import Abstract from './pages/Abstract';
import Committee from './pages/Committee';
import Contact from './pages/Contact';
import Media from './pages/Media';
import Gallery from './pages/Gallery';

import WelcomeSplash from './components/WelcomeSplash';
import Chatbot from './components/Chatbot';
const AdminApp = lazy(() => import('./admin/AppAdmin'));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutIMS />} />
        <Route path="/about/yroc" element={<AboutYROC2027 />} />

        <Route path="/invitation" element={<Invitation />} />
        <Route path="/registration" element={<Registration />} />
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
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('yroc_intro_played');
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
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
    if (showSplash) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSplash]);

  const handleSplashComplete = () => {
    sessionStorage.setItem('yroc_intro_played', 'true');
    setShowSplash(false);
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
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Navbar />
            <div className="page-content">
              <Routes>
                <Route path="/admin/*" element={
                  <Suspense fallback={<div className="admin-loading">Loading admin panel...</div>}>
                    <AdminApp />
                  </Suspense>
                } />
                <Route path="/*" element={<AnimatedRoutes />} />
              </Routes>
            </div>
            <Footer />
            <Chatbot />
          </motion.div>
        )}
      </AnimatePresence>
    </Router>
  );
}

export default App;
