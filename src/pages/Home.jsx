import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BareillyAttractionCard from '../components/BareillyAttractionCard';
import { bareillyAttractions } from '../data/bareillyAttractions';

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

const vibeTags = ['Cancer Care Continuum', 'Radiation Oncology', 'Precision Care', 'Young Oncology Forum'];
const quickStats = [
  { value: '1200', label: 'Hospital Beds' },
  { value: '100', label: 'Dedicated Cancer Beds' },
  { value: '250 KM', label: 'Regional Reach' },
  { value: '2027', label: 'Conference Edition' }
];
const eventDate = new Date('2027-12-01T09:00:00');
const typePhrases = ['Preventive. Personalized. Precision. Palliative.', 'Advancing the full cancer care continuum.'];
const revealLine = 'YROC 2027 connects learning, technology, and compassion across every stage of cancer care.';
const marqueeAttractions = [...bareillyAttractions, ...bareillyAttractions];

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
          className="media-tile neon-outline hero-banner-frame"
        >
          <img src="/hero.png" alt="YROC Banner" className="fit-cover-image" />
        </motion.div>
      </motion.section>

      <section className="hero-stage">
        <motion.div variants={textFade} initial="hidden" animate="visible" className="hero-glass-panel">
          <motion.p variants={textFade} initial="hidden" animate="visible" style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '20px' }}>
            Theme: Cancer Care Continuum
          </motion.p>
          <motion.h1
            variants={textFade}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1.1, maxWidth: '1000px', marginBottom: '26px' }}
          >
            YROC <br />
            <span className="gradient-text">Young Radiation Oncology Conference 2027</span>
          </motion.h1>
          <p className="typing-line">{typedText}<span className="typing-caret">|</span></p>
          <p className="gradient-moving-text" style={{ marginTop: '6px', marginBottom: '20px' }}>
            Preventive. Personalized. Precision. Palliative.
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
            <h3 style={{ marginTop: '10px', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>YROC 2027 starts in</h3>
          </div>
          <div className="countdown-grid">
            <div className="count-pill"><strong>{timeLeft.days}</strong><span>Days</span></div>
            <div className="count-pill"><strong>{timeLeft.hours}</strong><span>Hours</span></div>
            <div className="count-pill"><strong>{timeLeft.minutes}</strong><span>Minutes</span></div>
            <div className="count-pill"><strong>{timeLeft.seconds}</strong><span>Seconds</span></div>
          </div>
        </div>
      </motion.section>

      <motion.section
        style={{ padding: 'clamp(26px, 4vw, 34px) 0 clamp(54px, 8vw, 82px)' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.16 }}
      >
        <div className="home-attractions-shell">
          <div className="home-attractions-heading">
            <span className="about-kicker">Local Attractions</span>
            <h2 className="home-attractions-title">
              Bareilly Beyond The Venue
            </h2>
            <p className="page-lead centered">
              Tap any image to reveal the place details. The strip stays image-only so the motion feels clean on mobile and desktop alike.
            </p>
          </div>

          <div className="attractions-marquee-shell">
            <div className="attractions-marquee-track">
              {marqueeAttractions.map((attraction, index) => (
                <div className="attractions-marquee-item" key={`${attraction.title}-${index}`}>
                  <BareillyAttractionCard
                    attraction={attraction}
                    index={index % bareillyAttractions.length}
                    compact
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        style={{ padding: 'clamp(56px, 8vw, 100px) 0', borderTop: '1px solid rgba(124,58,237,0.12)' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="feature-media-frame">
          <img src="/hero.png" alt="Medical Conference Visuals" className="fit-cover-image" />
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

      <motion.section
        style={{ padding: 'clamp(56px, 8vw, 100px) 0', maxWidth: '800px', margin: '0 auto' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ fontSize: '2.5rem', marginBottom: '40px' }}>
          About the Institute
        </motion.h2>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Shri Ram Murti Smarak Institute of Medical Sciences, Bareilly, conceptualised in 2002, is a modern 1200-bed multi super speciality tertiary care hospital and medical college serving Bareilly and the surrounding region up to the farthest border towns of Uttarakhand and Nepal.
          </p>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Recognized by the Ministry of Health, Government of India and approved by NMC, New Delhi, the institute offers MBBS, postgraduate programmes across departments, and super speciality courses in Neurology and Neurosurgery. Over twenty three years, it has grown substantially in expertise, infrastructure, and medical education.
          </p>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Its advanced facilities include 3 Tesla 48 channel MRI, 256 Slice Dual Source CT Scan, High Energy Linear Accelerator, HDR Brachytherapy, 19 modular laminar flow OTs, critical care units, Cath Lab with DSA, SSI Mantra Surgical Robotic System, computerized labs, and a blood bank with component separation facility.
          </p>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            YROC 2027 builds on this clinical and academic foundation by creating a focused platform around the cancer care continuum, bringing together prevention, diagnosis, precision treatment, survivorship, and palliative care in one conversation.
          </p>
        </motion.div>
      </motion.section>

      <motion.section
        style={{ padding: 'clamp(56px, 8vw, 100px) 0', maxWidth: '800px', margin: '0 auto' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ fontSize: '2.5rem', marginBottom: '40px', color: 'var(--accent-primary)' }}>
          R R Cancer Institute &amp; Research Centre
        </motion.h2>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '20px' }}>
            The dedicated 100-bed R R Cancer Institute &amp; Research Centre is leading the way in the management of cancer patients with state-of-the-art infrastructure, latest machines, and expert faculty. It has established itself as a centre of excellence in cancer care across Uttar Pradesh and Uttarakhand.
          </p>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '20px' }}>
            The centre is equipped for conventional surgery, 3D-4K laparoscopic surgery, robotic surgery, IGRT, IMRT, SRS, SRT, SBRT, VMAT through High Energy Linear Accelerator (True Beam), HDR brachytherapy, interstitial implants, chemotherapy, immunotherapy, targeted therapy, hormonal therapy, bone marrow procedures, and palliative care.
          </p>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            With strong community outreach and screening programmes, the institute is also a pioneer in early cancer detection, treatment access, and cancer awareness, making the conference theme of continuum care especially relevant to its mission.
          </p>
        </motion.div>
      </motion.section>

      <motion.section
        style={{ padding: 'clamp(24px, 4vw, 40px) 0 clamp(56px, 8vw, 90px)', maxWidth: '800px', margin: '0 auto' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ fontSize: '2.2rem', marginBottom: '28px', color: 'var(--accent-primary)' }}>
          Department of Radiation Oncology
        </motion.h2>
        <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
          The Department of Radiation Oncology is central to the academic and clinical spirit of YROC 2027. With advanced radiotherapy capabilities, multidisciplinary coordination, and a patient-centred approach, the department supports precise treatment planning, evidence-based practice, and compassionate care across the full cancer journey.
        </p>
      </motion.section>

      <motion.section
        style={{ padding: 'clamp(32px, 5vw, 40px) 0 clamp(70px, 9vw, 100px)', maxWidth: '1100px', margin: '0 auto' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ fontSize: '2.2rem', marginBottom: '20px', color: 'var(--accent)' }}>
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
