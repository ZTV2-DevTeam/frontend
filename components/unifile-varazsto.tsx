"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Download,
  Wand2,
  Sparkles,
  FileX,
  RefreshCw
} from "lucide-react"
import { apiClient } from "@/lib/api"

interface UniFileVarázslóProps {
  onComplete?: () => void
}

interface UploadState {
  file: File | null
  uploading: boolean
  processing: boolean
  completed: boolean
  error: string | null
  progress: number
  result?: {
    message: string
    created_records: number
    warnings?: string[]
    summary?: Record<string, any>
  }
}

export function UniFileVarázsló({ onComplete }: UniFileVarázslóProps) {
  const { toast } = useToast()
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    uploading: false,
    processing: false,
    completed: false,
    error: null,
    progress: 0
  })

  const handleFileSelect = useCallback((file: File | null) => {
    setUploadState(prev => ({
      ...prev,
      file,
      completed: false,
      error: null,
      progress: 0,
      result: undefined
    }))
  }, [])

  const downloadSampleFile = async () => {
    try {
      // Download the sample JSON file
      const response = await fetch('/sample-files/unifile-varazsto-minta.json')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'unifile-varazsto-minta.json'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast({
          title: "Minta fájl letöltve",
          description: "A JSON minta fájl sikeresen letöltve. Excel verzió hamarosan elérhető lesz.",
        })
      } else {
        throw new Error('Sample file not found')
      }
    } catch (error) {
      toast({
        title: "Letöltési hiba", 
        description: "Nem sikerült letölteni a minta fájlt",
        variant: "destructive"
      })
    }
  }

  const simulateProgress = (callback?: () => void) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 10
      if (progress >= 95) {
        setUploadState(prev => ({ ...prev, progress: 95 }))
        clearInterval(interval)
        if (callback) callback()
      } else {
        setUploadState(prev => ({ ...prev, progress }))
      }
    }, 200)
  }

  const uploadFile = async () => {
    if (!uploadState.file) return

    setUploadState(prev => ({
      ...prev,
      uploading: true,
      processing: false,
      error: null,
      progress: 0
    }))

    try {
      // Start progress simulation
      simulateProgress(() => {
        setUploadState(prev => ({
          ...prev,
          uploading: false,
          processing: true,
          progress: 95
        }))
      })

      const formData = new FormData()
      formData.append('file', uploadState.file)
      formData.append('wizard_type', 'unifile')

      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/unifile-wizard/process', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiClient.getToken()}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('API endpoint not yet implemented')
      }

      const result = await response.json()

      setUploadState(prev => ({
        ...prev,
        uploading: false,
        processing: false,
        completed: true,
        progress: 100,
        result
      }))

      toast({
        title: "Sikeres feldolgozás",
        description: `${result.created_records} rekord sikeresen létrehozva.`,
      })

      if (onComplete) {
        onComplete()
      }

    } catch (error: any) {
      console.error('Upload error:', error)
      
      setUploadState(prev => ({
        ...prev,
        uploading: false,
        processing: false,
        error: error.message || 'Hiba történt a fájl feldolgozása során',
        progress: 0
      }))

      toast({
        title: "Feltöltési hiba",
        description: error.message || "Nem sikerült feltölteni és feldolgozni a fájlt",
        variant: "destructive"
      })
    }
  }

  const resetWizard = () => {
    setUploadState({
      file: null,
      uploading: false,
      processing: false,
      completed: false,
      error: null,
      progress: 0
    })
  }

  const isProcessing = uploadState.uploading || uploadState.processing

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-dashed border-purple-500/20 bg-gradient-to-r from-purple-50/50 via-purple-100/30 to-purple-50/50 dark:from-purple-950/30 dark:via-purple-900/20 dark:to-purple-950/30">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Wand2 className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              UniFile Varázsló
            </CardTitle>
            <Sparkles className="h-5 w-5 text-purple-500" />
          </div>
          <CardDescription className="text-lg">
            Egyetlen fájl feltöltésével automatikusan generálja a teljes rendszer konfigurációt
          </CardDescription>
        </CardHeader>
      </Card>

      {/* API Status Warning */}
      <Alert className="border-blue-500/50 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <strong>CSV csak:</strong> Az UniFile Varázsló most csak CSV fájlokat fogad el a biztonság érdekében. 
          Az Excel fájlokat kérjük mentse el CSV formátumban (UTF-8 encoding) a feltöltés előtt.
        </AlertDescription>
      </Alert>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Side - Instructions & Sample */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-500" />
              1. Minta fájl letöltése
            </CardTitle>
            <CardDescription>
              Töltse le a minta fájlt, amely tartalmazza az összes szükséges adatstruktúrát
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={downloadSampleFile}
              variant="outline" 
              className="w-full"
              disabled={isProcessing}
            >
              <Download className="h-4 w-4 mr-2" />
              Minta fájl letöltése (JSON)
            </Button>
            
            <Button 
              onClick={async () => {
                try {
                  const response = await fetch('/sample-files/unifile-varazsto-minta.csv')
                  if (response.ok) {
                    const blob = await response.blob()
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'unifile-varazsto-minta.csv'
                    document.body.appendChild(a)
                    a.click()
                    window.URL.revokeObjectURL(url)
                    document.body.removeChild(a)
                    
                    toast({
                      title: "CSV minta fájl letöltve",
                      description: "A CSV fájl Excel-ben is megnyitható.",
                    })
                  } else {
                    throw new Error('CSV file not found')
                  }
                } catch (error) {
                  toast({
                    title: "Letöltési hiba", 
                    description: "Nem sikerült letölteni a CSV minta fájlt",
                    variant: "destructive"
                  })
                }
              }}
              variant="outline" 
              className="w-full"
              disabled={isProcessing}
            >
              <Download className="h-4 w-4 mr-2" />
              Minta fájl letöltése (CSV)
            </Button>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Fontos:</strong> A CSV fájl tartalmazza az összes szükséges oszlopot és formátumot.
                Ne változtassa meg a fejléceket, csak töltse ki az adatokat. UTF-8 encoding szükséges.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Mit tartalmaz a minta fájl:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>CSV formátum:</strong> Diákok és tanárok egy táblázatban, UTF-8 encoding</li>
                <li>• <strong>Diákok:</strong> Stáb, Kezdés éve, Tagozat kitöltve</li>
                <li>• <strong>Tanárok:</strong> Médiatanár, Osztályfőnök, Osztályai kitöltve</li>
                <li>• <strong>Speciális szerepek:</strong> Gyártásvezető, Rádiós stáb</li>
                <li>• <strong>Automatikus feldolgozás:</strong> Osztályok, stábok létrehozása</li>
              </ul>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Új formátum:</strong> Az egyetlen fájl tartalmazza az összes személyt (diákok + tanárok) 
                12 oszloppal. A rendszer automatikusan felismeri a típusokat a kitöltött mezők alapján.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Right Side - Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-green-500" />
              2. Kitöltött fájl feltöltése
            </CardTitle>
            <CardDescription>
              Töltse fel a kitöltött fájlt az automatikus konfiguráció indításához
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!uploadState.completed ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="unifile-upload" className="text-sm font-medium">
                    Konfiguráció fájl feltöltése
                  </Label>
                  <Input
                    id="unifile-upload"
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                    disabled={isProcessing}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                </div>

                {uploadState.file && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{uploadState.file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {(uploadState.file.size / 1024).toFixed(1)} KB
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                {uploadState.error && (
                  <Alert className="border-red-500/50 bg-red-500/10">
                    <FileX className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-200">
                      <strong>Hiba:</strong> {uploadState.error}
                    </AlertDescription>
                  </Alert>
                )}

                {isProcessing && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">
                        {uploadState.uploading ? 'Fájl feltöltése...' : 'Adatok feldolgozása...'}
                      </span>
                    </div>
                    <Progress value={uploadState.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {uploadState.uploading && 'A fájl feltöltése folyamatban...'}
                      {uploadState.processing && 'Az adatok elemzése és rendszer konfiguráció...'}
                    </p>
                  </div>
                )}

                <Button 
                  onClick={uploadFile}
                  disabled={!uploadState.file || isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {uploadState.uploading ? 'Feltöltés...' : 'Feldolgozás...'}
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Varázsló indítása
                    </>
                  )}
                </Button>
              </>
            ) : (
              // Success State
              <div className="space-y-4">
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    <strong>Sikeres konfiguráció!</strong> A rendszer sikeresen beállítva.
                  </AlertDescription>
                </Alert>

                {uploadState.result && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {uploadState.result.created_records}
                        </p>
                        <p className="text-sm text-muted-foreground">Létrehozott rekord</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">100%</p>
                        <p className="text-sm text-muted-foreground">Befejezve</p>
                      </div>
                    </div>

                    {uploadState.result.warnings && uploadState.result.warnings.length > 0 && (
                      <Alert className="border-yellow-500/50 bg-yellow-500/10">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription>
                          <div className="text-yellow-800 dark:text-yellow-200">
                            <p className="font-medium mb-2">Figyelmeztetések:</p>
                            <ul className="text-sm list-disc list-inside space-y-1">
                              {uploadState.result.warnings.map((warning, index) => (
                                <li key={index}>{warning}</li>
                              ))}
                            </ul>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button 
                    onClick={resetWizard}
                    variant="outline"
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Újrakezdés
                  </Button>
                  {onComplete && (
                    <Button 
                      onClick={onComplete}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Befejezés
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features Info */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Mit csinál az UniFile Varázsló?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                Automatikus feldolgozás
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Egységes táblázat feldolgozása (12 oszlop)</li>
                <li>• Diákok és tanárok automatikus felismerése</li>
                <li>• Email formátum alapú típus meghatározás</li>
                <li>• Speciális szerepek kezelése (gyártásvezető, rádió)</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Automatikus létrehozás
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Osztályok (Kezdés éve + Tagozat kombinációk)</li>
                <li>• Stábok (A stáb, B stáb, stb.)</li>
                <li>• Rádiós csapatok (A1, B3, B4 kódok alapján)</li>
                <li>• Felhasználói fiókok és jogosultságok</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
