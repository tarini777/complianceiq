"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  AlertTriangle, 
  Star, 
  FileText, 
  Users, 
  Upload,
  CheckCircle,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductionBlockerProps {
  questionNumber: string
  title: string
  question: string
  points: number
  evidenceRequired: string[]
  responsibleRoles: string[]
  currentResponse?: 'yes' | 'no' | null
  onResponse?: (response: 'yes' | 'no') => void
  className?: string
}

const ProductionBlocker = React.forwardRef<HTMLDivElement, ProductionBlockerProps>(
  ({ 
    questionNumber, 
    title, 
    question, 
    points, 
    evidenceRequired, 
    responsibleRoles, 
    currentResponse,
    onResponse,
    className 
  }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "border-red-200 bg-red-50 shadow-lg",
          className
        )}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-gray-100 text-gray-700">
                {questionNumber}
              </Badge>
              <Badge variant="destructive" className="flex items-center space-x-1">
                <Star className="h-3 w-3" />
                <span>Production Blocker</span>
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {points} points
              </Badge>
            </div>
          </div>
          <CardTitle className="text-lg text-red-900 mt-3">
            {title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Question */}
          <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
            <p className="text-gray-900 font-medium leading-relaxed">
              {question}
            </p>
          </div>

          {/* Evidence Required */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-600" />
              <h4 className="font-semibold text-gray-800">Evidence Required:</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {evidenceRequired.map((evidence, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                  <Upload className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800">{evidence}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Responsible Roles */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-600" />
              <h4 className="font-semibold text-gray-800">Responsible Roles:</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {responsibleRoles.map((role, index) => (
                <Badge key={index} variant="outline" className="bg-green-50 border-green-300 text-green-700">
                  {role}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Response Options */}
          {onResponse && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Your Response:</h4>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={currentResponse === 'yes' ? 'default' : 'outline'}
                  onClick={() => onResponse('yes')}
                  className={`h-16 flex flex-col items-center space-y-2 ${
                    currentResponse === 'yes' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'hover:bg-green-50 hover:border-green-300'
                  }`}
                >
                  <CheckCircle className="h-6 w-6" />
                  <span className="font-medium">Yes, We Have This</span>
                </Button>
                <Button
                  variant={currentResponse === 'no' ? 'destructive' : 'outline'}
                  onClick={() => onResponse('no')}
                  className={`h-16 flex flex-col items-center space-y-2 ${
                    currentResponse === 'no' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'hover:bg-red-50 hover:border-red-300'
                  }`}
                >
                  <X className="h-6 w-6" />
                  <span className="font-medium">No, We Need This</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
)
ProductionBlocker.displayName = "ProductionBlocker"

export { ProductionBlocker }
