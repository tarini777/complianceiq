/**
 * Dynamic Assessment View - ComplianceIQ System
 * Real-time persona-driven assessment with collaboration features
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Loader2, 
  Users, 
  Target, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Brain,
  Shield,
  FileText,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { 
  assessmentApi, 
  DynamicAssessmentConfig, 
  AssessmentProgress,
  getPersonaDisplayName,
  getSectionProgressColor,
  getProductionStatusColor,
  formatTimeEstimate
} from '@/lib/api/assessment';

interface DynamicAssessmentViewProps {
  config: {
    personaId: string;
    subPersonaId?: string;
    therapeuticAreaId: string;
    companyId?: string;
    companyName: string;
  };
}

const DynamicAssessmentView: React.FC<DynamicAssessmentViewProps> = ({ config }) => {
  const [assessmentConfig, setAssessmentConfig] = useState<DynamicAssessmentConfig | null>(null);
  const [progress, setProgress] = useState<AssessmentProgress | null>(null);
  const [activeTab, setActiveTab] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [progressLoading, setProgressLoading] = useState<boolean>(false);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [savingResponse, setSavingResponse] = useState<string | null>(null);
  const [refreshingProgress, setRefreshingProgress] = useState<boolean>(false);

  // Load assessment configuration
  useEffect(() => {
    const loadAssessment = async () => {
      try {
        setLoading(true);
        const response = await assessmentApi.loadDynamicAssessment({
          personaId: config.personaId,
          subPersonaId: config.subPersonaId,
          therapeuticAreaId: config.therapeuticAreaId,
          companyId: config.companyId || 'demo-company',
          assessmentType: 'comprehensive'
        });

        if (response.success) {
          setAssessmentConfig(response.data);
          // Set first section with questions as active tab
          if (response.data.sections.length > 0) {
            const firstSectionWithQuestions = response.data.sections.find(section => 
              section.questions && section.questions.length > 0
            );
            if (firstSectionWithQuestions) {
              setActiveTab(firstSectionWithQuestions.id);
            } else {
              setActiveTab(response.data.sections[0].id);
            }
          }
        }
      } catch (error) {
        console.error('Error loading assessment:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [config]);

  // Load progress data
  useEffect(() => {
    const loadProgress = async () => {
      if (!config.personaId) return;

      try {
        setProgressLoading(true);
        const response = await assessmentApi.getAssessmentProgress({
          personaId: config.personaId,
          subPersonaId: config.subPersonaId
        });

        if (response.success) {
          setProgress(response.data);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setProgressLoading(false);
      }
    };

    loadProgress();
  }, [config.personaId, config.subPersonaId]);

  const handleResponseChange = (questionId: string, response: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }));
  };

  const handleSaveResponse = async (questionId: string, response: any) => {
    if (!assessmentConfig || !response?.trim()) return;

    try {
      setSavingResponse(questionId);
      
      const result = await assessmentApi.saveAssessmentResponse({
        personaId: config.personaId,
        subPersonaId: config.subPersonaId,
        sectionId: activeTab,
        questionId,
        response,
        timestamp: new Date().toISOString()
      });

      if (result.success) {
        // Show success feedback
        console.log('Response saved successfully');
        
        // Refresh progress
        const progressResponse = await assessmentApi.getAssessmentProgress({
          personaId: config.personaId,
          subPersonaId: config.subPersonaId
        });

        if (progressResponse.success) {
          setProgress(progressResponse.data);
        }
      } else {
        console.error('Failed to save response:', result.error);
        alert('Failed to save response. Please try again.');
      }
    } catch (error) {
      console.error('Error saving response:', error);
      alert('Error saving response. Please try again.');
    } finally {
      setSavingResponse(null);
    }
  };

  const handleBackToConfig = () => {
    window.location.href = '/assessment';
  };

  const handleRefreshProgress = async () => {
    if (!config.personaId) return;

    try {
      setRefreshingProgress(true);
      const response = await assessmentApi.getAssessmentProgress({
        personaId: config.personaId,
        subPersonaId: config.subPersonaId
      });

      if (response.success) {
        setProgress(response.data);
        console.log('Progress refreshed successfully');
      } else {
        console.error('Failed to refresh progress:', response.error);
        alert('Failed to refresh progress. Please try again.');
      }
    } catch (error) {
      console.error('Error refreshing progress:', error);
      alert('Error refreshing progress. Please try again.');
    } finally {
      setRefreshingProgress(false);
    }
  };

  const handleMarkSectionComplete = async (sectionId: string) => {
    if (!assessmentConfig) return;

    try {
      // Update collaboration state to completed
      const result = await assessmentApi.updateCollaborationState({
        sectionId,
        currentState: 'completed',
        comments: 'Section marked as complete by user'
      });

      if (result.success) {
        console.log('Section marked as complete');
        alert('Section marked as complete!');
        
        // Refresh progress to show updated state
        await handleRefreshProgress();
      } else {
        console.error('Failed to mark section complete:', result.error);
        alert('Failed to mark section complete. Please try again.');
      }
    } catch (error) {
      console.error('Error marking section complete:', error);
      alert('Error marking section complete. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading dynamic assessment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!assessmentConfig) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Assessment Not Found</h2>
            <p className="text-gray-600 mb-4">Unable to load assessment configuration</p>
            <Button onClick={handleBackToConfig}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Configuration
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const personaDisplayName = getPersonaDisplayName(
    {
      id: assessmentConfig.persona.id,
      name: assessmentConfig.persona.name,
      description: assessmentConfig.persona.description,
      isAdmin: assessmentConfig.persona.isAdmin,
      createdAt: new Date()
    }, 
    assessmentConfig.persona.subPersona
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Compliance Assessment</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-sm">
                  {config.companyName}
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  {personaDisplayName}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {assessmentConfig.therapeuticArea?.name}
                </Badge>
              </div>
            </div>
            <Button variant="outline" onClick={handleBackToConfig} className="shrink-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Config
            </Button>
          </div>

          {/* Progress Summary */}
          {progress && (
            <Card className="mb-6 border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {progress.assessment.overallCompletionRate.toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600 mb-2">Overall Progress</div>
                    <Progress 
                      value={progress.assessment.overallCompletionRate} 
                      className="h-2"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {progress.assessment.totalEarnedPoints}
                    </div>
                    <div className="text-sm text-gray-600">
                      of {progress.assessment.totalPoints} points
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-1">
                      {progress.assessment.estimatedTimeRemaining}
                    </div>
                    <div className="text-sm text-gray-600">minutes remaining</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold mb-1 ${getProductionStatusColor(progress.assessment.productionStatus)}`}>
                      {progress.assessment.productionStatus === 'production_ready' ? '✅' : '⚠️'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {progress.assessment.productionStatus === 'production_ready' ? 'Production Ready' : 'Needs Work'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Assessment Tabs */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xl font-semibold text-gray-900">Assessment Sections</div>
                <div className="text-sm text-gray-600">
                  {assessmentConfig.sections.length} sections • {assessmentConfig.sections.reduce((total, section) => total + section.questions.length, 0)} questions
                  {assessmentConfig.persona.isAdmin && (
                    <Badge variant="secondary" className="ml-2">Admin - Full Access</Badge>
                  )}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 h-auto bg-transparent p-1">
                  {assessmentConfig.sections.map((section) => {
                    const sectionProgress = progress?.sections.find(s => s.sectionId === section.id);
                    const completionRate = sectionProgress?.completionRate || 0;
                    
                    return (
                      <TabsTrigger 
                        key={section.id} 
                        value={section.id}
                        className="flex flex-col items-center gap-2 p-3 h-auto data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-xs font-bold text-center bg-gray-100 px-2 py-1 rounded">
                            {section.sectionNumber}
                          </div>
                          {section.isCriticalBlocker && (
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                        <div className="text-xs text-center leading-tight font-medium">
                          {section.title.split(' ').slice(0, 2).join(' ')}
                        </div>
                        <div className={`text-xs font-semibold ${getSectionProgressColor(completionRate)}`}>
                          {completionRate.toFixed(0)}%
                        </div>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              {assessmentConfig.sections.map((section) => {
                const sectionProgress = progress?.sections.find(s => s.sectionId === section.id);
                
                return (
                  <TabsContent key={section.id} value={section.id} className="p-6">
                    <div className="space-y-6">
                      {/* Section Header */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {section.title}
                          </h3>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-sm">
                              {section.questions.length} questions
                            </Badge>
                            <Badge variant="outline" className="text-sm">
                              {section.basePoints} points
                            </Badge>
                            {section.isCriticalBlocker && (
                              <Badge variant="destructive" className="text-sm">
                                🚨 Critical Blocker
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600 mb-1">Section Progress</div>
                          <div className={`text-2xl font-bold ${getSectionProgressColor(sectionProgress?.completionRate || 0)}`}>
                            {sectionProgress?.completionRate.toFixed(0) || 0}%
                          </div>
                          <Progress 
                            value={sectionProgress?.completionRate || 0} 
                            className="h-2 w-24 mt-2"
                          />
                        </div>
                      </div>

                      {/* Questions */}
                      <div className="space-y-6">
                        {section.questions.map((question) => (
                          <Card key={question.id} className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                                    Q{question.questionNumber}: {question.questionText}
                                  </h4>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge variant="outline" className="text-xs">
                                      {question.points} points
                                    </Badge>
                                    {question.isCritical && (
                                      <Badge variant="destructive" className="text-xs">
                                        🚨 Critical
                                      </Badge>
                                    )}
                                    <Badge variant="secondary" className="text-xs">
                                      {question.expertiseRequired} level
                                    </Badge>
                                    {question.therapyConditions && question.therapyConditions.length > 0 && (
                                      <Badge variant="outline" className="text-xs">
                                        Therapy-specific
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Question Response Area */}
                              <div className="space-y-4">
                                <textarea
                                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                  placeholder="Enter your detailed response here..."
                                  rows={4}
                                  value={responses[question.id] || ''}
                                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                                />
                                
                                <div className="flex justify-between items-center">
                                  <div className="text-sm text-gray-500">
                                    {responses[question.id]?.trim() ? (
                                      <span className="text-green-600">✓ Response saved</span>
                                    ) : (
                                      <span>Response required to save</span>
                                    )}
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => handleSaveResponse(question.id, responses[question.id])}
                                    disabled={!responses[question.id]?.trim() || savingResponse === question.id}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    {savingResponse === question.id ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Saving...
                                      </>
                                    ) : (
                                      'Save Response'
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Section Actions */}
                      <div className="flex justify-between items-center pt-6 border-t bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">
                              {section.questions.filter(q => responses[q.id]).length} of {section.questions.length}
                            </span> questions answered
                          </div>
                          <div className="text-sm text-gray-500">
                            {sectionProgress?.completionRate.toFixed(0) || 0}% complete
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleRefreshProgress}
                            disabled={refreshingProgress}
                            className="shrink-0"
                          >
                            <RefreshCw className={`h-4 w-4 mr-2 ${refreshingProgress ? 'animate-spin' : ''}`} />
                            {refreshingProgress ? 'Refreshing...' : 'Refresh'}
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleMarkSectionComplete(section.id)}
                            className="bg-green-600 hover:bg-green-700 shrink-0"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Complete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>
      </div>
  );
};

export default DynamicAssessmentView;
