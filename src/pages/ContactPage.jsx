import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ContactPage() {
  const navigate = useNavigate()
  
  // Form fields state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleBackHome = () => navigate('/')

  const getMailtoLink = () => {
    const subject = encodeURIComponent('Retirement Spending Analyzer — Support Request')
    const bodyText = `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\nQuestion/Message:\n${message}`
    return `mailto:support@howtospendyourretirement.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email || !message) return
    
    // Open user's native email client with pre-filled content
    window.location.href = getMailtoLink()
    
    // Show success state
    setSubmitted(true)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Source+Sans+3:wght@400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .cp-root {
          background: #f7f3ea;
          color: #1a2b1a;
          font-family: 'Source Sans 3', sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Nav */
        .cp-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 56px;
          background: #1c3829;
          border-bottom: 3px solid #b8860b;
        }
        .cp-logo { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .cp-logo-diamond { color: #b8860b; font-size: 22px; }
        .cp-logo-text { font-family: 'Source Sans 3', sans-serif; font-weight: 700; font-size: 18px; color: #f7f3ea; }
        .cp-logo-sub { font-size: 12px; color: #7aaa8a; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 1px; }
        .cp-nav-links { display: flex; align-items: center; gap: 24px; }
        .cp-nav-link { color: #8ab99a; text-decoration: none; font-size: 15px; font-weight: 600; cursor: pointer; transition: color 0.2s; }
        .cp-nav-link:hover { color: #f7f3ea; }
        .cp-nav-cta {
          background: #b8860b; color: #fff; border: none;
          padding: 9px 20px; border-radius: 6px;
          font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; transition: background 0.2s;
        }
        .cp-nav-cta:hover { background: #9a700a; }

        /* Container */
        .cp-container {
          max-width: 1040px;
          margin: 60px auto;
          padding: 0 24px;
          width: 100%;
          flex: 1;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 56px;
          align-items: start;
        }

        /* Left Side info */
        .cp-info-title {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 900;
          line-height: 1.15;
          margin-bottom: 24px;
          color: #1a2b1a;
        }
        .cp-info-sub {
          font-size: 18px;
          color: #4d6b55;
          line-height: 1.65;
          margin-bottom: 32px;
        }
        .cp-card {
          background: #ffffff;
          border: 1px solid rgba(45, 106, 79, 0.12);
          border-radius: 14px;
          padding: 28px;
          box-shadow: 0 4px 20px rgba(26, 43, 26, 0.04);
        }
        .cp-detail-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 20px;
        }
        .cp-detail-item:last-child { margin-bottom: 0; }
        .cp-detail-lbl {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #b8860b;
          font-weight: 700;
        }
        .cp-detail-val {
          font-size: 17px;
          font-weight: 700;
          color: #1a2b1a;
          word-break: break-all;
        }
        .cp-detail-val a {
          color: #2d6a4f;
          text-decoration: none;
          transition: border-bottom 0.15s;
          border-bottom: 1px dashed transparent;
        }
        .cp-detail-val a:hover {
          border-bottom-color: #2d6a4f;
        }
        .cp-detail-desc {
          font-size: 14px;
          color: #6b8f72;
        }

        /* Right Side Form */
        .cp-form-container {
          background: #ffffff;
          border: 1px solid rgba(45,106,79,0.15);
          border-radius: 16px;
          padding: 36px;
          box-shadow: 0 12px 40px rgba(26,43,26,0.08);
        }
        .cp-form-group {
          margin-bottom: 22px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .cp-form-label {
          font-size: 14px;
          font-weight: 600;
          color: #1a2b1a;
        }
        .cp-form-label span {
          color: #ef4444;
          margin-left: 2px;
        }
        .cp-input {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid rgba(45,106,79,0.18);
          border-radius: 8px;
          background: #fcfbfa;
          color: #1a2b1a;
          font-family: inherit;
          font-size: 15px;
          outline: none;
          transition: all 0.2s;
        }
        .cp-input:focus {
          border-color: #2d6a4f;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(45,106,79,0.1);
        }
        .cp-textarea {
          resize: vertical;
          min-height: 120px;
        }
        .cp-submit-btn {
          width: 100%;
          background: #2d6a4f;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 14px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }
        .cp-submit-btn:hover {
          background: #1e4d3a;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(45,106,79,0.25);
        }

        /* Success view */
        .cp-success-icon {
          width: 54px;
          height: 54px;
          background: rgba(45,106,79,0.1);
          color: #2d6a4f;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin: 0 auto 20px;
        }
        .cp-success-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 800;
          text-align: center;
          margin-bottom: 14px;
          color: #1a2b1a;
        }
        .cp-success-msg {
          font-size: 15px;
          color: #4d6b55;
          line-height: 1.65;
          text-align: center;
          margin-bottom: 28px;
        }
        .cp-success-btn {
          width: 100%;
          background: #b8860b;
          color: #fff;
          border: none;
          padding: 14px;
          font-size: 15px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
          text-align: center;
          display: block;
          text-decoration: none;
        }
        .cp-success-btn:hover {
          background: #9a700a;
        }
        .cp-secondary-btn {
          width: 100%;
          background: transparent;
          color: #2d6a4f;
          border: 1.5px solid #2d6a4f;
          padding: 13px;
          font-size: 15px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 10px;
          transition: background 0.2s;
          text-align: center;
          display: block;
        }
        .cp-secondary-btn:hover {
          background: rgba(45,106,79,0.06);
        }

        /* Footer */
        .cp-footer {
          border-top: 1px solid rgba(45,106,79,0.15);
          padding: 28px 56px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #1c3829;
          margin-top: auto;
        }
        .cp-fl { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 600; color: #f7f3ea; }
        .cp-fn { font-size: 14px; color: #7aaa8a; }

        @media (max-width: 768px) {
          .cp-nav { padding: 16px 24px; }
          .cp-logo-sub { display: none; }
          .cp-container { grid-template-columns: 1fr; gap: 40px; margin: 40px auto; }
          .cp-info-title { font-size: 32px; }
          .cp-form-container { padding: 24px; }
          .cp-footer { padding: 24px; flex-direction: column; gap: 12px; text-align: center; }
        }
      `}</style>

      <div className="cp-root">
        {/* Nav */}
        <nav className="cp-nav">
          <div className="cp-logo" onClick={handleBackHome}>
            <span className="cp-logo-diamond">◆</span>
            <div>
              <div className="cp-logo-text">Retirement Spending Analyzer</div>
              <div className="cp-logo-sub">Smarter retirement income planning</div>
            </div>
          </div>
          <div className="cp-nav-links">
            <span className="cp-nav-link" onClick={handleBackHome}>Home</span>
            <span className="cp-nav-link" onClick={() => navigate('/pricing')}>Pricing</span>
            <button className="cp-nav-cta" onClick={() => navigate('/app')}>Launch App →</button>
          </div>
        </nav>

        {/* Main Area */}
        <div className="cp-container">
          {/* Info Side */}
          <div>
            <h1 className="cp-info-title">Let's Connect</h1>
            <p className="cp-info-sub">
              Have questions about our multi-phase calculator, Social Security calculations,
              Required Minimum Distributions (RMDs), or privacy policies? Get in touch directly.
            </p>

            <div className="cp-card">
              <div className="cp-detail-item">
                <div className="cp-detail-lbl">Support Email</div>
                <div className="cp-detail-val">
                  <a href="mailto:support@howtospendyourretirement.com">
                    support@howtospendyourretirement.com
                  </a>
                </div>
                <div className="cp-detail-desc">
                  Write to us directly or use the contact form.
                </div>
              </div>

              <div className="cp-detail-item" style={{ marginTop: 24 }}>
                <div className="cp-detail-lbl">Typical Response Time</div>
                <div className="cp-detail-val">Within 24 Hours</div>
                <div className="cp-detail-desc">
                  We review and respond to inquiries personally.
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="cp-form-container">
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div className="cp-form-group">
                  <label className="cp-form-label">Full Name<span>*</span></label>
                  <input
                    type="text"
                    className="cp-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="cp-form-group">
                  <label className="cp-form-label">Email Address<span>*</span></label>
                  <input
                    type="email"
                    className="cp-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="cp-form-group">
                  <label className="cp-form-label">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    className="cp-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                  />
                </div>

                <div className="cp-form-group">
                  <label className="cp-form-label">Message / Question<span>*</span></label>
                  <textarea
                    className="cp-input cp-textarea"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you plan your retirement spending?"
                    required
                  />
                </div>

                <button type="submit" className="cp-submit-btn">
                  Send Message
                </button>
              </form>
            ) : (
              <div>
                <div className="cp-success-icon">✓</div>
                <h2 className="cp-success-title">Message Prepared</h2>
                <p className="cp-success-msg">
                  We have prepared your message template! Click the button below to open your device's
                  email application and send it to our support address.
                </p>
                <a href={getMailtoLink()} className="cp-success-btn">
                  Open Email Client
                </a>
                <button className="cp-secondary-btn" onClick={() => setSubmitted(false)}>
                  Modify Message
                </button>
                <button className="cp-secondary-btn" style={{ borderColor: 'transparent', color: '#64748b' }} onClick={handleBackHome}>
                  Return to Home
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="cp-footer">
          <div className="cp-fl">
            <span style={{ color: '#b8860b' }}>◆</span>
            Retirement Spending Analyzer
          </div>
          <div className="cp-fn">
            Not financial advice. Consult a qualified advisor for personalized guidance.
          </div>
        </footer>
      </div>
    </>
  )
}
