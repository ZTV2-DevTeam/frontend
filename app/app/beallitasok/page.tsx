"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ThemeSelector } from "@/components/theme-selector"
import { PhoneNumberEditModal } from "@/components/phone-number-edit-modal"
import { useAuth } from "@/contexts/auth-context"
import { useUserRole } from "@/contexts/user-role-context"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Settings,
  Save,
  User,
  Mail,
  AtSign,
  Palette,
  Lock,
  Edit,
  Calendar,
  Clock,
  LogOut,
  Sparkles,
  Activity,
  Phone,
} from "lucide-react"

export default function SettingsPage() {
  const { user, logout, updateUserProfile } = useAuth()
  const { currentRole } = useUserRole()
  const router = useRouter()
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)

  if (!user) return null

  const userDisplayName = `${user.last_name} ${user.first_name}`.trim() || user.username

  const getUserInitials = () => {
    if (!user) return '?'
    const firstInitial = user.first_name?.[0] || user.username[0]
    const lastInitial = user.last_name?.[0] || user.username[1] || ''
    return `${firstInitial}${lastInitial}`.toUpperCase()
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handlePhoneNumberUpdate = (newPhoneNumber?: string) => {
    updateUserProfile({ telefonszam: newPhoneNumber })
  }



  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary rounded-xl shadow-sm">
                <Settings className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">Beállítások</h1>
                <p className="text-base text-muted-foreground">
                  Személyre szabás és fiókkezelés
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                {currentRole === 'admin' ? 'Admin' : 
                 currentRole === 'class-teacher' ? 'Tanár' : 'Diák'}
              </div>
            </div>
          </div>

          <div className="w-full max-w-6xl mx-auto space-y-6 md:space-y-8">
            {/* Profile Overview Card */}
            <Card className="border-2 shadow-lg bg-gradient-to-r from-card to-card/50">
              <CardHeader className="p-4 sm:p-6 pb-4">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-primary/20 shadow-xl flex-shrink-0">
                      <AvatarImage 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}&backgroundColor=transparent`}
                        alt={userDisplayName}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-lg sm:text-2xl">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2 min-w-0 flex-1 sm:flex-initial">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold break-words">{userDisplayName}</h2>
                      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="break-all">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
                          <AtSign className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="break-all">{user.username}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <div className="px-2 sm:px-3 py-1 bg-primary/15 text-primary rounded-full text-xs sm:text-sm font-medium">
                          <Activity className="w-3 h-3 inline mr-1" />
                          {currentRole === 'admin' ? 'Rendszer adminisztrátor' : 
                           currentRole === 'class-teacher' ? 'Osztályfőnök' : 'Diák'}
                        </div>

                      </div>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto sm:ml-auto">
                    <Button variant="outline" size="sm" disabled className="w-full sm:w-auto">
                      <Edit className="w-4 h-4 mr-2" />
                      Szerkesztés
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Enhanced Theme Section */}
            <Card className="border-2 shadow-lg">
              <CardHeader className="p-4 sm:p-6 pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl flex-shrink-0">
                      <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg sm:text-xl break-words">Megjelenés és téma</CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        Személyre szabd az alkalmazás kinézetét és színvilágát
                      </CardDescription>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto">
                    <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-700 dark:text-violet-300 rounded-full text-xs sm:text-sm font-medium flex items-center justify-center sm:justify-start gap-2">
                      <Sparkles className="w-3 h-3" />
                      Aktív
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-2 flex justify-center">
                <div className="w-full max-w-md">
                  <ThemeSelector />
                </div>
              </CardContent>
            </Card>

            {/* Detailed Profile Information */}
            <Card className="border-2 shadow-lg">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-blue-500/10 rounded-xl flex-shrink-0">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg sm:text-xl break-words">Profil információk</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Alapvető fiókadatok és beállítások
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium flex items-center gap-2">
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        Vezetéknév
                      </Label>
                      <div className="h-10 sm:h-11 px-3 py-2 bg-muted/30 border border-border/50 rounded-md flex items-center text-sm">
                        {user.last_name || 'Nincs megadva'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium flex items-center gap-2">
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        Keresztnév
                      </Label>
                      <div className="h-10 sm:h-11 px-3 py-2 bg-muted/30 border border-border/50 rounded-md flex items-center text-sm">
                        {user.first_name || 'Nincs megadva'}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium flex items-center gap-2">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                        Email cím
                      </Label>
                      <div className="h-10 sm:h-11 px-3 py-2 bg-muted/30 border border-border/50 rounded-md flex items-center text-xs sm:text-sm">
                        {user.email || 'Nincs megadva'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium flex items-center gap-2">
                        <AtSign className="w-3 h-3 sm:w-4 sm:h-4" />
                        Felhasználónév
                      </Label>
                      <div className="h-10 sm:h-11 px-3 py-2 bg-muted/30 border border-border/50 rounded-md flex items-center text-sm">
                        {user.username || 'Nincs megadva'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone Number Field */}
                <div className="space-y-2 pt-4 border-t">
                  <Label className="text-xs sm:text-sm font-medium flex items-center gap-2">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                    Telefonszám
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-10 sm:h-11 px-3 py-2 bg-muted/30 border border-border/50 rounded-md flex items-center text-sm">
                      {user.telefonszam || 'Nincs megadva'}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsPhoneModalOpen(true)}
                      className="h-10 sm:h-11 px-3"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Szerkesztés
                    </Button>
                  </div>
                </div>

                {/* System Information */}
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <Activity className="w-4 h-4" />
                    Rendszerinformációk
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                      <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-muted-foreground block">Utolsó bejelentkezés:</span>
                        <div className="font-mono text-xs">Ma</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                      <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-muted-foreground block">Regisztráció:</span>
                        <div className="font-mono text-xs">2024</div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button type="button" disabled className="h-10 sm:h-11 px-4 sm:px-6 opacity-50 flex-1 sm:flex-initial">
                    <Save className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Profil </span>mentése
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="h-10 sm:h-11 px-4 sm:px-6 flex-1 sm:flex-initial"
                    onClick={() => router.push('/app/jelszo-modositas')}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Jelszó </span>változtatása
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 px-2 sm:px-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-12 sm:h-14 text-sm sm:text-base px-6 sm:px-8 py-3"
                onClick={() => window.history.back()}
              >
                Vissza
              </Button>
              <Button
                variant="destructive"
                size="lg"
                className="flex-1 h-12 sm:h-14 text-sm sm:text-base px-6 sm:px-8 py-3
                dark:bg-red-600 dark:hover:bg-red-600/50"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Kijelentkezés
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Phone Number Edit Modal */}
      <PhoneNumberEditModal
        isOpen={isPhoneModalOpen}
        onOpenChange={setIsPhoneModalOpen}
        currentPhoneNumber={user.telefonszam}
        onPhoneNumberUpdate={handlePhoneNumberUpdate}
      />
    </SidebarProvider>
  )
}
