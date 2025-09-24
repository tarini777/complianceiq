import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { ScaleQuestion, AssessmentResponse } from '@/types';

interface ScaleQuestionRendererProps {
  question: ScaleQuestion;
  response?: AssessmentResponse;
  onResponseChange: (questionId: string, value: number) => void;
  therapeuticArea?: string;
  aiModelType?: string;
}

export const ScaleQuestionRenderer: React.FC<ScaleQuestionRendererProps> = ({
  question,
  response,
  onResponseChange,
  therapeuticArea,
  aiModelType
}) => {
  const currentValue = typeof response?.responseValue === 'number' ? response.responseValue : 0;
  
  // Default scale labels if not provided
  const scaleLabels = question.scaleLabels || {
    1: "Strongly Disagree",
    2: "Disagree", 
    3: "Neutral",
    4: "Agree",
    5: "Strongly Agree"
  };

  const handleScaleClick = (value: number) => {
    onResponseChange(question.id, value);
  };

  const getButtonVariant = (value: number) => {
    if (currentValue === value) {
      return "default";
    }
    return "outline";
  };

  const getButtonColor = (value: number) => {
    if (currentValue === value) {
      if (value <= 2) return "bg-red-500 hover:bg-red-600 text-white";
      if (value === 3) return "bg-yellow-500 hover:bg-yellow-600 text-white";
      if (value >= 4) return "bg-green-500 hover:bg-green-600 text-white";
    }
    return "";
  };

  return (
    <Card className={`mb-4 ${question.isBlocker || question.isProductionBlocker ? 'border-red-500' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center gap-2">
            {(question.isBlocker || question.isProductionBlocker) && (
              <span className="text-red-500">🚨</span>
            )}
            {question.questionText}
            <span className="text-sm text-gray-500">
              ({question.complexityPoints || question.points} pts)
            </span>
          </CardTitle>
        </div>
        
        {/* Question metadata */}
        <div className="flex items-center gap-2 flex-wrap mt-2">
          <Badge variant="outline" className="text-xs">
            {question.points} points
          </Badge>
          {question.isBlocker && (
            <Badge variant="destructive" className="text-xs">
              🚨 Production Blocker
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs">
            Scale Question
          </Badge>
          {question.therapySpecific && (
            <Badge variant="outline" className="text-xs">
              Therapy-specific
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Scale Question UI */}
        <div className="space-y-6">
          {/* Scale Description */}
          <div className="text-sm text-gray-600 text-center">
            Rate your level of agreement with the following statement:
          </div>
          
          {/* 1-5 Scale Buttons */}
          <div className="flex justify-between items-center space-x-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <div key={value} className="flex flex-col items-center space-y-2">
                <Button
                  variant={getButtonVariant(value)}
                  onClick={() => handleScaleClick(value)}
                  className={`w-12 h-12 rounded-full text-lg font-bold transition-all duration-200 ${getButtonColor(value)}`}
                >
                  {value}
                </Button>
                <span className="text-xs text-gray-600 text-center max-w-16">
                  {scaleLabels[value as keyof typeof scaleLabels]}
                </span>
              </div>
            ))}
          </div>
          
          {/* Current Selection Display */}
          {currentValue > 0 && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">Selected:</span>
                <span className="font-bold text-blue-600">{currentValue}</span>
                <span className="text-sm text-blue-600">
                  - {scaleLabels[currentValue as keyof typeof scaleLabels]}
                </span>
              </div>
            </div>
          )}
          
          {/* Evidence Required */}
          {question.evidenceRequired && question.evidenceRequired.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                Evidence Required:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {question.evidenceRequired.map((evidence, index) => (
                  <li key={index}>{evidence}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Responsible Roles */}
          {question.responsibleRoles && question.responsibleRoles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">Responsible Roles:</h4>
              <div className="flex flex-wrap gap-2">
                {question.responsibleRoles.map((role, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Production Blocker Warning */}
          {question.isProductionBlocker && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">Production Blocker</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                This question must be answered with a score of 4 or 5 to proceed with production deployment.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScaleQuestionRenderer;
