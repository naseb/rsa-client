import { useNavigate, Link } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta'

export default function LandingPage() {
  const navigate = useNavigate()
  const launchApp = () => navigate('/app')

  usePageMeta({
    title: "Retirement Income Calculator — Tax-Efficient Spending Analyzer",
    description: "Calculate your maximum sustainable retirement spending and plan a tax-efficient withdrawal strategy with our Retirement Income Calculator. Model RMD taxes, IRMAA surcharges, and sequence of returns risk.",
    canonicalPath: "/"
  });

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
          font-size: clamp(38px, 5.5vw, 68px);
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
        .lp-preview-content { padding: 24px; background: #f7f3ea; }
        .lp-topbar {
          background: #fff; border: 1px solid #d4e8d8; border-radius: 10px;
          padding: 12px 18px; margin-bottom: 16px;
          font-size: 13px; font-weight: 600; color: #1a2b1a;
        }
        .lp-status-card {
          background: linear-gradient(135deg, #1c3829 0%, #2d5a47 40%, #1c3829 100%);
          border-radius: 14px; padding: 22px 26px; margin-bottom: 16px;
          border-bottom: 2px solid #b8860b;
        }
        .lp-status-eyebrow { font-size: 10px; color: rgba(247,243,234,0.5); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 6px; }
        .lp-status-value { font-size: 32px; font-weight: 800; font-family: monospace; color: #4ade80; line-height: 1; margin-bottom: 10px; }
        .lp-status-line { font-size: 13px; color: rgba(247,243,234,0.85); line-height: 1.5; margin-bottom: 10px; }
        .lp-status-cmp { font-size: 12px; color: rgba(247,243,234,0.85); }
        .lp-grid2 { display: grid; grid-template-columns: 1.6fr 1fr; gap: 14px; margin-bottom: 16px; }
        .lp-white-card { background: #fff; border: 1px solid #d4e8d8; border-radius: 12px; padding: 16px 18px; }
        .lp-card-title { font-size: 13px; font-weight: 700; color: #1a2b1a; margin-bottom: 12px; }
        .lp-donut-legend { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; font-size: 11px; }
        .lp-gogo-panel {
          background: linear-gradient(135deg, #1c3829 0%, #2d5a47 40%, #1c3829 100%);
          border-radius: 14px; padding: 20px 24px;
          border-bottom: 2px solid #b8860b;
        }
        .lp-gogo-eyebrow { font-size: 10px; color: rgba(247,243,234,0.5); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 6px; }
        .lp-gogo-value { font-size: 26px; font-weight: 800; color: #f59e0b; font-family: monospace; margin-bottom: 16px; }
        .lp-phase-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
        .lp-phase-mc { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 12px; }
        .lp-phase-mc-lbl { font-size: 9px; color: rgba(247,243,234,0.5); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
        .lp-phase-mc-val { font-size: 14px; font-weight: 700; color: #f7f3ea; font-family: monospace; }
        .lp-phase-mc-sub { font-size: 10px; color: rgba(247,243,234,0.45); margin-top: 2px; }

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
          .lp-hero-title { font-size: 34px; }
          .lp-hero-sub { font-size: 18px; }
          .lp-preview-wrap { padding: 0 24px 64px; }
          .lp-grid2 { grid-template-columns: 1fr; }
          .lp-phase-row { grid-template-columns: repeat(2, 1fr); }
          .lp-features { padding: 64px 24px; }
          .lp-fg { grid-template-columns: 1fr; }
          .lp-how { padding: 64px 24px; }
          .lp-how-steps { grid-template-columns: 1fr; gap: 32px; }
          .lp-how-steps::before { display: none; }
          .lp-vs { padding: 64px 24px; }
          .lp-vs-grid { grid-template-columns: 1fr; }
          .lp-cta-band { padding: 64px 24px; }
          .lp-footer { padding: 24px; flex-direction: column; gap: 12px; text-align: center; }
          .lp-faq { padding: 64px 24px; }
          .lp-faq-item { padding: 24px 20px; }
          .lp-faq-q { font-size: 18px; }
        }

        /* ── FAQ SECTION ── */
        .lp-faq {
          padding: 88px 56px;
          max-width: 1040px;
          margin: 0 auto;
        }
        .lp-faq-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-top: 52px;
        }
        .lp-faq-item {
          background: #ffffff;
          border: 1px solid rgba(45, 106, 79, 0.12);
          border-radius: 14px;
          padding: 32px;
          box-shadow: 0 2px 12px rgba(26, 43, 26, 0.04);
          transition: all 0.2s;
        }
        .lp-faq-item:hover {
          border-color: rgba(45, 106, 79, 0.25);
          box-shadow: 0 6px 20px rgba(26, 43, 26, 0.08);
        }
        .lp-faq-q {
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          font-size: 20px;
          color: #1a2b1a;
          margin-bottom: 12px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          line-height: 1.3;
        }
        .lp-faq-q::before {
          content: 'Q:';
          color: #b8860b;
          font-weight: 900;
        }
        .lp-faq-a {
          font-size: 16px;
          color: #4d6b55;
          line-height: 1.7;
          padding-left: 28px;
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
          <div className="lp-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="lp-logo-diamond">◆</span>
            <div>
              <div className="lp-logo-text">Retirement Spending Analyzer</div>
              <div className="lp-logo-sub">Smarter retirement income planning</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Link to="/pricing" style={{ color: '#c8e6d2', textDecoration: 'none', fontWeight: 600, fontSize: 15, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#f7f3ea'} onMouseOut={(e) => e.target.style.color = '#c8e6d2'}>
              Pricing
            </Link>
            <Link to="/blog" style={{ color: '#c8e6d2', textDecoration: 'none', fontWeight: 600, fontSize: 15, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#f7f3ea'} onMouseOut={(e) => e.target.style.color = '#c8e6d2'}>
              Blog
            </Link>
            <Link to="/contact" style={{ color: '#c8e6d2', textDecoration: 'none', fontWeight: 600, fontSize: 15, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#f7f3ea'} onMouseOut={(e) => e.target.style.color = '#c8e6d2'}>
              Contact Us
            </Link>
            <button className="lp-nav-cta" onClick={launchApp}>Launch App →</button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="lp-hero">
          <div className="lp-eyebrow-pill">Retirement Income & Tax Optimization Calculator</div>
          <h1 className="lp-hero-title">
            Will Your Money Last In Retirement? Find Out in 5 Minutes.
          </h1>
          <p className="lp-hero-sub">
            You spent decades building your retirement savings. Now you need a
            <em>tax-efficient withdrawal strategy</em>. Stop relying on the rigid 4% rule of thumb.
            Enter your balances once to model <em>sequence of returns risk</em>, calculate RMD taxes,
            optimize Medicare IRMAA surcharges, and determine exactly how much you can spend
            through your Go-Go, Slow-Go, and No-Go retirement spending phases.
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

              {/* Top info bar */}
              <div className="lp-topbar">
                Portfolio: <span style={{ color: '#2d6a4f' }}>$1.85M</span>
                {' '}·{' '}
                Goal: <span style={{ color: '#b8860b' }}>$250.0K</span> at age 95
              </div>

              {/* Plan Status card */}
              <div className="lp-status-card">
                <div className="lp-status-eyebrow">Plan Status</div>
                <div className="lp-status-value">On Track</div>
                <div className="lp-status-line">
                  You can safely spend <strong style={{ color: '#fff' }}>$132,500</strong>/yr ($11.0K/mo) this year.
                  Use the modeling tool below to see how market performance impacts your future spending limits.
                </div>
                <div className="lp-status-cmp">
                  <strong style={{ color: '#4ade80' }}>+38%</strong> higher sustainable spending than the 4% Rule
                  {' '}<span style={{ color: '#b8860b', fontWeight: 700 }}>See full comparison →</span>
                </div>
              </div>

              {/* Growth chart + Wealth Allocation */}
              <div className="lp-grid2">
                <div className="lp-white-card">
                  <div className="lp-card-title">Portfolio Growth Over Time</div>
                  {(() => {
                    const points = [
                      { age: 57, v: 1600000 }, { age: 60, v: 1750000 }, { age: 62, v: 1850000 },
                      { age: 65, v: 1800000 }, { age: 70, v: 1600000 }, { age: 75, v: 1350000 },
                      { age: 80, v: 1050000 }, { age: 85, v: 750000 }, { age: 90, v: 450000 }, { age: 95, v: 250000 },
                    ];
                    const W = 400, H = 130, PAD = 4, MAX_V = 1850000, MIN_AGE = 57, MAX_AGE = 95;
                    const toX = (age) => PAD + ((age - MIN_AGE) / (MAX_AGE - MIN_AGE)) * (W - PAD * 2);
                    const toY = (v) => H - PAD - (v / MAX_V) * (H - PAD * 2);
                    const linePts = points.map((p) => `${toX(p.age)},${toY(p.v)}`).join(' ');
                    const areaPts = `${toX(MIN_AGE)},${H} ${linePts} ${toX(MAX_AGE)},${H}`;
                    const retireX = toX(65);
                    return (
                      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 130, display: 'block' }}>
                        <polygon points={areaPts} fill="#2d6a4f" opacity="0.12" />
                        <line x1={retireX} y1={0} x2={retireX} y2={H} stroke="#b8860b" strokeDasharray="4,3" strokeWidth="1.5" opacity="0.6" />
                        <polyline points={linePts} fill="none" stroke="#2d6a4f" strokeWidth="2.5" />
                      </svg>
                    );
                  })()}
                </div>

                <div className="lp-white-card">
                  <div className="lp-card-title">Wealth Allocation</div>
                  {(() => {
                    const R = 40, CX = 52, CY = 52, STROKE = 15;
                    const circumference = 2 * Math.PI * R;
                    const preTaxLen = 0.78 * circumference;
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ position: 'relative', width: 104, height: 104, flexShrink: 0 }}>
                          <svg viewBox="0 0 104 104" style={{ width: 104, height: 104 }}>
                            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#f59e0b" strokeWidth={STROKE} />
                            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#2d6a4f" strokeWidth={STROKE}
                              strokeDasharray={`${preTaxLen} ${circumference}`}
                              transform={`rotate(-90 ${CX} ${CY})`} />
                          </svg>
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                            <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 800, color: '#1a2b1a' }}>$1.85M</div>
                            <div style={{ fontSize: 8, color: '#4d6b55', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total</div>
                          </div>
                        </div>
                        <div className="lp-donut-legend">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1a2b1a' }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2d6a4f', display: 'inline-block' }} />
                            Pre-tax <span style={{ color: '#4d6b55', fontFamily: 'monospace' }}>$1.44M (78%)</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1a2b1a' }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                            Taxable <span style={{ color: '#4d6b55', fontFamily: 'monospace' }}>$410.0K (22%)</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Go-Go phase panel */}
              <div className="lp-gogo-panel">
                <div className="lp-gogo-eyebrow">Go-Go Phase Base Spending (Today's Dollars)</div>
                <div className="lp-gogo-value">$132,500/year</div>
                <div className="lp-phase-row">
                  <div className="lp-phase-mc">
                    <div className="lp-phase-mc-lbl" style={{ color: '#f59e0b' }}>Go-Go · Ages 65–74</div>
                    <div className="lp-phase-mc-val">$132,500/yr</div>
                    <div className="lp-phase-mc-sub">$11,042/mo · 100% of base</div>
                  </div>
                  <div className="lp-phase-mc">
                    <div className="lp-phase-mc-lbl" style={{ color: '#c4b5fd' }}>Slow-Go · Ages 75–84</div>
                    <div className="lp-phase-mc-val">$106,000/yr</div>
                    <div className="lp-phase-mc-sub">$8,833/mo · 80% of base</div>
                  </div>
                  <div className="lp-phase-mc">
                    <div className="lp-phase-mc-lbl" style={{ color: '#67e8f9' }}>No-Go · Ages 85–95</div>
                    <div className="lp-phase-mc-val">$79,500/yr</div>
                    <div className="lp-phase-mc-sub">$6,625/mo · 60% of base</div>
                  </div>
                  <div className="lp-phase-mc">
                    <div className="lp-phase-mc-lbl">Portfolio at 95</div>
                    <div className="lp-phase-mc-val">$250.0K</div>
                    <div className="lp-phase-mc-sub">Target: $250.0K</div>
                  </div>
                  <div className="lp-phase-mc">
                    <div className="lp-phase-mc-lbl">Social Security</div>
                    <div className="lp-phase-mc-val">$2,850/mo</div>
                    <div className="lp-phase-mc-sub">Claiming age 67</div>
                  </div>
                </div>
              </div>
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
              { icon: '◆', title: 'Three-Phase Spending Model', desc: 'Go-Go, Slow-Go, and No-Go phases reflect your real retirement lifestyle arc. Spend more while you are active and taper naturally as your pace slows.' },
              { icon: '📊', title: 'RMD & IRMAA Tax Planning', desc: 'Built-in Required Minimum Distribution (RMD) tax calculator and Medicare IRMAA surcharge models to optimize retirement tax brackets.' },
              { icon: '📉', title: 'Sequence of Returns Risk', desc: 'Model custom market crash scenarios to see exactly how investment downturns affect portfolio longevity and your retirement income plan.' },
              { icon: '🔐', title: 'Fully Private', desc: 'Your data never leaves your browser. Export and import your complete plan as a local file at any time.' },
              { icon: '🆚', title: '4% Rule vs. RSA Calculator', desc: 'Compare your customized Retirement Spending Analyzer plan side-by-side with the standard 4% rule of thumb using your real balances.' },
              { icon: '⚡', title: 'Tax-Efficient Withdrawal Strategy', desc: 'Bracket filling, Roth conversion ladders, and dynamic withdrawal sequencing designed to minimize lifetime federal taxes.' },
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
              Start your 7-day free trial.
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

        {/* ── FAQ ── */}
        <section className="lp-faq" id="faq">
          <div className="lp-eyebrow">Frequently Asked Questions</div>
          <h2 className="lp-sec-title">Common Questions about RSA</h2>
          <div className="lp-faq-grid">
            <div className="lp-faq-item">
              <h3 className="lp-faq-q">What is the difference between the Retirement Spending Analyzer (RSA) and the 4% rule?</h3>
              <p className="lp-faq-a">
                The standard 4% rule assumes a flat, inflation-adjusted spending amount throughout your entire retirement, ignoring tax brackets, account-type withdrawal sequencing, and lifestyle changes. The RSA is a dynamic model that calculates your spending based on your actual accounts (Taxable, Roth, Pre-tax), Social Security claiming age, RMD mandates, and your natural lifestyle arc (Go-Go, Slow-Go, and No-Go phases) to maximize your safe spending.
              </p>
            </div>
            <div className="lp-faq-item">
              <h3 className="lp-faq-q">What are the Go-Go, Slow-Go, and No-Go spending phases?</h3>
              <p className="lp-faq-a">
                These phases represent how retirees actually spend money. The "Go-Go" phase (early retirement) is when you are active, traveling, and spending the most. The "Slow-Go" phase is when your pace slows and spending naturally tapers. The "No-Go" phase (late retirement) is when active travel spending decreases, often leaving basic living costs and healthcare. RSA allows you to plan your withdrawals around this natural lifestyle curve.
              </p>
            </div>
            <div className="lp-faq-item">
              <h3 className="lp-faq-q">Is my financial data secure on the Retirement Spending Analyzer?</h3>
              <p className="lp-faq-a">
                Yes, absolutely. The RSA is built with a privacy-first architecture. All your calculations run client-side in your browser, and your sensitive financial inputs are stored locally on your device. Your data is never sent to our servers, sold, or stored in any database.
              </p>
            </div>
            <div className="lp-faq-item">
              <h3 className="lp-faq-q">How does the RSA model market crashes and investment downturns?</h3>
              <p className="lp-faq-a">
                The RSA includes a dedicated market return override feature. You can select any calendar year in your projection and input a custom negative return (e.g., -20%) to see how a "sequence of returns" risk or market crash affects your portfolio's longevity and how your spending phases adapt.
              </p>
            </div>
          </div>
        </section>

        {/* ── JSON-LD Structured Schema Markup (AEO / GEO / Google Rich Snippets) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://howtospendyourretirement.com/#software",
                  "name": "Retirement Spending Analyzer",
                  "url": "https://howtospendyourretirement.com",
                  "applicationCategory": "FinancialApplication",
                  "operatingSystem": "All",
                  "description": "Calculate your maximum sustainable retirement spending and plan a tax-efficient withdrawal strategy with our Retirement Income Calculator. Model RMD taxes, IRMAA surcharges, and sequence of returns risk.",
                  "offers": {
                    "@type": "Offer",
                    "price": "29.00",
                    "priceCurrency": "USD"
                  }
                },
                {
                  "@type": "FAQPage",
                  "@id": "https://howtospendyourretirement.com/#faq",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "What is the difference between the Retirement Spending Analyzer (RSA) and the 4% rule?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "The standard 4% rule assumes a flat, inflation-adjusted spending amount throughout your entire retirement, ignoring tax brackets, account-type withdrawal sequencing, and lifestyle changes. The RSA is a dynamic model that calculates your spending based on your actual accounts (Taxable, Roth, Pre-tax), Social Security claiming age, RMD mandates, and your natural lifestyle arc (Go-Go, Slow-Go, and No-Go phases) to maximize your safe spending."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What are the Go-Go, Slow-Go, and No-Go spending phases?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "These phases represent how retirees actually spend money. The 'Go-Go' phase (early retirement) is when you are active, traveling, and spending the most. The 'Slow-Go' phase is when your pace slows and spending naturally tapers. The 'No-Go' phase (late retirement) is when active travel spending decreases, often leaving basic living costs and healthcare. RSA allows you to plan your withdrawals around this natural lifestyle curve."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Is my financial data secure on the Retirement Spending Analyzer?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes, absolutely. The RSA is built with a privacy-first architecture. All your calculations run client-side in your browser, and your sensitive financial inputs are stored locally on your device. Your data is never sent to our servers, sold, or stored in any database."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "How does the RSA model market crashes and investment downturns?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "The RSA includes a dedicated market return override feature. You can select any calendar year in your projection and input a custom negative return (e.g., -20%) to see how a 'sequence of returns' risk or market crash affects your portfolio's longevity and how your spending phases adapt."
                      }
                    }
                  ]
                }
              ]
            })
          }}
        />

        {/* ── FOOTER ── */}
        <footer className="lp-footer">
          <div className="lp-fl">
            <span style={{ color: '#b8860b' }}>◆</span>
            Retirement Spending Analyzer
          </div>
          <div style={{ display: 'flex', gap: 24, fontSize: 14, margin: '8px 0', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/" style={{ color: '#7aaa8a', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#f7f3ea'} onMouseOut={(e) => e.target.style.color = '#7aaa8a'}>Home</Link>
            <Link to="/pricing" style={{ color: '#7aaa8a', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#f7f3ea'} onMouseOut={(e) => e.target.style.color = '#7aaa8a'}>Pricing</Link>
            <Link to="/blog" style={{ color: '#7aaa8a', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#f7f3ea'} onMouseOut={(e) => e.target.style.color = '#7aaa8a'}>Blog</Link>
            <Link to="/contact" style={{ color: '#7aaa8a', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#f7f3ea'} onMouseOut={(e) => e.target.style.color = '#7aaa8a'}>Contact Us</Link>
          </div>
          <div className="lp-fn">
            Not financial advice. Consult a qualified advisor for personalized guidance.
          </div>
        </footer>

      </div>
    </>
  )
}
