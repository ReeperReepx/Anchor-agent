"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Uncaught error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <h2 className="text-xl font-semibold text-[#1D1D1F] mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-[#6B7280] mb-6">
            An unexpected error occurred. Please try refreshing.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="bg-[#B85C42] text-white px-5 py-2.5 rounded-[10px] text-sm font-semibold transition-all hover:bg-[#D4917F]"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
