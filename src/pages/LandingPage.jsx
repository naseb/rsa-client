import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()
  const launchApp = () => navigate('/app')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Source+Sans+3:wght@400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .lp-root {
          background: #f7f3ea;
          color: #1a2b1a;
          font-family: 'Source Sans 3', sans-serif;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          font-size: 17px;
          line-height: 1.6;
        }

        /* ── NAV ── */
        .lp-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 56px;
          background: #1c3829;
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 3px solid #b8860b;
        }
        .lp-logo { display: flex; align-items: center; gap: 12px; }
        .lp-logo-diamond { color: #b8860b; font-size: 22px; }
        .lp-logo-text { font-family: 'Source Sans 3', sans-serif; font-weight: 700; font-size: 18px; color: #f7f3ea; letter-spacing: 0.01em; }
        .lp-logo-sub { font-size: 12px; color: #7aaa8a; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 1px; }
        .lp-nav-cta {
          background: #b8860b; color: #fff; border: none;
          padding: 11px 28px; border-radius: 6px;
          font-family: 'Source Sans 3', sans-serif; font-size: 16px; font-weight: 700;
          cursor: pointer; transition: background 0.2s; letter-spacing: 0.01em;
        }
        .lp-nav-cta:hover { background: #9a700a; }

        /* ── HERO ── */
        .lp-hero {
          padding: 100px 56px 80px;
          max-width: 1040px;
          margin: 0 auto;
          text-align: center;
        }
        .lp-eyebrow-pill {
          display: inline-block;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #2d6a4f;
          background: rgba(45,106,79,0.1);
          border: 1px solid rgba(45,106,79,0.25);
          padding: 7px 20px; border-radius: 100px;
          margin-bottom: 32px;
        }
        .lp-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 5.5vw, 72px);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -0.02em;
          margin-bottom: 28px;
          color: #1a2b1a;
        }
        .lp-hero-title .accent { color: #2d6a4f; }
        .lp-hero-title em { color: #b8860b; font-style: italic; }
        .lp-hero-sub {
          font-size: 20px;
          color: #3d5c42;
          line-height: 1.75;
          max-width: 680px;
          margin: 0 auto 44px;
          font-weight: 400;
        }
        .lp-hero-sub em { color: #1a2b1a; font-style: italic; font-weight: 600; }
        .lp-hero-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .lp-btn-primary {
          background: #2d6a4f; color: #fff; border: none;
          padding: 16px 40px; border-radius: 8px;
          font-family: 'Source Sans 3', sans-serif; font-size: 18px; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; gap: 10px;
          letter-spacing: 0.01em;
        }
        .lp-btn-primary:hover { background: #1e4d3a; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(45,106,79,0.3); }
        .lp-btn-ghost {
          background: transparent; color: #2d6a4f;
          border: 2px solid #2d6a4f;
          padding: 15px 36px; border-radius: 8px;
          font-family: 'Source Sans 3', sans-serif; font-size: 18px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .lp-btn-ghost:hover { background: rgba(45,106,79,0.08); }

        /* ── APP PREVIEW ── */
        .lp-preview-wrap { padding: 0 56px 88px; max-width: 1040px; margin: 0 auto; }
        .lp-preview-card {
          background: #1e293b;
          border: 1px solid rgba(148,163,184,0.15);
          border-radius: 16px; overflow: hidden;
          box-shadow: 0 24px 64px rgba(26,43,26,0.18);
        }
        .lp-preview-bar {
          background: #0f172a; padding: 14px 20px;
          display: flex; align-items: center; gap: 8px;
          border-bottom: 1px solid rgba(148,163,184,0.1);
        }
        .lp-dot { width: 11px; height: 11px; border-radius: 50%; }
        .lp-preview-url {
          flex: 1; margin: 0 14px;
          background: rgba(255,255,255,0.07);
          border-radius: 6px; padding: 6px 14px;
          font-size: 13px; color: #64748b; text-align: center; font-family: monospace;
        }
        .lp-preview-content { padding: 28px 32px; }
        .lp-preview-header {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%);
          border-radius: 12px; padding: 20px 26px; margin-bottom: 20px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .lp-ph-eyebrow { font-size: 11px; color: #64748b; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 5px; }
        .lp-ph-title { font-family: 'Source Sans 3', sans-serif; font-weight: 700; font-size: 17px; color: #f8fafc; }
        .lp-ph-sub { font-size: 12px; color: #94a3b8; margin-top: 4px; }
        .lp-ph-val { font-size: 26px; font-weight: 700; color: #10b981; font-family: monospace; text-align: right; }
        .lp-ph-lbl { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; text-align: right; }
        .lp-mini-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 18px; }
        .lp-mc { background: rgba(255,255,255,0.05); border: 1px solid rgba(148,163,184,0.1); border-radius: 10px; padding: 14px 16px; }
        .lp-mc-lbl { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
        .lp-mc-val { font-size: 20px; font-weight: 700; color: #10b981; font-family: monospace; }
        .lp-mc-sub { font-size: 12px; color: #64748b; margin-top: 3px; }
        .lp-pt { width: 100%; border-collapse: collapse; font-size: 13px; }
        .lp-pt th { color: #64748b; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em; padding: 8px 14px; border-bottom: 1px solid rgba(148,163,184,0.1); text-align: left; font-weight: 600; }
        .lp-pt td { padding: 8px 14px; border-bottom: 1px solid rgba(148,163,184,0.06); color: #94a3b8; }
        .lp-pt td:first-child { color: #f1f5f9; font-weight: 500; }
        .lp-pt td.lp-g { color: #10b981; font-weight: 600; font-family: monospace; }
        .lp-pb { display: inline-block; font-size: 11px; font-weight: 600; padding: 2px 9px; border-radius: 4px; background: rgba(16,185,129,0.12); color: #10b981; }
        .lp-pb.slow { background: rgba(148,163,184,0.1); color: #94a3b8; }

        /* ── DIVIDER ── */
        .lp-gold-divider {
          height: 3px;
          background: linear-gradient(90deg, transparent, #b8860b, transparent);
          margin: 0;
        }

        /* ── FEATURES ── */
        .lp-features { padding: 88px 56px; max-width: 1040px; margin: 0 auto; }
        .lp-eyebrow { font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #b8860b; margin-bottom: 12px; }
        .lp-sec-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(34px, 4vw, 46px); font-weight: 800;
          letter-spacing: -0.02em; margin-bottom: 52px;
          line-height: 1.15; color: #1a2b1a;
        }
        .lp-fg { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .lp-fc {
          background: #ffffff;
          border: 1px solid rgba(45,106,79,0.12);
          border-radius: 14px; padding: 32px 28px;
          transition: all 0.2s;
          box-shadow: 0 2px 12px rgba(26,43,26,0.06);
        }
        .lp-fc:hover { border-color: rgba(45,106,79,0.3); box-shadow: 0 8px 32px rgba(26,43,26,0.1); transform: translateY(-2px); }
        .lp-fi {
          width: 48px; height: 48px;
          background: rgba(45,106,79,0.1);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; margin-bottom: 18px;
        }
        .lp-ft { font-weight: 700; font-size: 18px; margin-bottom: 10px; color: #1a2b1a; }
        .lp-fd { font-size: 16px; color: #4d6b55; line-height: 1.65; }

        /* ── HOW IT WORKS ── */
        .lp-how {
          padding: 88px 56px;
          background: #1c3829;
          border-top: 3px solid #b8860b;
          border-bottom: 3px solid #b8860b;
        }
        .lp-how .lp-eyebrow { color: #b8860b; }
        .lp-how .lp-sec-title { color: #f7f3ea; }
        .lp-how-inner { max-width: 1040px; margin: 0 auto; }
        .lp-how-steps {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 40px; margin-top: 52px; position: relative;
        }
        .lp-how-steps::before {
          content: '';
          position: absolute; top: 28px;
          left: calc(16.66% + 14px); right: calc(16.66% + 14px);
          height: 2px;
          background: linear-gradient(90deg, #b8860b, rgba(184,134,11,0.2));
        }
        .lp-step { text-align: center; position: relative; }
        .lp-sn {
          width: 54px; height: 54px; border-radius: 50%;
          background: #b8860b; color: #fff;
          font-family: 'Playfair Display', serif; font-weight: 800; font-size: 20px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px; position: relative; z-index: 1;
          box-shadow: 0 4px 16px rgba(184,134,11,0.4);
        }
        .lp-st { font-weight: 700; font-size: 18px; margin-bottom: 10px; color: #f7f3ea; }
        .lp-sd { font-size: 16px; color: #8ab99a; line-height: 1.65; }

        /* ── VS SECTION ── */
        .lp-vs { padding: 88px 56px; max-width: 1040px; margin: 0 auto; }
        .lp-vs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-top: 52px; }
        .lp-vc {
          border: 1px solid rgba(45,106,79,0.15);
          border-radius: 16px; padding: 36px 32px;
          background: #fff;
          box-shadow: 0 2px 12px rgba(26,43,26,0.06);
        }
        .lp-vc.feat {
          border-color: #2d6a4f;
          border-width: 2px;
          background: #f0f8f4;
          box-shadow: 0 8px 32px rgba(45,106,79,0.12);
        }
        .lp-vb { font-size: 13px; font-weight: 700; padding: 4px 14px; border-radius: 100px; display: inline-block; margin-bottom: 16px; }
        .lp-vb.green { color: #fff; background: #2d6a4f; }
        .lp-vb.gray { color: #6b8f72; background: rgba(45,106,79,0.1); }
        .lp-vn { font-family: 'Playfair Display', serif; font-weight: 800; font-size: 24px; margin-bottom: 8px; color: #1a2b1a; }
        .lp-vn.muted { color: #8aaa90; }
        .lp-vt { font-size: 16px; color: #5a7a60; margin-bottom: 24px; }
        .lp-vl { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .lp-vl li { font-size: 16px; color: #2d4a35; display: flex; align-items: flex-start; gap: 10px; line-height: 1.5; }
        .lp-vl li::before { content: '✓'; color: #2d6a4f; font-weight: 800; flex-shrink: 0; font-size: 16px; }
        .lp-vl li.no { color: #9aaa9a; }
        .lp-vl li.no::before { content: '✗'; color: #c4d4c4; }

        /* ── CTA BAND ── */
        .lp-cta-band { padding: 100px 56px; text-align: center; background: #f0ebe0; border-top: 1px solid rgba(45,106,79,0.12); }
        .lp-cta-inner { max-width: 640px; margin: 0 auto; }
        .lp-cta-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 4vw, 52px); font-weight: 900;
          letter-spacing: -0.02em; margin-bottom: 18px;
          line-height: 1.12; color: #1a2b1a;
        }
        .lp-cta-sub { font-size: 19px; color: #4d6b55; margin-bottom: 40px; line-height: 1.7; }
        .lp-free-note { font-size: 15px; color: #7a9b82; margin-top: 16px; }

        /* ── FOOTER ── */
        .lp-footer {
          border-top: 1px solid rgba(45,106,79,0.15);
          padding: 28px 56px;
          display: flex; justify-content: space-between; align-items: center;
          background: #1c3829;
        }
        .lp-fl { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 600; color: #f7f3ea; }
        .lp-fn { font-size: 14px; color: #7aaa8a; }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .lp-nav { padding: 16px 24px; }
          .lp-logo-sub { display: none; }
          .lp-hero { padding: 64px 24px 52px; }
          .lp-hero-title { font-size: 38px; }
          .lp-hero-sub { font-size: 18px; }
          .lp-preview-wrap { padding: 0 24px 64px; }
          .lp-mini-row { grid-template-columns: 1fr; }
          .lp-features { padding: 64px 24px; }
          .lp-fg { grid-template-columns: 1fr; }
          .lp-how { padding: 64px 24px; }
          .lp-how-steps { grid-template-columns: 1fr; gap: 32px; }
          .lp-how-steps::before { display: none; }
          .lp-vs { padding: 64px 24px; }
          .lp-vs-grid { grid-template-columns: 1fr; }
          .lp-cta-band { padding: 64px 24px; }
          .lp-footer { padding: 24px; flex-direction: column; gap: 12px; text-align: center; }
        }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .lp-hero .lp-eyebrow-pill { animation: fadeUp 0.5s ease both; }
        .lp-hero .lp-hero-title    { animation: fadeUp 0.5s 0.1s ease both; }
        .lp-hero .lp-hero-sub      { animation: fadeUp 0.5s 0.2s ease both; }
        .lp-hero .lp-hero-btns     { animation: fadeUp 0.5s 0.3s ease both; }
      `}</style>

      <div className="lp-root">

        {/* ── NAV ── */}
        <nav className="lp-nav">
          <div className="lp-logo">
            <span className="lp-logo-diamond">◆</span>
            <div>
              <div className="lp-logo-text">Retirement Spending Analyzer</div>
              <div className="lp-logo-sub">Smarter retirement income planning</div>
            </div>
          </div>
          <button className="lp-nav-cta" onClick={launchApp}>Launch App →</button>
        </nav>

        {/* ── HERO ── */}
        <section className="lp-hero">
          <div className="lp-eyebrow-pill">The Smarter Retirement Income Planning Tool</div>
          <h1 className="lp-hero-title">
            "Stop Guessing How Much You Can Spend In Retirement. Know Exactly What Your Accounts Can Pay You."
          </h1>
          <p className="lp-hero-sub">
            You spent decades building your accounts. Now comes the question
            that keeps retirees up at night:{' '}
            <em>how much can I actually take out without running dry?</em>{' '}
            Enter your balances once and get a precise, personalized answer —
            built around your real taxes, Social Security, and how your
            spending naturally changes as you age.
          </p>
          <div className="lp-hero-btns">
            <button className="lp-btn-primary" onClick={launchApp}>
              Launch the App →
            </button>
            <button className="lp-btn-ghost"
              onClick={() => document.getElementById('how').scrollIntoView({ behavior: 'smooth' })}>
              See how it works
            </button>
          </div>
        </section>

        {/* ── APP PREVIEW ── */}
        <div className="lp-preview-wrap">
          <div className="lp-preview-card">
            <div className="lp-preview-bar">
              <div className="lp-dot" style={{ background: '#ef4444' }} />
              <div className="lp-dot" style={{ background: '#f59e0b' }} />
              <div className="lp-dot" style={{ background: '#10b981' }} />
              <div className="lp-preview-url">howtospendyourretirement.com/app</div>
            </div>
            <div className="lp-preview-content">
              <div className="lp-preview-header">
                <div>
                  <div className="lp-ph-eyebrow">Retirement Spending Analyzer</div>
                  <div className="lp-ph-title">
                    ◆ <span style={{ color: '#10b981' }}>Go-Go</span>{' '}
                    · <span style={{ color: '#94a3b8' }}>Slow-Go</span>{' '}
                    · <span style={{ color: '#475569' }}>No-Go</span>
                  </div>
                  <div className="lp-ph-sub">Portfolio: $1,850,000 · Goal: $500,000 at age 90</div>
                </div>
                <div>
                  <div className="lp-ph-val">$114,200</div>
                  <div className="lp-ph-lbl">Annual Spending</div>
                </div>
              </div>
              <div className="lp-mini-row">
                <div className="lp-mc">
                  <div className="lp-mc-lbl">Go-Go Spending</div>
                  <div className="lp-mc-val">$114,200</div>
                  <div className="lp-mc-sub">$9,517/mo · Ages 65–75</div>
                </div>
                <div className="lp-mc">
                  <div className="lp-mc-lbl">Slow-Go Spending</div>
                  <div className="lp-mc-val" style={{ color: '#94a3b8' }}>$91,360</div>
                  <div className="lp-mc-sub">$7,613/mo · Ages 75–85</div>
                </div>
                <div className="lp-mc">
                  <div className="lp-mc-lbl">No-Go Spending</div>
                  <div className="lp-mc-val" style={{ color: '#94a3b8' }}>$68,520</div>
                  <div className="lp-mc-sub">$5,710/mo · Ages 85–90</div>
                </div>
              </div>
              <table className="lp-pt">
                <thead>
                  <tr>
                    <th>Age</th><th>Phase</th><th>Spending</th><th>Portfolio</th><th>Tax</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>65</td><td><span className="lp-pb">Go-Go</span></td><td className="lp-g">$114,200</td><td>$1,822,400</td><td>$18,340</td></tr>
                  <tr><td>70</td><td><span className="lp-pb">Go-Go</span></td><td className="lp-g">$114,200</td><td>$1,634,100</td><td>$20,180</td></tr>
                  <tr><td>75</td><td><span className="lp-pb slow">Slow-Go</span></td><td style={{ color: '#94a3b8', fontFamily: 'monospace' }}>$91,360</td><td>$1,490,200</td><td>$14,220</td></tr>
                  <tr><td>80</td><td><span className="lp-pb slow">Slow-Go</span></td><td style={{ color: '#94a3b8', fontFamily: 'monospace' }}>$91,360</td><td>$1,280,500</td><td>$15,890</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lp-gold-divider" />

        {/* ── FEATURES ── */}
        <section className="lp-features">
          <div className="lp-eyebrow">What makes it different</div>
          <h2 className="lp-sec-title">Built for how retirement<br />actually works</h2>
          <div className="lp-fg">
            {[
              { icon: '◆', title: 'Three-Phase Spending', desc: 'Go-Go, Slow-Go, and No-Go phases reflect your real lifestyle arc. Spend more while you\'re active, taper naturally as your pace slows.' },
              { icon: '📊', title: 'RMD & IRMAA Aware', desc: 'Accounts for Required Minimum Distributions and Medicare IRMAA surcharges — the details most retirement tools completely ignore.' },
              { icon: '📉', title: 'Market Crash Modeling', desc: 'Override market returns in any year to see exactly how a downturn affects your plan — and how long your portfolio takes to recover.' },
              { icon: '🔐', title: 'Fully Private', desc: 'Your data never leaves your browser. Export and import your complete plan as a local file at any time.' },
              { icon: '🆚', title: 'vs. 4% Rule Comparison', desc: 'See side-by-side how your personalized RSA compares to the standard 4% rule using your actual numbers.' },
              { icon: '⚡', title: 'Tax Optimization Pro', desc: 'Bracket filling, Roth conversion ladders, and dynamic withdrawal sequencing — personalized to your accounts to minimize lifetime federal taxes.', comingSoon: true },
            ].map(f => (
              <div className="lp-fc" key={f.title}>
                <div className="lp-fi">{f.icon}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div className="lp-ft" style={{ marginBottom: 0 }}>{f.title}</div>
                  {f.comingSoon && (
                    <span style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
                      textTransform: 'uppercase', padding: '3px 10px', borderRadius: 100,
                      background: '#10b981', color: '#fff',
                      whiteSpace: 'nowrap', flexShrink: 0,
                    }}>Coming Soon</span>
                  )}
                </div>
                <div className="lp-fd">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="lp-gold-divider" />

        {/* ── HOW IT WORKS ── */}
        <section className="lp-how" id="how">
          <div className="lp-how-inner">
            <div className="lp-eyebrow">How it works</div>
            <h2 className="lp-sec-title">Three steps to your number</h2>
            <div className="lp-how-steps">
              {[
                {
                  n: '1',
                  title: 'Enter your accounts',
                  desc: 'Add your Pre-tax, Roth, and taxable account balances. Include your Social Security start age and expected monthly benefit.',
                },
                {
                  n: '2',
                  title: 'Define your phases',
                  desc: 'Set the ages when your Go-Go, Slow-Go, and No-Go phases begin. Adjust the spending percentage for each phase.',
                },
                {
                  n: '3',
                  title: 'Get your number',
                  desc: 'The analyzer finds your maximum sustainable Go-Go spending while meeting your end-of-life portfolio goal.',
                },
              ].map(s => (
                <div className="lp-step" key={s.n}>
                  <div className="lp-sn">{s.n}</div>
                  <div className="lp-st">{s.title}</div>
                  <div className="lp-sd">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="lp-gold-divider" />

        {/* ── VS ── */}
        <section className="lp-vs">
          <div className="lp-eyebrow">The difference</div>
          <h2 className="lp-sec-title">RSA vs the 4% Rule</h2>
          <div className="lp-vs-grid">
            <div className="lp-vc feat">
              <div className="lp-vb green">◆ RSA</div>
              <div className="lp-vn">Retirement Spending Analyzer</div>
              <div className="lp-vt">Adapts to your life, your taxes, your plan</div>
              <ul className="lp-vl">
                {[
                  'Three-phase spending that adapts as you age',
                  'Federal tax bracket calculations built in',
                  'RMD handling and IRMAA surcharges',
                  'Social Security claiming optimization',
                  'Multi-account withdrawal sequencing',
                  'Market crash scenario modeling',
                  'End-of-life portfolio goal target',
                ].map(i => <li key={i}>{i}</li>)}
              </ul>
            </div>
            <div className="lp-vc">
              <div className="lp-vb gray">The standard approach</div>
              <div className="lp-vn muted">The 4% Rule</div>
              <div className="lp-vt">Simple, but one-size-fits-all</div>
              <ul className="lp-vl">
                {[
                  'Flat spending every year regardless of lifestyle',
                  'No tax optimization',
                  'No RMD or IRMAA awareness',
                  'No Social Security integration',
                  'No account-type sequencing',
                  'No scenario modeling',
                  'No bequest / goal target',
                ].map(i => <li className="no" key={i}>{i}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="lp-cta-band">
          <div className="lp-cta-inner">
            <h2 className="lp-cta-title">Ready to find your number?</h2>
            <p className="lp-cta-sub">
              Start your 7-day free trial. No credit card required.
              Takes about 5 minutes to enter your accounts and see your answer.
            </p>
            <button className="lp-btn-primary"
              style={{ margin: '0 auto', fontSize: 19, padding: '18px 52px' }}
              onClick={launchApp}>
              Launch the App →
            </button>
            <p className="lp-free-note">
              7-day free trial · Cancel anytime · Your data stays on your device
            </p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="lp-footer">
          <div className="lp-fl">
            <span style={{ color: '#b8860b' }}>◆</span>
            Retirement Spending Analyzer
          </div>
          <div className="lp-fn">
            Not financial advice. Consult a qualified advisor for personalized guidance.
          </div>
        </footer>

      </div>
    </>
  )
}
