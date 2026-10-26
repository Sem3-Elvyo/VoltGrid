import { Component } from "react";
import { TriangleAlert } from "lucide-react";

// Error boundaries must be class components: only classes have
// getDerivedStateFromError / componentDidCatch.
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="container" style={{ paddingBottom: 56 }}>
        <div className="card error-card">
          <TriangleAlert size={28} />
          <h2>Something went wrong on this page</h2>
          <p>{this.state.error.message}</p>
          <button className="btn btn-primary" onClick={() => this.setState({ error: null })}>
            Try again
          </button>
        </div>
      </div>
    );
  }
}
