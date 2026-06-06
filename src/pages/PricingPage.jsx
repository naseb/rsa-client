/**
 * PricingPage.jsx
 * ===============
 * Shows the three subscription plans.
 * Clicking a plan calls /api/create-checkout-session on the server,
 * which returns a Stripe Checkout URL. The user is redirected there.
 * After payment, Stripe sends them to /success.
 */

import { useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const PLANS = [
  {
    id: 'report_pass',
    priceId: import.meta.env.VITE_PRICE_REPORT_PASS || 'price_1TcO_report_pass_mock',
    name: 'Report Pass',
    billing: 'One-Time',
    price: '$29',
    period: '/report',
    annualEquiv: 'Perfect for a single plan',
    badge: 'SINGLE USE',
    badgeColor: '#b8860b',
    color: '#b8860b',
    features: [
      'Full RSA calculator access',
      'Go-Go / Slow-Go / No-Go phases',
      'Tax-optimized withdrawal sequencing',
      'Printable premium PDF report',
      'No recurring charges',
    ],
    cta: 'Get Report Pass',
  },
  {
    id: 'standard_annual',
    priceId: import.meta.env.VITE_PRICE_STANDARD_ANNUAL || 'price_1TcOh9BjY5AWuxIOEw59XCbD',
    name: 'Standard Annual',
    billing: 'Annual Review Pass',
    price: '$89',
    period: '/year',
    annualEquiv: 'Just $7.42/month',
    badge: 'POPULAR B2C',
    badgeColor: '#10b981',
    color: '#10b981',
    features: [
      '1 year of unlimited updates',
      'Full RSA calculator',
      'Go-Go / Slow-Go / No-Go phases',
      'RMD & IRMAA modeling',
      'Printable premium PDF report',
      'Export & import your plan',
    ],
    cta: 'Start Free Trial',
  },
  {
    id: 'pro_annual',
    priceId: import.meta.env.VITE_PRICE_PRO_ANNUAL || 'price_1TcOf7BjY5AWuxIO7UE3NsVq',
    name: 'Pro Annual',
    billing: 'Annual Review Pass',
    price: '$119',
    period: '/year',
    annualEquiv: 'Just $9.92/month',
    badge: 'PRO TAX ENGINES',
    badgeColor: '#1d4ed8',
    color: '#1d4ed8',
    features: [
      'Everything in Standard',
      '— plus —',
      'Tax Optimization Pro features',
      'Federal bracket filling solver',
      'Roth conversion ladder planner',
      'Lifetime tax savings estimate',
    ],
    cta: 'Start Free Trial',
    comingSoon: true,
  },
  {
    id: 'advisor_monthly',
    priceId: import.meta.env.VITE_PRICE_ADVISOR_MONTHLY || 'price_1TcO_advisor_monthly_mock',
    name: 'Advisor Monthly',
    billing: 'Advisor Portal',
    price: '$99',
    period: '/month',
    annualEquiv: 'Billed monthly',
    badge: 'ADVISOR',
    badgeColor: '#8b5cf6',
    color: '#8b5cf6',
    features: [
      'Manage unlimited client plans',
      'Client profile dashboards',
      'Advisor custom PDF branding',
      'Upload firm logo & contact info',
      'All Pro tax optimization engines',
    ],
    cta: 'Subscribe Advisor',
    comingSoon: true,
  },
  {
    id: 'advisor_annual',
    priceId: import.meta.env.VITE_PRICE_ADVISOR_ANNUAL || 'price_1TcO_advisor_annual_mock',
    name: 'Advisor Annual',
    billing: 'Advisor Portal',
    price: '$799',
    period: '/year',
    annualEquiv: 'Save 33% ($66/month)',
    badge: 'ADVISOR BEST VALUE',
    badgeColor: '#8b5cf6',
    color: '#8b5cf6',
    features: [
      'Manage unlimited client plans',
      'Client profile dashboards',
      'Advisor custom PDF branding',
      'Upload firm logo & contact info',
      'All Pro tax optimization engines',
    ],
    cta: 'Subscribe Advisor',
    comingSoon: true,
  },
]

export default function PricingPage() {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const navigate = useNavigate()
  const [loadingPlan, setLoadingPlan] = useState(null)
  const [error, setError] = useState(null)

  const handleSelect = async (plan) => {
    // If not signed in, go to sign-up first
    if (!isSignedIn) {
      navigate('/sign-up')
      return
    }

    setLoadingPlan(plan.id)
    setError(null)

    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priceId: plan.priceId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create checkout session')
      }

      const { url } = await res.json()
      window.location.href = url
    } catch (err) {
      setError(err.message)
      setLoadingPlan(null)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      fontFamily: 'DM Sans, sans-serif',
      color: '#f1f5f9',
      padding: '0 24px 80px',
    }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 24px', borderBottom: '1px solid rgba(148,163,184,0.12)',
        marginBottom: 60,
      }}>
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <span style={{ color: '#10b981', fontSize: 18 }}>◆</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>
            Retirement Spending Analyzer
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span onClick={() => navigate('/contact')} style={{ color: '#94a3b8', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#f1f5f9'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
            Contact Us
          </span>
          {isSignedIn && (
            <div style={{ fontSize: 13, color: '#cbd5e1' }}>
              Signed in as {user?.primaryEmailAddress?.emailAddress}
            </div>
          )}
        </div>
      </nav>

      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 56px' }}>
        <div style={{
          display: 'inline-block', fontSize: 12, fontWeight: 600,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: '#10b981', background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.2)',
          padding: '6px 16px', borderRadius: 100, marginBottom: 24,
        }}>
          Simple, transparent pricing
        </div>
        <h1 style={{
          fontFamily: 'Raleway, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)',
          fontWeight: 900, letterSpacing: '-0.01em', margin: '0 0 16px',
          color: '#f8fafc', lineHeight: 1.1,
        }}>
          Start with a 7-day free trial
        </h1>
        <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
          Full access to the RSA calculator. No credit card required to start.
          Cancel anytime before the trial ends and you won't be charged.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 20,
        maxWidth: 960,
        margin: '0 auto',
      }}>
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: plan.id.startsWith('advisor') ? 'rgba(139,92,246,0.04)' : plan.id.startsWith('pro') ? 'rgba(29,78,216,0.04)' : plan.id === 'report_pass' ? 'rgba(184,134,11,0.04)' : '#1e293b',
              border: `1px solid ${plan.id.startsWith('advisor') ? 'rgba(139,92,246,0.35)' : plan.id.startsWith('pro') ? 'rgba(29,78,216,0.35)' : plan.id === 'report_pass' ? 'rgba(184,134,11,0.35)' : plan.id === 'standard_annual' ? 'rgba(16,185,129,0.35)' : 'rgba(148,163,184,0.12)'}`,
              borderRadius: 16,
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              opacity: plan.comingSoon ? 0.75 : 1,
            }}
          >
            {/* Diagonal Coming Soon Watermark */}
            {plan.comingSoon && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                pointerEvents: 'none',
                overflow: 'hidden',
                borderRadius: 16,
                zIndex: 2,
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: 'rgba(255, 255, 255, 0.12)', // see-through white
                  textTransform: 'uppercase',
                  transform: 'rotate(-30deg)', // left bottom to top right
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.12em',
                  userSelect: 'none',
                  border: '3px solid rgba(255, 255, 255, 0.08)',
                  padding: '6px 14px',
                  borderRadius: 6,
                }}>
                  Coming Soon
                </div>
              </div>
            )}
            {/* Badge */}
            {plan.badge && (
              <div style={{
                position: 'absolute', top: -12, left: '50%',
                transform: 'translateX(-50%)',
                background: plan.badgeColor,
                color: '#fff', fontSize: 11, fontWeight: 700,
                padding: '3px 14px', borderRadius: 100,
                letterSpacing: '0.08em',
              }}>
                {plan.badge}
              </div>
            )}

            {/* Plan name */}
            <div style={{ marginBottom: 4 }}>
              <span style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: plan.color,
              }}>
                {plan.name}
              </span>
              <span style={{
                fontSize: 11, color: '#64748b', marginLeft: 8,
              }}>
                {plan.billing}
              </span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: 4 }}>
              <span style={{
                fontFamily: 'monospace', fontSize: 40, fontWeight: 700,
                color: '#f8fafc', lineHeight: 1,
              }}>
                {plan.price}
              </span>
              <span style={{ fontSize: 14, color: '#64748b', marginLeft: 4 }}>
                {plan.period}
              </span>
            </div>
            {plan.annualEquiv && (
              <div style={{ fontSize: 12, color: '#10b981', marginBottom: 20 }}>
                {plan.annualEquiv}
              </div>
            )}
            {!plan.annualEquiv && <div style={{ marginBottom: 20 }} />}

            {/* Features */}
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', flex: 1 }}>
              {plan.features.map((f, i) => (
                <li key={i} style={{
                  fontSize: 13, color: f === '— plus —' ? '#64748b' : '#94a3b8',
                  padding: '5px 0',
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                  fontStyle: f === '— plus —' ? 'italic' : 'normal',
                }}>
                  {f !== '— plus —' && (
                    <span style={{ color: plan.color, fontWeight: 700, flexShrink: 0 }}>✓</span>
                  )}
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA button */}
            <button
              onClick={() => !plan.comingSoon && handleSelect(plan)}
              disabled={loadingPlan !== null || plan.comingSoon}
              style={{
                background: plan.comingSoon ? '#334155' : plan.color,
                color: plan.comingSoon ? '#94a3b8' : '#fff',
                border: 'none',
                padding: '13px 24px', borderRadius: 10,
                fontSize: 15, fontWeight: 600,
                fontFamily: 'DM Sans, sans-serif',
                cursor: plan.comingSoon ? 'not-allowed' : loadingPlan ? 'wait' : 'pointer',
                opacity: plan.comingSoon ? 0.65 : loadingPlan && loadingPlan !== plan.id ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
            >
              {plan.comingSoon ? 'Coming Soon' : loadingPlan === plan.id ? 'Redirecting...' : plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          maxWidth: 480, margin: '24px auto 0', padding: '12px 20px',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 10, fontSize: 13, color: '#fca5a5', textAlign: 'center',
        }}>
          {error}
        </div>
      )}

      {/* Footer note */}
      <div style={{
        textAlign: 'center', marginTop: 48,
        fontSize: 12, color: '#475569', lineHeight: 1.8,
      }}>
        7-day free trial on all plans · Cancel anytime · Secure payment via Stripe
        <br />
        Pro plan is annual only · Tax Optimization tab coming soon
      </div>
    </div>
  )
}
