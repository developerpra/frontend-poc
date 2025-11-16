import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: any;
}

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.error("Component Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
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
