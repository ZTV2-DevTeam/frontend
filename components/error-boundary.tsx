'use client'

/* eslint-disable @typescript-eslint/no-empty-object-type */
import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error)
    console.error('Error Info:', errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 border border-red-300 rounded-lg bg-red-50">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
          <details className="text-sm text-red-700">
            <summary className="cursor-pointer mb-2">Error Details</summary>
            <pre className="whitespace-pre-wrap bg-red-100 p-2 rounded">
              {this.state.error?.stack || this.state.error?.message}
            </pre>
          </details>
          <button
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
            onClick={() => this.setState({ hasError: false, error: undefined })}
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
