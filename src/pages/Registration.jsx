import React, { useState } from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  out: { opacity: 0, y: -20, transition: { duration: 0.5, ease: 'easeIn' } }
};

const sectionReveal = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
};

const inputStyle = {
  width: '100%',
  padding: '15px 20px',
  background: 'var(--surface-glass)',
  border: '1px solid var(--surface-stroke)',
  borderRadius: '8px',
  color: 'var(--text-primary)',
  fontFamily: 'Inter',
  fontSize: '1rem',
  marginBottom: '20px',
  outline: 'none'
};

const initialForm = {
  fullName: '',
  institution: '',
  specialization: '',
  email: '',
  registrationType: 'delegate'
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

export default function Registration() {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${apiBaseUrl}/api/register.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Registration failed.');
      }

      setStatus({ type: 'success', message: result.message });
      setFormData(initialForm);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Something went wrong while submitting the form.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="content-shell narrow-shell">
      <motion.section
        className="page-section"
        style={{ textAlign: 'center' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h1 className="page-title centered" style={{ marginBottom: '20px' }}>
          Conference <span className="gradient-text">Registration</span>
        </h1>
        <p className="page-lead centered" style={{ marginBottom: '40px' }}>
          Secure your spot at the 13th YROC Cancer Conference. Early bird registration closes soon.
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--accent-primary)' }}>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Dr. Jane Doe"
            value={formData.fullName}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--accent-primary)' }}>Institution / Hospital</label>
          <input
            type="text"
            name="institution"
            placeholder="Johns Hopkins Medicine"
            value={formData.institution}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--accent-primary)' }}>Specialization</label>
          <input
            type="text"
            name="specialization"
            placeholder="E.g., Medical Oncology, Radiology..."
            value={formData.specialization}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--accent-primary)' }}>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="jane@example.com"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--accent-primary)' }}>Registration Type</label>
          <select
            name="registrationType"
            value={formData.registrationType}
            onChange={handleChange}
            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', WebkitAppearance: 'none' }}
          >
            <option value="delegate" style={{ color: '#000' }}>Delegate (Standard)</option>
            <option value="student" style={{ color: '#000' }}>Student / Fellow (Discounted)</option>
            <option value="speaker" style={{ color: '#000' }}>Invited Speaker</option>
          </select>

          {status.message ? (
            <p
              style={{
                color: status.type === 'success' ? '#0f9d58' : '#d93025',
                marginTop: '10px',
                marginBottom: '10px'
              }}
            >
              {status.message}
            </p>
          ) : null}

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: 'var(--accent-secondary)' }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '20px',
              backgroundColor: 'var(--accent-primary)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              marginTop: '20px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          </motion.button>
        </form>
      </motion.section>
    </motion.div>
  );
}
