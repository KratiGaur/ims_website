import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CinematicBackdrop from '../components/CinematicBackdrop';

const pageVariants = {
  initial: { opacity: 0, y: 20, filter: 'blur(8px)' },
  in: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: 'easeOut' } },
  out: { opacity: 0, y: -20, transition: { duration: 0.5, ease: 'easeIn' } }
};

const textFade = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: 'easeOut' } }
};

const sectionReveal = {
  hidden: { opacity: 0, y: 42, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.82, ease: [0.16, 1, 0.3, 1] } }
};

export default function Home() {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="content-shell home-page cinematic-page">
      <CinematicBackdrop />

      <section className="hero-stage">
        <motion.div variants={textFade} initial="hidden" animate="visible" className="hero-glass-panel" style={{ gap: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.h1
            variants={textFade}
            initial="hidden"
            animate="visible"
            style={{ fontSize: 'clamp(5rem, 12vw, 8.5rem)', lineHeight: 0.9, fontWeight: 800, color: '#391a56', margin: 0 }}
          >
            YROC
          </motion.h1>

          <motion.p
            variants={textFade}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.12 }}
            style={{ color: '#7c3aed', fontSize: '1rem', letterSpacing: '4px', textTransform: 'uppercase', margin: 0, fontWeight: 700 }}
          >
            THEME: CANCER CARE CONTINUUM
          </motion.p>

          <motion.p
            variants={textFade}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.24 }}
            style={{ margin: 0, color: '#7c3aed', fontSize: 'clamp(1.2rem, 2.2vw, 1.5rem)', fontWeight: 600, letterSpacing: '0.5px' }}
          >
            Preventive. Personalized. Precision. Palliative.
          </motion.p>

          <motion.p
            variants={textFade}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.36 }}
            style={{ margin: '0 auto', lineHeight: 1.8, color: '#6b7280', maxWidth: '760px', fontSize: '1.05rem' }}
          >
            YROC 2027 connects learning, technology, and compassion across every stage of cancer care.
          </motion.p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px', marginTop: '24px' }}>
            <Link
              to="/registration"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '170px',
                padding: '12px 24px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                color: '#fff',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 18px 40px rgba(124, 58, 237, 0.18)'
              }}
            >
              Register Now
            </Link>
            <Link
              to="/invitation"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '170px',
                padding: '12px 24px',
                borderRadius: '999px',
                background: 'rgba(248, 250, 252, 0.88)',
                border: '1px solid rgba(167, 139, 250, 0.5)',
                color: '#5b21b6',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              Read Invitation
            </Link>
            <Link
              to="/abstract"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '170px',
                padding: '12px 24px',
                borderRadius: '999px',
                background: 'rgba(248, 250, 252, 0.88)',
                border: '1px solid rgba(167, 139, 250, 0.5)',
                color: '#5b21b6',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              Submit Abstract
            </Link>
          </div>
        </motion.div>
      </section>

      <motion.section className="page-section-tight" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }}>
        <div className="section-card">
          <h2 className="section-title mb-3">Conference Theme</h2>
          <p className="prose-copy">
            Cancer care today demands continuity across prevention, early detection, precision diagnosis, advanced treatment, rehabilitation, survivorship, and palliative support. YROC 2027 is centered on this continuum, encouraging a patient-focused, multidisciplinary approach that is both scientifically current and clinically compassionate.
          </p>
        </div>
      </motion.section>

      <motion.section className="page-section-tight" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }}>
        <div className="section-card">
          <h2 className="section-title mb-3">About the Institute</h2>
          <p className="prose-copy">
            Shri Ram Murti Smarak Institute of Medical Sciences, Bareilly, a mission conceptualised in the year 2002, is a modern 1200-bed multi super speciality tertiary care hospital and medical college catering to healthcare needs across a radius of 250 kilometres of the Bareilly zone, extending up to the farthest border towns of Uttarakhand and Nepal. The Medical College is recognized by the Ministry of Health, Government of India and approved by NMC, New Delhi, and offers MBBS, postgraduate courses across departments, and super speciality programmes in Neurology and Neurosurgery.
          </p>
          <p className="prose-copy">
            In twenty three years of its establishment, the institute has grown multifold in facilities, expertise, and medical education. It is among the self-funded medical colleges to house some of the country’s leading technologies for diagnosis and intervention, including 3 Tesla 48 channel MRI, 256 Slice Dual Source CT Scan, High Energy Linear Accelerator, HDR Brachytherapy, 19 ultramodern modular laminar flow OTs, SICU, ICU, ICCU, NICU, PICU, Cath Lab with DSA, and the SSI Mantra Surgical System, all supported by advanced computerized clinical laboratories and a blood bank with component separation facility.
          </p>
          <p className="prose-copy mb-0">
            Through YROC 2027, the institute extends its academic and clinical mission by creating a dedicated forum for radiation oncology and allied specialties to exchange ideas that can improve outcomes throughout the cancer care pathway.
          </p>
        </div>
      </motion.section>

      <motion.section className="page-section-tight" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }}>
        <div className="section-card">
          <h2 className="section-title mb-3">R R Cancer Institute & Research Centre</h2>
          <p className="prose-copy">
            The dedicated 100-bed R R Cancer Institute & Research Centre is leading the way in the management of cancer patients. With state-of-the-art infrastructure, the latest machines, and expert faculty, the institute has established itself as a centre of excellence in cancer care across Uttar Pradesh and Uttarakhand.
          </p>
          <p className="prose-copy mb-0">
            Equipped with conventional surgery, 3D-4K laparoscopic surgery, robotic surgery, IGRT, IMRT, SRS, SRT, SBRT, VMAT through High Energy Linear Accelerator (TrueBeam), HDR brachytherapy, interstitial implants, chemotherapy, immunotherapy, targeted therapy, hormonal therapy, bone marrow procedures, and palliative care, the centre delivers holistic and high-quality treatment. Its community outreach and screening programmes also make it a pioneer in early detection, treatment, and cancer awareness.
          </p>
        </div>
      </motion.section>

      <motion.section className="page-section-tight" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }}>
        <h2 className="section-title mb-4" style={{ textAlign: 'center' }}>Conference Glimpses</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {[
            'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=80'
          ].map((src) => (
            <div key={src} style={{ borderRadius: '24px', overflow: 'hidden', minHeight: '220px', background: 'var(--surface-glass)' }}>
              <img src={src} alt="Conference glimpse" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
