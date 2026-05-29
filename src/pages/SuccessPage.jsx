/**
 * SuccessPage.jsx
 * ===============
 * User lands here after completing Stripe Checkout.
 * Calls /api/link-subscription on the server to store the
 * Stripe customer ID in the user's Clerk metadata.
 * Then redirects to /app once the subscription is confirmed.
 */

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { useSubscription } from '../context/SubscriptionContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function SuccessPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const { refetch } = useSubscription()
  const [status, setStatus] = useState('linking') // 'linking' | 'done' | 'error'
  const [message, setMessage] = useState('Setting up your subscription...')

  useEffect(() => {
    const sessionId = searchParams.get('session_id')

    const linkSubscription = async () => {
      try {
        const token = await getToken()
        const res = await fetch(
          `${API_URL}/api/link-subscription?session_id=${sessionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (!res.ok) throw new Error('Failed to link subscription')

        // Refresh subscription context so ProtectedRoute lets them through
        await refetch()
        setStatus('done')
        setMessage('You\'re all set! Taking you to the app...')

        // Redirect to app after a short pause
        setTimeout(() => navigate('/app'), 1500)
      } catch (err) {
        console.error(err)
        setStatus('error')
        setMessage('Something went wrong linking your subscription. Please contact support.')
      }
    }

    if (sessionId) {
      linkSubscription()
    } else {
      // No session ID — maybe they landed here directly, just send to app
      refetch().then(() => navigate('/app'))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif',
      padding: 24,
      textAlign: 'center',
    }}>
      {status === 'linking' && (
        <>
          <div style={{ fontSize: 36, color: '#10b981', marginBottom: 16 }}>◆</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
            Almost there...
          </div>
          <div style={{ fontSize: 14, color: '#64748b' }}>{message}</div>
        </>
      )}

      {status === 'done' && (
        <>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#10b981', marginBottom: 8 }}>
            Welcome!
          </div>
          <div style={{ fontSize: 14, color: '#64748b' }}>{message}</div>
        </>
      )}

      {status === 'error' && (
        <>
          <div style={{ fontSize: 36, color: '#ef4444', marginBottom: 16 }}>⚠</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
            Something went wrong
          </div>
          <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 24 }}>{message}</div>
          <button
            onClick={() => navigate('/pricing')}
            style={{
              background: '#10b981', color: '#fff', border: 'none',
              padding: '10px 24px', borderRadius: 8,
              fontSize: 14, fontWeight: 600,
              fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
            }}
          >
            Back to Pricing
          </button>
        </>
      )}
    </div>
  )
}
