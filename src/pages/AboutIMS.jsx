import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LayoutGroup, motion } from 'framer-motion';

import CinematicBackdrop from '../components/CinematicBackdrop';

const pageVariants = {
  initial: { opacity: 0, y: 20, filter: 'blur(8px)' },
  in: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: 'easeOut' } },
  out: { opacity: 0, y: -20, transition: { duration: 0.5, ease: 'easeIn' } }
};

const sectionReveal = {
  hidden: { opacity: 0, y: 42, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.82, ease: [0.16, 1, 0.3, 1] } }
};

const instituteHighlights = [
  {
    title: 'About the Institute',
    body:
      'Shri Ram Murti Smarak Institute of Medical Sciences, Bareilly, conceptualised in 2002, is a modern 1200-bed multi super speciality tertiary care hospital and medical college serving Bareilly and the surrounding region up to the farthest border towns of Uttarakhand and Nepal.'
  },
  {
    title: 'Advanced Infrastructure',
    body:
      'The institute houses advanced diagnostic and treatment infrastructure including 3 Tesla 48 channel MRI, 256 Slice Dual Source CT Scan, High Energy Linear Accelerator, HDR Brachytherapy, modular laminar flow OTs, critical care units, Cath Lab with DSA, the SSI Mantra Surgical Robotic System, and high-tech clinical laboratories.'
  },
  {
    title: 'Cancer Care Excellence',
    body:
      'The 100-bed R R Cancer Institute and Research Centre and the Department of Radiation Oncology together anchor high-quality oncology services across Uttar Pradesh and Uttarakhand through precision treatment, multidisciplinary coordination, and academic engagement.'
  }
];

export default function AboutIMS() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const target = document.querySelector(location.hash);
    if (!target) {
      return;
    }

    window.setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }, [location.hash]);

  return (
    <LayoutGroup>
      <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="content-shell medium-shell cinematic-page">
        <CinematicBackdrop />


        <motion.section
          className="page-section-tight"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
        >
          <div className="about-detail-grid">
            {instituteHighlights.map((item) => (
              <article key={item.title} className="section-card about-detail-card">
                <h2>{item.title}</h2>
                <p>{item.body}</p>
              </article>
            ))}
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
            <p style={{ fontSize: '1.2rem', lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Shri Ram Murti Smarak Institute of Medical Sciences, Bareilly, conceptualised in 2002, is a modern 1200-bed multi super speciality tertiary care hospital and medical college serving Bareilly and the surrounding region up to the farthest border towns of Uttarakhand and Nepal.
            </p>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Recognized by the Ministry of Health, Government of India and approved by NMC, New Delhi, the institute offers MBBS, postgraduate programmes across departments, and super speciality courses in Neurology and Neurosurgery. Over twenty three years, it has grown substantially in expertise, infrastructure, and medical education.
            </p>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Its advanced facilities include 3 Tesla 48 channel MRI, 256 Slice Dual Source CT Scan, High Energy Linear Accelerator, HDR Brachytherapy, 19 modular laminar flow OTs, critical care units, Cath Lab with DSA, SSI Mantra Surgical Robotic System, computerized labs, and a blood bank with component separation facility.
            </p>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
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
            <p style={{ fontSize: '1.2rem', lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: '20px' }}>
              The dedicated 100-bed R R Cancer Institute &amp; Research Centre is leading the way in the management of cancer patients with state-of-the-art infrastructure, latest machines, and expert faculty. It has established itself as a centre of excellence in cancer care across Uttar Pradesh and Uttarakhand.
            </p>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: '20px' }}>
              The centre is equipped for conventional surgery, 3D-4K laparoscopic surgery, robotic surgery, IGRT, IMRT, SRS, SRT, SBRT, VMAT through High Energy Linear Accelerator (True Beam), HDR brachytherapy, interstitial implants, chemotherapy, immunotherapy, targeted therapy, hormonal therapy, bone marrow procedures, and palliative care.
            </p>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
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
          <p style={{ fontSize: '1.15rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
            The Department of Radiation Oncology is central to the academic and clinical spirit of YROC 2027. With advanced radiotherapy capabilities, multidisciplinary coordination, and a patient-centred approach, the department supports precise treatment planning, evidence-based practice, and compassionate care across the full cancer journey.
          </p>
        </motion.section>
      </motion.div>
    </LayoutGroup>
  );
}
