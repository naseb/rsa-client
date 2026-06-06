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
      <div style={{ marginBottom: 28, textAlign: 'center' }}>
        <div style={{ fontSize: 28, color: '#10b981', marginBottom: 8 }}>◆</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>
          Retirement Spending Allowance
        </div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
          Start your 7-day free trial — no credit card required to try
        </div>
      </div>

      {/* Clerk widget — light theme sits cleanly on our dark page */}
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/app"
        appearance={{
          variables: {
            colorPrimary: '#10b981',
            borderRadius: '10px',
          },
        }}
      />

      <div style={{ marginTop: 20, fontSize: 12, color: '#475569', textAlign: 'center' }}>
        Already have an account?{' '}
        <a href="/sign-in" style={{ color: '#10b981', textDecoration: 'none' }}>
          Sign in
        </a>
      </div>
    </div>
  )
}
