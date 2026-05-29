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
    id: 'standard_monthly',
    priceId: import.meta.env.VITE_PRICE_STANDARD_MONTHLY,
    name: 'Standard',
    billing: 'Monthly',
    price: '$10',
    period: '/month',
    annualEquiv: null,
    badge: null,
    color: '#10b981',
    features: [
      'Full RSA calculator',
      'Go-Go / Slow-Go / No-Go phases',
      'Tax-optimized withdrawal sequencing',
      'RMD & IRMAA modeling',
      'Market crash scenario modeling',
      'vs 4% Rule comparison',
      'Export & import your plan',
    ],
    cta: 'Start Free Trial',
  },
  {
    id: 'standard_annual',
    priceId: import.meta.env.VITE_PRICE_STANDARD_ANNUAL,
    name: 'Standard',
    billing: 'Annual',
    price: '$89',
    period: '/year',
    annualEquiv: 'Just $7.42/month',
    badge: 'BEST VALUE',
    badgeColor: '#10b981',
    color: '#10b981',
    features: [
      'Full RSA calculator',
      'Go-Go / Slow-Go / No-Go phases',
      'Tax-optimized withdrawal sequencing',
      'RMD & IRMAA modeling',
      'Market crash scenario modeling',
      'vs 4% Rule comparison',
      'Export & import your plan',
    ],
    cta: 'Start Free Trial',
  },
  {
    id: 'pro_annual',
    priceId: import.meta.env.VITE_PRICE_PRO_ANNUAL,
    name: 'Pro',
    billing: 'Annual',
    price: '$119',
    period: '/year',
    annualEquiv: 'Just $9.92/month',
    badge: 'PRO',
    badgeColor: '#1D4ED8',
    color: '#1D4ED8',
    features: [
      'Everything in Standard',
      '— plus —',
      'Tax Optimization Pro tab',
      'Federal bracket filling',
      'Roth conversion ladder',
      'Dynamic withdrawal sequencing',
      'Lifetime tax savings estimate',
    ],
    cta: 'Start Free Trial',
    proOnly: true,
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
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <span style={{ color: '#10b981', fontSize: 18 }}>◆</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>
            Retirement Spending Allowance
          </span>
        </a>
        {isSignedIn && (
          <div style={{ fontSize: 13, color: '#cbd5e1' }}>
            Signed in as {user?.primaryEmailAddress?.emailAddress}
          </div>
        )}
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

      {/* Plan cards */}
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
              background: plan.proOnly ? 'rgba(29,78,216,0.04)' : '#1e293b',
              border: `1px solid ${plan.proOnly ? 'rgba(29,78,216,0.35)' : plan.id === 'standard_annual' ? 'rgba(16,185,129,0.35)' : 'rgba(148,163,184,0.12)'}`,
              borderRadius: 16,
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
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
              onClick={() => handleSelect(plan)}
              disabled={loadingPlan !== null}
              style={{
                background: plan.color,
                color: '#fff', border: 'none',
                padding: '13px 24px', borderRadius: 10,
                fontSize: 15, fontWeight: 600,
                fontFamily: 'DM Sans, sans-serif',
                cursor: loadingPlan ? 'wait' : 'pointer',
                opacity: loadingPlan && loadingPlan !== plan.id ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
            >
              {loadingPlan === plan.id ? 'Redirecting...' : plan.cta}
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
