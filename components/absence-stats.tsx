"use client"

import React from 'react'
import { TavolletSchema } from '@/lib/api'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CalendarDays, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Users,
  Calendar,
  TrendingUp,
  BarChart3,
  Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'

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

  // Calculate approval rate for admin view
  const approvalRate = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0
  const pendingRate = stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0

  return (
    <div className="space-y-4">
      {/* Main Shared Progress Bar - Shows Status Distribution */}
      <Card className="overflow-hidden shadow-sm border-0">
        <CardContent className="p-3">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Távollét státusz</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {stats.total} kérelem • {stats.totalDays} nap
              </p>
            </div>
          </div>
          
          {stats.total > 0 ? (
            <div className="space-y-2">
              {/* Shared Progress Bar */}
              <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                {/* Approved Section */}
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500"
                  style={{ width: `${approvalRate}%` }}
                />
                {/* Pending Section */}
                <div 
                  className="absolute top-0 h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                  style={{ 
                    left: `${approvalRate}%`, 
                    width: `${pendingRate}%` 
                  }}
                />
                {/* Denied Section */}
                <div 
                  className="absolute top-0 h-full bg-gradient-to-r from-red-500 to-rose-400 transition-all duration-500"
                  style={{ 
                    left: `${approvalRate + pendingRate}%`, 
                    width: `${100 - approvalRate - pendingRate}%` 
                  }}
                />
              </div>

              {/* Ultra Compact Legend */}
              <div className="flex items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-emerald-700 dark:text-emerald-400">
                    Elfogadva {stats.approved} ({approvalRate}%)
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-amber-700 dark:text-amber-400">
                    Függőben {stats.pending} ({pendingRate}%)
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-red-700 dark:text-red-400">
                    Elutasítva {stats.denied} ({100 - approvalRate - pendingRate}%)
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-3 text-slate-500 dark:text-slate-400">
              <Activity className="h-6 w-6 mx-auto mb-1 opacity-50" />
              <p className="text-xs">Még nincsenek távollét kérelmek</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compact Secondary Stats - Only show relevant ones */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Ongoing Absences */}
        {stats.ongoing > 0 && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
            <Clock className="h-4 w-4 text-orange-600 flex-shrink-0" />
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{stats.ongoing}</div>
              <div className="text-xs text-orange-600">Folyamatban</div>
            </div>
          </div>
        )}

        {/* Upcoming Absences (for students) */}
        {!isAdmin && stats.upcoming > 0 && (
          <div className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <Calendar className="h-4 w-4 text-indigo-600 flex-shrink-0" />
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{stats.upcoming}</div>
              <div className="text-xs text-indigo-600">Jövőbeli</div>
            </div>
          </div>
        )}

        {/* Unique Students (for admins) */}
        {isAdmin && (
          <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
            <Users className="h-4 w-4 text-purple-600 flex-shrink-0" />
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{stats.uniqueStudents}</div>
              <div className="text-xs text-purple-600">Diák</div>
            </div>
          </div>
        )}

        {/* Average Days */}
        {stats.total > 0 && (
          <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <BarChart3 className="h-4 w-4 text-slate-600 flex-shrink-0" />
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {(stats.totalDays / stats.total).toFixed(1)}
              </div>
              <div className="text-xs text-slate-600">Átlag nap</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Status badge component with improved design and theme support
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
      <Badge className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800 transition-colors duration-200">
        <XCircle className="h-3 w-3 flex-shrink-0" />
        <span>Elutasítva</span>
      </Badge>
    )
  }

  if (approved) {
    return (
      <Badge className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800 transition-colors duration-200">
        <CheckCircle className="h-3 w-3 flex-shrink-0" />
        <span>Jóváhagyva</span>
      </Badge>
    )
  }

  switch (status) {
    case 'függőben':
      return (
        <Badge className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:hover:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800 transition-colors duration-200">
          <AlertTriangle className="h-3 w-3 flex-shrink-0" />
          <span>Függőben</span>
        </Badge>
      )
    case 'jövőbeli':
      return (
        <Badge className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800 transition-colors duration-200">
          <Calendar className="h-3 w-3 flex-shrink-0" />
          <span>Jövőbeli</span>
        </Badge>
      )
    case 'folyamatban':
      return (
        <Badge className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-800 transition-colors duration-200">
          <Clock className="h-3 w-3 flex-shrink-0" />
          <span>Folyamatban</span>
        </Badge>
      )
    case 'lezárt':
      return (
        <Badge className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:hover:bg-slate-900/50 dark:text-slate-400 dark:border-slate-700 transition-colors duration-200">
          <CheckCircle className="h-3 w-3 flex-shrink-0" />
          <span>Lezárt</span>
        </Badge>
      )
    default:
      return (
        <Badge className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900/30 dark:hover:bg-slate-900/50 dark:text-slate-400 dark:border-slate-700 transition-colors duration-200">
          <span>{status}</span>
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
