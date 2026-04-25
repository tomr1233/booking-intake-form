import * as React from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

interface FieldProps {
  label: string
  htmlFor?: string
  subLabel?: string
  error?: string
  className?: string
  children: React.ReactNode
}

export function Field({ label, htmlFor, subLabel, error, className, children }: FieldProps) {
  // The shadcn Label primitive uses `flex items-center gap-2`, so we keep the
  // label text as the only Label child and render the sub-label as a sibling
  // block below it to get the stacked layout shown in the onboarding app.
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {subLabel && (
        <p className="text-xs text-muted-foreground font-normal -mt-1">
          {subLabel}
        </p>
      )}
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
