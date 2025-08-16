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

  const statCards = [
    {
      title: 'Összes távollét',
      value: stats.total,
      icon: CalendarDays,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Folyamatban',
      value: stats.ongoing,
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Jóváhagyva',
      value: stats.approved,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Függőben',
      value: stats.pending,
      icon: AlertTriangle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Elutasítva',
      value: stats.denied,
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
  ]

  // Add admin-specific stats
  if (isAdmin) {
    statCards.push(
      {
        title: 'Érintett diákok',
        value: stats.uniqueStudents,
        icon: Users,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
      },
      {
        title: 'Összes hiányzó nap',
        value: stats.totalDays,
        icon: Calendar,
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-50',
      }
    )
  } else {
    statCards.push(
      {
        title: 'Jövőbeli távollét',
        value: stats.upcoming,
        icon: Calendar,
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-50',
      },
      {
        title: 'Összes hiányzó nap',
        value: stats.totalDays,
        icon: CalendarDays,
        color: 'text-gray-500',
        bgColor: 'bg-gray-50',
      }
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-lg font-semibold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
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
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">
              {selectedAbsences.length} távollét kiválasztva
            </span>
          </div>
          
          {pendingAbsences.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={onBulkApprove}
                disabled={loading}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 disabled:opacity-50"
              >
                <CheckCircle className="h-3 w-3" />
                Összes jóváhagyása
              </button>
              
              <button
                onClick={onBulkDeny}
                disabled={loading}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:opacity-50"
              >
                <XCircle className="h-3 w-3" />
                Összes elutasítása
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
