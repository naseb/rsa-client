import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ClerkProvider } from "@clerk/react"
import { SubscriptionProvider } from './context/SubscriptionContext'
import App from './App.jsx'
import LandingPage from './pages/LandingPage.jsx'
import SignInPage from './pages/SignInPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import PricingPage from './pages/PricingPage.jsx'
import SuccessPage from './pages/SuccessPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          <Route path="/success" element={
            <SubscriptionProvider>
              <SuccessPage />
            </SubscriptionProvider>
          } />

          {/* Protected route — requires login + active subscription */}
          <Route path="/app" element={
            <SubscriptionProvider>
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            </SubscriptionProvider>
          } />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)
