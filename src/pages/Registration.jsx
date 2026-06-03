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
  registrationType: 'delegate',
  role: 'attendee',
  mobileNumber: '',
  whatsappNumber: '',
  addressForCorrespondence: ''
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

  const [showForm, setShowForm] = useState(false);

  const scrollToForm = () => {
    setShowForm(true);
    requestAnimationFrame(() => {
      const el = document.getElementById('registration-form');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
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
        <h1 className="page-title centered" style={{ marginBottom: '10px' }}>
          YROC2027 <span className="gradient-text">Registration</span>
        </h1>
        <p className="page-lead centered" style={{ marginBottom: '25px' }}>
          All participants must complete registration to attend and/or present papers. At least one author of each accepted paper must register.
        </p>

        <div
          style={{
            textAlign: 'left',
            margin: '0 auto',
            maxWidth: 980,
            padding: '18px 18px',
            background: 'var(--surface-glass)',
            border: '1px solid var(--surface-stroke)',
            borderRadius: 12
          }}
        >
          <h2 style={{ margin: '0 0 10px', color: 'var(--accent-primary)', fontSize: '1.15rem' }}>
            Registration categories
          </h2>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Students/Research Scholar</li>
            <li>Faculty</li>
            <li>Industry participants</li>
            <li>Attendee</li>
          </ul>

          <h2 style={{ margin: '20px 0 10px', color: 'var(--accent-primary)', fontSize: '1.15rem' }}>
            Registration Fee
          </h2>
          <p style={{ margin: '0 0 12px', opacity: 0.95 }}>
            <b>Note:</b> Registration fees are non-refundable once paid.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid var(--surface-stroke)', padding: '10px', background: 'rgba(255,255,255,0.03)' }}>Registration</th>
                  <th style={{ border: '1px solid var(--surface-stroke)', padding: '10px', background: 'rgba(255,255,255,0.03)' }}>Early Bird (till 25th June 2026)</th>
                  <th style={{ border: '1px solid var(--surface-stroke)', padding: '10px', background: 'rgba(255,255,255,0.03)' }}>Regular</th>
                </tr>
                <tr>
                  <th style={{ border: '1px solid var(--surface-stroke)', padding: '8px' }}></th>
                  <th style={{ border: '1px solid var(--surface-stroke)', padding: '8px' }}>Indian Author / Foreign Author</th>
                  <th style={{ border: '1px solid var(--surface-stroke)', padding: '8px' }}>Indian Author / Foreign Author</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid var(--surface-stroke)', padding: '10px' }}>Students / Research Scholar</td>
                  <td style={{ border: '1px solid var(--surface-stroke)', padding: '10px' }}>3000 INR / 240 USD</td>
                  <td style={{ border: '1px solid var(--surface-stroke)', padding: '10px' }}>5000 INR / 400 USD</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid var(--surface-stroke)', padding: '10px' }}>Faculty</td>
                  <td style={{ border: '1px solid var(--surface-stroke)', padding: '10px' }}>3600 INR / 300 USD</td>
                  <td style={{ border: '1px solid var(--surface-stroke)', padding: '10px' }}>6000 INR / 500 USD</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid var(--surface-stroke)', padding: '10px' }}>Industry Participants</td>
                  <td style={{ border: '1px solid var(--surface-stroke)', padding: '10px' }}>4600 INR / 340 USD</td>
                  <td style={{ border: '1px solid var(--surface-stroke)', padding: '10px' }}>8000 INR / 600 USD</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid var(--surface-stroke)', padding: '10px' }}>Attendee</td>
                  <td style={{ border: '1px solid var(--surface-stroke)', padding: '10px' }}>900 INR / 60 USD</td>
                  <td style={{ border: '1px solid var(--surface-stroke)', padding: '10px' }}>1500 INR / 100 USD</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 style={{ margin: '20px 0 10px', color: 'var(--accent-primary)', fontSize: '1.15rem' }}>
            Registration Process
          </h2>
          <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>
              Complete the online registration form.
            </li>
            <li>Pay the applicable registration fee through the online payment mode.</li>
            <li>Upload the payment confirmation receipt during registration.</li>
            <li>Authors of accepted papers must upload the camera-ready paper after successful registration.</li>
          </ol>

          <h2 style={{ margin: '20px 0 10px', color: 'var(--accent-primary)', fontSize: '1.15rem' }}>
            Mode of Payment
          </h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Registration Fee may be remitted through Net Banking to the bank account given below. (Proof of remittance of the requisite registration fee with transaction number shall be sent by above registration link.)
          </p>
          <div style={{ marginTop: 12, padding: 14, borderRadius: 10, border: '1px solid var(--surface-stroke)', background: 'rgba(255,255,255,0.03)' }}>
            <div><b>Account Holder Name:</b> Engineering SRMS CET, Bareilly</div>
            <div><b>Bank Name:</b> Punjab National Bank</div>
            <div><b>Account No.:</b> 52241010000080</div>
            <div><b>Branch:</b> SRM Medical Smarak Trust, Bareilly, Uttar Pradesh</div>
            <div><b>Branch Code:</b> 522410</div>
            <div><b>IFSC Code:</b> PUNB0522410</div>
          </div>

          <h2 style={{ margin: '20px 0 10px', color: 'var(--accent-primary)', fontSize: '1.15rem' }}>
            Important Notes
          </h2>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Each registration allows the presentation of one paper.</li>
            <li>Additional papers by the same author may require separate registration.</li>
            <li>Participants will receive conference materials, certificates, and access to all technical sessions.</li>
            <li>Registered participants will be issued certificates of presentation/participation after the conference.</li>
            <li>For any registration-related queries, contact the conference organizing committee via the official email address (to be updated).</li>
          </ul>

          <div style={{ marginTop: 22 }}>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: 'var(--accent-secondary)' }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={scrollToForm}
              style={{
                width: '100%',
                padding: '18px',
                backgroundColor: 'var(--accent-primary)',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '1.05rem',
                fontWeight: 800,
                cursor: 'pointer',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                boxShadow: '0 10px 25px rgba(0,0,0,0.25)'
              }}
            >
              Register Now
            </motion.button>
          </div>
        </div>

        {showForm ? (
          <div id="registration-form" style={{ textAlign: 'left', marginTop: 26, maxWidth: 980, marginLeft: 'auto', marginRight: 'auto' }}>
            <form onSubmit={handleSubmit}>
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

              <label style={{ display: 'block', marginBottom: '10px', color: 'var(--accent-primary)' }}>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', WebkitAppearance: 'none' }}
              >
                <option value="paper_presenter" style={{ color: '#000' }}>Paper Presenter</option>
                <option value="attendee" style={{ color: '#000' }}>Attendee</option>
              </select>

              <label style={{ display: 'block', marginBottom: '10px', color: 'var(--accent-primary)' }}>Mobile No.</label>
              <input
                type="tel"
                name="mobileNumber"
                placeholder="+91 9876543210"
                value={formData.mobileNumber}
                onChange={handleChange}
                style={inputStyle}
                required
              />

              <label style={{ display: 'block', marginBottom: '10px', color: 'var(--accent-primary)' }}>WhatsApp No.</label>
              <input
                type="tel"
                name="whatsappNumber"
                placeholder="+91 9876543210"
                value={formData.whatsappNumber}
                onChange={handleChange}
                style={inputStyle}
                required
              />

              <label style={{ display: 'block', marginBottom: '10px', color: 'var(--accent-primary)' }}>Address for Correspondence</label>
              <input
                type="text"
                name="addressForCorrespondence"
                placeholder="City, State, Pin code"
                value={formData.addressForCorrespondence}
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
          </div>
        ) : null}
      </motion.section>
    </motion.div>
  );
}
