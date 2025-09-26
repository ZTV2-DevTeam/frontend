"use client"

import React, { useState, useEffect } from 'react'
import { apiClient, ForgatoTipusSchema } from '@/lib/api'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Camera, Users, Calendar, Settings } from 'lucide-react'
import { toast } from 'sonner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FilmingSessionTypeSelectorProps {
  value?: string | null
  onValueChange: (value: string | null) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  required?: boolean
  className?: string
  showAllOption?: boolean
  allOptionLabel?: string
}

export function FilmingSessionTypeSelector({
  value,
  onValueChange,
  placeholder = "Válassz forgatás típust (opcionális)",
  label,
  disabled = false,
  required = false,
  className = "",
  showAllOption = true,
  allOptionLabel = "Minden típus"
}: FilmingSessionTypeSelectorProps) {
  const [filmingTypes, setFilmingTypes] = useState<ForgatoTipusSchema[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch filming types
  useEffect(() => {
    const fetchFilmingTypes = async () => {
      try {
        setLoading(true)
        setError(null)
        const types = await apiClient.getFilmingTypes()
        setFilmingTypes(types)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load filming types'
        setError(errorMessage)
        toast.error('Hiba a forgatás típusok betöltésekor', {
          description: errorMessage
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFilmingTypes()
  }, [])

  const getFilmingTypeInfo = (type: string) => {
    const typeMap = {
      'kacsa': { 
        icon: Users, 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        description: 'Kacsa összejátszás - csapatépítés és gyakorlás' 
      },
      'rendes': { 
        icon: Camera, 
        color: 'bg-green-100 text-green-800 border-green-200', 
        description: 'KaCsa forgatás - hivatalos műsor készítése' 
      },
      'rendezveny': { 
        icon: Calendar, 
        color: 'bg-purple-100 text-purple-800 border-purple-200', 
        description: 'Rendezvény forgatás - események dokumentálása' 
      },
      'egyeb': { 
        icon: Settings, 
        color: 'bg-gray-100 text-gray-800 border-gray-200', 
        description: 'Egyéb forgatás - speciális projektek' 
      }
    }
    return typeMap[type as keyof typeof typeMap] || typeMap.egyeb
  }

  const FilmingTypeBadge: React.FC<{ type: string; label: string }> = ({ type, label }) => {
    const info = getFilmingTypeInfo(type)
    const Icon = info.icon

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline" 
              className={`inline-flex items-center gap-1.5 ${info.color}`}
            >
              <Icon className="h-3 w-3" />
              {label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{info.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const selectedType = filmingTypes.find(type => type.value === value)

  return (
    <div className={className}>
      {label && (
        <Label htmlFor="filming-type-selector" className="text-sm font-medium mb-2 block">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="space-y-2">
        <Select
          value={value || ''}
          onValueChange={(newValue) => onValueChange(newValue || null)}
          disabled={disabled || loading}
        >
          <SelectTrigger id="filming-type-selector" className="w-full">
            <SelectValue placeholder={loading ? "Betöltés..." : placeholder} />
          </SelectTrigger>
          <SelectContent>
            {showAllOption && (
              <SelectItem value="">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-slate-100 text-slate-800">
                    Összes
                  </Badge>
                  <span>{allOptionLabel}</span>
                </div>
              </SelectItem>
            )}
            {filmingTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  <FilmingTypeBadge type={type.value} label={type.label} />
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Display selected type info */}
        {selectedType && (
          <div className="pt-1">
            <FilmingTypeBadge type={selectedType.value} label={selectedType.label} />
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
            Hiba: {error}
          </div>
        )}
      </div>
    </div>
  )
}

// Hook for easier use in forms
export function useFilmingTypeSelector(initialValue?: string | null) {
  const [value, setValue] = useState<string | null>(initialValue || null)
  
  return {
    value,
    setValue,
    props: {
      value,
      onValueChange: setValue
    }
  }
}