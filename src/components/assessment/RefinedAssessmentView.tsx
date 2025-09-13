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
  BookOpen,
  Shield,
  Brain,
  Globe,
  Scale,
  Database,
  Settings,
  Star,
  Info,
  FileText,
  Upload
} from 'lucide-react';
import { Persona, SubPersona, ProgressTracking, CategoryProgress, ProgressMilestone } from '@/types';
import { getQuestionsForSubPersona, progressTrackingConfig } from '@/data/persona-assessments';

interface RefinedAssessmentViewProps {
  persona: Persona;
  subPersona?: SubPersona;
  onComplete: (results: any) => void;
  onBack: () => void;
}

const RefinedAssessmentView: React.FC<RefinedAssessmentViewProps> = ({
  persona,
  subPersona,
  onComplete,
  onBack
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
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
      
      const updatedMilestones = progressTracking.milestones.map(milestone => ({
        ...milestone,
        achieved: completionPercentage >= milestone.threshold,
        achievedAt: completionPercentage >= milestone.threshold && !milestone.achieved ? new Date() : milestone.achievedAt
      }));

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

      const timeSpent = Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60);
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

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'AI Governance Committee': Users,
      'Regulatory Compliance': Shield,
      'AI Model Validation': Brain,
      'Clinical Validation': Target,
      'Quality Assurance': CheckCircle,
      'Risk Assessment': AlertTriangle,
      'Data Privacy': Shield,
      'Security & Access Control': Shield,
      'Documentation': FileText,
      'Training & Adoption': Users
    };
    return iconMap[category] || Settings;
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
        {/* Header with improved visual hierarchy */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${persona.color} rounded-full flex items-center justify-center`}>
              <persona.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-compliance-900">
                {persona.name} Assessment
              </h1>
              {subPersona && (
                <p className="text-lg text-compliance-700">
                  {subPersona.name}
                </p>
              )}
            </div>
          </div>
          <p className="text-lg text-compliance-600 max-w-3xl mx-auto">
            {subPersona ? subPersona.description : persona.description}
          </p>
        </div>

        {/* Compact Progress Overview - More visual, less cluttered */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-compliance-900">
                    {progressTracking.completionPercentage}%
                  </div>
                  <div className="text-xs text-compliance-600">Complete</div>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-compliance-900">
                    {progressTracking.currentQuestion}/{progressTracking.totalQuestions}
                  </div>
                  <div className="text-xs text-compliance-600">Questions</div>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-compliance-900">
                    {progressTracking.timeSpent}m
                  </div>
                  <div className="text-xs text-compliance-600">Time Spent</div>
                </div>
              </div>
              <div className="flex space-x-1">
                {progressTracking.milestones.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className={`w-3 h-3 rounded-full ${
                      milestone.achieved ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                    title={milestone.label}
                  />
                ))}
              </div>
            </div>
            <Progress value={progressTracking.completionPercentage} className="h-3" />
          </CardContent>
        </Card>

        {/* Category Progress - More compact and visual */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Progress by Category</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {progressTracking.categoryProgress
                .filter(cat => cat.questionsTotal > 0)
                .map((category) => {
                  const IconComponent = getCategoryIcon(category.category);
                  return (
                    <div key={category.category} className="flex items-center space-x-2 bg-white rounded-lg p-3 border">
                      <IconComponent className={`h-4 w-4 ${
                        category.blockers > 0 ? 'text-red-500' : 
                        category.completionPercentage === 100 ? 'text-green-500' : 
                        'text-compliance-600'
                      }`} />
                      <div className="text-sm">
                        <div className="font-medium text-compliance-900">
                          {category.category}
                        </div>
                        <div className="text-xs text-compliance-600">
                          {category.questionsCompleted}/{category.questionsTotal} • {category.pointsEarned}/{category.pointsTotal} pts
                        </div>
                      </div>
                      {category.blockers > 0 && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Question Card with better visual hierarchy */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="bg-blue-50 border-blue-300 text-blue-700">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Badge>
                {currentQuestion.isBlocker && (
                  <Badge variant="destructive" className="flex items-center space-x-1">
                    <Star className="h-3 w-3" />
                    <span>Production Blocker</span>
                  </Badge>
                )}
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Target className="h-3 w-3" />
                  <span>{currentQuestion.points} points</span>
                </Badge>
              </div>
              <Badge variant="outline" className="bg-gray-50 border-gray-300 text-gray-700">
                {currentQuestion.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question Text with improved typography */}
            <div className="bg-gradient-to-r from-compliance-50 to-compliance-100 rounded-lg p-6 border-l-4 border-compliance-500">
              <h3 className="text-xl font-semibold text-compliance-900 leading-relaxed">
                {currentQuestion.text}
              </h3>
            </div>

            {/* Evidence Required - More actionable */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-compliance-600" />
                <h4 className="font-semibold text-compliance-800">Evidence Required:</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentQuestion.evidenceRequired.map((evidence, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Upload className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-800">{evidence}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Responsible Roles - More visual */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-compliance-600" />
                <h4 className="font-semibold text-compliance-800">Responsible Roles:</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentQuestion.responsibleRole.map((role, index) => (
                  <Badge key={index} variant="outline" className="bg-green-50 border-green-300 text-green-700">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Response Options with better UX */}
            <div className="space-y-4">
              <h4 className="font-semibold text-compliance-800">Your Response:</h4>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={responses[currentQuestion.id] === 'yes' ? 'default' : 'outline'}
                  onClick={() => handleResponse(currentQuestion.id, 'yes')}
                  className={`h-16 flex flex-col items-center space-y-2 ${
                    responses[currentQuestion.id] === 'yes' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'hover:bg-green-50 hover:border-green-300'
                  }`}
                >
                  <CheckCircle className="h-6 w-6" />
                  <span className="font-medium">Yes, We Have This</span>
                </Button>
                <Button
                  variant={responses[currentQuestion.id] === 'no' ? 'destructive' : 'outline'}
                  onClick={() => handleResponse(currentQuestion.id, 'no')}
                  className={`h-16 flex flex-col items-center space-y-2 ${
                    responses[currentQuestion.id] === 'no' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'hover:bg-red-50 hover:border-red-300'
                  }`}
                >
                  <AlertTriangle className="h-6 w-6" />
                  <span className="font-medium">No, We Need This</span>
                </Button>
              </div>
            </div>

            <Separator />

            {/* Navigation with better visual feedback */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Persona Selection</span>
              </Button>

              <div className="flex space-x-3">
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
                  className={`flex items-center space-x-2 ${
                    hasResponse ? 'bg-compliance-600 hover:bg-compliance-700' : ''
                  }`}
                >
                  <span>{isLastQuestion ? 'Complete Assessment' : 'Next Question'}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Milestone Achievements - More celebratory */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Achievement Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {progressTracking.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    milestone.achieved
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    milestone.achieved ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {milestone.achieved ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <span className="text-xs font-bold text-gray-600">{milestone.threshold}%</span>
                    )}
                  </div>
                  <div className="text-sm font-medium text-compliance-900">
                    {milestone.label}
                  </div>
                  {milestone.achieved && milestone.achievedAt && (
                    <div className="text-xs text-green-600 mt-1">
                      ✓ Achieved
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

export default RefinedAssessmentView;
