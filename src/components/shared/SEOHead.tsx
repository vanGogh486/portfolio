import { Helmet } from 'react-helmet-async'
import { SITE } from '@/lib/constants'

interface SEOHeadProps {
  title: string
  description?: string
  ogImage?: string
  ogType?: 'website' | 'video.other'
  canonicalUrl?: string
}

export default function SEOHead({
  title,
  description = SITE.tagline,
  ogImage = '/og-image.png',
  ogType = 'website',
  canonicalUrl,
}: SEOHeadProps) {
  const fullTitle = `${title} | ${SITE.name}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Helmet>
  )
}
