/**
 * Example Usage Component
 * 
 * Demonstrates how to use the centralized database models configuration
 * throughout the application.
 */

"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DatabaseAdminButton, DatabaseAdminMenuItem } from '@/components/database-admin-button'
import { DatabaseAdminMenu, DatabaseAdminToolbar } from '@/components/database-admin-menu'
import { 
  DATABASE_MODELS, 
  getDatabaseAdminUrl, 
  getModelDisplayName,
  getDatabaseAdminMenuItemsByRole 
} from '@/lib/database-models'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Code } from 'lucide-react'

export function DatabaseModelsExample() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Database Models Usage Examples
          </CardTitle>
          <CardDescription>
            Different ways to use the centralized database models configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Example 1: Database Admin Buttons */}
          <div>
            <h4 className="text-sm font-medium mb-3">1. Database Admin Buttons</h4>
            <div className="flex flex-wrap gap-2">
              <DatabaseAdminButton modelName="FORGATAS">
                Forgatások
              </DatabaseAdminButton>
              <DatabaseAdminButton modelPath={DATABASE_MODELS.PARTNER}>
                Partnerek
              </DatabaseAdminButton>
              <DatabaseAdminButton modelName="EQUIPMENT" variant="default">
                Felszerelések
              </DatabaseAdminButton>
            </div>
          </div>

          {/* Example 2: Dropdown Menu Integration */}
          <div>
            <h4 className="text-sm font-medium mb-3">2. Dropdown Menu Integration</h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  Database Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DatabaseAdminMenuItem modelName="FORGATAS">
                  Forgatások kezelése
                </DatabaseAdminMenuItem>
                <DatabaseAdminMenuItem modelName="BEOSZTAS">
                  Beosztások kezelése
                </DatabaseAdminMenuItem>
                <DatabaseAdminMenuItem modelPath={DATABASE_MODELS.AUTH_USER}>
                  Felhasználók kezelése
                </DatabaseAdminMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Example 3: Quick Access Toolbar */}
          <div>
            <h4 className="text-sm font-medium mb-3">3. Quick Access Toolbar</h4>
            <DatabaseAdminToolbar maxItems={4} />
          </div>

          {/* Example 4: Helper Functions */}
          <div>
            <h4 className="text-sm font-medium mb-3">4. Helper Functions Usage</h4>
            <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
              <p><strong>Model Display Name:</strong> {getModelDisplayName(DATABASE_MODELS.PARTNER)}</p>
              <p><strong>Admin URL:</strong> {getDatabaseAdminUrl(DATABASE_MODELS.FORGATAS)}</p>
              <p><strong>Available Models for Admin:</strong> {getDatabaseAdminMenuItemsByRole('admin').length} models</p>
            </div>
          </div>

          {/* Example 5: Complete Menu Systems */}
          <div>
            <h4 className="text-sm font-medium mb-3">5. Complete Menu Systems</h4>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Grid Layout</CardTitle>
                </CardHeader>
                <CardContent>
                  <DatabaseAdminMenu 
                    layout="grid" 
                    showCategories={false} 
                    className="max-h-48 overflow-y-auto"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Sidebar Layout</CardTitle>
                </CardHeader>
                <CardContent>
                  <DatabaseAdminMenu 
                    layout="sidebar" 
                    showCategories={true} 
                    className="max-h-48 overflow-y-auto"
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Example 6: Custom Implementation */}
          <div>
            <h4 className="text-sm font-medium mb-3">6. Custom Implementation</h4>
            <div className="space-y-2">
              {Object.entries(DATABASE_MODELS).slice(0, 5).map(([key, path]) => (
                <div 
                  key={key}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <span className="text-sm font-medium">
                    {getModelDisplayName(path)}
                  </span>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => {
                      const url = getDatabaseAdminUrl(path)
                      window.open(url, '_blank')
                    }}
                  >
                    Open Admin
                  </Button>
                </div>
              ))}
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
