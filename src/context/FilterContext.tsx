import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'

interface FilterContextValue {
  activeCategory: string | null
  activeTag: string | null
  setCategory: (category: string | null) => void
  setTag: (tag: string | null) => void
  resetFilters: () => void
}

const FilterContext = createContext<FilterContextValue | null>(null)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams()

  const activeCategory = searchParams.get('category')
  const activeTag = searchParams.get('tag')

  const setCategory = useCallback(
    (category: string | null) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (category) {
          next.set('category', category)
        } else {
          next.delete('category')
        }
        next.delete('tag') // clear tag when changing category
        return next
      })
    },
    [setSearchParams],
  )

  const setTag = useCallback(
    (tag: string | null) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (tag) {
          next.set('tag', tag)
        } else {
          next.delete('tag')
        }
        return next
      })
    },
    [setSearchParams],
  )

  const resetFilters = useCallback(() => {
    setSearchParams({})
  }, [setSearchParams])

  return (
    <FilterContext.Provider
      value={{ activeCategory, activeTag, setCategory, setTag, resetFilters }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilterContext(): FilterContextValue {
  const ctx = useContext(FilterContext)
  if (!ctx) {
    throw new Error('useFilterContext must be used within a FilterProvider')
  }
  return ctx
}
