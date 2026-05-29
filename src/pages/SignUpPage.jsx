import { SignUp } from '@clerk/clerk-react'

export default function SignUpPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif',
      padding: '20px',
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 28, color: '#10b981', marginBottom: 8 }}>◆</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>
          Retirement Spending Allowance
        </div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
          Start your 7-day free trial — no credit card required to try
        </div>
      </div>

      {/* Clerk sign-up widget */}
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/pricing"
        appearance={{
          variables: {
            colorPrimary: '#10b981',
            colorBackground: '#1e293b',
            colorText: '#f1f5f9',
            colorTextSecondary: '#94a3b8',
            colorInputBackground: '#0f172a',
            colorInputText: '#f1f5f9',
            borderRadius: '10px',
          },
          elements: {
            card: { boxShadow: 'none', border: '1px solid rgba(148,163,184,0.12)' },
            headerTitle: { color: '#f8fafc' },
            headerSubtitle: { color: '#94a3b8' },
          }
        }}
      />

      <div style={{ marginTop: 24, fontSize: 12, color: '#475569', textAlign: 'center' }}>
        Already have an account?{' '}
        <a href="/sign-in" style={{ color: '#10b981', textDecoration: 'none' }}>
          Sign in
        </a>
      </div>
    </div>
  )
}
