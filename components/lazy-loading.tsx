'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-assign-module-variable */

import React, { lazy, Suspense, ComponentType } from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface LazyWrapperProps {
  children?: React.ReactNode
  fallback?: React.ReactNode
  minHeight?: string
}

export function LazyWrapper({ 
  children, 
  fallback, 
  minHeight = 'min-h-[200px]' 
}: LazyWrapperProps) {
  const defaultFallback = (
    <div className={`flex items-center justify-center ${minHeight} w-full`}>
      <div className="text-center space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">Komponens betöltése...</p>
      </div>
    </div>
  )

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  )
}

export function LazyCard({ 
  children, 
  className = '',
  minHeight = 'min-h-[200px]' 
}: LazyWrapperProps & { className?: string }) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <LazyWrapper minHeight={minHeight}>
          {children}
        </LazyWrapper>
      </CardContent>
    </Card>
  )
}

// Helper function to create lazy-loaded components with named exports
export function createLazyComponentNamed<T extends ComponentType<any>>(
  importFn: () => Promise<Record<string, any>>,
  componentName: string,
  fallback?: React.ReactNode,
  minHeight?: string
) {
  const LazyComponent = lazy(async () => {
    const module = await importFn()
    return { default: module[componentName] }
  })

  return function LazyComponentWrapper(props: React.ComponentProps<T>) {
    return (
      <LazyWrapper fallback={fallback} minHeight={minHeight}>
        <LazyComponent {...props} />
      </LazyWrapper>
    )
  }
}

// Simplified lazy loading for basic components
export function SimpleLazy({ 
  componentPath, 
  componentName = 'default',
  fallback,
  minHeight = 'min-h-[200px]',
  ...props 
}: {
  componentPath: string
  componentName?: string
  fallback?: React.ReactNode
  minHeight?: string
  [key: string]: any
}) {
  const LazyComponent = lazy(async () => {
    const module = await import(componentPath)
    return { 
      default: componentName === 'default' ? module.default : module[componentName] 
    }
  })

  return (
    <LazyWrapper fallback={fallback} minHeight={minHeight}>
      <LazyComponent {...props} />
    </LazyWrapper>
  )
}
