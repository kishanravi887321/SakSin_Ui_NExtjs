export default function OfflinePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
      color: 'white',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          You're Offline
        </h1>
        <p style={{ marginBottom: '2rem', color: '#94a3b8' }}>
          No internet connection detected. Some features may be limited.
        </p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  )
}