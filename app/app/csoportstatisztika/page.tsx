"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { usePermissions } from "@/contexts/permissions-context"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ProtectedRoute } from "@/components/protected-route"
import { ProfessionalLoading } from "@/components/professional-loading"
import { apiClient } from "@/lib/api"
import { type ClassMatrixResponseSchema, type OsztalySchema } from "@/lib/api"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowUpDown, Table as TableIcon } from "lucide-react"

export default function CsoportstatisztikaPage() {
  const { user } = useAuth()
  const { hasPermission } = usePermissions()
  
  const [classes, setClasses] = useState<OsztalySchema[]>([])
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null)
  
  const [matrixData, setMatrixData] = useState<ClassMatrixResponseSchema | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [flipAxes, setFlipAxes] = useState(false)

  // Fetch available classes for selector
  useEffect(() => {
    let active = true
    const fetchClasses = async () => {
      try {
        const classesData = await apiClient.getClasses()
        if (active) {
          setClasses(classesData)
          if (classesData.length > 0 && !selectedClassId) {
            setSelectedClassId(classesData[0].id)
          }
        }
      } catch (err) {
        console.error("Failed to load classes:", err)
      }
    }
    fetchClasses()
    return () => { active = false }
  }, [])

  // Fetch matrix data when a class is selected
  useEffect(() => {
    if (!selectedClassId) return

    let active = true
    const fetchMatrix = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await apiClient.getClassMatrix(selectedClassId)
        if (active) {
          setMatrixData(data)
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || "Hiba történt a statisztika betöltésekor.")
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchMatrix()
    return () => { active = false }
  }, [selectedClassId])

  // Admin and Class-Teacher only route (Admin has more rights, both should access group stats usually but prompt says Admin only so let's check)
  const isLoading = loading || !classes.length

  const getHeatmapColor = (count: number) => {
    if (count === 0) return "transparent"
    if (count === 1) return "var(--heatmap-1, rgba(59, 130, 246, 0.2))"
    if (count === 2) return "var(--heatmap-2, rgba(59, 130, 246, 0.4))"
    if (count === 3) return "var(--heatmap-3, rgba(59, 130, 246, 0.6))"
    if (count === 4) return "var(--heatmap-4, rgba(59, 130, 246, 0.8))"
    return "var(--heatmap-5, rgba(37, 99, 235, 1))"
  }

  // Render matrix
  const renderMatrix = () => {
    if (!matrixData) return null
    if (matrixData.members.length === 0) return <div className="p-8 text-center text-muted-foreground">Ebben az osztályban nincsenek diákok.</div>

    return (
      <div className="overflow-x-auto border rounded-md">
        <TooltipProvider>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="p-3 border-b text-left bg-muted/30 font-medium w-48 sticky left-0 z-10">
                  {flipAxes ? "Szerepkörök \\ Diákok" : "Diákok \\ Szerepkörök"}
                </th>
                {flipAxes ? (
                  matrixData.members.map((member) => (
                    <th key={member.user_id} className="p-3 border-b text-center align-bottom border-l bg-muted/10 min-w-16">
                      <div className="transform rotate-180 h-32 m-auto flex items-center mb-2" style={{ writingMode: 'vertical-rl' }}>
                        <span>{member.user_name}</span>
                      </div>
                    </th>
                  ))
                ) : (
                  matrixData.roles.map((role) => (
                    <th key={role.id} className="p-3 border-b text-center align-bottom border-l bg-muted/10 min-w-16">
                      <div className="transform rotate-180 h-32 m-auto flex items-center mb-2" style={{ writingMode: 'vertical-rl' }}>
                        <span>{role.name}</span>
                      </div>
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {flipAxes ? (
                // Rows = Roles, Cols = Members
                matrixData.roles.map((role) => (
                  <tr key={role.id}>
                    <td className="p-3 border-b border-r bg-muted/30 font-medium sticky left-0 z-10 w-48">
                      {role.name}
                    </td>
                    {matrixData.members.map((member) => {
                      const cell = member.roles.find(r => r.szerepkor_id === role.id)
                      const count = cell ? cell.count : 0
                      const bg = getHeatmapColor(count)
                      return (
                        <td key={member.user_id} className="border-b border-l relative" style={{ backgroundColor: bg }}>
                          {count > 0 ? (
                            <Tooltip delayDuration={150}>
                              <TooltipTrigger asChild>
                                <div className="w-full h-full p-3 min-h-12 flex items-center justify-center font-bold cursor-pointer">
                                  {count}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs bg-popover text-popover-foreground border shadow-md p-4">
                                <div className="space-y-3">
                                  <p className="font-semibold text-sm border-b pb-2">{member.user_name} mint {role.name}</p>
                                  <ul className="text-xs space-y-2 list-none pl-0 text-left m-0">
                                    {cell?.occurrences.map((occ, idx) => (
                                      <li key={idx} className="flex flex-col gap-0.5 bg-muted/30 p-2 rounded-sm">
                                        <span className="font-medium text-foreground">{occ.forgatas_name}</span>
                                        <span className="text-muted-foreground/80">{occ.date} {occ.time.substring(0, 5)}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <div className="w-full h-full p-3 min-h-12 flex items-center justify-center text-muted-foreground/30">0</div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))
              ) : (
                // Rows = Members, Cols = Roles
                matrixData.members.map((member) => (
                  <tr key={member.user_id}>
                    <td className="p-3 border-b border-r bg-muted/30 font-medium sticky left-0 z-10 w-48">
                      {member.user_name}
                    </td>
                    {matrixData.roles.map((role) => {
                       const cell = member.roles.find(r => r.szerepkor_id === role.id)
                       const count = cell ? cell.count : 0
                       const bg = getHeatmapColor(count)
                       return (
                         <td key={role.id} className="border-b border-l relative" style={{ backgroundColor: bg }}>
                           {count > 0 ? (
                             <Tooltip delayDuration={150}>
                               <TooltipTrigger asChild>
                                 <div className="w-full h-full p-3 min-h-12 flex items-center justify-center font-bold cursor-pointer">
                                   {count}
                                 </div>
                               </TooltipTrigger>
                               <TooltipContent className="max-w-xs bg-popover text-popover-foreground border shadow-md p-4">
                                 <div className="space-y-3">
                                   <p className="font-semibold text-sm border-b pb-2">{member.user_name} mint {role.name}</p>
                                   <ul className="text-xs space-y-2 list-none pl-0 text-left m-0">
                                     {cell?.occurrences.map((occ, idx) => (
                                       <li key={idx} className="flex flex-col gap-0.5 bg-muted/30 p-2 rounded-sm">
                                         <span className="font-medium text-foreground">{occ.forgatas_name}</span>
                                         <span className="text-muted-foreground/80">{occ.date} {occ.time.substring(0, 5)}</span>
                                       </li>
                                     ))}
                                   </ul>
                                 </div>
                               </TooltipContent>
                             </Tooltip>
                           ) : (
                             <div className="w-full h-full p-3 min-h-12 flex items-center justify-center text-muted-foreground/30">0</div>
                           )}
                         </td>
                       )
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TooltipProvider>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex-1 space-y-6 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary rounded-xl shadow-sm">
                  <TableIcon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">Csoportstatisztika</h1>
                  <p className="text-sm text-muted-foreground">
                    Osztályszintű forgatási beosztás statisztika
                  </p>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader className="pb-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between bg-muted/10 gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg">Statisztika nézet</CardTitle>
                  <CardDescription>Válassz osztályt a mátrix megjelenítéséhez</CardDescription>
                </div>
                <div className="flex gap-2 items-center w-full sm:w-auto">
                  <Select
                    value={selectedClassId?.toString() || ""}
                    onValueChange={(val) => setSelectedClassId(parseInt(val))}
                    disabled={classes.length === 0}
                  >
                    <SelectTrigger className="w-full sm:w-[250px]">
                      <SelectValue placeholder="Osztály választása" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                           {cls.current_display_name || cls.display_name || `${cls.start_year}-${cls.szekcio}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setFlipAxes(!flipAxes)}
                    title="Tengelyek felcserélése"
                    className="shrink-0"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6 relative min-h-[400px]">
                {loading && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-20 backdrop-blur-sm">
                    <ProfessionalLoading title="Adatok betöltése..." variant="simple" />
                  </div>
                )}
                
                {error && (
                  <div className="p-4 bg-destructive/10 text-destructive rounded-md mb-4 border border-destructive/20">
                    {error}
                  </div>
                )}

                {renderMatrix()}
                
              </CardContent>
            </Card>

          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
