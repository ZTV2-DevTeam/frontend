"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useTheme } from '@/contexts/theme-context'
import { ThemeSelector } from '@/components/theme-selector'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  User,
  Settings,
  Palette,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Edit,
  Mail,
  Calendar,
  Clock,
  ChevronRight
} from 'lucide-react'

interface SettingsMenuProps {
  onClose?: () => void
}

export function SettingsMenu({ onClose }: SettingsMenuProps) {
  const { user, logout } = useAuth()
  const { themeColor } = useTheme()
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      onClose?.()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const getUserInitials = () => {
    if (!user) return '?'
    const firstInitial = user.first_name?.[0] || user.username[0]
    const lastInitial = user.last_name?.[0] || user.username[1] || ''
    return `${firstInitial}${lastInitial}`.toUpperCase()
  }

  const formatUserName = () => {
    if (!user) return 'Ismeretlen felhasználó'
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`
    }
    return user.username
  }

  const settingSections = [
    {
      id: 'account',
      label: 'Fiók beállítások',
      icon: User,
      description: 'Profil és személyes adatok kezelése',
      disabled: true
    },
    {
      id: 'notifications',
      label: 'Értesítések',
      icon: Bell,
      description: 'Értesítési preferenciák',
      disabled: true
    },
    {
      id: 'privacy',
      label: 'Adatvédelem',
      icon: Shield,
      description: 'Biztonsági és adatvédelmi beállítások',
      disabled: true
    },
    {
      id: 'help',
      label: 'Súgó és támogatás',
      icon: HelpCircle,
      description: 'GYIK és ügyfélszolgálat',
      disabled: true
    }
  ]

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Settings className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Beállítások</h1>
        </div>
        <p className="text-muted-foreground">
          Személyre szabás és fiókkezelés
        </p>
      </div>

      {/* Profile Section */}
      <Card className="border-2">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarImage 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}&backgroundColor=transparent`}
                alt={formatUserName()}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <CardTitle className="text-xl">
                {formatUserName()}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user?.email || 'Nincs email megadva'}
              </CardDescription>
              <CardDescription className="flex items-center gap-2">
                <User className="w-4 h-4" />
                @{user?.username}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                  Szerkesztés
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Profil műveletek</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <Edit className="w-4 h-4" />
                  Profil szerkesztése
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/app/jelszo-modositas')}>
                  <Shield className="w-4 h-4" />
                  Jelszó módosítása
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
      </Card>

      {/* Theme Section */}
      <Card className="border-2">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Palette className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Megjelenés</CardTitle>
              <CardDescription>
                Téma és színbeállítások testreszabása
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ThemeSelector />
        </CardContent>
      </Card>

      {/* Additional Settings Sections */}
      <Card className="border-2">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <Settings className="w-5 h-5" />
            </div>
            További beállítások
          </CardTitle>
          <CardDescription>
            Hamarosan elérhető funkciók
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {settingSections.map((section) => {
            const IconComponent = section.icon
            return (
              <Button
                key={section.id}
                variant="ghost"
                className="w-full justify-between h-auto p-4 text-left"
                disabled={section.disabled}
                onClick={() => !section.disabled && setActiveSection(section.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    section.disabled 
                      ? 'bg-muted/50 text-muted-foreground/50' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className={`font-medium ${
                      section.disabled ? 'text-muted-foreground/70' : ''
                    }`}>
                      {section.label}
                    </div>
                    <div className={`text-sm ${
                      section.disabled ? 'text-muted-foreground/50' : 'text-muted-foreground'
                    }`}>
                      {section.description}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${
                  section.disabled ? 'text-muted-foreground/30' : 'text-muted-foreground'
                }`} />
              </Button>
            )
          })}
        </CardContent>
      </Card>

      {/* System Information */}
      <Card className="border-2 bg-muted/20">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Utolsó bejelentkezés:</span>
              <span className="font-mono">Ma</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Regisztráció:</span>
              <span className="font-mono">2024</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Felhasználó ID:</span>
              <span className="font-mono">#{user?.user_id}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onClose}
        >
          Bezárás
        </Button>
        <Button
          variant="destructive"
          className="flex-1"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Kijelentkezés
        </Button>
      </div>
    </div>
  )
}
