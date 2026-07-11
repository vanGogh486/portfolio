import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { PROFILE } from '@/data/profile'
import { SOCIAL_LINKS } from '@/lib/constants'

export default function ContactSection() {
  const [copied, setCopied] = useState(false)

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText('819859568@qq.com')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const input = document.createElement('input')
      input.value = '819859568@qq.com'
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

  return (
    <section id="contact" className="px-6 sm:px-8 lg:px-10 py-24 sm:py-32 bg-[#0C0C0C]">
      <div className="mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/25 mb-4">Contact</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6">
            联系我
          </h2>
          <p className="text-[14px] sm:text-base text-white/35 max-w-md mx-auto mb-12 leading-relaxed">
            对项目感兴趣或有合作想法？欢迎通过以下方式联系。
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* Email + Copy */}
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#141414] px-5 py-4">
            <span className="text-[14px] text-white/60 font-medium">819859568@qq.com</span>
            <button
              type="button"
              onClick={copyEmail}
              className="rounded-lg border border-white/[0.1] px-3 py-1.5 text-[11px] font-medium text-white/40 hover:text-white/70 hover:border-white/[0.2] transition-all active:scale-95"
            >
              {copied ? '已复制' : '复制'}
            </button>
          </div>

          {/* Email link */}
          <a
            href={SOCIAL_LINKS.email}
            className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-6 py-4 text-[13px] font-medium text-white/50 hover:border-white/[0.18] hover:text-white/80 transition-all"
          >
            发送邮件
          </a>
        </motion.div>

        {/* Footer note */}
        <motion.p
          className="mt-12 text-[11px] text-white/15"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          &copy; {new Date().getFullYear()} {PROFILE.name}. All rights reserved.
        </motion.p>
      </div>
    </section>
  )
}
