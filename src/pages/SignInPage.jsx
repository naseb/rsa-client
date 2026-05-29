import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
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
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
          Sign in to your account
        </div>
      </div>

      {/* Clerk sign-in widget */}
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/app"
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
        Don't have an account?{' '}
        <a href="/sign-up" style={{ color: '#10b981', textDecoration: 'none' }}>
          Start your 7-day free trial
        </a>
      </div>
    </div>
  )
}
