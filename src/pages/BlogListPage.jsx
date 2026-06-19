import { useNavigate, Link } from 'react-router-dom'
import { BLOG_POSTS } from '../content/blogData'
import usePageMeta from '../hooks/usePageMeta'

export default function BlogListPage() {
  const navigate = useNavigate()

  usePageMeta({
    title: "Retirement spending strategies & insights — Retirement Spending Analyzer Blog",
    description: "Read practical strategies, mathematical insights, and guides to help you confidently plan and manage your retirement spending and tax optimization.",
    canonicalPath: "/blog"
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Source+Sans+3:wght@400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .blog-root {
          background: #f7f3ea;
          color: #1a2b1a;
          font-family: 'Source Sans 3', sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* ── NAV ── */
        .blog-nav {
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
        .blog-logo { display: flex; align-items: center; gap: 12px; cursor: pointer; text-decoration: none; }
        .blog-logo-diamond { color: #b8860b; font-size: 22px; }
        .blog-logo-text { font-family: 'Source Sans 3', sans-serif; font-weight: 700; font-size: 18px; color: #f7f3ea; letter-spacing: 0.01em; }
        .blog-logo-sub { font-size: 12px; color: #7aaa8a; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 1px; }
        .blog-nav-links { display: flex; align-items: center; gap: 24px; }
        .blog-nav-link { color: #c8e6d2; text-decoration: none; font-size: 15px; font-weight: 600; cursor: pointer; transition: color 0.2s; }
        .blog-nav-link:hover { color: #f7f3ea; }
        .blog-nav-cta {
          background: #b8860b; color: #fff; border: none;
          padding: 11px 28px; border-radius: 6px;
          font-family: 'Source Sans 3', sans-serif; font-size: 16px; font-weight: 700;
          cursor: pointer; transition: background 0.2s; letter-spacing: 0.01em;
          text-decoration: none; display: inline-block;
        }
        .blog-nav-cta:hover { background: #9a700a; }

        /* ── HEADER ── */
        .blog-header {
          padding: 80px 24px 60px;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }
        .blog-eyebrow {
          display: inline-block;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #2d6a4f;
          background: rgba(45,106,79,0.1);
          border: 1px solid rgba(45,106,79,0.25);
          padding: 7px 20px; border-radius: 100px;
          margin-bottom: 20px;
        }
        .blog-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 4.5vw, 56px);
          font-weight: 900;
          color: #1a2b1a;
          line-height: 1.15;
          margin-bottom: 16px;
        }
        .blog-sub {
          font-size: 18px;
          color: #4d6b55;
          line-height: 1.6;
        }

        /* ── GRID ── */
        .blog-container {
          max-width: 1120px;
          width: 100%;
          margin: 0 auto 100px;
          padding: 0 24px;
          flex: 1;
        }
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 32px;
        }
        .blog-card {
          background: #ffffff;
          border: 1px solid rgba(45, 106, 79, 0.12);
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 20px rgba(26, 43, 26, 0.04);
          transition: all 0.25s ease;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
        }
        .blog-card:hover {
          transform: translateY(-6px);
          border-color: rgba(45, 106, 79, 0.25);
          box-shadow: 0 12px 30px rgba(26, 43, 26, 0.08);
        }
        .blog-card-content {
          padding: 32px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .blog-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          color: #7aaa8a;
          margin-bottom: 16px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .blog-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 800;
          color: #1a2b1a;
          line-height: 1.3;
          margin-bottom: 14px;
          transition: color 0.15s;
        }
        .blog-card:hover .blog-card-title {
          color: #2d6a4f;
        }
        .blog-card-desc {
          font-size: 16px;
          color: #4d6b55;
          line-height: 1.6;
          margin-bottom: 24px;
          flex: 1;
        }
        .blog-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(45,106,79,0.08);
          padding-top: 20px;
          font-size: 14px;
          color: #7aaa8a;
          font-weight: 600;
        }
        .blog-read-more {
          color: #2d6a4f;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: gap 0.2s;
        }
        .blog-card:hover .blog-read-more {
          gap: 10px;
        }

        /* ── FOOTER ── */
        .blog-footer {
          border-top: 1px solid rgba(45,106,79,0.15);
          padding: 28px 56px;
          display: flex; justify-content: space-between; align-items: center;
          background: #1c3829;
          margin-top: auto;
        }
        .blog-fl { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 600; color: #f7f3ea; }
        .blog-fn { font-size: 14px; color: #7aaa8a; }

        @media (max-width: 768px) {
          .blog-nav { padding: 16px 24px; }
          .blog-logo-sub { display: none; }
          .blog-header { padding: 50px 24px 40px; }
          .blog-grid { grid-template-columns: 1fr; }
          .blog-footer { padding: 24px; flex-direction: column; gap: 12px; text-align: center; }
        }
      `}</style>

      <div className="blog-root">
        {/* Nav */}
        <nav className="blog-nav">
          <Link className="blog-logo" to="/">
            <span className="blog-logo-diamond">◆</span>
            <div>
              <div className="blog-logo-text">Retirement Spending Analyzer</div>
              <div className="blog-logo-sub">Smarter retirement income planning</div>
            </div>
          </Link>
          <div className="blog-nav-links">
            <Link className="blog-nav-link" to="/">Home</Link>
            <Link className="blog-nav-link" to="/pricing">Pricing</Link>
            <Link className="blog-nav-link" to="/contact">Contact Us</Link>
            <Link className="blog-nav-cta" to="/app">Launch App →</Link>
          </div>
        </nav>

        {/* Header */}
        <header className="blog-header">
          <span className="blog-eyebrow">Retirement Wisdom</span>
          <h1 className="blog-title">The Retirement Spending Blog</h1>
          <p className="blog-sub">
            Practical strategies, mathematical insights, and psychological guides to help you confidently spend what you've saved.
          </p>
        </header>

        {/* Main Content */}
        <main className="blog-container">
          <div className="blog-grid">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                className="blog-card"
                to={`/blog/${post.slug}`}
              >
                <div className="blog-card-content">
                  <div className="blog-meta">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                  <h2 className="blog-card-title">{post.title}</h2>
                  <p className="blog-card-desc">{post.description}</p>
                  <div className="blog-card-footer">
                    <span>{post.readTime}</span>
                    <span className="blog-read-more">
                      Read Article <span style={{ fontSize: 16 }}>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="blog-footer">
          <div className="blog-fl">
            <span style={{ color: '#b8860b' }}>◆</span>
            Retirement Spending Analyzer
          </div>
          <div className="blog-fn">
            Not financial advice. Consult a qualified advisor for personalized guidance.
          </div>
        </footer>
      </div>
    </>
  )
}
