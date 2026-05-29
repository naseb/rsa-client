/**
 * SubscriptionContext.jsx
 * =======================
 * Provides subscription status to the entire app.
 *
 * Any component can call useSubscription() to get:
 *   subscription.status  — 'trialing' | 'active' | 'none'
 *   subscription.tier    — 'standard' | 'pro' | null
 *   loading              — true while fetching
 *   refetch()            — call after subscription changes (e.g. after checkout)
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from '@clerk/clerk-react'

const SubscriptionContext = createContext(null)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export function SubscriptionProvider({ children }) {
  const { getToken, isSignedIn, isLoaded } = useAuth()
  const [subscription, setSubscription] = useState({ status: 'none', tier: null })
  const [loading, setLoading] = useState(true)

  const fetchSubscription = useCallback(async () => {
    if (!isSignedIn) {
      setSubscription({ status: 'none', tier: null })
      setLoading(false)
      return
    }

    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/api/subscription`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        const data = await res.json()
        setSubscription(data)
      } else {
        setSubscription({ status: 'none', tier: null })
      }
    } catch (err) {
      console.error('Failed to fetch subscription:', err)
      setSubscription({ status: 'none', tier: null })
    } finally {
      setLoading(false)
    }
  }, [isSignedIn, getToken])

  // Fetch when auth state is ready
  useEffect(() => {
    if (!isLoaded) return
    fetchSubscription()
  }, [isLoaded, fetchSubscription])

  const value = {
    subscription,
    loading,
    refetch: fetchSubscription,
    // Convenience booleans
    hasAccess: ['trialing', 'active'].includes(subscription.status),
    isPro: subscription.status === 'active' && subscription.tier === 'pro',
    isTrialing: subscription.status === 'trialing',
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) throw new Error('useSubscription must be used inside SubscriptionProvider')
  return ctx
}
