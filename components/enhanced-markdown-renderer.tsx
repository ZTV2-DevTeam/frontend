"use client"

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkBreaks from 'remark-breaks'
import remarkEmoji from 'remark-emoji'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { cn } from '@/lib/utils'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github.css'

interface EnhancedMarkdownRendererProps {
  children: string
  className?: string
  maxLength?: number
  showMoreButton?: boolean
  onShowMore?: () => void
}

export function EnhancedMarkdownRenderer({ 
  children, 
  className, 
  maxLength,
  showMoreButton = false,
  onShowMore 
}: EnhancedMarkdownRendererProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  
  const content = maxLength && !isExpanded && children.length > maxLength
    ? children.substring(0, maxLength) + '...'
    : children
  
  const shouldShowButton = maxLength && children.length > maxLength && !isExpanded

  const handleShowMore = () => {
    setIsExpanded(true)
    onShowMore?.()
  }

  return (
    <div className={cn("prose prose-sm max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,        // GitHub Flavored Markdown (tables, strikethrough, task lists, etc.)
          remarkMath,       // Math expressions ($$ and $ syntax)
          remarkBreaks,     // Line breaks become <br> elements
          remarkEmoji,      // Convert :emoji: to emoji characters
        ]}
        rehypePlugins={[
          rehypeRaw,        // Allow raw HTML
          rehypeKatex,      // Render math expressions with KaTeX
          rehypeHighlight,  // Syntax highlighting for code blocks
          rehypeSlug,       // Add IDs to headings
          [rehypeAutolinkHeadings, { // Add clickable links to headings
            behavior: 'wrap',
            properties: {
              className: ['anchor-link'],
            },
          }],
        ]}
        components={{
          // Custom styling for different elements
          h1: ({ children, ...props }) => (
            <h1 className="text-2xl font-bold mb-4 text-foreground border-b pb-2" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-xl font-semibold mb-3 text-foreground" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-lg font-medium mb-2 text-foreground" {...props}>
              {children}
            </h3>
          ),
          p: ({ children, ...props }) => (
            <p className="mb-3 text-foreground leading-relaxed" {...props}>
              {children}
            </p>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote 
              className="border-l-4 border-primary pl-4 py-2 my-4 bg-muted/50 italic text-muted-foreground" 
              {...props}
            >
              {children}
            </blockquote>
          ),
          code: ({ children, className, ...props }) => {
            const isInline = !className
            return isInline ? (
              <code 
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground" 
                {...props}
              >
                {children}
              </code>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          pre: ({ children, ...props }) => (
            <pre 
              className="bg-muted p-4 rounded-lg overflow-x-auto my-4 border" 
              {...props}
            >
              {children}
            </pre>
          ),
          ul: ({ children, ...props }) => (
            <ul className="list-disc pl-6 mb-4 space-y-1" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal pl-6 mb-4 space-y-1" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="text-foreground" {...props}>
              {children}
            </li>
          ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-border" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-muted" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody {...props}>
              {children}
            </tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr className="border-b border-border" {...props}>
              {children}
            </tr>
          ),
          th: ({ children, ...props }) => (
            <th className="border border-border px-4 py-2 text-left font-semibold" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="border border-border px-4 py-2" {...props}>
              {children}
            </td>
          ),
          a: ({ children, href, ...props }) => (
            <a 
              href={href}
              className="text-primary hover:text-primary/80 underline underline-offset-2 cursor-pointer" 
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              {...props}
            >
              {children}
            </a>
          ),
          img: ({ src, alt, ...props }) => (
            <img 
              src={src} 
              alt={alt}
              className="max-w-full h-auto rounded-lg border shadow-sm my-4" 
              {...props}
            />
          ),
          hr: ({ ...props }) => (
            <hr className="my-6 border-border" {...props} />
          ),
          // Task list styling
          input: ({ type, checked, ...props }) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  disabled
                  className="mr-2 accent-primary"
                  {...props}
                />
              )
            }
            return <input type={type} {...props} />
          },
        }}
      >
        {content}
      </ReactMarkdown>
      
      {shouldShowButton && showMoreButton && (
        <button
          onClick={handleShowMore}
          className="text-primary hover:text-primary/80 text-sm mt-2 underline underline-offset-2 font-medium"
        >
          Több megjelenítése
        </button>
      )}
    </div>
  )
}
