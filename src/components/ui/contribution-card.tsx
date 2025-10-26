import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { formatCurrency, formatRelativeTime } from "@/lib/utils"
import { DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import type { Contribution } from "@/types/contribution"

interface ContributionCardProps {
  contribution: Contribution
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  showActions?: boolean
  className?: string
}

const statusIcons = {
  pending: AlertCircle,
  approved: CheckCircle,
  rejected: XCircle,
  completed: CheckCircle,
}

const statusColors = {
  pending: 'text-yellow-500',
  approved: 'text-green-500',
  rejected: 'text-red-500',
  completed: 'text-green-500',
}

export function ContributionCard({
  contribution,
  onApprove,
  onReject,
  showActions = false,
  className,
}: ContributionCardProps) {
  const StatusIcon = statusIcons[contribution.status]
  const statusColor = statusColors[contribution.status]

  return (
    <Card className={`p-4 hover:shadow-card-hover transition-all duration-300 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-mint-green rounded-full flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-text-primary">
              {contribution.contributor?.full_name || 'Unknown User'}
            </h4>
            <p className="text-sm text-text-tertiary">
              {formatRelativeTime(contribution.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <StatusIcon className={`h-5 w-5 ${statusColor}`} />
          <StatusBadge status={contribution.status as any} />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-text-primary">
            {formatCurrency(contribution.amount, contribution.currency)}
          </span>
          <span className="text-sm text-text-secondary">
            {contribution.type.charAt(0).toUpperCase() + contribution.type.slice(1)}
          </span>
        </div>
        <p className="text-text-secondary text-sm">
          {contribution.description}
        </p>
        {contribution.goal && (
          <p className="text-text-tertiary text-xs mt-1">
            For: {contribution.goal.title}
          </p>
        )}
      </div>

      {showActions && contribution.status === 'pending' && (
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => onApprove?.(contribution.id)}
            className="flex-1"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReject?.(contribution.id)}
            className="flex-1"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </div>
      )}

      {contribution.approved_at && (
        <div className="flex items-center text-xs text-text-tertiary mt-2">
          <Clock className="h-3 w-3 mr-1" />
          Approved {formatRelativeTime(contribution.approved_at)}
        </div>
      )}
    </Card>
  )
}