"use client"

import { Button } from "@/components/ui/button"
import { generateGoogleCalendarUrl } from "@/lib/utils"
import Image from "next/image"

interface GoogleCalendarButtonProps {
  forgatas: {
    name: string
    description?: string
    date: string
    time_from: string
    time_to: string
    location?: { name?: string; address?: string }
  }
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  children?: React.ReactNode
  showIcon?: boolean
  iconOnly?: boolean
}

export function GoogleCalendarButton({
  forgatas,
  variant = "outline",
  size = "sm",
  className = "",
  children,
  showIcon = true,
  iconOnly = false
}: GoogleCalendarButtonProps) {
  const handleAddToCalendar = () => {
    const calendarUrl = generateGoogleCalendarUrl(forgatas)
    window.open(calendarUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToCalendar}
      className={`${variant === "outline" ? "bg-transparent" : ""} ${className}`}
      title="Hozzáadás a Google Naptárhoz"
    >
      {showIcon && (
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/512px-Google_Calendar_icon_%282020%29.svg.png"
          alt="Google Calendar"
          width={16}
          height={16}
          className={`w-4 h-4 object-contain${!iconOnly ? ' mr-2' : ''}`}
        />
      )}
      {!iconOnly && (children || "Naptárba")}
    </Button>
  )
}