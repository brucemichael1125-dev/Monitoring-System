import { Component, type ReactNode } from "react";

interface State { hasError: boolean; error: Error | null; }
interface Props { children: ReactNode; fallback?: ReactNode; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{ padding: "60px 40px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1e293b", margin: "0 0 8px" }}>
            Something went wrong
          </h2>
          <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 20px" }}>
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: "10px 22px", background: "#2d8a4e", color: "#fff",
              border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "var(--font-sans)",
            }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
