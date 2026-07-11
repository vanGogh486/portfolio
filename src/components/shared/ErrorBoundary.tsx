import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 px-4 text-center">
            <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
            <p className="text-slate-400">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              type="button"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-light"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
