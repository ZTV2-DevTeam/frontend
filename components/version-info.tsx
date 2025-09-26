"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getShortVersionInfo, getAppVersion } from "@/lib/version"
import { Info } from "lucide-react"

interface VersionInfoProps {
  className?: string
  variant?: "default" | "minimal"
}

/**
 * Version information component that displays app version and build date
 * Designed to be subtle but informative, shown at the bottom of dashboards
 * Clicking the version will navigate to the corresponding changelog entry
 */
export function VersionInfo({ className = "", variant = "default" }: VersionInfoProps) {
  const versionInfo = getShortVersionInfo()
  const currentVersion = getAppVersion()
  const changelogUrl = `/changelog#${currentVersion}`

  if (variant === "minimal") {
    return (
      <div className={`flex justify-center ${className}`}>
        <Link href={changelogUrl}>
          <Badge variant="outline" className="text-xs text-muted-foreground border-muted-foreground/20 bg-background/50 hover:bg-muted/50 hover:text-foreground transition-colors cursor-pointer">
            <Info className="h-3 w-3 mr-1.5" />
            {versionInfo}
          </Badge>
        </Link>
      </div>
    )
  }

  return (
    <Card className={`border-muted-foreground/10 bg-muted/30 ${className}`}>
      <CardContent className="py-2 px-4">
        <Link href={changelogUrl}>
          <div className="flex items-center justify-center gap-2 hover:text-foreground transition-colors cursor-pointer">
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">
              {versionInfo}
            </span>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}