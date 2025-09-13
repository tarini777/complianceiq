"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface ScorecardProps {
  title: string
  icon: React.ComponentType<{ className?: string }>
  currentScore: number
  maxScore: number
  isHighlighted?: boolean
  isCritical?: boolean
  className?: string
}

const Scorecard = React.forwardRef<HTMLDivElement, ScorecardProps>(
  ({ title, icon: Icon, currentScore, maxScore, isHighlighted = false, isCritical = false, className }, ref) => {
    const percentage = maxScore > 0 ? Math.round((currentScore / maxScore) * 100) : 0
    const isComplete = percentage === 100
    const hasProgress = percentage > 0

    return (
      <Card
        ref={ref}
        className={cn(
          "relative transition-all duration-200 hover:shadow-md",
          isHighlighted && "ring-2 ring-blue-500 shadow-lg",
          isCritical && "border-red-200 bg-red-50",
          isComplete && "border-green-200 bg-green-50",
          hasProgress && !isComplete && "border-yellow-200 bg-yellow-50",
          className
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={cn(
                "p-2 rounded-lg",
                isCritical && "bg-red-100",
                isComplete && "bg-green-100",
                hasProgress && !isComplete && "bg-yellow-100",
                !hasProgress && "bg-gray-100"
              )}>
                <Icon className={cn(
                  "h-4 w-4",
                  isCritical && "text-red-600",
                  isComplete && "text-green-600",
                  hasProgress && !isComplete && "text-yellow-600",
                  !hasProgress && "text-gray-600"
                )} />
              </div>
              <span className="text-sm font-medium text-gray-900 truncate">
                {title}
              </span>
            </div>
            {isCritical && (
              <Badge variant="destructive" className="text-xs">
                Critical
              </Badge>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {currentScore}
              </span>
              <span className="text-sm text-gray-500">
                / {maxScore}
              </span>
            </div>
            
            <Progress 
              value={percentage} 
              className={cn(
                "h-2",
                isCritical && "[&>div]:bg-red-500",
                isComplete && "[&>div]:bg-green-500",
                hasProgress && !isComplete && "[&>div]:bg-yellow-500",
                !hasProgress && "[&>div]:bg-gray-300"
              )}
            />
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {percentage}% complete
              </span>
              {isComplete && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                  Complete
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
)
Scorecard.displayName = "Scorecard"

export { Scorecard }
