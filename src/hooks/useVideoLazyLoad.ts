import { useEffect, useRef, useState } from 'react'

interface LazyLoadState {
  ref: React.RefObject<HTMLDivElement | null>
  shouldLoad: boolean
  isLoaded: boolean
  hasError: boolean
}

export function useVideoLazyLoad(options?: {
  rootMargin?: string
  threshold?: number
}): LazyLoadState {
  const ref = useRef<HTMLDivElement | null>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: options?.rootMargin ?? '200px',
        threshold: options?.threshold ?? 0,
      },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [options?.rootMargin, options?.threshold])

  return { ref, shouldLoad, isLoaded, hasError }
}
