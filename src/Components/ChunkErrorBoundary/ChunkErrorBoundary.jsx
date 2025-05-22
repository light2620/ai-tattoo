// Components/ChunkErrorBoundary/ChunkErrorBoundary.jsx
import React from 'react';

class ChunkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Check if the error is likely a chunk load error
    // This check can be made more specific based on error messages from your bundler
    const message = error.message || '';
    if (
        message.toLowerCase().includes('loading chunk failed') ||
        message.toLowerCase().includes('failed to fetch dynamically imported module') ||
        error.name === 'ChunkLoadError' // Some libraries might throw specific error names
    ) {
      return { hasError: true, isChunkError: true, errorInfo: error };
    }
    // For other errors, you might handle them differently or re-throw
    return { hasError: true, isChunkError: false, errorInfo: error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ChunkErrorBoundary caught an error:", error, errorInfo);
    // If it's identified as a chunk error, you might try a reload
    if (this.state.isChunkError) {
        this.attemptReload();
    }
  }

  attemptReload = () => {
    if (!sessionStorage.getItem('chunk_reload_attempted_by_boundary')) {
      sessionStorage.setItem('chunk_reload_attempted_by_boundary', 'true');
      window.location.reload();
    } else {
      console.error('Chunk load error persisted after boundary reload attempt.');
      // Update state to show a persistent error message if reload didn't work
      this.setState({ showPersistentError: true });
    }
  };

  render() {
    if (this.state.showPersistentError) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h1>Application Error</h1>
              <p>There was an issue loading parts of the application. Please try refreshing your browser again, or contact support if the problem continues.</p>
              <button onClick={() => window.location.reload()}>Refresh Page</button>
            </div>
          );
    }
    if (this.state.hasError && this.state.isChunkError) {
      // You can render any custom fallback UI for chunk errors
      // The reload might have already been triggered by componentDidCatch
      // This is a fallback UI if the reload doesn't happen or fails
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Loading Error</h1>
          <p>We had trouble loading a part of the page. We are trying to fix it...</p>
          {/* Could show a manual refresh button if reload is disabled or fails */}
          {/* <button onClick={this.attemptReload}>Try Reloading</button> */}
        </div>
      );
    }
    if (this.state.hasError && !this.state.isChunkError) {
        // Fallback for other types of errors caught by this boundary
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h1>Something went wrong</h1>
              <p>An unexpected error occurred. Please try refreshing.</p>
            </div>
          );
    }

    return this.props.children;
  }
}

// Clear the session storage flag on successful full page load
window.addEventListener('load', () => {
  sessionStorage.removeItem('chunk_reload_attempted_by_boundary');
});

export default ChunkErrorBoundary;