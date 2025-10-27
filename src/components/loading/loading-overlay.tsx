import React from 'react'
import { LoadingSpinner } from './loading-spinner'
import { cn } from '@/lib/utils'

interface LoadingOverlayProps {
  className?: string
  text?: string
  show?: boolean
  children?: React.ReactNode
}

export function LoadingOverlay({ 
  className, 
  text = "Loading...", 
  show = true,
  children 
}: LoadingOverlayProps) {
  if (!show) return <>{children}</>

  return (
    <div className={cn("relative", className)}>
      {children}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <LoadingSpinner text={text} size="lg" />
      </div>
    </div>
  )
}