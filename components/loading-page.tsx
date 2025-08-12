'use client'

import { useEffect, useState } from 'react'
import { SimpleLoading, LoadingOverlay } from '@/components/simple-loading'
import { EnhancedLoading } from '@/components/enhanced-loading'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Sparkles, Zap, Shield, Server } from 'lucide-react'

interface LoadingPageProps {
  variant?: 'simple' | 'enhanced' | 'splash' | 'progress'
  title?: string
  subtitle?: string
  progress?: number
  steps?: string[]
  currentStep?: number
  showLogo?: boolean
}

export function LoadingPage({
  variant = 'enhanced',
  title = 'Betöltés',
  subtitle = 'Kérjük, várjon...',
  progress,
  steps = [],
  currentStep = 0,
  showLogo = true
}: LoadingPageProps) {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <SimpleLoading size="lg" text={title} variant="gradient" />
      </div>
    )
  }

  if (variant === 'enhanced') {
    return (
      <EnhancedLoading
        isLoading={true}
        error={null}
        loadingText={title}
        stage="data"
      />
    )
  }

  if (variant === 'progress') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 px-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardContent className="p-8 space-y-6">
            {/* Logo or Icon */}
            {showLogo && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                  <Sparkles className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
            )}

            {/* Title and Subtitle */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-muted-foreground">{subtitle}</p>
              )}
            </div>

            {/* Progress Bar */}
            {progress !== undefined && (
              <div className="space-y-2">
                <Progress value={displayProgress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground">
                  {Math.round(displayProgress)}% kész
                </p>
              </div>
            )}

            {/* Steps */}
            {steps.length > 0 && (
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                      index === currentStep 
                        ? 'bg-primary/10 border border-primary/20' 
                        : index < currentStep 
                          ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800'
                          : 'bg-muted/30 border border-border/50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                      index === currentStep 
                        ? 'bg-primary text-primary-foreground animate-pulse' 
                        : index < currentStep 
                          ? 'bg-green-500 text-white'
                          : 'bg-muted text-muted-foreground'
                    }`}>
                      {index < currentStep ? '✓' : index + 1}
                    </div>
                    <span className={`text-sm ${
                      index === currentStep 
                        ? 'font-medium text-foreground' 
                        : index < currentStep 
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-muted-foreground'
                    }`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Splash variant
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="text-center space-y-8 max-w-md mx-auto px-4">
        {/* Animated Logo */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl">
            <Zap className="h-12 w-12 text-primary-foreground animate-pulse" />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-4 border-primary/20 animate-ping" />
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 mt-8">
          {[
            { icon: Shield, text: 'Biztonságos kapcsolat', color: 'text-blue-500' },
            { icon: Server, text: 'Szerver inicializálás', color: 'text-green-500' },
            { icon: Sparkles, text: 'Felhasználói felület', color: 'text-purple-500' }
          ].map((feature, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 justify-center opacity-70 hover:opacity-100 transition-opacity"
            >
              <feature.icon className={`h-5 w-5 ${feature.color}`} />
              <span className="text-sm text-muted-foreground">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
