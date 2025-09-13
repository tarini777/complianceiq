'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Clock, 
  Target, 
  AlertTriangle, 
  ArrowLeft, 
  ArrowRight,
  Users,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react';
import { Persona, SubPersona, ProgressTracking, CategoryProgress, ProgressMilestone } from '@/types';
import { getQuestionsForSubPersona, progressTrackingConfig } from '@/data/persona-assessments';

interface EnhancedPersonaAssessmentViewProps {
  persona: Persona;
  subPersona?: SubPersona;
  onComplete: (results: any) => void;
  onBack: () => void;
}

const EnhancedPersonaAssessmentView: React.FC<EnhancedPersonaAssessmentViewProps> = ({
  persona,
  subPersona,
  onComplete,
  onBack
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [progressTracking, setProgressTracking] = useState<ProgressTracking>({
    personaId: persona.id,
    subPersonaId: subPersona?.id,
    currentQuestion: 0,
    totalQuestions: 0,
    completionPercentage: 0,
    timeSpent: 0,
    estimatedTimeRemaining: 0,
    milestones: [],
    categoryProgress: []
  });

  const questions = subPersona ? getQuestionsForSubPersona(subPersona.id) : [];
  const currentQuestion = questions[currentQuestionIndex];

  // Initialize progress tracking
  useEffect(() => {
    if (questions.length > 0) {
      const milestones = progressTrackingConfig.milestones.map(milestone => ({
        ...milestone,
        achieved: false
      }));

      const categoryProgress = progressTrackingConfig.categories.map(category => ({
        category,
        questionsTotal: questions.filter(q => q.category === category).length,
        questionsCompleted: 0,
        pointsEarned: 0,
        pointsTotal: questions.filter(q => q.category === category).reduce((sum, q) => sum + q.points, 0),
        completionPercentage: 0,
        blockers: 0
      }));

      setProgressTracking(prev => ({
        ...prev,
        totalQuestions: questions.length,
        milestones,
        categoryProgress
      }));
    }
  }, [questions]);

  // Update progress tracking
  useEffect(() => {
    if (questions.length > 0) {
      const completionPercentage = Math.round((Object.keys(responses).length / questions.length) * 100);
      
      // Update milestones
      const updatedMilestones = progressTracking.milestones.map(milestone => ({
        ...milestone,
        achieved: completionPercentage >= milestone.threshold,
        achievedAt: completionPercentage >= milestone.threshold && !milestone.achieved ? new Date() : milestone.achievedAt
      }));

      // Update category progress
      const updatedCategoryProgress = progressTracking.categoryProgress.map(cat => {
        const categoryQuestions = questions.filter(q => q.category === cat.category);
        const completedQuestions = categoryQuestions.filter(q => responses[q.id] !== undefined);
        const earnedPoints = categoryQuestions
          .filter(q => responses[q.id] === 'yes')
          .reduce((sum, q) => sum + q.points, 0);
        const blockers = categoryQuestions.filter(q => q.isBlocker && responses[q.id] === 'no').length;

        return {
          ...cat,
          questionsCompleted: completedQuestions.length,
          pointsEarned: earnedPoints,
          completionPercentage: cat.questionsTotal > 0 ? Math.round((completedQuestions.length / cat.questionsTotal) * 100) : 0,
          blockers
        };
      });

      // Calculate time spent and estimated remaining
      const timeSpent = Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60); // minutes
      const estimatedTimePerQuestion = timeSpent / Math.max(Object.keys(responses).length, 1);
      const estimatedTimeRemaining = Math.round((questions.length - Object.keys(responses).length) * estimatedTimePerQuestion);

      setProgressTracking(prev => ({
        ...prev,
        currentQuestion: currentQuestionIndex + 1,
        completionPercentage,
        timeSpent,
        estimatedTimeRemaining,
        milestones: updatedMilestones,
        categoryProgress: updatedCategoryProgress
      }));
    }
  }, [responses, currentQuestionIndex, questions, startTime]);

  const handleResponse = (questionId: string, response: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Assessment complete
      const finalScore = calculateScore();
      onComplete({
        persona: persona.name,
        subPersona: subPersona?.name,
        score: finalScore,
        responses,
        timeSpent: progressTracking.timeSpent,
        completedAt: new Date()
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const earnedPoints = questions
      .filter(q => responses[q.id] === 'yes')
      .reduce((sum, q) => sum + q.points, 0);
    
    return {
      percentage: Math.round((earnedPoints / totalPoints) * 100),
      earnedPoints,
      totalPoints,
      blockers: questions.filter(q => q.isBlocker && responses[q.id] === 'no').length
    };
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-compliance-50 to-compliance-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-compliance-600 mx-auto mb-4"></div>
              <p className="text-compliance-600">Loading assessment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasResponse = responses[currentQuestion.id] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-compliance-50 to-compliance-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-compliance-900 mb-2">
            {persona.name} Assessment
          </h1>
          {subPersona && (
            <h2 className="text-2xl font-semibold text-compliance-700 mb-4">
              {subPersona.name}
            </h2>
          )}
          <p className="text-lg text-compliance-600 max-w-3xl mx-auto">
            {subPersona ? subPersona.description : persona.description}
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Assessment Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Overall Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-compliance-700">Overall Progress</span>
                  <span className="text-sm text-compliance-600">{progressTracking.completionPercentage}%</span>
                </div>
                <Progress value={progressTracking.completionPercentage} className="h-2" />
              </div>

              {/* Questions Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-compliance-700">Questions</span>
                  <span className="text-sm text-compliance-600">
                    {progressTracking.currentQuestion} / {progressTracking.totalQuestions}
                  </span>
                </div>
                <Progress 
                  value={(progressTracking.currentQuestion / progressTracking.totalQuestions) * 100} 
                  className="h-2" 
                />
              </div>

              {/* Time Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-compliance-700">Time Spent</span>
                  <span className="text-sm text-compliance-600">{progressTracking.timeSpent} min</span>
                </div>
                <div className="text-xs text-compliance-500">
                  Est. {progressTracking.estimatedTimeRemaining} min remaining
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-compliance-700">Milestones</span>
                  <span className="text-sm text-compliance-600">
                    {progressTracking.milestones.filter(m => m.achieved).length} / {progressTracking.milestones.length}
                  </span>
                </div>
                <div className="flex space-x-1">
                  {progressTracking.milestones.map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className={`w-2 h-2 rounded-full ${
                        milestone.achieved ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      title={milestone.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Category Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {progressTracking.categoryProgress
                .filter(cat => cat.questionsTotal > 0)
                .map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-compliance-700 truncate">
                      {category.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      {category.blockers > 0 && (
                        <AlertTriangle className="h-3 w-3 text-red-500" />
                      )}
                      <span className="text-xs text-compliance-600">
                        {category.completionPercentage}%
                      </span>
                    </div>
                  </div>
                  <Progress value={category.completionPercentage} className="h-1" />
                  <div className="text-xs text-compliance-500">
                    {category.questionsCompleted}/{category.questionsTotal} questions • {category.pointsEarned}/{category.pointsTotal} points
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </CardTitle>
                <CardDescription className="mt-2">
                  <Badge variant="outline" className="mr-2">
                    <Target className="h-3 w-3 mr-1" />
                    {currentQuestion.points} points
                  </Badge>
                  {currentQuestion.isBlocker && (
                    <Badge variant="destructive" className="mr-2">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Production Blocker
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    {currentQuestion.category}
                  </Badge>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg font-medium text-compliance-900">
              {currentQuestion.text}
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-semibold text-compliance-800">Evidence Required:</h4>
              <ul className="list-disc list-inside space-y-1 text-compliance-600">
                {currentQuestion.evidenceRequired.map((evidence, index) => (
                  <li key={index} className="text-sm">{evidence}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-compliance-800">Response:</h4>
              <div className="flex space-x-4">
                <Button
                  variant={responses[currentQuestion.id] === 'yes' ? 'default' : 'outline'}
                  onClick={() => handleResponse(currentQuestion.id, 'yes')}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Yes
                </Button>
                <Button
                  variant={responses[currentQuestion.id] === 'no' ? 'destructive' : 'outline'}
                  onClick={() => handleResponse(currentQuestion.id, 'no')}
                  className="flex-1"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  No
                </Button>
              </div>
            </div>

            <Separator />

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Persona Selection</span>
              </Button>

              <div className="flex space-x-2">
                {currentQuestionIndex > 0 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  disabled={!hasResponse}
                  className="flex items-center space-x-2"
                >
                  <span>{isLastQuestion ? 'Complete Assessment' : 'Next'}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Milestones Achievement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Achievement Milestones</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {progressTracking.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    milestone.achieved
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-4 h-4 rounded-full ${
                      milestone.achieved ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <span className="text-sm font-medium text-compliance-700">
                      {milestone.label}
                    </span>
                  </div>
                  <div className="text-xs text-compliance-500">
                    {milestone.threshold}% complete
                  </div>
                  {milestone.achieved && milestone.achievedAt && (
                    <div className="text-xs text-green-600 mt-1">
                      Achieved at {milestone.achievedAt.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedPersonaAssessmentView;
