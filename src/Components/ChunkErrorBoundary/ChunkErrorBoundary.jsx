// src/components/ChunkErrorBoundary.jsx
import { Component } from "react";

class ChunkErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, retry: false };
  }

  static getDerivedStateFromError(error) {
    if (/Loading chunk [\d]+ failed/.test(error.message)) {
      const alreadyTried = sessionStorage.getItem("chunkLoadRetry");

      if (!alreadyTried) {
        sessionStorage.setItem("chunkLoadRetry", "true");
        window.location.reload(); // Retry once
      } else {
        sessionStorage.removeItem("chunkLoadRetry");
        window.location.href = "/"; // Redirect to home
      }
    }

    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Chunk load failed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Trying to recover…</h2>;
    }

    return this.props.children;
  }
}

export default ChunkErrorBoundary;
