## New Form Design

This doc includes the implementation for a new form design.

```typescript jsx
import React, { useState } from 'react';

const ExpressNextForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    workEmail: '',
    companyName: '',
    websiteUrl: ''
  });

  const steps = [
    { id: 'basics', label: 'The Basics', subtitle: 'Let\'s get acquainted' },
    { id: 'numbers', label: 'Numbers', subtitle: 'Your metrics matter' },
    { id: 'process', label: 'Process', subtitle: 'How you work' },
    { id: 'vision', label: 'Vision', subtitle: 'Where you\'re headed' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToStep = (index) => {
    setCurrentStep(index);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .form-container {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          font-family: 'DM Sans', sans-serif;
          background: #FDFBF7;
        }

        .sidebar {
          background: linear-gradient(165deg, #1a1a1a 0%, #2d2926 100%);
          padding: 48px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .sidebar::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(212, 165, 116, 0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        .sidebar::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 200px;
          background: linear-gradient(to top, rgba(212, 165, 116, 0.05), transparent);
          pointer-events: none;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 80px;
          position: relative;
          z-index: 1;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #D4A574 0%, #C4956A 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          font-family: 'Instrument Serif', serif;
          font-size: 24px;
          color: #FDFBF7;
          letter-spacing: -0.5px;
        }

        .steps-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
          z-index: 1;
        }

        .step-item {
          padding: 20px 24px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
          border: 1px solid transparent;
        }

        .step-item:hover:not(.active) {
          background: rgba(253, 251, 247, 0.03);
        }

        .step-item.active {
          background: rgba(253, 251, 247, 0.06);
          border-color: rgba(212, 165, 116, 0.2);
        }

        .step-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 32px;
          background: #D4A574;
          border-radius: 0 2px 2px 0;
        }

        .step-label {
          font-family: 'Instrument Serif', serif;
          font-size: 22px;
          color: rgba(253, 251, 247, 0.4);
          transition: color 0.4s ease;
          margin-bottom: 4px;
        }

        .step-item.active .step-label,
        .step-item.completed .step-label {
          color: #FDFBF7;
        }

        .step-subtitle {
          font-size: 13px;
          color: rgba(253, 251, 247, 0.25);
          transition: color 0.4s ease;
          letter-spacing: 0.3px;
        }

        .step-item.active .step-subtitle {
          color: rgba(212, 165, 116, 0.7);
        }

        .step-item.completed .step-subtitle {
          color: rgba(253, 251, 247, 0.4);
        }

        .step-check {
          position: absolute;
          right: 24px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(212, 165, 116, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .step-item.completed .step-check {
          opacity: 1;
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 40px;
          position: relative;
          z-index: 1;
        }

        .security-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(253, 251, 247, 0.35);
          font-size: 12px;
          letter-spacing: 0.5px;
        }

        .main-content {
          padding: 48px 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
        }

        .main-content::before {
          content: '';
          position: absolute;
          top: 60px;
          right: 60px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(212, 165, 116, 0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .form-header {
          margin-bottom: 56px;
        }

        .step-indicator {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #D4A574;
          margin-bottom: 16px;
          font-weight: 500;
        }

        .form-title {
          font-family: 'Instrument Serif', serif;
          font-size: 52px;
          color: #1a1a1a;
          line-height: 1.1;
          letter-spacing: -1px;
          margin-bottom: 12px;
        }

        .form-description {
          font-size: 17px;
          color: #6B6560;
          line-height: 1.6;
          max-width: 420px;
        }

        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 32px;
          max-width: 560px;
        }

        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .field-label {
          font-size: 13px;
          font-weight: 500;
          color: #1a1a1a;
          letter-spacing: 0.3px;
        }

        .field-input {
          padding: 18px 20px;
          font-size: 16px;
          font-family: 'DM Sans', sans-serif;
          border: 1.5px solid #E8E4DE;
          border-radius: 10px;
          background: #FFFFFF;
          color: #1a1a1a;
          transition: all 0.3s ease;
          outline: none;
        }

        .field-input::placeholder {
          color: #B8B4AE;
        }

        .field-input:hover {
          border-color: #D4D0CA;
        }

        .field-input:focus {
          border-color: #D4A574;
          box-shadow: 0 0 0 4px rgba(212, 165, 116, 0.1);
        }

        .form-actions {
          margin-top: 48px;
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .btn-primary {
          padding: 18px 40px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          background: #1a1a1a;
          color: #FDFBF7;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          display: flex;
          align-items: center;
          gap: 12px;
          letter-spacing: 0.3px;
        }

        .btn-primary:hover {
          background: #2d2926;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(26, 26, 26, 0.2);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        .btn-arrow {
          transition: transform 0.3s ease;
        }

        .btn-primary:hover .btn-arrow {
          transform: translateX(4px);
        }

        .skip-link {
          font-size: 14px;
          color: #8A8580;
          text-decoration: none;
          transition: color 0.3s ease;
          cursor: pointer;
        }

        .skip-link:hover {
          color: #D4A574;
        }

        .decorative-element {
          position: absolute;
          bottom: 60px;
          right: 60px;
          width: 120px;
          height: 120px;
          opacity: 0.5;
        }

        .decorative-element svg {
          width: 100%;
          height: 100%;
        }

        @media (max-width: 1024px) {
          .form-container {
            grid-template-columns: 1fr;
          }

          .sidebar {
            display: none;
          }

          .main-content {
            padding: 40px 24px;
            min-height: 100vh;
          }

          .form-title {
            font-size: 36px;
          }

          .field-row {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>

      <div className="form-container">
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 5L9 2L15 5V13L9 16L3 13V5Z" stroke="#FDFBF7" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M9 8V16" stroke="#FDFBF7" strokeWidth="1.5"/>
                <path d="M3 5L9 8L15 5" stroke="#FDFBF7" strokeWidth="1.5"/>
              </svg>
            </div>
            <span className="logo-text">ExpressNext</span>
          </div>

          <nav className="steps-nav">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`step-item ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                onClick={() => goToStep(index)}
              >
                <div className="step-label">{step.label}</div>
                <div className="step-subtitle">{step.subtitle}</div>
                <div className="step-check">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#D4A574" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="security-badge">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L2 3.5V7.5C2 11.09 4.56 14.42 8 15.5C11.44 14.42 14 11.09 14 7.5V3.5L8 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                <path d="M5.5 8L7 9.5L10.5 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Your information is secure and encrypted
            </div>
          </div>
        </aside>

        <main className="main-content">
          <header className="form-header">
            <div className="step-indicator">Step {currentStep + 1} of {steps.length}</div>
            <h1 className="form-title">Who are you?</h1>
            <p className="form-description">
              We'd love to know a bit about you and your company. This helps us tailor your experience.
            </p>
          </header>

          <form className="form-fields" onSubmit={(e) => e.preventDefault()}>
            <div className="field-row">
              <div className="field-group">
                <label className="field-label">First Name</label>
                <input
                  type="text"
                  className="field-input"
                  placeholder="Jane"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
              </div>
              <div className="field-group">
                <label className="field-label">Last Name</label>
                <input
                  type="text"
                  className="field-input"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Work Email</label>
              <input
                type="email"
                className="field-input"
                placeholder="jane@company.com"
                value={formData.workEmail}
                onChange={(e) => handleInputChange('workEmail', e.target.value)}
              />
            </div>

            <div className="field-row">
              <div className="field-group">
                <label className="field-label">Company Name</label>
                <input
                  type="text"
                  className="field-input"
                  placeholder="Acme Inc."
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </div>
              <div className="field-group">
                <label className="field-label">Website URL</label>
                <input
                  type="url"
                  className="field-input"
                  placeholder="acme.com"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-primary" onClick={nextStep}>
                Continue
                <svg className="btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span className="skip-link">Save for later</span>
            </div>
          </form>

          <div className="decorative-element">
            <svg viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="58" stroke="#E8E4DE" strokeWidth="1" strokeDasharray="4 4"/>
              <circle cx="60" cy="60" r="40" stroke="#E8E4DE" strokeWidth="1"/>
              <circle cx="60" cy="60" r="20" stroke="#D4A574" strokeWidth="1" opacity="0.5"/>
            </svg>
          </div>
        </main>
      </div>
    </>
  );
};

export default ExpressNextForm;
```