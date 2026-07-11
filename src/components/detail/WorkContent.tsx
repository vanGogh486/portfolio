import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface WorkContentProps {
  content: string
}

export default function WorkContent({ content }: WorkContentProps) {
  return (
    <div className="prose prose-invert prose-slate max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children, ...props }) => (
            <h2
              className="mt-10 mb-4 text-2xl font-bold text-white"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="mt-8 mb-3 text-xl font-semibold text-slate-200"
              {...props}
            >
              {children}
            </h3>
          ),
          p: ({ children, ...props }) => (
            <p className="mb-4 leading-relaxed text-slate-400" {...props}>
              {children}
            </p>
          ),
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              className="text-accent-light underline underline-offset-2 transition-colors hover:text-accent-secondary"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
          ul: ({ children, ...props }) => (
            <ul className="mb-4 list-disc space-y-1 pl-6 text-slate-400" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="mb-4 list-decimal space-y-1 pl-6 text-slate-400" {...props}>
              {children}
            </ol>
          ),
          code: ({ children, className, ...props }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code
                  className="rounded bg-slate-800 px-1.5 py-0.5 text-sm text-accent-secondary"
                  {...props}
                >
                  {children}
                </code>
              )
            }
            return (
              <code
                className="block overflow-x-auto rounded-lg bg-slate-800 p-4 text-sm text-slate-300"
                {...props}
              >
                {children}
              </code>
            )
          },
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="my-4 border-l-4 border-accent bg-slate-800/50 py-2 pl-4 italic text-slate-300"
              {...props}
            >
              {children}
            </blockquote>
          ),
          img: ({ src, alt, ...props }) => (
            <img
              src={src}
              alt={alt ?? ''}
              className="rounded-lg border border-slate-800"
              loading="lazy"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
