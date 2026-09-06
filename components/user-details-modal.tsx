"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X, Phone, Mail, History, Pencil, Radio, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { apiClient, UserProfileSchema, StabHistoryEntry } from "@/lib/api"
import { UserAvatar } from "@/components/user-avatar"
import { UserStabBadge } from "@/components/stab-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

/**
 * Minimal shape needed to render something useful before/without the full
 * profile fetch (e.g. data already available from a list the caller rendered).
 */
export interface UserDetailsModalUser {
  id: number
  full_name?: string
  first_name?: string
  last_name?: string
  username?: string
  email?: string
  telefonszam?: string
  admin_type?: string
  gyv?: boolean
  osztaly_name?: string
  stab_name?: string
  /** Contextual role label for the page this modal was opened from (e.g. "Operatőr" in a forgatás crew list) */
  contextRole?: string
}

interface UserDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserDetailsModalUser | null
  /** Extra page-specific content rendered below the standard sections (e.g. role statistics) */
  children?: React.ReactNode
}

function getRoleInfo(adminType?: string, gyv?: boolean) {
  if (adminType === 'system_admin') return { name: 'Rendszergazda', icon: '👑', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' }
  if (adminType === 'developer') return { name: 'Fejlesztő', icon: '💻', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' }
  if (adminType === 'teacher') return { name: 'Médiatanár', icon: '👨‍🏫', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' }
  if (gyv) return { name: 'Gyártásvezető', icon: '🎬', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' }
  return { name: 'Diák', icon: '🎓', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' }
}

function formatStabHistoryEntry(entry: StabHistoryEntry) {
  const changes: string[] = []
  if (entry.previous_stab || entry.new_stab) {
    changes.push(`Stáb: ${entry.previous_stab || '—'} → ${entry.new_stab || '—'}`)
  }
  if (entry.previous_radio_stab || entry.new_radio_stab) {
    changes.push(`Rádiós stáb: ${entry.previous_radio_stab || '—'} → ${entry.new_radio_stab || '—'}`)
  }
  return changes
}

export function UserDetailsModal({ open, onOpenChange, user, children }: UserDetailsModalProps) {
  const [profile, setProfile] = useState<UserProfileSchema | null>(null)
  const [stabHistory, setStabHistory] = useState<StabHistoryEntry[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      setProfile(null)
      setStabHistory([])
      return
    }
    if (!user?.id) return

    let cancelled = false
    setLoading(true)

    Promise.all([
      apiClient.getUserDetails(user.id).catch(() => null),
      apiClient.getUserStabHistory(user.id).catch(() => []),
    ]).then(([profileData, historyData]) => {
      if (cancelled) return
      setProfile(profileData)
      setStabHistory(historyData || [])
    }).finally(() => {
      if (!cancelled) setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [open, user?.id])

  // Radix's Dialog can leave `pointer-events: none` stuck on <body> when the
  // close races with another dismissable layer (e.g. a DropdownMenuItem's
  // onClick both closing its menu and opening this dialog). Without this,
  // hover/click stops working on the rest of the page until a reload.
  useEffect(() => {
    if (open) return
    const timeout = window.setTimeout(() => {
      document.body.style.pointerEvents = ''
    }, 300)
    return () => window.clearTimeout(timeout)
  }, [open])

  if (!user) return null

  const firstName = profile?.first_name ?? user.first_name ?? ''
  const lastName = profile?.last_name ?? user.last_name ?? ''
  const displayName = profile
    ? `${lastName} ${firstName}`.trim()
    : (user.full_name || `${user.last_name ?? ''} ${user.first_name ?? ''}`.trim() || user.username || '')
  const username = profile?.username ?? user.username
  const email = profile?.email ?? user.email
  const phone = profile?.telefonszam ?? user.telefonszam
  const adminType = profile?.admin_type ?? user.admin_type
  const gyv = profile?.gyv ?? user.gyv
  const osztalyName = profile?.osztaly_name ?? user.osztaly_name
  const stabName = profile?.stab_name ?? user.stab_name
  const radioStabName = profile?.radio_stab_name
  const roleInfo = getRoleInfo(adminType, gyv)

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-150",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-100"
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-150",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-100"
          )}
        >
          <div className="pointer-events-auto relative flex w-full max-w-md max-h-[85vh] flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-2xl">
            <DialogPrimitive.Close className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <X className="h-4 w-4" />
              <span className="sr-only">Bezárás</span>
            </DialogPrimitive.Close>

            <div className="overflow-y-auto p-6 space-y-5">
              {/* Header */}
              <div className="flex flex-col items-center gap-2 text-center">
                <UserAvatar
                  email={email || ''}
                  firstName={firstName || ''}
                  lastName={lastName || ''}
                  username={username || ''}
                  customSize={72}
                  className="border-2 border-primary/20"
                  fallbackClassName="bg-gradient-to-br from-primary/20 to-primary/10 text-xl font-semibold"
                />
                <div>
                  <DialogPrimitive.Title className="text-lg font-semibold leading-tight">
                    {displayName || 'Ismeretlen felhasználó'}
                  </DialogPrimitive.Title>
                  {username && <p className="text-sm text-muted-foreground">@{username}</p>}
                </div>
                <DialogPrimitive.Description className="sr-only">
                  {displayName} adatlapja és elérhetőségei
                </DialogPrimitive.Description>

                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                  <Badge className={cn("text-xs px-2.5 py-1", roleInfo.color)}>
                    <span className="mr-1.5">{roleInfo.icon}</span>
                    {roleInfo.name}
                  </Badge>
                  {user.contextRole && (
                    <Badge variant="secondary" className="text-xs px-2.5 py-1">{user.contextRole}</Badge>
                  )}
                  {osztalyName && <Badge variant="outline" className="text-xs px-2.5 py-1">{osztalyName}</Badge>}
                  {stabName && <UserStabBadge stabName={stabName} size="sm" />}
                  {radioStabName && (
                    <Badge variant="outline" className="text-xs px-2.5 py-1 gap-1">
                      <Radio className="h-3 w-3" />
                      {radioStabName}
                    </Badge>
                  )}
                </div>
              </div>

              {loading && (
                <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adatok betöltése...
                </div>
              )}

              {/* Contact info */}
              {(phone || email) && (
                <div className="space-y-2">
                  {phone && (
                    <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/40 p-3">
                      <Phone className="h-4 w-4 text-green-500 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground">Telefon</div>
                        <div className="font-medium truncate">{phone}</div>
                      </div>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/40 p-3">
                      <Mail className="h-4 w-4 text-blue-500 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground">Email</div>
                        <div className="font-medium truncate">{email}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Additional permissions/flags */}
              {profile && (profile.szerkeszto || profile.can_create_forgatas) && (
                <div className="flex flex-wrap gap-1.5">
                  {profile.szerkeszto && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <Pencil className="h-3 w-3" /> Szerkesztő
                    </Badge>
                  )}
                </div>
              )}

              {/* Stáb history */}
              {stabHistory.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <History className="h-4 w-4 text-muted-foreground" />
                    Korábbi stáb tagságok
                  </div>
                  <div className="space-y-2">
                    {stabHistory.map((entry) => (
                      <div key={entry.id} className="rounded-lg border border-border/50 bg-muted/40 p-3 text-sm">
                        {formatStabHistoryEntry(entry).map((line, idx) => (
                          <div key={idx}>{line}</div>
                        ))}
                        <div className="mt-1 text-xs text-muted-foreground">
                          {new Date(entry.datetime).toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {children}
            </div>

            {(phone || email) && (
              <div className="flex gap-2 border-t border-border/50 p-4">
                {phone && (
                  <Button className="flex-1" size="sm" asChild>
                    <a href={`tel:${phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Hívás
                    </a>
                  </Button>
                )}
                {email && (
                  <Button variant="outline" className="flex-1 bg-transparent" size="sm" asChild>
                    <a href={`mailto:${email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
