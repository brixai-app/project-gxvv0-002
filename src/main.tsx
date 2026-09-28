import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', fontFamily: 'Inter, system-ui, sans-serif', background: '#0a0a0f', color: '#f5f5f7', minHeight: '100vh' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>Something went wrong</h1>
          <pre style={{ padding: '16px', background: '#1a1a25', borderRadius: '8px', overflow: 'auto', fontSize: '14px', color: '#f87171' }}>{this.state.error}</pre>
          <button onClick={() => this.setState({ hasError: false, error: '' })} style={{ marginTop: '16px', padding: '8px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Try Again</button>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)