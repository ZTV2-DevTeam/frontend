"use client"

import React from 'react'
import { TavolletSchema } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CalendarDays, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Users,
  Calendar
} from 'lucide-react'

interface AbsenceStatsProps {
  absences: TavolletSchema[]
  isAdmin: boolean
}

export function AbsenceStats({ absences, isAdmin }: AbsenceStatsProps) {
  const stats = {
    total: absences.length,
    ongoing: absences.filter(a => a.status === 'folyamatban').length,
    approved: absences.filter(a => a.approved && !a.denied).length,
    denied: absences.filter(a => a.denied).length,
    pending: absences.filter(a => !a.approved && !a.denied).length,
    upcoming: absences.filter(a => a.status === 'jövőbeli').length,
    totalDays: absences.reduce((sum, a) => sum + a.duration_days, 0),
    uniqueStudents: isAdmin ? new Set(absences.map(a => a.user.id)).size : 1,
  }

  // Mobile compact stats - only show the most important ones
  const mobileStats = [
    { label: 'Összes', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Függőben', value: stats.pending, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Jóváhagyva', value: stats.approved, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Elutasítva', value: stats.denied, color: 'text-red-600', bg: 'bg-red-50' },
  ]

  // Desktop detailed stats
  const desktopStats = [
    {
      title: 'Összes távollét',
      value: stats.total,
      icon: CalendarDays,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Függőben',
      value: stats.pending,
      icon: AlertTriangle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Jóváhagyva',
      value: stats.approved,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Elutasítva',
      value: stats.denied,
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Folyamatban',
      value: stats.ongoing,
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
  ]

  // Add admin-specific stats
  if (isAdmin) {
    desktopStats.push({
      title: 'Érintett diákok',
      value: stats.uniqueStudents,
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    })
  } else {
    desktopStats.push({
      title: 'Jövőbeli',
      value: stats.upcoming,
      icon: Calendar,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    })
  }

  return (
    <>
      {/* Mobile Compact Stats */}
      <div className="block sm:hidden">
        <Card className="overflow-hidden shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">Távollét áttekintés</h3>
              <Badge variant="outline" className="text-xs">
                {stats.totalDays} nap
              </Badge>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {mobileStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${stat.bg} mb-1`}>
                    <span className={`text-sm font-bold ${stat.color}`}>
                      {stat.value}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            {isAdmin && stats.uniqueStudents > 0 && (
              <div className="flex items-center justify-center gap-1 mt-3 pt-3 border-t">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {stats.uniqueStudents} diák érintett
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Desktop Detailed Stats */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {desktopStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className={`overflow-hidden border-l-4 ${stat.borderColor} hover:shadow-md transition-shadow`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
        
        {/* Total Days Summary Card */}
        <Card className="overflow-hidden border-l-4 border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-gray-50">
                <CalendarDays className="h-5 w-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Összes hiányzó nap</p>
                <p className="text-2xl font-bold">{stats.totalDays}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// Status badge component
export function StatusBadge({ 
  status, 
  denied, 
  approved 
}: { 
  status: string; 
  denied: boolean; 
  approved?: boolean;
}) {
  if (denied) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Elutasítva
      </Badge>
    )
  }

  if (approved) {
    return (
      <Badge variant="default" className="flex items-center gap-1 bg-green-600 hover:bg-green-700">
        <CheckCircle className="h-3 w-3" />
        Jóváhagyva
      </Badge>
    )
  }

  switch (status) {
    case 'függőben':
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Függőben
        </Badge>
      )
    case 'jövőbeli':
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Jövőbeli
        </Badge>
      )
    case 'folyamatban':
      return (
        <Badge variant="default" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Folyamatban
        </Badge>
      )
    case 'lezárt':
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Lezárt
        </Badge>
      )
    default:
      return (
        <Badge variant="secondary">
          {status}
        </Badge>
      )
  }
}

// Quick actions component for admins
export function AbsenceQuickActions({ 
  onBulkApprove, 
  onBulkDeny, 
  selectedAbsences = [],
  loading = false 
}: {
  onBulkApprove?: () => void
  onBulkDeny?: () => void
  selectedAbsences?: TavolletSchema[]
  loading?: boolean
}) {
  if (selectedAbsences.length === 0) return null

  const pendingAbsences = selectedAbsences.filter(a => !a.denied)

  return (
    <Card>
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <span className="text-sm font-medium">
              {selectedAbsences.length} távollét kiválasztva
            </span>
          </div>
          
          {pendingAbsences.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={onBulkApprove}
                disabled={loading}
                className="flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 disabled:opacity-50 transition-colors"
              >
                <CheckCircle className="h-3 w-3 flex-shrink-0" />
                <span className="whitespace-nowrap">Összes jóváhagyása</span>
              </button>
              
              <button
                onClick={onBulkDeny}
                disabled={loading}
                className="flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:opacity-50 transition-colors"
              >
                <XCircle className="h-3 w-3 flex-shrink-0" />
                <span className="whitespace-nowrap">Összes elutasítása</span>
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
