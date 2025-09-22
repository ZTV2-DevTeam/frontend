'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Loader2, Shield, Server, Database, CheckCircle } from 'lucide-react'

interface ProfessionalLoadingProps {
  variant?: 'simple' | 'detailed' | 'splash'
  title?: string
  subtitle?: string
  progress?: number
  steps?: string[]
  currentStep?: number
  showProgress?: boolean
}

export function ProfessionalLoading({
  variant = 'detailed',
  title = 'Betöltés',
  subtitle = 'Kérjük, várjon...',
  progress,
  steps = [],
  currentStep = 0,
  showProgress = true
}: ProfessionalLoadingProps) {
  const [displayProgress, setDisplayProgress] = useState(0)

  useEffect(() => {
    if (progress !== undefined) {
      const timer = setTimeout(() => {
        setDisplayProgress(progress)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [progress])

  if (variant === 'simple') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="relative inline-flex">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
        </div>
      </div>
    )
  }

  if (variant === 'splash') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-8 max-w-sm mx-auto px-4">
          {/* Company Logo Area */}
          <div className="relative">
            <div className="w-16 h-16 mx-auto rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <div className="w-8 h-8 rounded bg-primary"></div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {/* Loading indicator */}
          <div className="relative inline-flex">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>

          {/* System status */}
          <div className="space-y-3 text-sm">
            {[
              { icon: Shield, text: 'Biztonsági ellenőrzés', status: 'completed' },
              { icon: Server, text: 'Szerver kapcsolat', status: 'active' },
              { icon: Database, text: 'Adatok betöltése', status: 'pending' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-center gap-3">
                <item.icon className={`h-4 w-4 ${
                  item.status === 'completed' ? 'text-chart-1' :
                  item.status === 'active' ? 'text-primary' :
                  'text-muted-foreground'
                }`} />
                <span className={`${
                  item.status === 'completed' ? 'text-chart-1' :
                  item.status === 'active' ? 'text-foreground' :
                  'text-muted-foreground'
                }`}>
                  {item.text}
                </span>
                {item.status === 'completed' && (
                  <CheckCircle className="h-4 w-4 text-chart-1" />
                )}
                {item.status === 'active' && (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Detailed variant (default)
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-sm border border-border">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="relative inline-flex">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {showProgress && progress !== undefined && (
            <div className="space-y-2">
              <Progress value={displayProgress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">
                {Math.round(displayProgress)}% kész
              </p>
            </div>
          )}

          {/* Steps */}
          {steps.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground text-center">Folyamat:</h3>
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-md border transition-all duration-300 ${
                    index === currentStep 
                      ? 'bg-primary/5 border-primary/20' 
                      : index < currentStep 
                        ? 'bg-chart-1/5 border-chart-1/20'
                        : 'bg-muted/20 border-border'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium border ${
                    index === currentStep 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : index < currentStep 
                        ? 'bg-chart-1 text-white border-chart-1'
                        : 'bg-muted text-muted-foreground border-border'
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : index === currentStep ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`text-sm ${
                    index === currentStep 
                      ? 'font-medium text-foreground' 
                      : index < currentStep 
                        ? 'text-chart-1'
                        : 'text-muted-foreground'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Footer info */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Ez általában néhány másodpercet vesz igénybe
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}