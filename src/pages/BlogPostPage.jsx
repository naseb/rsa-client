import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { BLOG_POSTS } from '../content/blogData'
import { marked } from 'marked'
import usePageMeta from '../hooks/usePageMeta'

// Eagerly load all markdown files in the content/posts folder as raw strings
const markdownFiles = import.meta.glob('../content/posts/*.md', { query: '?raw', eager: true })

export default function BlogPostPage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  // Find the post metadata
  const postMeta = BLOG_POSTS.find((p) => p.slug === slug)

  usePageMeta({
    title: postMeta ? `${postMeta.title} — Retirement Spending Analyzer` : "Article Not Found",
    description: postMeta ? postMeta.description : "The article you are looking for does not exist.",
    canonicalPath: postMeta ? `/blog/${postMeta.slug}` : "/blog"
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!postMeta) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center', fontFamily: 'system-ui' }}>
        <h2>Article Not Found</h2>
        <p style={{ margin: '12px 0 24px', color: '#666' }}>The article you are looking for does not exist.</p>
        <Link to="/blog" style={{ display: 'inline-block', padding: '10px 20px', cursor: 'pointer', textDecoration: 'none', background: '#2d6a4f', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 'bold' }}>
          Back to Blog
        </Link>
      </div>
    )
  }

  // Get raw markdown from imported files
  const fileKey = `../content/posts/${slug}.md`
  const fileModule = markdownFiles[fileKey]
  const rawMarkdown = fileModule ? (fileModule.default || fileModule) : ''

  // Convert markdown to HTML
  let htmlContent = ''
  try {
    // In marked v18, parse options are passed directly as the second argument
    htmlContent = marked.parse(typeof rawMarkdown === 'string' ? rawMarkdown : '', {
      breaks: true,
      gfm: true
    })
  } catch (err) {
    console.error('Failed to parse markdown:', err)
    htmlContent = `<p>Error loading content: ${err.message}</p>`
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .post-root {
          background: #f7f3ea;
          color: #1a2b1a;
          font-family: 'Source Sans 3', sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* ── NAV ── */
        .post-nav {
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
        .post-logo { display: flex; align-items: center; gap: 12px; cursor: pointer; text-decoration: none; }
        .post-logo-diamond { color: #b8860b; font-size: 22px; }
        .post-logo-text { font-family: 'Source Sans 3', sans-serif; font-weight: 700; font-size: 18px; color: #f7f3ea; }
        .post-logo-sub { font-size: 12px; color: #7aaa8a; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 1px; }
        .post-nav-links { display: flex; align-items: center; gap: 24px; }
        .post-nav-link { color: #c8e6d2; text-decoration: none; font-size: 15px; font-weight: 600; cursor: pointer; transition: color 0.2s; }
        .post-nav-link:hover { color: #f7f3ea; }
        .post-nav-cta {
          background: #b8860b; color: #fff; border: none;
          padding: 11px 28px; border-radius: 6px;
          font-family: 'Source Sans 3', sans-serif; font-size: 16px; font-weight: 700;
          cursor: pointer; transition: background 0.2s;
          text-decoration: none; display: inline-block;
        }
        .post-nav-cta:hover { background: #9a700a; }

        /* ── WRAPPER ── */
        .post-container {
          max-width: 800px;
          width: 100%;
          margin: 0 auto 100px;
          padding: 60px 24px 0;
          flex: 1;
        }

        .post-back-btn {
          background: transparent;
          border: 1px solid rgba(45,106,79,0.25);
          color: #2d6a4f;
          padding: 8px 18px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 40px;
          text-decoration: none;
        }
        .post-back-btn:hover {
          background: rgba(45,106,79,0.06);
          border-color: #2d6a4f;
        }

        /* ── HEADER ── */
        .post-header {
          margin-bottom: 48px;
          border-bottom: 1px solid rgba(45,106,79,0.12);
          padding-bottom: 32px;
        }
        .post-category {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #2d6a4f;
          margin-bottom: 16px;
        }
        .post-meta-info {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 15px;
          color: #6b8f72;
          font-weight: 500;
        }

        /* ── BODY MARKDOWN RENDER ── */
        .post-body {
          font-size: 19px;
          line-height: 1.75;
          color: #2a3b2a;
        }

        /* Custom Markdown Styles */
        .post-body h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 5.5vw, 48px);
          font-weight: 900;
          color: #1a2b1a;
          line-height: 1.15;
          margin: 0 0 24px;
        }
        .post-body h2 {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 800;
          color: #1a2b1a;
          margin-top: 48px;
          margin-bottom: 16px;
          border-bottom: 1px solid rgba(45,106,79,0.08);
          padding-bottom: 8px;
        }
        .post-body h3 {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 800;
          color: #1a2b1a;
          margin-top: 32px;
          margin-bottom: 12px;
        }
        .post-body p {
          margin-bottom: 24px;
        }
        .post-body strong {
          color: #1a2b1a;
          font-weight: 700;
        }
        .post-body a {
          color: #2d6a4f;
          text-decoration: underline;
          text-underline-offset: 4px;
          font-weight: 600;
          transition: color 0.15s;
        }
        .post-body a:hover {
          color: #1e4d3a;
        }
        .post-body ul, .post-body ol {
          margin-bottom: 28px;
          padding-left: 28px;
        }
        .post-body li {
          margin-bottom: 10px;
        }
        .post-body li::marker {
          color: #b8860b;
          font-weight: 700;
        }
        .post-body blockquote {
          background: rgba(45,106,79,0.05);
          border-left: 4px solid #b8860b;
          padding: 20px 24px;
          border-radius: 0 8px 8px 0;
          margin: 32px 0;
          font-size: 17px;
          color: #38523f;
          line-height: 1.65;
        }
        .post-body blockquote p {
          margin-bottom: 0;
        }
        .post-body blockquote strong {
          color: #2d6a4f;
        }
        .post-body pre {
          background: #1e293b;
          color: #cbd5e1;
          padding: 24px;
          border-radius: 12px;
          overflow-x: auto;
          font-family: 'JetBrains Mono', monospace;
          font-size: 15px;
          line-height: 1.5;
          margin: 32px 0;
          border: 1px solid rgba(148,163,184,0.1);
        }
        .post-body code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 15px;
          background: rgba(45,106,79,0.08);
          color: #2d6a4f;
          padding: 3px 6px;
          border-radius: 4px;
          font-weight: 600;
        }
        .post-body pre code {
          background: transparent;
          color: inherit;
          padding: 0;
          font-weight: normal;
        }
        .post-body hr {
          border: none;
          border-top: 1px solid rgba(45,106,79,0.15);
          margin: 40px 0;
        }

        /* ── FOOTER ── */
        .post-footer {
          border-top: 1px solid rgba(45,106,79,0.15);
          padding: 28px 56px;
          display: flex; justify-content: space-between; align-items: center;
          background: #1c3829;
          margin-top: auto;
        }
        .post-fl { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 600; color: #f7f3ea; }
        .post-fn { font-size: 14px; color: #7aaa8a; }

        @media (max-width: 768px) {
          .post-nav { padding: 16px 24px; }
          .post-logo-sub { display: none; }
          .post-container { padding: 40px 20px 0; }
          .post-body { font-size: 18px; }
          .post-footer { padding: 24px; flex-direction: column; gap: 12px; text-align: center; }
        }
      `}</style>

      <div className="post-root">
        {/* Nav */}
        <nav className="post-nav">
          <Link className="post-logo" to="/">
            <span className="post-logo-diamond">◆</span>
            <div>
              <div className="post-logo-text">Retirement Spending Analyzer</div>
              <div className="post-logo-sub">Smarter retirement income planning</div>
            </div>
          </Link>
          <div className="post-nav-links">
            <Link className="post-nav-link" to="/">Home</Link>
            <Link className="post-nav-link" to="/pricing">Pricing</Link>
            <Link className="post-nav-link" to="/blog">Blog</Link>
            <Link className="post-nav-link" to="/contact">Contact Us</Link>
            <Link className="post-nav-cta" to="/app">Launch App →</Link>
          </div>
        </nav>

        {/* Article Body */}
        <main className="post-container">
          <Link className="post-back-btn" to="/blog">
            <span>←</span> Back to Blog
          </Link>

          <article>
            <header className="post-header">
              <span className="post-category">{postMeta.category}</span>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, color: '#1a2b1a', lineHeight: 1.15, marginBottom: 20 }}>
                {postMeta.title}
              </h1>
              <div className="post-meta-info">
                <span>By {postMeta.author}</span>
                <span>•</span>
                <span>{postMeta.date}</span>
                <span>•</span>
                <span>{postMeta.readTime}</span>
              </div>
            </header>

            <section 
              className="post-body" 
              dangerouslySetInnerHTML={{ __html: htmlContent }} 
            />
          </article>

          <Link className="post-back-btn" to="/blog" style={{ marginTop: 60 }}>
            <span>←</span> Back to Blog
          </Link>
        </main>

        {/* Footer */}
        <footer className="post-footer">
          <div className="post-fl">
            <span style={{ color: '#b8860b' }}>◆</span>
            Retirement Spending Analyzer
          </div>
          <div className="post-fn">
            Not financial advice. Consult a qualified advisor for personalized guidance.
          </div>
        </footer>
      </div>
    </>
  )
}
