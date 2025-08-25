"use client"

import React from 'react'
import { UserAvatar, UserAvatarWithTooltip } from '@/components/user-avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useTheme, type ThemeColor } from '@/contexts/theme-context'

/**
 * Profile Picture Demo Component
 * Showcases the different profile picture implementations including theme color support
 */
export function ProfilePictureDemo() {
  const { themeColor, setThemeColor } = useTheme()
  
  const demoUsers = [
    {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      role: 'Adminisztrátor'
    },
    {
      email: 'jane.smith@gmail.com',
      firstName: 'Jane',
      lastName: 'Smith',
      username: 'janesmith',
      role: 'Tanár'
    },
    {
      email: 'student@school.edu',
      firstName: 'Alex',
      lastName: 'Johnson',
      username: 'alexj',
      role: 'Diák'
    },
    {
      email: 'test@test.com',
      firstName: '',
      lastName: '',
      username: 'testuser',
      role: 'Vendég (Nincs név - UN inicialé)'
    },
    {
      email: 'single@name.com',
      firstName: 'Madonna',
      lastName: '',
      username: 'madonna',
      role: 'Művész (Egy név - MA inicialé)'
    }
  ]

  const themeColors: ThemeColor[] = ['red', 'amber', 'yellow', 'cyan', 'green', 'indigo', 'purple', 'pink', 'blue', 'slate']

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profilkép Demonstráció</CardTitle>
        <CardDescription>
          Az alkalmazás különböző helyein megjelenő profilképek bemutatása téma színekkel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Color Selector */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Téma szín választó</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Válassz különböző téma színeket és lásd, hogy a profilképek is változnak:
          </p>
          <div className="flex flex-wrap gap-2">
            {themeColors.map((color) => (
              <Button
                key={color}
                onClick={() => setThemeColor(color)}
                variant={themeColor === color ? "default" : "outline"}
                size="sm"
                className="capitalize"
              >
                {color}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Jelenlegi téma: <strong>{themeColor}</strong>
          </p>
        </div>

        {/* Size Variations */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Különböző méretek</h3>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <UserAvatar
                email="demo@example.com"
                firstName="Demo"
                lastName="User"
                username="demouser"
                size="sm"
              />
              <p className="text-xs text-muted-foreground mt-1">Kicsi</p>
            </div>
            <div className="text-center">
              <UserAvatar
                email="demo@example.com"
                firstName="Demo"
                lastName="User"
                username="demouser"
                size="md"
              />
              <p className="text-xs text-muted-foreground mt-1">Közepes</p>
            </div>
            <div className="text-center">
              <UserAvatar
                email="demo@example.com"
                firstName="Demo"
                lastName="User"
                username="demouser"
                size="lg"
              />
              <p className="text-xs text-muted-foreground mt-1">Nagy</p>
            </div>
            <div className="text-center">
              <UserAvatar
                email="demo@example.com"
                firstName="Demo"
                lastName="User"
                username="demouser"
                size="xl"
              />
              <p className="text-xs text-muted-foreground mt-1">Extra nagy</p>
            </div>
          </div>
        </div>

        {/* Theme Color Showcase */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Téma színekkel készült profilképek</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Ugyanaz a felhasználó különböző téma színekkel:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {themeColors.map((color) => (
              <div key={color} className="text-center p-3 border rounded-lg">
                <UserAvatar
                  email="theme.demo@example.com"
                  firstName="Theme"
                  lastName="Demo"
                  username="themedemo"
                  size="lg"
                />
                <p className="text-xs text-muted-foreground mt-2 capitalize">{color}</p>
                <Badge 
                  variant={themeColor === color ? "default" : "secondary"}
                  className="text-xs mt-1"
                >
                  {themeColor === color ? "Aktív" : "Elérhető"}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* User List */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Felhasználói lista</h3>
          <div className="space-y-3">
            {demoUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <UserAvatarWithTooltip
                  email={user.email}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  username={user.username}
                  size="md"
                  showName={true}
                />
                <Badge variant="secondary">{user.role}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Grayscale Examples */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Szürke árnyalatos (navigációhoz)</h3>
          <div className="flex items-center gap-4">
            {demoUsers.slice(0, 3).map((user, index) => (
              <UserAvatar
                key={index}
                email={user.email}
                firstName={user.firstName}
                lastName={user.lastName}
                username={user.username}
                size="md"
                grayscale={true}
                className="rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Flex Container Test */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Flexbox teszt (nem zsugorodik)</h3>
          <div className="flex items-center gap-3 p-3 border rounded-lg max-w-md">
            <UserAvatar
              email="longname@verylongdomainname.com"
              firstName="Very Long First Name"
              lastName="Very Long Last Name"
              username="verylongusername"
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">Very Long First Name Very Long Last Name</p>
              <p className="text-sm text-muted-foreground truncate">longname@verylongdomainname.com</p>
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Megjegyzés:</strong> A profilképek automatikusan próbálnak betöltődni a következő forrásokból:
          </p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>DiceBear Shapes avatar generátor (email alapú seed, téma színekkel)</li>
            <li>DiceBear Initials avatar generátor (email alapú seed, téma színekkel)</li>
            <li>UI Avatars szolgáltatás (név alapú, téma színekkel)</li>
            <li>Helyi inicialé alapú fallback (csak kereszt- és vezetéknév alapján)</li>
          </ol>
          <p className="mt-2">
            <strong>Inicialék:</strong> Kizárólag a kereszt- és vezetéknév alapján generálódnak. 
            Felhasználónév és email cím nem használódik inicialékhoz.
          </p>
          <p className="mt-2">
            <strong>Téma színek:</strong> A profilképek automatikusan alkalmazkodnak a jelenlegi 
            téma színéhez, biztosítva a konzisztens vizuális megjelenést az alkalmazásban.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
