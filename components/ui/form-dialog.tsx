"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Save, X } from "lucide-react"

interface FormDialogProps {
  title: string
  description?: string
  trigger: React.ReactNode
  children: React.ReactNode
  onSubmit?: () => void
  onCancel?: () => void
  isLoading?: boolean
  disabled?: boolean
  className?: string
  size?: "sm" | "md" | "lg" | "xl" | "full"
  open?: boolean
  onOpenChange?: (open: boolean) => void
  submitLabel?: string
  cancelLabel?: string
  showFooter?: boolean
}

export function FormDialog({
  title,
  description,
  trigger,
  children,
  onSubmit,
  onCancel,
  isLoading = false,
  disabled = false,
  className,
  size = "md",
  open,
  onOpenChange,
  submitLabel = "Mentés",
  cancelLabel = "Mégse",
  showFooter = true,
}: FormDialogProps) {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw] w-full h-[95vh]",
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!disabled && onSubmit) {
      onSubmit()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent 
        className={cn(
          sizeClasses[size],
          size === "full" && "h-[95vh]",
          className
        )}
        onEscapeKeyDown={(e) => {
          if (isLoading) {
            e.preventDefault()
          }
        }}
        onInteractOutside={(e) => {
          if (isLoading) {
            e.preventDefault()
          }
        }}
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <ScrollArea 
          className={cn(
            "flex-1 pr-6",
            size === "full" ? "h-[calc(95vh-8rem)]" : "max-h-[60vh]"
          )}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {children}
          </form>
        </ScrollArea>

        {showFooter && (
          <DialogFooter className="flex gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              {cancelLabel}
            </Button>
            <Button
              type="submit"
              onClick={onSubmit}
              disabled={disabled || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {submitLabel}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Confirmation Dialog
interface ConfirmDialogProps {
  title: string
  description: string
  trigger: React.ReactNode
  onConfirm: () => void
  onCancel?: () => void
  isLoading?: boolean
  confirmLabel?: string
  cancelLabel?: string
  variant?: "destructive" | "default"
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ConfirmDialog({
  title,
  description,
  trigger,
  onConfirm,
  onCancel,
  isLoading = false,
  confirmLabel = "Megerősítés",
  cancelLabel = "Mégse",
  variant = "destructive",
  open,
  onOpenChange,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={variant}
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
