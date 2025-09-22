"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-border": "var(--border)",
          "--normal-text": "var(--card-foreground)",
          "--success-bg": "color-mix(in srgb, var(--chart-1) 15%, var(--card))",
          "--success-border": "var(--chart-1)",
          "--success-text": "var(--card-foreground)",
          "--error-bg": "color-mix(in srgb, var(--destructive) 15%, var(--card))",
          "--error-border": "var(--destructive)",
          "--error-text": "var(--card-foreground)",
          "--info-bg": "color-mix(in srgb, var(--chart-2) 15%, var(--card))",
          "--info-border": "var(--chart-2)",
          "--info-text": "var(--card-foreground)",
          "--warning-bg": "color-mix(in srgb, var(--chart-4) 15%, var(--card))",
          "--warning-border": "var(--chart-4)",
          "--warning-text": "var(--card-foreground)",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          backgroundColor: "var(--normal-bg)",
          borderColor: "var(--normal-border)",
          color: "var(--normal-text)",
          border: "1px solid var(--normal-border)",
          borderRadius: "var(--radius)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 12px -4px color-mix(in srgb, var(--foreground) 25%, transparent), 0 0 0 1px color-mix(in srgb, var(--border) 50%, transparent)",
        },
        className: "font-sans text-sm"
      }}
      position="top-right"
      expand
      visibleToasts={5}
      closeButton
      richColors={false}
      {...props}
    />
  )
}

export { Toaster }
