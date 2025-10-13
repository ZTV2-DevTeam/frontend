'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Plus, Settings, Search, Wrench, AlertTriangle, Calendar } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUserRole } from '@/contexts/user-role-context'
import { useApiQuery } from '@/lib/api-helpers'
import { apiClient } from '@/lib/api'
import type { EquipmentSchema, EquipmentTipusSchema } from '@/lib/api'
import { EquipmentDataTable } from '@/components/equipment-data-table'
import { EquipmentManagementDialog } from '@/components/equipment-management-dialog'
import { CreateEquipmentTypeDialog } from '@/components/create-equipment-type-dialog'
import { EquipmentAssignmentDialog } from '@/components/equipment-assignment-dialog'
import { EquipmentAvailabilityChecker } from '@/components/equipment-availability-checker'
import { EquipmentStats } from '@/components/equipment-stats'

export default function EquipmentPage() {
  const { isAuthenticated } = useAuth()
  const { currentRole } = useUserRole()
  const isAdmin = currentRole === 'admin'
  const searchParams = useSearchParams()
  const router = useRouter()

  // State for filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [functionalFilter, setFunctionalFilter] = useState<string>('all')

  // Dialog states
  const [showCreateEquipment, setShowCreateEquipment] = useState(false)
  const [showEditEquipment, setShowEditEquipment] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentSchema | null>(null)
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false)

  // Handle URL parameters to auto-open assignment dialog
  useEffect(() => {
    // Wait for authentication and role to be determined
    if (!isAuthenticated || currentRole === undefined) return
    
    const sessionId = searchParams.get('session')
    const openDialog = searchParams.get('assign')
    
    console.log('URL params:', { sessionId, openDialog, isAdmin, isAuthenticated, currentRole })
    
    if (sessionId && openDialog === 'true' && isAdmin) {
      console.log('Opening assignment dialog with session:', sessionId)
      // Small delay to ensure component is fully mounted
      setTimeout(() => {
        setShowAssignmentDialog(true)
      }, 100)
    }
  }, [searchParams, isAdmin, isAuthenticated, currentRole])

  // Clear URL parameters when assignment dialog is closed
  const handleAssignmentDialogChange = (open: boolean) => {
    setShowAssignmentDialog(open)
    
    if (!open && (searchParams.get('session') || searchParams.get('assign'))) {
      // Clear URL parameters to prevent auto-reopening
      router.replace('/app/felszereles')
    }
  }

  // Fetch equipment and types
  const { data: equipment, error: equipmentError, loading: equipmentLoading } = useApiQuery(
    () => isAuthenticated ? apiClient.getEquipment() : Promise.resolve([]),
    [isAuthenticated]
  )

  const { data: equipmentTypes, error: typesError, loading: typesLoading } = useApiQuery(
    () => isAuthenticated ? apiClient.getEquipmentTypes() : Promise.resolve([]),
    [isAuthenticated]
  )

  const { data: filmingSessions } = useApiQuery(
    () => isAuthenticated && isAdmin ? apiClient.getFilmingSessions() : Promise.resolve([]),
    [isAuthenticated, isAdmin]
  )

  // Ensure data is available
  const equipmentList = equipment || []
  const typesList = equipmentTypes || []

  // Filter equipment based on current filters
  const filteredEquipment = equipmentList.filter((item: EquipmentSchema) => {
    const matchesSearch = searchTerm === '' || 
      item.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = selectedType === 'all' || 
      (item.equipment_type?.id.toString() === selectedType)

    const matchesFunctional = functionalFilter === 'all' ||
      (functionalFilter === 'functional' && item.functional) ||
      (functionalFilter === 'non-functional' && !item.functional)

    return matchesSearch && matchesType && matchesFunctional
  })



  const loading = equipmentLoading || typesLoading

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex-1 flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <Wrench className="absolute inset-0 m-auto h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Felszerelések betöltése</h3>
                <p className="text-sm text-muted-foreground">Kérjük várjon, amíg betöltjük az adatokat...</p>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (equipmentError || typesError) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex-1 flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md mx-4 border-destructive/20 bg-destructive/5">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle className="text-destructive">Hiba történt</CardTitle>
                <CardDescription>
                  Nem sikerült betölteni a felszerelés adatokat
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  {equipmentError || typesError}
                </p>
                <Button 
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  Újrapróbálás
                </Button>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  // Refresh handler
  const handleRefresh = () => {
    // Force re-render by reloading the page for now
    // In a production app, you'd want to refetch the data instead
    window.location.reload()
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary rounded-xl shadow-sm">
                <Wrench className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">
                  Felszerelés 
                  <span className="text-orange-500 text-lg ml-2 font-medium">(Tesztelés alatt)</span>
                </h1>
                <p className="text-base text-muted-foreground">
                  {isAdmin 
                    ? 'Felszerelések kezelés és állapotuk nyomonkövetése'
                    : 'Felszerelések megtekintése'
                  }
                </p>
              </div>
            </div>
            
            {isAdmin && (
              <div className="flex items-center gap-2">
                <CreateEquipmentTypeDialog onSuccess={handleRefresh}>
                  <Button 
                    variant="outline" 
                    className="whitespace-nowrap shadow-sm"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Típus kezelés
                  </Button>
                </CreateEquipmentTypeDialog>
                <Button 
                  variant="outline"
                  className="whitespace-nowrap shadow-sm"
                  onClick={() => handleAssignmentDialogChange(true)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Hozzárendelés
                </Button>
                <Button 
                  className="whitespace-nowrap shadow-sm"
                  onClick={() => setShowCreateEquipment(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Új felszerelés
                </Button>
              </div>
            )}
          </div>

      {/* Main Content */}
      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">Felszerelés lista</TabsTrigger>
          <TabsTrigger value="availability">Elérhetőség ellenőrző</TabsTrigger>
          {isAdmin && <TabsTrigger value="stats">Statisztikák</TabsTrigger>}
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Szűrők</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Keresés név, márka vagy modell alapján..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Válasszon típust" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Minden típus</SelectItem>
                    {typesList.map((type: EquipmentTipusSchema) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.emoji && `${type.emoji} `}{type.name} ({type.equipment_count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={functionalFilter} onValueChange={setFunctionalFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Állapot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Minden állapot</SelectItem>
                    <SelectItem value="functional">Működőképes</SelectItem>
                    <SelectItem value="non-functional">Karbantartásra szorul</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Equipment Table */}
          <Card>
            <CardHeader>
              <CardTitle>Felszerelés ({filteredEquipment.length})</CardTitle>
              <CardDescription>
                {isAdmin 
                  ? 'Kattintson egy felszerelésre a részletek megtekintéséhez vagy szerkesztéséhez.'
                  : 'Tekintse meg az elérhető média felszereléseket és azok állapotát.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EquipmentDataTable
                data={filteredEquipment}
                isAdmin={isAdmin}
                onEditEquipment={(equipment) => {
                  setSelectedEquipment(equipment)
                  setShowEditEquipment(true)
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability">
          <EquipmentAvailabilityChecker />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="stats">
            <EquipmentStats 
              equipment={equipmentList}
              equipmentTypes={typesList}
              filmingSessions={filmingSessions || []}
            />
          </TabsContent>
        )}
      </Tabs>
        </div>

        {/* Dialogs */}
        {isAdmin && (
          <>
            <EquipmentManagementDialog
              open={showCreateEquipment}
              onOpenChange={setShowCreateEquipment}
              equipment={null}
              equipmentTypes={typesList}
              onSuccess={handleRefresh}
            />
            
            <EquipmentManagementDialog
              open={showEditEquipment}
              onOpenChange={setShowEditEquipment}
              equipment={selectedEquipment}
              equipmentTypes={typesList}
              onSuccess={handleRefresh}
            />

            <EquipmentAssignmentDialog
              open={showAssignmentDialog}
              onOpenChange={handleAssignmentDialogChange}
              onSuccess={handleRefresh}
              initialSessionId={searchParams.get('session')}
            />
          </>
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}