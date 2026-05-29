import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  const launchApp = () => navigate('/app')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .lp-root {
          background: #0f172a;
          color: #f1f5f9;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        /* NAV */
        .lp-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 48px;
          border-bottom: 1px solid rgba(148,163,184,0.12);
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(15,23,42,0.95);
          backdrop-filter: blur(12px);
        }
        .lp-logo { display: flex; align-items: center; gap: 10px; }
        .lp-logo-diamond { color: #10b981; font-size: 20px; }
        .lp-logo-text { font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px; color: #f1f5f9; }
        .lp-logo-sub { font-size: 11px; color: #94a3b8; letter-spacing: 0.07em; text-transform: uppercase; }
        .lp-nav-cta {
          background: #10b981; color: #fff; border: none;
          padding: 9px 22px; border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: background 0.2s;
        }
        .lp-nav-cta:hover { background: #059669; }

        /* HERO */
        .lp-hero {
          padding: 90px 48px 72px;
          max-width: 960px;
          margin: 0 auto;
          text-align: center;
        }
        .lp-eyebrow-pill {
          display: inline-block;
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #10b981;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.2);
          padding: 6px 16px; border-radius: 100px;
          margin-bottom: 28px;
        }
        .lp-hero-title {
          font-family: 'Raleway', sans-serif;
          font-size: clamp(38px, 5vw, 62px);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.01em;
          margin-bottom: 22px;
          color: #f8fafc;
        }
        .lp-hero-title .accent { color: #10b981; }
        .lp-hero-sub {
          font-size: 18px; color: #94a3b8; line-height: 1.8;
          max-width: 620px; margin: 0 auto 40px;
        }
        .lp-hero-sub em { color: #cbd5e1; font-style: italic; }
        .lp-hero-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .lp-btn-primary {
          background: #10b981; color: #fff; border: none;
          padding: 15px 36px; border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; gap: 8px;
        }
        .lp-btn-primary:hover { background: #059669; transform: translateY(-1px); }
        .lp-btn-ghost {
          background: transparent; color: #f1f5f9;
          border: 1px solid rgba(148,163,184,0.2);
          padding: 15px 32px; border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
        }
        .lp-btn-ghost:hover { border-color: rgba(148,163,184,0.4); background: rgba(255,255,255,0.04); }

        /* APP PREVIEW */
        .lp-preview-wrap { padding: 0 48px 80px; max-width: 960px; margin: 0 auto; }
        .lp-preview-card {
          background: #1e293b;
          border: 1px solid rgba(148,163,184,0.12);
          border-radius: 16px; overflow: hidden;
        }
        .lp-preview-bar {
          background: #0f172a; padding: 13px 20px;
          display: flex; align-items: center; gap: 8px;
          border-bottom: 1px solid rgba(148,163,184,0.1);
        }
        .lp-dot { width: 10px; height: 10px; border-radius: 50%; }
        .lp-preview-url {
          flex: 1; margin: 0 12px;
          background: rgba(255,255,255,0.06);
          border-radius: 6px; padding: 5px 12px;
          font-size: 11px; color: #64748b; text-align: center;
        }
        .lp-preview-content { padding: 24px 28px; }
        .lp-preview-header {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%);
          border-radius: 12px; padding: 18px 24px; margin-bottom: 18px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .lp-ph-eyebrow { font-size: 10px; color: #64748b; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 4px; }
        .lp-ph-title { font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 16px; color: #f8fafc; }
        .lp-ph-sub { font-size: 11px; color: #94a3b8; margin-top: 3px; }
        .lp-ph-val { font-size: 22px; font-weight: 700; color: #10b981; font-family: monospace; text-align: right; }
        .lp-ph-lbl { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; text-align: right; }
        .lp-mini-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px; }
        .lp-mc {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(148,163,184,0.1);
          border-radius: 10px; padding: 13px 15px;
        }
        .lp-mc-lbl { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 5px; }
        .lp-mc-val { font-size: 19px; font-weight: 700; color: #10b981; font-family: monospace; }
        .lp-mc-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
        .lp-pt { width: 100%; border-collapse: collapse; font-size: 12px; }
        .lp-pt th {
          color: #64748b; text-transform: uppercase; font-size: 10px;
          letter-spacing: 0.08em; padding: 7px 12px;
          border-bottom: 1px solid rgba(148,163,184,0.1);
          text-align: left; font-weight: 600;
        }
        .lp-pt td { padding: 7px 12px; border-bottom: 1px solid rgba(148,163,184,0.06); color: #94a3b8; }
        .lp-pt td:first-child { color: #f1f5f9; font-weight: 500; }
        .lp-pt td.lp-g { color: #10b981; font-weight: 600; font-family: monospace; }
        .lp-pb {
          display: inline-block; font-size: 10px; font-weight: 600;
          padding: 2px 8px; border-radius: 4px;
          background: rgba(16,185,129,0.12); color: #10b981;
        }
        .lp-pb.slow { background: rgba(148,163,184,0.1); color: #94a3b8; }

        /* FEATURES */
        .lp-features { padding: 72px 48px; max-width: 960px; margin: 0 auto; }
        .lp-eyebrow { font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #10b981; margin-bottom: 10px; }
        .lp-sec-title {
          font-family: 'Raleway', sans-serif;
          font-size: 34px; font-weight: 900;
          letter-spacing: -0.01em; margin-bottom: 44px;
          line-height: 1.15; color: #f8fafc;
        }
        .lp-fg { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .lp-fc {
          background: #1e293b;
          border: 1px solid rgba(148,163,184,0.12);
          border-radius: 14px; padding: 26px 22px;
          transition: border-color 0.2s;
        }
        .lp-fc:hover { border-color: rgba(16,185,129,0.3); }
        .lp-fi {
          width: 40px; height: 40px;
          background: rgba(16,185,129,0.1);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; margin-bottom: 14px;
        }
        .lp-ft { font-weight: 700; font-size: 14px; margin-bottom: 7px; color: #f1f5f9; }
        .lp-fd { font-size: 13px; color: #94a3b8; line-height: 1.6; }

        /* HOW IT WORKS */
        .lp-how {
          padding: 72px 48px;
          background: #0d1a2d;
          border-top: 1px solid rgba(148,163,184,0.1);
          border-bottom: 1px solid rgba(148,163,184,0.1);
        }
        .lp-how-inner { max-width: 960px; margin: 0 auto; }
        .lp-how-steps {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 32px; margin-top: 44px; position: relative;
        }
        .lp-how-steps::before {
          content: '';
          position: absolute; top: 21px;
          left: calc(16.66% + 10px); right: calc(16.66% + 10px);
          height: 1px;
          background: linear-gradient(90deg, #10b981, rgba(16,185,129,0.15));
        }
        .lp-step { text-align: center; position: relative; }
        .lp-sn {
          width: 42px; height: 42px; border-radius: 50%;
          background: #10b981; color: #fff;
          font-family: 'Raleway', sans-serif; font-weight: 800; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 14px; position: relative; z-index: 1;
        }
        .lp-st { font-weight: 700; font-size: 14px; margin-bottom: 7px; color: #f1f5f9; }
        .lp-sd { font-size: 13px; color: #94a3b8; line-height: 1.6; }

        /* VS SECTION */
        .lp-vs { padding: 72px 48px; max-width: 960px; margin: 0 auto; }
        .lp-vs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; margin-top: 44px; }
        .lp-vc { border: 1px solid rgba(148,163,184,0.12); border-radius: 14px; padding: 26px 22px; background: #1e293b; }
        .lp-vc.feat { border-color: rgba(16,185,129,0.35); background: rgba(16,185,129,0.04); }
        .lp-vb { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 100px; display: inline-block; margin-bottom: 12px; }
        .lp-vb.green { color: #10b981; background: rgba(16,185,129,0.12); }
        .lp-vb.gray { color: #64748b; background: rgba(148,163,184,0.1); }
        .lp-vn { font-family: 'Raleway', sans-serif; font-weight: 800; font-size: 20px; margin-bottom: 5px; }
        .lp-vt { font-size: 13px; color: #64748b; margin-bottom: 18px; }
        .lp-vl { list-style: none; display: flex; flex-direction: column; gap: 9px; }
        .lp-vl li { font-size: 13px; color: #94a3b8; display: flex; align-items: flex-start; gap: 8px; }
        .lp-vl li::before { content: '✓'; color: #10b981; font-weight: 700; flex-shrink: 0; }
        .lp-vl li.no { color: #475569; }
        .lp-vl li.no::before { content: '✗'; color: #334155; }

        /* CTA BAND */
        .lp-cta-band { padding: 80px 48px; text-align: center; }
        .lp-cta-inner { max-width: 580px; margin: 0 auto; }
        .lp-cta-title {
          font-family: 'Raleway', sans-serif;
          font-size: 38px; font-weight: 900;
          letter-spacing: -0.01em; margin-bottom: 14px;
          line-height: 1.15; color: #f8fafc;
        }
        .lp-cta-sub { font-size: 16px; color: #94a3b8; margin-bottom: 34px; line-height: 1.7; }
        .lp-free-note { font-size: 12px; color: #475569; margin-top: 14px; }

        /* FOOTER */
        .lp-footer {
          border-top: 1px solid rgba(148,163,184,0.1);
          padding: 22px 48px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .lp-fl { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #f1f5f9; }
        .lp-fn { font-size: 12px; color: #475569; }

        @media (max-width: 700px) {
          .lp-nav { padding: 16px 20px; }
          .lp-logo-sub { display: none; }
          .lp-hero { padding: 60px 20px 48px; }
          .lp-preview-wrap { padding: 0 20px 60px; }
          .lp-mini-row { grid-template-columns: 1fr; }
          .lp-features { padding: 60px 20px; }
          .lp-fg { grid-template-columns: 1fr 1fr; }
          .lp-how { padding: 60px 20px; }
          .lp-how-steps { grid-template-columns: 1fr; }
          .lp-how-steps::before { display: none; }
          .lp-vs { padding: 60px 20px; }
          .lp-vs-grid { grid-template-columns: 1fr; }
          .lp-cta-band { padding: 60px 20px; }
          .lp-footer { padding: 20px; flex-direction: column; gap: 10px; text-align: center; }
        }
      `}</style>

      <div className="lp-root">

        {/* NAV */}
        <nav className="lp-nav">
          <div className="lp-logo">
            <span className="lp-logo-diamond">◆</span>
            <div>
              <div className="lp-logo-text">Retirement Spending Allowance</div>
              <div className="lp-logo-sub">Smarter retirement income planning</div>
            </div>
          </div>
          <button className="lp-nav-cta" onClick={launchApp}>Launch App →</button>
        </nav>

        {/* HERO */}
        <section className="lp-hero">
          <div className="lp-eyebrow-pill">The Smarter Retirement Income Planning Tool</div>
          <h1 className="lp-hero-title">
            Not "how little can I live on" —<br />but "how much can I actually <span className="accent">spend</span>?"
          </h1>
          <p className="lp-hero-sub">
            You spent decades building your accounts. Now comes the question that keeps retirees up at night:{' '}
            <em>how much can I actually take out without running dry?</em>{' '}
            Enter your balances once and get a precise, personalized answer — built around your real taxes, Social Security, and how your spending naturally changes as you age.
          </p>
          <div className="lp-hero-btns">
            <button className="lp-btn-primary" onClick={launchApp}>Launch the App →</button>
            <button className="lp-btn-ghost" onClick={() => document.getElementById('how').scrollIntoView({ behavior: 'smooth' })}>See how it works</button>
          </div>
        </section>

        {/* APP PREVIEW */}
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
                  <div className="lp-ph-eyebrow">Retirement Spending Allowance</div>
                  <div className="lp-ph-title">
                    ◆ <span style={{ color: '#10b981' }}>Go-Go</span> · <span style={{ color: '#94a3b8' }}>Slow-Go</span> · <span style={{ color: '#475569' }}>No-Go</span>
                  </div>
                  <div className="lp-ph-sub">Portfolio: $1,850,000 · Goal: $500,000 at age 90</div>
                </div>
                <div>
                  <div className="lp-ph-val">$114,200</div>
                  <div className="lp-ph-lbl">Annual Allowance</div>
                </div>
              </div>
              <div className="lp-mini-row">
                <div className="lp-mc"><div className="lp-mc-lbl">Go-Go Spending</div><div className="lp-mc-val">$114,200</div><div className="lp-mc-sub">$9,517/mo · Ages 65–75</div></div>
                <div className="lp-mc"><div className="lp-mc-lbl">Slow-Go Spending</div><div className="lp-mc-val" style={{ color: '#94a3b8' }}>$91,360</div><div className="lp-mc-sub">$7,613/mo · Ages 75–85</div></div>
                <div className="lp-mc"><div className="lp-mc-lbl">No-Go Spending</div><div className="lp-mc-val" style={{ color: '#94a3b8' }}>$68,520</div><div className="lp-mc-sub">$5,710/mo · Ages 85–90</div></div>
              </div>
              <table className="lp-pt">
                <thead><tr><th>Age</th><th>Phase</th><th>Spending</th><th>Portfolio</th><th>Tax</th></tr></thead>
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

        {/* FEATURES */}
        <section className="lp-features">
          <div className="lp-eyebrow">What makes it different</div>
          <h2 className="lp-sec-title">Built for how retirement<br />actually works</h2>
          <div className="lp-fg">
            {[
              { icon: '◆', title: 'Three-Phase Spending', desc: 'Go-Go, Slow-Go, and No-Go phases reflect your real lifestyle arc. Spend more while you\'re active, taper naturally as you slow down.' },
              { icon: '⚡', title: 'Tax-Optimized Withdrawals', desc: 'Automatically sequences withdrawals across Pre-tax, Tax-free, and Taxable accounts to minimize your lifetime tax burden.' },
              { icon: '📊', title: 'RMD & IRMAA Aware', desc: 'Accounts for Required Minimum Distributions and Medicare IRMAA surcharges — the details most tools ignore.' },
              { icon: '📉', title: 'Market Crash Modeling', desc: 'Override market returns in any year to see exactly how a downturn affects your plan — and how you recover.' },
              { icon: '🔐', title: 'Fully Private', desc: 'Your data never leaves your browser. No account required. Export and import your plan as a local JSON file.' },
              { icon: '🆚', title: 'vs. 4% Rule Comparison', desc: 'See side-by-side how your personalized RSA stacks up against the standard 4% rule using your actual numbers.' },
            ].map(f => (
              <div className="lp-fc" key={f.title}>
                <div className="lp-fi">{f.icon}</div>
                <div className="lp-ft">{f.title}</div>
                <div className="lp-fd">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="lp-how" id="how">
          <div className="lp-how-inner">
            <div className="lp-eyebrow">How it works</div>
            <h2 className="lp-sec-title">Three steps to your number</h2>
            <div className="lp-how-steps">
              {[
                { n: '1', title: 'Enter your accounts', desc: 'Add your Pre-tax, Roth, and taxable balances. Include your Social Security start age and expected benefit.' },
                { n: '2', title: 'Define your phases', desc: 'Set the ages when your Go-Go, Slow-Go, and No-Go phases begin. Adjust the spending ratio between phases.' },
                { n: '3', title: 'Get your allowance', desc: 'The solver finds your maximum sustainable Go-Go spending while meeting your end-of-life portfolio goal.' },
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

        {/* VS */}
        <section className="lp-vs">
          <div className="lp-eyebrow">The difference</div>
          <h2 className="lp-sec-title">RSA vs the 4% Rule</h2>
          <div className="lp-vs-grid">
            <div className="lp-vc feat">
              <div className="lp-vb green">◆ RSA</div>
              <div className="lp-vn" style={{ color: '#10b981' }}>Retirement Spending Allowance</div>
              <div className="lp-vt">Adapts to your life, your taxes, your plan</div>
              <ul className="lp-vl">
                {['Three-phase spending that adapts as you age','Federal tax bracket calculations built in','RMD handling and IRMAA surcharges','Social Security claiming optimization','Multi-account withdrawal sequencing','Market crash scenario modeling','End-of-life portfolio goal target'].map(i => <li key={i}>{i}</li>)}
              </ul>
            </div>
            <div className="lp-vc">
              <div className="lp-vb gray">The standard approach</div>
              <div className="lp-vn" style={{ color: '#94a3b8' }}>The 4% Rule</div>
              <div className="lp-vt">Simple, but one-size-fits-all</div>
              <ul className="lp-vl">
                {['Flat spending every year regardless of lifestyle','No tax optimization','No RMD or IRMAA awareness','No Social Security integration','No account-type sequencing','No scenario modeling','No bequest / goal target'].map(i => <li className="no" key={i}>{i}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="lp-cta-band">
          <div className="lp-cta-inner">
            <h2 className="lp-cta-title">Ready to find your number?</h2>
            <p className="lp-cta-sub">No account required. Your data stays on your device. Takes about 5 minutes to set up your plan.</p>
            <button className="lp-btn-primary" style={{ margin: '0 auto', fontSize: 17, padding: '18px 44px' }} onClick={launchApp}>
              Launch the App →
            </button>
            <p className="lp-free-note">Free to use · No data stored · Works on desktop and mobile</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="lp-footer">
          <div className="lp-fl"><span style={{ color: '#10b981' }}>◆</span> Retirement Spending Allowance</div>
          <div className="lp-fn">Not financial advice. Consult a qualified advisor for personalized guidance.</div>
        </footer>

      </div>
    </>
  )
}
