'use client'

import type { ReactNode } from "react"
import { Badge } from "./ui/badge"

// Matches KaCsa team codes embedded in a name, e.g. "KaCsa A1" -> "A1".
// The letter (A/B) marks the stáb, the number marks the session's sequence.
const KACSA_TEAM_CODE = /\b([AB])(\d+)\b/g

interface KacsaTitleProps {
  name?: string | null
  className?: string
  badgeClassName?: string
}

/**
 * Renders a forgatás name, replacing KaCsa team codes (e.g. "A1", "B2")
 * with colored badges instead of plain text.
 */
export function KacsaTitle({ name, className, badgeClassName }: KacsaTitleProps) {
  if (!name) return null

  const parts: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  const regex = new RegExp(KACSA_TEAM_CODE)

  while ((match = regex.exec(name)) !== null) {
    if (match.index > lastIndex) {
      parts.push(name.slice(lastIndex, match.index))
    }

    const team = match[1].toUpperCase()
    const colorClasses = team === "A"
      ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
      : "bg-green-500/10 text-green-400 border-green-500/30"

    parts.push(
      <Badge
        key={`${match.index}-${match[0]}`}
        variant="outline"
        className={`mx-1 align-middle text-[1em] font-[inherit] leading-none px-1.5 py-0.5 ${colorClasses} ${badgeClassName ?? ""}`}
      >
        {match[0]}
      </Badge>
    )

    lastIndex = regex.lastIndex
  }

  if (lastIndex < name.length) {
    parts.push(name.slice(lastIndex))
  }

  return <span className={className}>{parts}</span>
}
