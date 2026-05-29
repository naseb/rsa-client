/**
 * ProtectedRoute.jsx
 * ==================
 * Wraps the /app route. Three checks before rendering the app:
 *
 *   1. Is the user signed in? (Clerk)         → if not, redirect to /sign-in
 *   2. Is the subscription loaded?             → show loading spinner
 *   3. Does the user have access?              → if not, redirect to /pricing
 *
 * Trial users (status: 'trialing') get Standard features only.
 * Pro users (status: 'active', tier: 'pro') get everything.
 */

import { useUser } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'
import { useSubscription } from '../context/SubscriptionContext'

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useUser()
  const { hasAccess, loading } = useSubscription()

  // Still loading Clerk auth state
  if (!isLoaded) return <LoadingScreen message="Loading..." />

  // Not signed in → go to sign-in page
  if (!isSignedIn) return <Navigate to="/sign-in" replace />

  // Signed in but subscription check still in flight
  if (loading) return <LoadingScreen message="Checking subscription..." />

  // Signed in but no active subscription → go to pricing
  if (!hasAccess) return <Navigate to="/pricing" replace />

  // All good — render the app
  return children
}

function LoadingScreen({ message }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      fontFamily: 'DM Sans, sans-serif',
    }}>
      <div style={{ fontSize: 28, color: '#10b981' }}>◆</div>
      <div style={{ fontSize: 14, color: '#64748b' }}>{message}</div>
    </div>
  )
}
