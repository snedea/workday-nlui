import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Canvas Renderer Error:', error, errorInfo);

    // Clear localStorage if there's a component error to prevent persistent issues
    try {
      localStorage.removeItem('workday-nlui-last-response');
      console.warn('Cleared cached UI data due to rendering error');
    } catch (e) {
      console.warn('Failed to clear localStorage:', e);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          padding: '24px',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          background: '#f9f9f9',
          margin: '16px 0'
        }}>
          <h3 style={{ color: '#d73757', marginBottom: '8px' }}>
            ⚠️ Rendering Error
          </h3>
          <p style={{ color: '#666', marginBottom: '12px' }}>
            There was an error rendering the UI components. This is usually caused by cached data.
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              background: '#0073e6',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear Cache & Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}