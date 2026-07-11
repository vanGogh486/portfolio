export interface WorkFrontmatter {
  slug: string
  title: string
  date: string
  category: string
  tags: string[]
  thumbnail: string
  video: string
  fullVideo?: string | null
  description: string
  duration?: string
  tools?: string[]
  featured?: boolean
  videoFormat?: string
  videoWidth?: number
  videoHeight?: number
}

export interface WorkData extends WorkFrontmatter {
  content: string // markdown body
}

export interface FilterState {
  activeCategory: string | null
  activeTag: string | null
}
