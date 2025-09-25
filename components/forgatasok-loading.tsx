'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Loader2, Camera, Users, FileText, CheckCircle } from 'lucide-react'

interface ForgatásokLoadingProps {
  sessionsLoading?: boolean
  assignmentsLoading?: boolean
  usersLoading?: boolean
  sessionCount?: number
  assignmentCount?: number
  userCount?: number
  variant?: 'minimal' | 'detailed'
}

export function ForgatásokLoading({
  sessionsLoading = true,
  assignmentsLoading = false,
  usersLoading = false,
  sessionCount = 0,
  assignmentCount = 0,
  userCount = 0,
  variant = 'detailed'
}: ForgatásokLoadingProps) {
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState(0)

  const stages = useMemo(() => [
    {
      name: 'Forgatások betöltése',
      icon: Camera,
      loading: sessionsLoading,
      count: sessionCount,
      description: 'Forgatási munkamenet adatok'
    },
    {
      name: 'Beosztások betöltése',
      icon: FileText,
      loading: assignmentsLoading,
      count: assignmentCount,
      description: 'Stáb beosztások és szerepkörök'
    },
    {
      name: 'Felhasználói adatok',
      icon: Users,
      loading: usersLoading,
      count: userCount,
      description: 'Részletes stáb információk'
    }
  ], [sessionsLoading, assignmentsLoading, usersLoading, sessionCount, assignmentCount, userCount])

  useEffect(() => {
    // Calculate progress based on loading stages
    let completedStages = 0
    const totalStages = stages.length
    
    // Find current active stage
    let activeStage = 0
    if (!sessionsLoading) {
      completedStages++
      if (!assignmentsLoading) {
        completedStages++
        activeStage = 1
        if (!usersLoading) {
          completedStages++
          activeStage = 2
        }
      }
    }
    
    setCurrentStage(activeStage)
    
    // Calculate progress percentage (each stage is worth 33.33%)
    const baseProgress = (completedStages / totalStages) * 100
    
    // Add partial progress for current loading stage
    const stageProgress = stages[activeStage]?.loading ? 10 : 0
    
    setProgress(Math.min(baseProgress + stageProgress, 100))
  }, [sessionsLoading, assignmentsLoading, usersLoading, sessionCount, assignmentCount, userCount, stages])

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center space-y-4 max-w-sm">
          <div className="relative">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Forgatások betöltése</p>
            <Progress value={progress} className="w-full h-2" />
            <p className="text-xs text-muted-foreground">
              {Math.round(progress)}% kész
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="relative inline-flex items-center justify-center">
              <div className="p-3 bg-primary rounded-xl shadow-sm">
                <Camera className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Forgatások betöltése</h3>
              <p className="text-sm text-muted-foreground">
                Adatok összegyűjtése és feldolgozása...
              </p>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Összesített állapot</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="w-full h-3" />
          </div>

          {/* Loading Stages */}
          <div className="space-y-3">
            {stages.map((stage, index) => {
              const StageIcon = stage.icon
              const isActive = index === currentStage
              const isCompleted = index < currentStage || (!stage.loading && index <= currentStage)
              const isLoading = stage.loading && isActive
              
              return (
                <div
                  key={stage.name}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-primary/10 border border-primary/20'
                      : isCompleted
                        ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800'
                        : 'bg-muted/30 border border-border/50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <StageIcon className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${
                        isActive ? 'text-foreground' : isCompleted ? 'text-green-700 dark:text-green-300' : 'text-muted-foreground'
                      }`}>
                        {stage.name}
                      </p>
                      {stage.count > 0 && (
                        <span className="text-xs text-muted-foreground ml-2">
                          {stage.count} elem
                        </span>
                      )}
                    </div>
                    <p className={`text-xs ${
                      isActive ? 'text-muted-foreground' : isCompleted ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                    }`}>
                      {isCompleted ? 'Befejezve' : isLoading ? 'Folyamatban...' : stage.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer Status */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              {progress < 100 ? (
                <>
                  {stages[currentStage]?.loading ? 'Feldolgozás folyamatban...' : 'Inicializálás...'}
                </>
              ) : (
                'Betöltés befejezve'
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Skeleton loading component for when we want a lighter version
export function ForgatásokSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-muted rounded-xl" />
        <div className="space-y-2">
          <div className="h-6 w-32 bg-muted rounded" />
          <div className="h-4 w-48 bg-muted rounded" />
        </div>
      </div>
      
      {/* Cards skeleton */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-4 p-4 border rounded-lg bg-card/50">
            <div className="flex items-center justify-between">
              <div className="w-5 h-5 bg-muted rounded" />
              <div className="w-12 h-5 bg-muted rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-3 w-1/2 bg-muted rounded" />
              <div className="h-3 w-2/3 bg-muted rounded" />
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <div className="w-16 h-3 bg-muted rounded" />
              <div className="w-4 h-4 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}