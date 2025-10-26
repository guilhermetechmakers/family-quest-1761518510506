import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/components/ui/progress-bar"
import { StatusBadge } from "@/components/ui/status-badge"
import { formatCurrency, calculateProgress } from "@/lib/utils"
import { Target, Users, Calendar, ArrowRight, DollarSign } from "lucide-react"
import type { Goal } from "@/types/goal"

interface GoalCardProps {
  goal: Goal
  onViewDetails?: (id: string) => void
  onContribute?: (id: string) => void
  className?: string
}

export function GoalCard({
  goal,
  onViewDetails,
  onContribute,
  className,
}: GoalCardProps) {
  const progress = calculateProgress(goal.current_value, goal.target_value)

  return (
    <Card className={`p-6 hover:shadow-card-hover transition-all duration-300 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-5 w-5 text-mint-green" />
            <h3 className="text-lg font-semibold text-text-primary">
              {goal.title}
            </h3>
          </div>
          <p className="text-text-secondary text-sm mb-3 line-clamp-2">
            {goal.description}
          </p>
          <StatusBadge status={goal.status as any} />
        </div>
        {goal.image_url && (
          <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden ml-4">
            <img
              src={goal.image_url}
              alt={goal.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-text-secondary mb-2">
          <span className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            {formatCurrency(goal.current_value, goal.currency)} / {formatCurrency(goal.target_value, goal.currency)}
          </span>
          <span className="font-semibold">{progress.toFixed(1)}%</span>
        </div>
        <ProgressBar
          value={goal.current_value}
          max={goal.target_value}
          size="md"
          color="mint"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-text-tertiary">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {goal.contributors?.length || 0} contributors
          </div>
          {goal.estimated_completion && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(goal.estimated_completion).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {goal.contributors?.slice(0, 3).map((contributor, index) => (
              <div
                key={index}
                className="w-8 h-8 bg-pale-lavender rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold"
              >
                {contributor.user?.full_name?.charAt(0) || 'U'}
              </div>
            ))}
          </div>
          {goal.contributors && goal.contributors.length > 3 && (
            <span className="text-sm text-text-tertiary">
              +{goal.contributors.length - 3} more
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          {onContribute && goal.status === 'active' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onContribute(goal.id)}
            >
              Contribute
            </Button>
          )}
          {onViewDetails && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(goal.id)}
            >
              View Details
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}