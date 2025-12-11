import React, { ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: ((props: { error: Error }) => React.ReactNode) | React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Component Error:", error, info);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === "function") {
        return this.props.fallback({ error: this.state.error });
      }
      
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Something went wrong.
          </h1>
          <p className="mt-2 text-gray-700">{String(this.state.error)}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
