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

const textareaStyle = {
  ...inputStyle,
  minHeight: '180px',
  resize: 'vertical'
};

const initialForm = {
  paperTitle: '',
  authors: '',
  presentingAuthorEmail: '',
  category: 'original-research',
  abstractText: ''
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

export default function Abstract() {
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
      const response = await fetch(`${apiBaseUrl}/api/submit-paper.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Paper submission failed.');
      }

      setStatus({ type: 'success', message: result.message });
      setFormData(initialForm);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Something went wrong while submitting the paper.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="content-shell narrow-shell">
      <motion.section
        className="page-section"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h1 className="page-title" style={{ marginBottom: '40px' }}>
          Call for <span className="gradient-text">Abstracts</span>
        </h1>

        <div style={{ padding: 'clamp(18px, 3vw, 30px)', background: 'var(--surface-glass)', border: '1px solid var(--surface-stroke)', borderRadius: '20px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'var(--accent-primary)' }}>Important Dates</h2>
          <ul style={{ listStyleType: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8 }}>
            <li><strong style={{ color: 'var(--text-primary)' }}>Portal Opens:</strong> October 1, 2025</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Submission Deadline:</strong> January 15, 2026</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Acceptance Notification:</strong> March 1, 2026</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Late-breaking Abstract Deadline:</strong> April 10, 2026</li>
          </ul>
        </div>

        <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Submission Guidelines</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '20px' }}>
          The Scientific Committee invites authors to submit abstracts for original research, clinical trials, and critical case studies in the field of oncology. All submissions must be written in English and exceed no more than 350 words.
        </p>

        <ul style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '40px', paddingLeft: '20px' }}>
          <li style={{ marginBottom: '10px' }}>Structure your abstract: Background, Methods, Results, and Conclusions.</li>
          <li style={{ marginBottom: '10px' }}>Do not include tables, graphs, or images in the primary abstract text submission.</li>
          <li style={{ marginBottom: '10px' }}>Ensure all co-authors have reviewed and approved the content prior to submission.</li>
        </ul>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--accent-primary)' }}>Paper Title</label>
          <input
            type="text"
            name="paperTitle"
            value={formData.paperTitle}
            onChange={handleChange}
            placeholder="Enter the paper or abstract title"
            style={inputStyle}
            required
          />

          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--accent-primary)' }}>Authors</label>
          <input
            type="text"
            name="authors"
            value={formData.authors}
            onChange={handleChange}
            placeholder="Dr. A, Dr. B, Dr. C"
            style={inputStyle}
            required
          />

          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--accent-primary)' }}>Presenting Author Email</label>
          <input
            type="email"
            name="presentingAuthorEmail"
            value={formData.presentingAuthorEmail}
            onChange={handleChange}
            placeholder="author@example.com"
            style={inputStyle}
            required
          />

          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--accent-primary)' }}>Submission Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', WebkitAppearance: 'none' }}
          >
            <option value="original-research" style={{ color: '#000' }}>Original Research</option>
            <option value="clinical-trial" style={{ color: '#000' }}>Clinical Trial</option>
            <option value="case-study" style={{ color: '#000' }}>Critical Case Study</option>
          </select>

          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--accent-primary)' }}>Abstract Text</label>
          <textarea
            name="abstractText"
            value={formData.abstractText}
            onChange={handleChange}
            placeholder="Write your abstract here..."
            style={textareaStyle}
            maxLength={350}
            required
          />

          <p style={{ color: 'var(--text-secondary)', marginTop: '-10px', marginBottom: '20px' }}>
            {formData.abstractText.length}/350 characters
          </p>

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
              padding: '15px 30px',
              backgroundColor: 'var(--accent-primary)',
              border: 'none',
              color: '#fff',
              borderRadius: '30px',
              fontSize: '1.1rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Abstract'}
          </motion.button>
        </form>
      </motion.section>
    </motion.div>
  );
}
