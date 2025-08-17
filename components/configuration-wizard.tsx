'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Upload,
  FileSpreadsheet,
  Users,
  GraduationCap,
  School,
  Building,
  Camera,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  Info,
  Eye,
  RefreshCw
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { apiClient } from '@/lib/api'

interface ConfigurationWizardProps {
  onComplete: () => void
}

interface WizardStatus {
  total_records: number
  successful_uploads: number
  in_progress: number
  classes_completed: boolean
  stabs_completed: boolean
  teachers_completed: boolean
  students_completed: boolean
  wizard_completed: boolean
}

interface ParsedData {
  type: string
  total_records: number
  valid_records: number
  invalid_records: number
  data: any[]
  errors: string[]
  warnings: string[]
}

interface UploadState {
  uploading: boolean
  parsing: boolean
  confirming: boolean
  file: File | null
  parsedData: ParsedData | null
  confirmed: boolean
  showPreview: boolean
}

const DATA_TYPES = {
  classes: { label: 'Osztályok', required: true, order: 1 },
  stabs: { label: 'Stábok', required: true, order: 2 },
  teachers: { label: 'Tanárok', required: true, order: 3 },
  students: { label: 'Tanulók', required: true, order: 4 }
}

export function ConfigurationWizard({ onComplete }: ConfigurationWizardProps) {
  const [wizardStatus, setWizardStatus] = useState<WizardStatus | null>(null)
  const [uploadStates, setUploadStates] = useState<{[key: string]: UploadState}>({})
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [currentData, setCurrentData] = useState<{[key: string]: any[]}>({})
  const [loadingCurrentData, setLoadingCurrentData] = useState(false)
  const [activeTab, setActiveTab] = useState('status')
  const { toast } = useToast()

  // Initialize upload states
  useEffect(() => {
    const initialStates: {[key: string]: UploadState} = {}
    Object.keys(DATA_TYPES).forEach(type => {
      initialStates[type] = {
        uploading: false,
        parsing: false,
        confirming: false,
        file: null,
        parsedData: null,
        confirmed: false,
        showPreview: false
      }
    })
    setUploadStates(initialStates)
  }, [])

  // Load wizard status
  const loadWizardStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/config-wizard/status', {
        headers: {
          'Authorization': `Bearer ${apiClient.getToken()}`
        }
      })

      if (response.ok) {
        const status = await response.json()
        setWizardStatus(status)
        
        // Update confirmed states based on status
        setUploadStates(prev => ({
          ...prev,
          classes: { ...prev.classes, confirmed: status.classes_completed },
          stabs: { ...prev.stabs, confirmed: status.stabs_completed },
          teachers: { ...prev.teachers, confirmed: status.teachers_completed },
          students: { ...prev.students, confirmed: status.students_completed }
        }))
      } else {
        // If API is not available, create a default status
        console.warn('Config wizard API not available, using default status')
        setWizardStatus({
          total_records: 0,
          successful_uploads: 0,
          in_progress: 0,
          classes_completed: false,
          stabs_completed: false,
          teachers_completed: false,
          students_completed: false,
          wizard_completed: false
        })
      }
    } catch (error) {
      console.error('Failed to load wizard status:', error)
      // Set default status on error
      setWizardStatus({
        total_records: 0,
        successful_uploads: 0,
        in_progress: 0,
        classes_completed: false,
        stabs_completed: false,
        teachers_completed: false,
        students_completed: false,
        wizard_completed: false
      })
    } finally {
      setLoadingStatus(false)
    }
  }, [])

  // Load current data for review
  const loadCurrentData = useCallback(async () => {
    setLoadingCurrentData(true)
    try {
      const dataTypes = Object.keys(DATA_TYPES)
      const results: {[key: string]: any[]} = {}
      
      for (const dataType of dataTypes) {
        try {
          const response = await fetch(`/api/config-wizard/current-data/${dataType}`, {
            headers: {
              'Authorization': `Bearer ${apiClient.getToken()}`
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            results[dataType] = data.data || []
          } else {
            console.warn(`API endpoint for ${dataType} not available`)
            results[dataType] = []
          }
        } catch (error) {
          console.error(`Failed to load ${dataType} data:`, error)
          results[dataType] = []
        }
      }
      
      setCurrentData(results)
    } catch (error) {
      console.error('Failed to load current data:', error)
      // Set empty data on error
      const emptyResults: {[key: string]: any[]} = {}
      Object.keys(DATA_TYPES).forEach(dataType => {
        emptyResults[dataType] = []
      })
      setCurrentData(emptyResults)
    } finally {
      setLoadingCurrentData(false)
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'current') {
      loadCurrentData()
    }
  }, [activeTab, loadCurrentData])

  const renderCurrentDataSection = (dataType: string) => {
    const config = DATA_TYPES[dataType as keyof typeof DATA_TYPES]
    const data = currentData[dataType] || []
    
    if (!config) return null

    const icons = {
      classes: GraduationCap,
      stabs: Users,
      teachers: School,
      students: Users
    }
    const Icon = icons[dataType as keyof typeof icons]

    const getDisplayColumns = (dataType: string) => {
      switch (dataType) {
        case 'classes':
          return [
            { key: 'start_year', label: 'Évfolyam' },
            { key: 'section', label: 'Szekció' },
            { key: 'school_year', label: 'Tanév' },
            { key: 'class_teachers', label: 'Osztályfőnök' }
          ]
        case 'stabs':
          return [
            { key: 'name', label: 'Név' },
            { key: 'description', label: 'Leírás' },
            { key: 'type', label: 'Típus' }
          ]
        case 'teachers':
          return [
            { key: 'username', label: 'Felhasználónév' },
            { key: 'first_name', label: 'Keresztnév' },
            { key: 'last_name', label: 'Vezetéknév' },
            { key: 'email', label: 'Email' },
            { key: 'admin_type', label: 'Jogosultság' },
            { key: 'is_class_teacher', label: 'Osztályfőnök' }
          ]
        case 'students':
          return [
            { key: 'username', label: 'Felhasználónév' },
            { key: 'first_name', label: 'Keresztnév' },
            { key: 'last_name', label: 'Vezetéknév' },
            { key: 'class_display', label: 'Osztály' },
            { key: 'stab', label: 'Stáb' }
          ]
        default:
          return []
      }
    }

    const columns = getDisplayColumns(dataType)
    const displayData = data.slice(0, 50) // Show max 50 records for performance

    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-blue-400" />
            {config.label}
            <Badge variant="outline" className="text-xs">
              {data.length} rekord
            </Badge>
          </CardTitle>
          <CardDescription>
            Jelenleg feltöltött {config.label.toLowerCase()} adatok áttekintése
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Még nincsenek feltöltött {config.label.toLowerCase()} adatok</p>
              <p className="text-sm mt-2">Használja a feltöltés funkciót adatok hozzáadásához</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold text-blue-600">{data.length}</p>
                  <p className="text-xs text-muted-foreground">Összes</p>
                </div>
                {dataType === 'students' && (
                  <>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">
                        {data.filter(s => s.stab).length}
                      </p>
                      <p className="text-xs text-muted-foreground">Stábba osztva</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold text-purple-600">
                        {new Set(data.map(s => `${s.class_start_year}${s.class_section}`)).size}
                      </p>
                      <p className="text-xs text-muted-foreground">Osztály</p>
                    </div>
                  </>
                )}
                {dataType === 'teachers' && (
                  <>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">
                        {data.filter(t => t.is_class_teacher).length}
                      </p>
                      <p className="text-xs text-muted-foreground">Osztályfőnök</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold text-red-600">
                        {data.filter(t => t.admin_type === 'system_admin').length}
                      </p>
                      <p className="text-xs text-muted-foreground">Admin</p>
                    </div>
                  </>
                )}
                {dataType === 'classes' && (
                  <>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">
                        {new Set(data.map(c => c.start_year)).size}
                      </p>
                      <p className="text-xs text-muted-foreground">Évfolyam</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold text-purple-600">
                        {new Set(data.map(c => c.section)).size}
                      </p>
                      <p className="text-xs text-muted-foreground">Szekció</p>
                    </div>
                  </>
                )}
              </div>

              {/* Data Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-96">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.map(col => (
                          <TableHead key={col.key} className="min-w-[100px] bg-muted/50">
                            {col.label}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayData.map((row, index) => (
                        <TableRow key={index} className="hover:bg-muted/25">
                          {columns.map(col => (
                            <TableCell key={col.key} className="text-sm">
                              {dataType === 'students' && col.key === 'class_display' ? 
                                `${row.class_start_year}${row.class_section}` :
                               dataType === 'teachers' && col.key === 'is_class_teacher' ?
                                (row[col.key] ? 'Igen' : 'Nem') :
                               col.key === 'admin_type' && row[col.key] === 'system_admin' ?
                                'Rendszergazda' :
                               col.key === 'admin_type' && row[col.key] === 'teacher' ?
                                'Tanár' :
                               String(row[col.key] || '-')
                              }
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {data.length > 50 && (
                  <div className="p-3 bg-muted/25 border-t text-center text-sm text-muted-foreground">
                    Csak az első 50 rekord látható. Összesen: {data.length} rekord
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const handleFileSelect = useCallback((dataType: string, file: File | null) => {
    setUploadStates(prev => ({
      ...prev,
      [dataType]: {
        ...prev[dataType],
        file,
        parsedData: null,
        showPreview: false
      }
    }))
  }, [])

  const parseFile = async (dataType: string) => {
    const state = uploadStates[dataType]
    if (!state.file) return

    setUploadStates(prev => ({
      ...prev,
      [dataType]: { ...prev[dataType], parsing: true, parsedData: null }
    }))

    try {
      const formData = new FormData()
      formData.append('file', state.file)
      formData.append('data_type', dataType)

      const response = await fetch('/api/config-wizard/parse-xlsx', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiClient.getToken()}`
        },
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        setUploadStates(prev => ({
          ...prev,
          [dataType]: {
            ...prev[dataType],
            parsing: false,
            parsedData: result,
            showPreview: true
          }
        }))

        toast({
          title: "Fájl feldolgozva",
          description: `${result.valid_records} érvényes rekord található a fájlban.`,
        })
      } else {
        throw new Error(result.message || 'Hiba történt a fájl feldolgozása során')
      }
    } catch (error: any) {
      console.error('Parse error:', error)
      
      // If API is not available, show a fallback message
      setUploadStates(prev => ({
        ...prev,
        [dataType]: { ...prev[dataType], parsing: false, parsedData: null }
      }))

      toast({
        title: "API nem elérhető",
        description: "A Configuration Wizard API még nincs implementálva. Ez a funkció jelenleg csak demo céljából érhető el.",
        variant: "destructive"
      })
    }
  }

  const confirmData = async (dataType: string) => {
    const state = uploadStates[dataType]
    if (!state.parsedData) return

    setUploadStates(prev => ({
      ...prev,
      [dataType]: { ...prev[dataType], confirming: true }
    }))

    try {
      const response = await fetch('/api/config-wizard/confirm-data', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiClient.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: dataType,
          data: state.parsedData.data
        })
      })

      const result = await response.json()

      if (response.ok) {
        setUploadStates(prev => ({
          ...prev,
          [dataType]: {
            ...prev[dataType],
            confirming: false,
            confirmed: true,
            showPreview: false
          }
        }))

        toast({
          title: "Adatok létrehozva",
          description: `${result.created_records} rekord sikeresen létrehozva.`,
        })

        // Reload wizard status
        loadWizardStatus()
      } else {
        throw new Error(result.message || 'Hiba történt az adatok létrehozása során')
      }
    } catch (error: any) {
      console.error('Confirm error:', error)
      
      setUploadStates(prev => ({
        ...prev,
        [dataType]: { ...prev[dataType], confirming: false }
      }))

      toast({
        title: "Létrehozási hiba",
        description: error.message || "Nem sikerült létrehozni az adatokat",
        variant: "destructive"
      })
    }
  }

  const downloadTemplate = async (dataType: string) => {
    try {
      const response = await fetch(`/api/config-wizard/download-template/${dataType}`, {
        headers: {
          'Authorization': `Bearer ${apiClient.getToken()}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${dataType}_sablon.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Sablon letöltve",
          description: `${dataType}_sablon.xlsx sikeresen letöltve.`,
        })
      } else {
        throw new Error('Template endpoint not available')
      }
    } catch (error: any) {
      toast({
        title: "Letöltési hiba",
        description: error.message || "Nem sikerült letölteni a sablont",
        variant: "destructive"
      })
    }
  }

  const completeWizard = async () => {
    try {
      const response = await fetch('/api/config-wizard/complete', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiClient.getToken()}`
        }
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Konfiguráció befejezve",
          description: "A rendszer sikeresen konfigurálva és aktiválva.",
        })
        onComplete()
      } else {
        throw new Error(result.message || 'Hiba történt a konfiguráció befejezése során')
      }
    } catch (error: any) {
      toast({
        title: "Befejezési hiba",
        description: error.message || "Nem sikerült befejezni a konfigurációt",
        variant: "destructive"
      })
    }
  }

  const getStatusIcon = (dataType: string) => {
    const state = uploadStates[dataType]
    if (state?.confirmed) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (state?.parsedData) return <Eye className="h-4 w-4 text-blue-600" />
    return <Upload className="h-4 w-4 text-muted-foreground" />
  }

  const renderDataPreview = (dataType: string, parsedData: ParsedData) => {
    if (!parsedData.data || parsedData.data.length === 0) return null

    const sampleData = parsedData.data.slice(0, 3) // Show first 3 rows
    const keys = Object.keys(sampleData[0] || {})

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{parsedData.valid_records}</p>
            <p className="text-sm text-muted-foreground">Érvényes rekord</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{parsedData.invalid_records}</p>
            <p className="text-sm text-muted-foreground">Hibás rekord</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{parsedData.total_records}</p>
            <p className="text-sm text-muted-foreground">Összes rekord</p>
          </div>
        </div>

        {parsedData.errors.length > 0 && (
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <div className="text-red-800 dark:text-red-200">
                <p className="font-medium mb-2">Hibák a fájlban:</p>
                <ul className="text-sm list-disc list-inside space-y-1">
                  {parsedData.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {parsedData.warnings.length > 0 && (
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription>
              <div className="text-yellow-800 dark:text-yellow-200">
                <p className="font-medium mb-2">Figyelmeztetések:</p>
                <ul className="text-sm list-disc list-inside space-y-1">
                  {parsedData.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {sampleData.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Adatok előnézete (első 3 sor):</h4>
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {keys.map(key => (
                      <TableHead key={key} className="min-w-[100px]">{key}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleData.map((row, index) => (
                    <TableRow key={index}>
                      {keys.map(key => (
                        <TableCell key={key} className="text-sm">
                          {String(row[key] || '')}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {parsedData.data.length > 3 && (
              <p className="text-sm text-muted-foreground text-center">
                ...és még {parsedData.data.length - 3} sor
              </p>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderUploadSection = (dataType: string) => {
    const config = DATA_TYPES[dataType as keyof typeof DATA_TYPES]
    const state = uploadStates[dataType]
    
    if (!config || !state) return null

    const icons = {
      classes: GraduationCap,
      stabs: Users,
      teachers: School,
      students: Users
    }
    const Icon = icons[dataType as keyof typeof icons]

    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(dataType)}
            <Icon className="h-5 w-5 text-blue-400" />
            {config.label}
            {config.required && <Badge variant="destructive" className="text-xs">Kötelező</Badge>}
            {state.confirmed && <Badge variant="default" className="text-xs bg-green-600">Kész</Badge>}
          </CardTitle>
          <CardDescription>
            {dataType === 'classes' && 'Osztályok és szekciók (pl. 2024F, 2023A)'}
            {dataType === 'stabs' && 'Média stábok (A stáb, B stáb, stb.)'}
            {dataType === 'teachers' && 'Tanárok és adminisztrátorok'}
            {dataType === 'students' && 'Diákok és osztályba sorolás'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.confirmed ? (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Ez az adattípus sikeresen fel lett töltve és megerősítve.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Template Download */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">XLSX sablon letöltése</p>
                  <p className="text-xs text-muted-foreground">
                    Töltse le a sablont a helyes formátum megismeréséhez
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadTemplate(dataType)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Sablon
                </Button>
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                <Label htmlFor={`file-${dataType}`} className="text-sm font-medium">
                  XLSX fájl feltöltése
                </Label>
                <Input
                  id={`file-${dataType}`}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => handleFileSelect(dataType, e.target.files?.[0] || null)}
                  disabled={state.parsing || state.confirming}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                
                {state.file && !state.parsedData && (
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{state.file.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {(state.file.size / 1024).toFixed(1)} KB
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => parseFile(dataType)}
                      disabled={state.parsing}
                    >
                      {state.parsing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Feldolgozás...
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Előnézet
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Data Preview */}
              {state.parsedData && state.showPreview && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/25">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Adatok előnézete</h4>
                    <Button
                      size="sm"
                      onClick={() => setUploadStates(prev => ({
                        ...prev,
                        [dataType]: { ...prev[dataType], showPreview: false }
                      }))}
                      variant="ghost"
                    >
                      Bezárás
                    </Button>
                  </div>
                  
                  {renderDataPreview(dataType, state.parsedData)}
                  
                  {state.parsedData.valid_records > 0 && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => confirmData(dataType)}
                        disabled={state.confirming}
                        className="flex-1"
                      >
                        {state.confirming ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Létrehozás...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Adatok megerősítése és létrehozása
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  if (loadingStatus) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Állapot betöltése...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* API Status Warning */}
      <Alert className="border-orange-500/50 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800 dark:text-orange-200">
          <strong>Fejlesztési állapot:</strong> A Configuration Wizard API végpontok még nem implementáltak. 
          Ez az interfész demo céljából érhető el, és mutatja be a tervezett funkcionalitást.
        </AlertDescription>
      </Alert>

      {/* Status Overview */}
      {wizardStatus && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Konfiguráció állapota
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={loadWizardStatus}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{wizardStatus.total_records}</p>
                <p className="text-sm text-muted-foreground">Összes rekord</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{wizardStatus.successful_uploads}</p>
                <p className="text-sm text-muted-foreground">Sikeres feltöltés</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-amber-600">{wizardStatus.in_progress}</p>
                <p className="text-sm text-muted-foreground">Folyamatban</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">
                  {[wizardStatus.classes_completed, wizardStatus.stabs_completed, wizardStatus.teachers_completed, wizardStatus.students_completed].filter(Boolean).length}/4
                </p>
                <p className="text-sm text-muted-foreground">Befejezett lépés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Feltöltés & Beállítás
          </TabsTrigger>
          <TabsTrigger value="current" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Jelenlegi Adatok
          </TabsTrigger>
        </TabsList>

        {/* Upload and Setup Tab */}
        <TabsContent value="status" className="space-y-6">
          {/* Setup Steps */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Javasolt sorrend:</strong> Osztályok → Stábok → Tanárok → Tanulók. 
              Minden lépésben töltse le a sablont, töltse fel az adatokat, tekintse meg az előnézetet, majd erősítse meg a létrehozást.
            </AlertDescription>
          </Alert>

          {/* Upload Sections */}
          <div className="space-y-6">
            {Object.keys(DATA_TYPES)
              .sort((a, b) => DATA_TYPES[a as keyof typeof DATA_TYPES].order - DATA_TYPES[b as keyof typeof DATA_TYPES].order)
              .map(dataType => renderUploadSection(dataType))}
          </div>

          {/* Completion */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Konfiguráció befejezése
              </CardTitle>
              <CardDescription>
                Miután feltöltötte és megerősítette az összes kötelező adatot, fejezze be a konfigurációt.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {wizardStatus?.wizard_completed ? (
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    A konfiguráció már be van fejezve! A rendszer aktív és használatra kész.
                  </AlertDescription>
                </Alert>
              ) : wizardStatus && wizardStatus.classes_completed && wizardStatus.stabs_completed && wizardStatus.teachers_completed && wizardStatus.students_completed ? (
                <div className="space-y-4">
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      Minden kötelező elem sikeresen feltöltve! 
                      A rendszer kész a használatra.
                    </AlertDescription>
                  </Alert>
                  <Button 
                    onClick={completeWizard}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Konfiguráció befejezése és rendszer aktiválása
                  </Button>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    A konfiguráció befejezéséhez fejezze be az összes kötelező lépést:
                    Osztályok, Stábok, Tanárok és Tanulók feltöltése és megerősítése.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Current Data Tab */}
        <TabsContent value="current" className="space-y-6">
          {loadingCurrentData ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Jelenlegi adatok betöltése...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Jelenlegi adatok áttekintése</h3>
                  <p className="text-sm text-muted-foreground">
                    Tekintse át az összes feltöltött adatot kompakt módon
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={loadCurrentData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Frissítés
                </Button>
              </div>

              <div className="space-y-6">
                {Object.keys(DATA_TYPES)
                  .sort((a, b) => DATA_TYPES[a as keyof typeof DATA_TYPES].order - DATA_TYPES[b as keyof typeof DATA_TYPES].order)
                  .map(dataType => renderCurrentDataSection(dataType))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
