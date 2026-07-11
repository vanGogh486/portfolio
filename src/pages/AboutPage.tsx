import SEOHead from '@/components/shared/SEOHead'
import Bio from '@/components/about/Bio'
import Skills from '@/components/about/Skills'
import Contact from '@/components/about/Contact'

export default function AboutPage() {
  return (
    <>
      <SEOHead title="About" description="Learn more about me and my AI video work." />

      <div className="mx-auto max-w-4xl space-y-16 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Bio />
        <Skills />
        <Contact />
      </div>
    </>
  )
}
