"use client"

import React, { useState, useEffect } from 'react'
import { apiClient, TavolletTipusSchema } from '@/lib/api'
import { usePermissions } from '@/contexts/permissions-context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, HelpCircle } from 'lucide-react'
import { toast } from 'sonner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AbsenceTypeSelectorProps {
  value?: number | null
  onValueChange: (value: number | null) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

export function AbsenceTypeSelector({
  value,
  onValueChange,
  placeholder = "Válassz távolléti típust (opcionális)",
  label,
  disabled = false,
  required = false,
  className = ""
}: AbsenceTypeSelectorProps) {
  const [absenceTypes, setAbsenceTypes] = useState<TavolletTipusSchema[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getCurrentRole } = usePermissions()
  
  // Check if current user is a student (students shouldn't see usage counts)
  const currentRole = getCurrentRole()
  const isStudent = currentRole === 'student'

  // Fetch absence types
  useEffect(() => {
    const fetchAbsenceTypes = async () => {
      try {
        setLoading(true)
        setError(null)
        const types = await apiClient.getAbsenceTypes()
        setAbsenceTypes(types)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Hiba történt a távolléti típusok betöltésekor'
        setError(message)
        console.error('Error fetching absence types:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAbsenceTypes()
  }, [])

  const handleValueChange = (newValue: string) => {
    if (newValue === "none" || newValue === "") {
      onValueChange(null)
    } else {
      const numValue = parseInt(newValue, 10)
      onValueChange(isNaN(numValue) ? null : numValue)
    }
  }

  const getIgnoredCountsAsDisplay = (ignoredCountsAs: string): { text: string; color: string; variant: "default" | "secondary" | "destructive" | "outline" } => {
    switch (ignoredCountsAs) {
      case 'approved':
        return { text: 'Elfogadva számít', color: 'dark:text-green-200 dark:bg-green-800 text-green-800 bg-green-200', variant: 'default' }
      case 'denied':
        return { text: 'Elutasítva számít', color: 'dark:text-red-200 dark:bg-red-800 text-red-800 bg-red-200', variant: 'destructive' }
      default:
        return { text: ignoredCountsAs, color: 'text-muted-foreground dark:text-muted-foreground bg-muted-background dark:bg-muted-background', variant: 'secondary' }
    }
  }

  if (loading) {
    return (
      <div className={className}>
        {label && <Label className="text-sm font-medium">{label}</Label>}
        <Select disabled>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Távolléti típusok betöltése..." />
          </SelectTrigger>
        </Select>
      </div>
    )
  }

  if (error) {
    return (
      <div className={className}>
        {label && <Label className="text-sm font-medium">{label}</Label>}
        <div className="mt-1 flex items-center gap-2 p-3 text-sm text-red-600 border border-red-200 rounded-md bg-red-50">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>Hiba: {error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center gap-2 mb-1">
          <Label className="text-sm font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {!required && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {isStudent 
                      ? "A távolléti típus további információt ad a távollét jellegéről."
                      : "A távolléti típus meghatározza, hogy jóváhagyatlan állapotban a távollét elfogadottnak vagy elutasítottnak számít-e."
                    }
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
      
      <Select 
        value={value?.toString() || ""} 
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger className="mt-1">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {/* None/Clear option */}
          <SelectItem value="none" className="text-muted-foreground italic">
            Nincs típus megadva
          </SelectItem>
          
          {/* Absence types */}
          {absenceTypes.map((type) => {
            const ignoredDisplay = getIgnoredCountsAsDisplay(type.ignored_counts_as)
            
            return (
              <SelectItem key={type.id} value={type.id.toString()}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{type.name}</div>
                    {type.explanation && (
                      <div className="text-xs text-muted-foreground truncate">
                        {type.explanation}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    {!isStudent && (
                      <Badge 
                        variant={ignoredDisplay.variant} 
                        className={`text-xs px-1.5 py-0.5 ${ignoredDisplay.color}`}
                      >
                        {ignoredDisplay.text}
                      </Badge>
                    )}
                    
                    {!isStudent && type.usage_count > 0 && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                        {type.usage_count}x
                      </Badge>
                    )}
                  </div>
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
      
      {/* Selected type info */}
      {value && absenceTypes.length > 0 && (
        <div className="mt-2">
          {(() => {
            const selectedType = absenceTypes.find(t => t.id === value)
            if (!selectedType) return null
            
            const ignoredDisplay = getIgnoredCountsAsDisplay(selectedType.ignored_counts_as)
            
            return (
              <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded-md">
                <div className="font-medium mb-1">{selectedType.name}</div>
                
                {selectedType.explanation && (
                  <div className="mb-2">{selectedType.explanation}</div>
                )}
                
                {!isStudent && (
                  <div className="flex items-center gap-2">
                    <span>Jóváhagyatlan státuszban:</span>
                    <Badge 
                      variant={ignoredDisplay.variant} 
                      className={`text-xs ${ignoredDisplay.color}`}
                    >
                      {ignoredDisplay.text}
                    </Badge>
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}

// Utility hook for managing absence type selection
export function useAbsenceTypeSelector(initialValue?: number | null) {
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(initialValue || null)
  const [absenceTypes, setAbsenceTypes] = useState<TavolletTipusSchema[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await apiClient.getAbsenceTypes()
        setAbsenceTypes(types)
      } catch (error) {
        console.error('Error fetching absence types:', error)
        toast.error('Nem sikerült betölteni a távolléti típusokat')
      } finally {
        setLoading(false)
      }
    }

    fetchTypes()
  }, [])

  const selectedType = selectedTypeId ? absenceTypes.find(t => t.id === selectedTypeId) : null

  return {
    selectedTypeId,
    setSelectedTypeId,
    selectedType,
    absenceTypes,
    loading
  }
}