import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export interface StepDescriptor {
  id: string
  name: string
  shortName: string
}

interface StepIndicatorProps {
  currentStep: number
  steps: StepDescriptor[]
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  const totalSteps = steps.length
  const percent = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0

  return (
    <div className="w-full">
      <div className="relative h-1 bg-secondary rounded-full overflow-hidden mb-6">
        <motion.div
          className="absolute inset-y-0 left-0 bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div
                className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary border-primary'
                    : isCurrent
                      ? 'border-primary bg-background'
                      : 'border-muted-foreground/30 bg-background'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <span
                    className={`text-sm font-medium ${
                      isCurrent ? 'text-primary' : 'text-muted-foreground/50'
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.3, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground/50'
                }`}
              >
                {step.shortName}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
