import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SuccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  primaryAction?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  showClose?: boolean
  className?: string
}

export function SuccessModal({
  open,
  onOpenChange,
  title,
  description,
  primaryAction,
  secondaryAction,
  showClose = true,
  className
}: SuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-md", className)}>
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-mint-green/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-mint-green" />
          </div>
          <DialogTitle className="text-xl font-semibold text-text-primary">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-text-secondary">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-center">
          {primaryAction && (
            <Button
              onClick={primaryAction.onClick}
              className="w-full sm:w-auto"
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              className="w-full sm:w-auto"
            >
              {secondaryAction.label}
            </Button>
          )}
          {showClose && !primaryAction && !secondaryAction && (
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}