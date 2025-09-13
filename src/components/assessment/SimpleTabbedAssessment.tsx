'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Upload,
  ArrowDown
} from 'lucide-react';
import { Persona, SubPersona, ProgressTracking, CategoryProgress, ProgressMilestone } from '@/types';
import { getQuestionsForSubPersona, progressTrackingConfig } from '@/data/persona-assessments';

interface SimpleTabbedAssessmentProps {
  persona: Persona;
  subPersona?: SubPersona;
  onComplete: (results: any) => void;
  onBack: () => void;
}

const SimpleTabbedAssessment: React.FC<SimpleTabbedAssessmentProps> = ({
  persona,
  subPersona,
  onComplete,
  onBack
}) => {
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
  
  // Group questions by category for tabs
  const questionsByCategory = questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {} as Record<string, typeof questions>);

  const categories = Object.keys(questionsByCategory);

  // Initialize progress tracking
  useEffect(() => {
    if (questions.length > 0) {
      const milestones = progressTrackingConfig.milestones.map(milestone => ({
        ...milestone,
        achieved: false
      }));

      const categoryProgress = categories.map(category => {
        const categoryQuestions = questionsByCategory[category];
        return {
          category,
          questionsTotal: categoryQuestions.length,
          questionsCompleted: 0,
          pointsEarned: 0,
          pointsTotal: categoryQuestions.reduce((sum, q) => sum + q.points, 0),
          completionPercentage: 0,
          blockers: 0
        };
      });

      setProgressTracking(prev => ({
        ...prev,
        totalQuestions: questions.length,
        milestones,
        categoryProgress
      }));
    }
  }, [questions, categories, questionsByCategory]);

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
        const categoryQuestions = questionsByCategory[cat.category] || [];
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
        completionPercentage,
        timeSpent,
        estimatedTimeRemaining,
        milestones: updatedMilestones,
        categoryProgress: updatedCategoryProgress
      }));
    }
  }, [responses, questions, categories, questionsByCategory, startTime]);

  const handleResponse = (questionId: string, response: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }));
  };

  const handleComplete = () => {
    const finalScore = calculateScore();
    onComplete({
      persona: persona.name,
      subPersona: subPersona?.name,
      score: finalScore,
      responses,
      timeSpent: progressTracking.timeSpent,
      completedAt: new Date()
    });
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

  const getCategoryProgress = (category: string) => {
    return progressTracking.categoryProgress.find(cat => cat.category === category) || {
      category,
      questionsTotal: 0,
      questionsCompleted: 0,
      pointsEarned: 0,
      pointsTotal: 0,
      completionPercentage: 0,
      blockers: 0
    };
  };

  if (questions.length === 0) {
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

  const allAnswered = Object.keys(responses).length === questions.length;
  const totalBlockers = progressTracking.categoryProgress.reduce((sum, cat) => sum + cat.blockers, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-compliance-50 to-compliance-100">
      <div className="container mx-auto px-4 py-8">
        {/* Simple Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${persona.color} rounded-full flex items-center justify-center`}>
              <persona.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-compliance-900">
                {persona.name}
              </h1>
              {subPersona && (
                <p className="text-lg text-compliance-700">
                  {subPersona.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Simple Progress Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-compliance-900">
                  {progressTracking.completionPercentage}%
                </div>
                <div className="text-sm text-compliance-600">Complete</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-compliance-900">
                  {Object.keys(responses).length}/{questions.length}
                </div>
                <div className="text-sm text-compliance-600">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-compliance-900">
                  {progressTracking.timeSpent}m
                </div>
                <div className="text-sm text-compliance-600">Time Spent</div>
              </div>
            </div>
            <Progress value={progressTracking.completionPercentage} className="h-3" />
          </CardContent>
        </Card>

        {/* Simple Tabbed Interface */}
        <Tabs defaultValue={categories[0]} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {categories.map((category) => {
              const IconComponent = getCategoryIcon(category);
              const progress = getCategoryProgress(category);
              const isComplete = progress.completionPercentage === 100;
              const hasBlockers = progress.blockers > 0;
              
              return (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="flex items-center space-x-2 p-3"
                >
                  <IconComponent className={`h-4 w-4 ${
                    hasBlockers ? 'text-red-500' : 
                    isComplete ? 'text-green-500' : 
                    'text-compliance-600'
                  }`} />
                  <span className="text-sm font-medium truncate">{category}</span>
                  {progress.questionsCompleted > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {progress.questionsCompleted}/{progress.questionsTotal}
                    </Badge>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => {
            const categoryQuestions = questionsByCategory[category];
            const progress = getCategoryProgress(category);
            const IconComponent = getCategoryIcon(category);

            return (
              <TabsContent key={category} value={category} className="space-y-4">
                {/* Category Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          progress.blockers > 0 ? 'bg-red-100' :
                          progress.completionPercentage === 100 ? 'bg-green-100' :
                          'bg-gray-100'
                        }`}>
                          <IconComponent className={`h-5 w-5 ${
                            progress.blockers > 0 ? 'text-red-600' :
                            progress.completionPercentage === 100 ? 'text-green-600' :
                            'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{category}</CardTitle>
                          <CardDescription>
                            {progress.questionsCompleted} of {progress.questionsTotal} questions completed
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-compliance-900">
                          {progress.pointsEarned}/{progress.pointsTotal}
                        </div>
                        <div className="text-sm text-compliance-600">points</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={progress.completionPercentage} className="h-2" />
                  </CardContent>
                </Card>

                {/* Questions in this category */}
                <div className="space-y-4">
                  {categoryQuestions.map((question, index) => {
                    const response = responses[question.id];
                    
                    return (
                      <Card key={question.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">Question {index + 1}</Badge>
                              {question.isBlocker && (
                                <Badge variant="destructive" className="flex items-center space-x-1">
                                  <Star className="h-3 w-3" />
                                  <span>Production Blocker</span>
                                </Badge>
                              )}
                              <Badge variant="secondary">{question.points} points</Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Question Text */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-lg font-medium text-gray-900 leading-relaxed">
                              {question.text}
                            </p>
                          </div>

                          {/* Evidence Required */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
                              <FileText className="h-4 w-4" />
                              <span>Evidence Required:</span>
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {question.evidenceRequired.map((evidence, idx) => (
                                <Badge key={idx} variant="outline" className="bg-blue-50 border-blue-300 text-blue-700">
                                  {evidence}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Responsible Roles */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>Responsible Roles:</span>
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {question.responsibleRole.map((role, idx) => (
                                <Badge key={idx} variant="outline" className="bg-green-50 border-green-300 text-green-700">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Response Options */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-800">Your Response:</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <Button
                                variant={response === 'yes' ? 'default' : 'outline'}
                                onClick={() => handleResponse(question.id, 'yes')}
                                className={`h-12 flex items-center space-x-2 ${
                                  response === 'yes' 
                                    ? 'bg-green-600 hover:bg-green-700' 
                                    : 'hover:bg-green-50 hover:border-green-300'
                                }`}
                              >
                                <CheckCircle className="h-5 w-5" />
                                <span>Yes, We Have This</span>
                              </Button>
                              <Button
                                variant={response === 'no' ? 'destructive' : 'outline'}
                                onClick={() => handleResponse(question.id, 'no')}
                                className={`h-12 flex items-center space-x-2 ${
                                  response === 'no' 
                                    ? 'bg-red-600 hover:bg-red-700' 
                                    : 'hover:bg-red-50 hover:border-red-300'
                                }`}
                              >
                                <AlertTriangle className="h-5 w-5" />
                                <span>No, We Need This</span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Simple Action Bar */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Persona Selection</span>
              </Button>

              <div className="flex items-center space-x-4">
                {totalBlockers > 0 && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">{totalBlockers} Production Blockers</span>
                  </div>
                )}
                
                <Button
                  onClick={handleComplete}
                  disabled={!allAnswered}
                  className="flex items-center space-x-2"
                >
                  <span>Complete Assessment</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleTabbedAssessment;
