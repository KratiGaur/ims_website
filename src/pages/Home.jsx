import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  out: { opacity: 0, y: -20, transition: { duration: 0.5, ease: 'easeIn' } }
};

const textFade = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};
const sectionReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' } }
};

const vibeTags = ['Live Panels', 'Future Tech', 'Global Experts', 'Youth Onco Network'];
const quickStats = [
  { value: '4K+', label: 'Attendees Expected' },
  { value: '120+', label: 'Speakers & Moderators' },
  { value: '35+', label: 'Countries Represented' },
  { value: '60+', label: 'Interactive Sessions' }
];
const eventDate = new Date('2026-12-01T09:00:00');
const typePhrases = ['Where Awareness Meets Innovation', 'Purple for Strength. Pink for Hope.'];
const revealLine = 'Together we turn science into survival stories.';

function getCountdownParts(targetDate) {
  const difference = targetDate.getTime() - new Date().getTime();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(() => getCountdownParts(eventDate));
  const [typedText, setTypedText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getCountdownParts(eventDate));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const currentPhrase = typePhrases[phraseIndex % typePhrases.length];
    if (typedText.length === currentPhrase.length) {
      const holdTimer = setTimeout(() => {
        setTypedText('');
        setPhraseIndex((prev) => (prev + 1) % typePhrases.length);
      }, 1400);
      return () => clearTimeout(holdTimer);
    }

    const typingTimer = setTimeout(() => {
      setTypedText(currentPhrase.slice(0, typedText.length + 1));
    }, 55);

    return () => clearTimeout(typingTimer);
  }, [typedText, phraseIndex]);

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="content-shell home-page">
      <motion.section
        style={{ padding: 'clamp(14px, 2vw, 24px) 0 10px' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="media-tile neon-outline"
          style={{ height: 'clamp(170px, 34vw, 340px)' }}
        >
          <img src="/banner.jpg" alt="YROC Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </motion.div>
      </motion.section>
      
      {/* Hero Section */}
      <section style={{ minHeight: 'min(860px, calc(100vh - var(--nav-height)))', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div variants={textFade} initial="hidden" animate="visible" className="hero-glass-panel">
          <motion.p variants={textFade} initial="hidden" animate="visible" style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '20px' }}>
            Theme: Advancing Oncology Together
          </motion.p>
          <motion.h1
            variants={textFade} initial="hidden" animate="visible" transition={{ delay: 0.2 }}
            style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1.1, maxWidth: '1000px', marginBottom: '26px' }}
          >
            The 13th <br/>
            <span className="gradient-text">YROC Cancer Conference</span>
          </motion.h1>
          <p className="typing-line">{typedText}<span className="typing-caret">|</span></p>
          <p className="gradient-moving-text" style={{ marginTop: '6px', marginBottom: '20px' }}>
            Future-forward oncology for a new generation.
          </p>
          <p style={{ margin: '0 0 22px', lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: '780px' }}>
            {revealLine.split(' ').map((word, idx) => (
              <motion.span
                key={`${word}-${idx}`}
                initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.45 + idx * 0.06, duration: 0.35 }}
                style={{ display: 'inline-block', marginRight: '7px' }}
              >
                {word}
              </motion.span>
            ))}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/registration" className="glassy-cta">Register Now</Link>
            <Link to="/media" className="glassy-cta">Watch Highlights</Link>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {vibeTags.map((tag) => <span key={tag} className="trend-chip">{tag}</span>)}
          </div>
          <div className="marquee-wrap">
            <div className="marquee-track">
              {[...vibeTags, ...vibeTags, ...vibeTags, ...vibeTags].map((item, idx) => (
                <span className="marquee-item" key={`${item}-${idx}`}>- {item} -</span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <motion.section
        style={{ padding: '0 0 clamp(44px, 7vw, 70px)' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="stats-grid">
          {quickStats.map((stat) => (
            <motion.div key={stat.label} whileHover={{ y: -4 }} className="stat-card">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        style={{ padding: '0 0 clamp(44px, 7vw, 70px)', maxWidth: '1100px', margin: '0 auto' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="section-card countdown-shell">
          <div style={{ marginBottom: '14px' }}>
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Live Countdown
            </p>
            <h3 style={{ marginTop: '10px', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>YROC 2026 starts in</h3>
          </div>
          <div className="countdown-grid">
            <div className="count-pill"><strong>{timeLeft.days}</strong><span>Days</span></div>
            <div className="count-pill"><strong>{timeLeft.hours}</strong><span>Hours</span></div>
            <div className="count-pill"><strong>{timeLeft.minutes}</strong><span>Minutes</span></div>
            <div className="count-pill"><strong>{timeLeft.seconds}</strong><span>Seconds</span></div>
          </div>
        </div>
      </motion.section>

      {/* Picture Section */}
      <motion.section
        style={{ padding: 'clamp(56px, 8vw, 100px) 0', borderTop: '1px solid rgba(124,58,237,0.12)' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
         <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ width: '100%', height: 'clamp(220px, 42vw, 400px)', borderRadius: '20px', overflow: 'hidden' }}>
            <img src="/hero.png" alt="Medical Conference Visuals" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
         </motion.div>
      </motion.section>

      <motion.section
        style={{ padding: '10px 0 80px' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.16 }}
      >
        <div className="mood-grid">
          <div className="media-tile"><img src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80" alt="Discussion circle" /></div>
          <div className="media-tile"><img src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80" alt="Lab research" /></div>
          <div className="media-tile"><img src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=1200&q=80" alt="Conference audience" /></div>
          <div className="media-tile"><img src="https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&w=1200&q=80" alt="Doctor interaction" /></div>
        </div>
      </motion.section>

      {/* WriteUp Section (300-400 words) */}
      <motion.section
        style={{ padding: 'clamp(56px, 8vw, 100px) 0', maxWidth: '800px', margin: '0 auto' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ fontSize: '2.5rem', marginBottom: '40px' }}
        >
          Welcome to the Forefront of Discovery
        </motion.h2>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '20px' }}>
            The 13th YROC Cancer Conference stands as a beacon of collaboration, innovation, and unwavering dedication to the global fight against cancer. Over the past twelve iterations, YROC has evolved from a regional symposium into an internationally recognized platform where leading oncologists, researchers, policymakers, and advocates converge to exchange groundbreaking ideas and clinical advancements.
          </p>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '20px' }}>
            This year, under the theme "Advancing Oncology Together," we are expanding our focus on multidisciplinary approaches to cancer care. We recognize that transformative breakthroughs do not happen in isolation. They are born at the intersection of diverse disciplines—from molecular biology and immunology to data science and patient advocacy. The 13th YROC program is meticulously designed to foster these critical connections.
          </p>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Attendees will experience a dynamic convergence of keynote lectures, interactive panel discussions, and late-breaking abstract presentations. Our sessions will delve into the latest clinical trials, highly targeted therapeutic interventions, immunotherapy breakthroughs, and the critical importance of early diagnostic technologies. Furthermore, we are intensely focused on health equity, ensuring that the remarkable innovations discussed here translate to improved survival rates and quality of life for patients across all demographics globally.
          </p>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            We invite you to join us in this critical endeavor. Together, through shared knowledge and relentless pursuit of excellence, we can accelerate the pace of scientific discovery and redefine the future of oncology. Your presence here is a vital component of this collective mission.
          </p>
        </motion.div>
      </motion.section>

      {/* Vision Section (250-350 words) */}
      <motion.section
        style={{ padding: 'clamp(56px, 8vw, 100px) 0', maxWidth: '800px', margin: '0 auto' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ fontSize: '2.5rem', marginBottom: '40px', color: 'var(--accent-primary)' }}
        >
          Our Vision
        </motion.h2>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '20px' }}>
            At the heart of the YROC paradigm lies a profound and ambitious vision: a future where cancer is fundamentally preventable, highly manageable, and ultimately curable. We envision a global healthcare ecosystem where the devastating impact of this disease is mitigated by rapid, equitable access to precision medicine and holistic supportive care. Our vision extends far beyond the confines of clinical laboratories and hospital wards; it encompasses a comprehensive societal shift in how we understand, approach, and conquer malignancies.
          </p>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '20px' }}>
            We are driven by the belief that the synergistic intelligence of the global scientific community is our most powerful weapon. By breaking down institutional silos and fostering unprecedented levels of cross-border collaboration, we can condense decades of research into years of transformative progress. We aim to empower the next generation of researchers with the resources and mentorship required to challenge existing paradigms and chart untraversed territories in molecular biology.
          </p>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            Ultimately, our vision is deeply rooted in human resilience. We exist to honor the courage of patients and the dedication of caregivers. Everything we do—from curating this world-class conference curriculum to facilitating groundbreaking research grants—is dedicated to the singular goal of saving lives and restoring hope to millions of families worldwide.
          </p>
        </motion.div>
      </motion.section>

      <motion.section
        style={{ padding: 'clamp(32px, 5vw, 40px) 0 clamp(70px, 9vw, 100px)', maxWidth: '1100px', margin: '0 auto' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ fontSize: '2.2rem', marginBottom: '20px', color: 'var(--accent)' }}
        >
          Dynamic Media Experience
        </motion.h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '28px' }}>
          Explore our dedicated media and gallery sections featuring photos, videos, and event highlights with smooth transitions across all devices.
        </p>
        <div className="bento-grid">
          <motion.div whileHover={{ y: -6 }} className="section-card neon-outline" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '10px', color: 'var(--accent)' }}>Media Section</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              Featured videos, key sessions, and spotlight content designed for quick viewing.
            </p>
            <Link to="/media" className="glassy-cta">View Media</Link>
          </motion.div>
          <motion.div whileHover={{ y: -6 }} className="section-card neon-outline" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '10px', color: 'var(--accent)' }}>Gallery Section</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              Browse event moments, speakers, and behind-the-scenes highlights in a clean gallery layout.
            </p>
            <Link to="/gallery" className="glassy-cta">Open Gallery</Link>
          </motion.div>
        </div>
      </motion.section>

    </motion.div>
  );
}
