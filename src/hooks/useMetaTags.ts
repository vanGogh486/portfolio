import { useEffect } from 'react'

interface MetaTags {
  title: string
  description?: string
  ogImage?: string
  ogType?: string
}

export function useMetaTags({ title, description, ogImage, ogType }: MetaTags) {
  useEffect(() => {
    document.title = `${title} | 潘奕冰`

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(name.startsWith('og:') ? 'property' : 'name', name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    if (description) setMeta('description', description)
    if (ogImage) setMeta('og:image', ogImage)
    if (ogType) setMeta('og:type', ogType)
    setMeta('og:title', title)
  }, [title, description, ogImage, ogType])
}
