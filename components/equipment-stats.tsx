'use client'

import * as React from 'react'
import { useMemo } from 'react'
import { TrendingUp, TrendingDown, Wrench, AlertTriangle, Settings } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import type { EquipmentSchema, EquipmentTipusSchema, ForgatSchema } from '@/lib/api'

interface EquipmentStatsProps {
  equipment: EquipmentSchema[]
  equipmentTypes: EquipmentTipusSchema[]
  filmingSessions: ForgatSchema[]
  className?: string
}

interface UsageStats {
  equipmentId: number
  equipmentName: string
  usageCount: number
  lastUsed?: Date
  type?: string
  typeEmoji?: string
}

interface TypeStats {
  typeId: number
  typeName: string
  emoji?: string
  totalCount: number
  functionalCount: number
  assignedCount: number
  functionalPercentage: number
}

export function EquipmentStats({ 
  equipment, 
  equipmentTypes, 
  filmingSessions, 
  className 
}: EquipmentStatsProps) {
  // Calculate usage statistics
  const usageStats = useMemo((): UsageStats[] => {
    const stats: UsageStats[] = []
    
    equipment.forEach(equip => {
      let usageCount = 0
      let lastUsed: Date | undefined

      // Count how many sessions this equipment is assigned to
      filmingSessions.forEach(session => {
        if (session.equipment_ids && session.equipment_ids.includes(equip.id)) {
          usageCount++
          const sessionDate = new Date(`${session.date}T${session.time_from}`)
          if (!lastUsed || sessionDate > lastUsed) {
            lastUsed = sessionDate
          }
        }
      })

      stats.push({
        equipmentId: equip.id,
        equipmentName: `${equip.nickname} ${equip.brand ? `(${equip.brand})` : ''}`,
        usageCount,
        lastUsed,
        type: equip.equipment_type?.name,
        typeEmoji: equip.equipment_type?.emoji
      })
    })

    // Sort by usage count descending
    return stats.sort((a, b) => b.usageCount - a.usageCount)
  }, [equipment, filmingSessions])

  // Calculate type statistics
  const typeStats = useMemo((): TypeStats[] => {
    const stats: TypeStats[] = []
    
    equipmentTypes.forEach(type => {
      const typeEquipment = equipment.filter(e => e.equipment_type?.id === type.id)
      const functionalCount = typeEquipment.filter(e => e.functional).length
      
      // Count assigned equipment (in active sessions)
      const assignedCount = typeEquipment.filter(e =>
        filmingSessions.some(session => 
          session.equipment_ids && session.equipment_ids.includes(e.id)
        )
      ).length

      stats.push({
        typeId: type.id,
        typeName: type.name,
        emoji: type.emoji,
        totalCount: typeEquipment.length,
        functionalCount,
        assignedCount,
        functionalPercentage: typeEquipment.length > 0 
          ? Math.round((functionalCount / typeEquipment.length) * 100)
          : 0
      })
    })

    // Sort by total count descending
    return stats.sort((a, b) => b.totalCount - a.totalCount)
  }, [equipment, equipmentTypes, filmingSessions])

  // Overall statistics
  const totalEquipment = equipment.length
  const functionalEquipment = equipment.filter(e => e.functional).length
  const assignedEquipment = equipment.filter(e =>
    filmingSessions.some(session => 
      session.equipment_ids && session.equipment_ids.includes(e.id)
    )
  ).length
  const mostUsedEquipment = usageStats[0]

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Összes felszerelés</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEquipment}</div>
              <p className="text-xs text-muted-foreground">
                {equipmentTypes.length} típusban
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kihasználtság</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{assignedEquipment}</div>
              <p className="text-xs text-muted-foreground">
                {totalEquipment > 0 ? Math.round((assignedEquipment / totalEquipment) * 100) : 0}% aktív használat
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Működőképes</CardTitle>
              <div className="h-4 w-4 bg-green-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{functionalEquipment}</div>
              <p className="text-xs text-muted-foreground">
                {totalEquipment > 0 ? Math.round((functionalEquipment / totalEquipment) * 100) : 0}% működőképes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Karbantartásra szorul</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{totalEquipment - functionalEquipment}</div>
              <p className="text-xs text-muted-foreground">
                Javítást igényel
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Most Used Equipment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Leggyakrabban használt felszerelések
              </CardTitle>
              <CardDescription>
                Forgatásokhoz rendelt felszerelések gyakorisága alapján
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageStats.slice(0, 10).map((stat, index) => (
                  <div key={stat.equipmentId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{stat.equipmentName}</div>
                        {stat.type && (
                          <div className="text-xs text-muted-foreground">
                            {stat.typeEmoji && `${stat.typeEmoji} `}{stat.type}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{stat.usageCount}x</div>
                      {stat.lastUsed && (
                        <div className="text-xs text-muted-foreground">
                          Utolsó: {stat.lastUsed.toLocaleDateString('hu-HU')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {usageStats.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Nincs használati adat
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Type Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Típus szerinti statisztikák
              </CardTitle>
              <CardDescription>
                Felszerelés típusok állapota és kihasználtsága
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {typeStats.map((stat) => (
                  <div key={stat.typeId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {stat.emoji && <span>{stat.emoji}</span>}
                        <span className="font-medium text-sm">{stat.typeName}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.totalCount} db
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Működőképes</span>
                          <span>{stat.functionalPercentage}%</span>
                        </div>
                        <Progress value={stat.functionalPercentage} className="h-2" />
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {stat.assignedCount} aktív
                        </Badge>
                        <Badge variant={stat.functionalCount === stat.totalCount ? 'default' : 'destructive'} className="text-xs">
                          {stat.functionalCount}/{stat.totalCount}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
                {typeStats.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Nincs típus adat
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Trends Table */}
        <Card>
          <CardHeader>
            <CardTitle>Részletes használati statisztikák</CardTitle>
            <CardDescription>
              Az összes felszerelés használati adatai
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rang</TableHead>
                  <TableHead>Felszerelés</TableHead>
                  <TableHead>Típus</TableHead>
                  <TableHead>Használatok száma</TableHead>
                  <TableHead>Utolsó használat</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usageStats.slice(0, 20).map((stat, index) => (
                  <TableRow key={stat.equipmentId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">#{index + 1}</span>
                        {index === 0 && <TrendingUp className="h-3 w-3 text-green-600" />}
                        {index === usageStats.length - 1 && index > 0 && <TrendingDown className="h-3 w-3 text-red-600" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{stat.equipmentName}</div>
                    </TableCell>
                    <TableCell>
                      {stat.type ? (
                        <Badge variant="secondary">
                          {stat.typeEmoji && `${stat.typeEmoji} `}{stat.type}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{stat.usageCount}</span>
                        {stat.usageCount === 0 && <Badge variant="outline">Nem használt</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {stat.lastUsed ? (
                        <div className="text-sm">
                          {stat.lastUsed.toLocaleDateString('hu-HU')}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Soha</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {stat.usageCount > (mostUsedEquipment?.usageCount || 0) * 0.7 ? (
                        <Badge variant="default" className="text-xs">Magas</Badge>
                      ) : stat.usageCount > (mostUsedEquipment?.usageCount || 0) * 0.3 ? (
                        <Badge variant="secondary" className="text-xs">Közepes</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Alacsony</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}