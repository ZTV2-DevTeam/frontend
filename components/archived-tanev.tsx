'use client'

import * as React from 'react'
import { Archive, ChevronDown, ChevronRight } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Standard banner used above any archived-Tanév content so users know the data
 * they're looking at is from a previous school year. Keep the wording consistent
 * across menus — see the multi-Tanév plan §4.
 */
export function ArchivedTanevBanner({
  tanev,
  className,
}: {
  tanev: { display_name: string }
  className?: string
}) {
  return (
    <Alert className={cn('border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-100', className)}>
      <Archive className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        Archivált tanév
        <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10">
          {tanev.display_name}
        </Badge>
      </AlertTitle>
      <AlertDescription>
        Az itt látható adatok egy korábbi tanévből származnak, és csak megtekintésre szolgálnak.
      </AlertDescription>
    </Alert>
  )
}

/**
 * Wrapper for a block of records that come from an archived Tanév. Renders a
 * collapsible header, the standard banner, and applies muted styling so the
 * current Tanév's content stays visually dominant.
 */
export function TanevSection({
  tanev,
  count,
  defaultOpen = false,
  children,
  className,
}: {
  tanev: { id: number; display_name: string; is_active: boolean }
  count?: number
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <section className={cn('space-y-3', className)}>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-start gap-2 border border-border/50 bg-muted/30 p-3 hover:bg-muted/50"
      >
        {open ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
        <Archive className="h-4 w-4 text-muted-foreground" />
        <span className="font-semibold">Archivált tanév – {tanev.display_name}</span>
        {typeof count === 'number' && (
          <Badge variant="secondary" className="ml-1 text-xs">
            {count}
          </Badge>
        )}
      </Button>
      {open && (
        <div className="space-y-4">
          <ArchivedTanevBanner tanev={tanev} />
          <div className="opacity-80">{children}</div>
        </div>
      )}
    </section>
  )
}
