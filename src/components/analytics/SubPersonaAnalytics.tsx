'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Users, 
  Award, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Star,
  MessageSquare
} from 'lucide-react';
import { PersonaInsights, CategoryProgress } from '@/types';

interface SubPersonaAnalyticsProps {
  personaId: string;
  personaName: string;
}

const SubPersonaAnalytics: React.FC<SubPersonaAnalyticsProps> = ({
  personaId,
  personaName
}) => {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [insights, setInsights] = useState<PersonaInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = async () => {
      setLoading(true);
      
      // Mock data - in real implementation, this would come from an API
      const mockSubPersonaAnalytics: any[] = [
        {
          subPersonaId: 'ceo-csuite',
          subPersonaName: 'CEO & C-Suite',
          averageCompletionTime: 12,
          averageScore: 87,
          completionRate: 95,
          commonBlockers: ['Strategic AI governance', 'Business impact assessment'],
          improvementAreas: ['Executive oversight frameworks', 'Board reporting'],
          bestPractices: ['Regular governance reviews', 'Clear decision authority'],
          userFeedback: {
            rating: 4.8,
            comments: ['Very relevant questions', 'Helped identify gaps']
          }
        },
        {
          subPersonaId: 'chief-medical',
          subPersonaName: 'Chief Medical Officer',
          averageCompletionTime: 15,
          averageScore: 92,
          completionRate: 98,
          commonBlockers: ['Clinical AI governance', 'Patient safety oversight'],
          improvementAreas: ['Medical device compliance', 'Clinical validation'],
          bestPractices: ['Medical oversight protocols', 'Safety monitoring'],
          userFeedback: {
            rating: 4.9,
            comments: ['Excellent clinical focus', 'Comprehensive safety coverage']
          }
        },
        {
          subPersonaId: 'chief-compliance',
          subPersonaName: 'Chief Compliance Officer',
          averageCompletionTime: 18,
          averageScore: 89,
          completionRate: 93,
          commonBlockers: ['Compliance frameworks', 'Risk assessment'],
          improvementAreas: ['Audit oversight', 'Regulatory monitoring'],
          bestPractices: ['Regular compliance reviews', 'Risk mitigation'],
          userFeedback: {
            rating: 4.7,
            comments: ['Thorough compliance coverage', 'Good risk focus']
          }
        }
      ];

      const mockInsights: PersonaInsights = {
        personaId,
        personaName,
        subPersonaAnalytics: mockSubPersonaAnalytics,
        overallPerformance: {
          averageCompletionTime: 15,
          averageScore: 89,
          completionRate: 95
        },
        recommendations: [
          {
            priority: 'high',
            category: 'Governance',
            description: 'Strengthen AI governance frameworks across all executive roles',
            actionItems: [
              'Implement regular governance reviews',
              'Establish clear decision authorities',
              'Create executive AI training programs'
            ]
          },
          {
            priority: 'medium',
            category: 'Risk Management',
            description: 'Enhance risk assessment and monitoring processes',
            actionItems: [
              'Develop comprehensive risk frameworks',
              'Implement continuous monitoring',
              'Create risk escalation procedures'
            ]
          }
        ]
      };

      setAnalytics(mockSubPersonaAnalytics);
      setInsights(mockInsights);
      setLoading(false);
    };

    loadAnalytics();
  }, [personaId, personaName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-compliance-50 to-compliance-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-compliance-600 mx-auto mb-4"></div>
              <p className="text-compliance-600">Loading analytics...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-compliance-50 to-compliance-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-compliance-900 mb-2">
            {personaName} Analytics
          </h1>
          <p className="text-lg text-compliance-600 max-w-3xl mx-auto">
            Detailed insights and performance metrics for each sub-persona specialization
          </p>
        </div>

        {/* Overall Performance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Overall Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-compliance-900 mb-2">
                  {insights?.overallPerformance.averageCompletionTime} min
                </div>
                <div className="text-sm text-compliance-600 mb-2">Average Completion Time</div>
                <div className="flex items-center justify-center space-x-1">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Below industry average</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-compliance-900 mb-2">
                  {insights?.overallPerformance.averageScore}%
                </div>
                <div className="text-sm text-compliance-600 mb-2">Average Score</div>
                <div className="flex items-center justify-center space-x-1">
                  <Target className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Above 85% target</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-compliance-900 mb-2">
                  {insights?.overallPerformance.completionRate}%
                </div>
                <div className="text-sm text-compliance-600 mb-2">Completion Rate</div>
                <div className="flex items-center justify-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Excellent</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="sub-personas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sub-personas">Sub-Persona Performance</TabsTrigger>
            <TabsTrigger value="insights">Insights & Recommendations</TabsTrigger>
            <TabsTrigger value="trends">Trends & Patterns</TabsTrigger>
          </TabsList>

          <TabsContent value="sub-personas" className="space-y-6">
            {/* Sub-Persona Performance Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {analytics.map((subPersona) => (
                <Card key={subPersona.subPersonaId} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{subPersona.subPersonaName}</CardTitle>
                    <CardDescription>
                      Detailed performance metrics and insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-compliance-900">
                          {subPersona.averageCompletionTime}m
                        </div>
                        <div className="text-xs text-compliance-600">Avg. Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-compliance-900">
                          {subPersona.averageScore}%
                        </div>
                        <div className="text-xs text-compliance-600">Avg. Score</div>
                      </div>
                    </div>

                    <Progress value={subPersona.completionRate} className="h-2" />
                    <div className="text-xs text-compliance-600 text-center">
                      {subPersona.completionRate}% completion rate
                    </div>

                    {/* User Rating */}
                    <div className="flex items-center justify-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(subPersona.userFeedback.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-compliance-600 ml-2">
                        {subPersona.userFeedback.rating}
                      </span>
                    </div>

                    {/* Common Blockers */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-compliance-800">Common Blockers:</h4>
                      <div className="flex flex-wrap gap-1">
                        {subPersona.commonBlockers.slice(0, 2).map((blocker: any, index: number) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {blocker}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Improvement Areas */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-compliance-800">Improvement Areas:</h4>
                      <div className="flex flex-wrap gap-1">
                        {subPersona.improvementAreas.slice(0, 2).map((area: any, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights?.recommendations.map((recommendation, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        recommendation.priority === 'high'
                          ? 'border-red-500 bg-red-50'
                          : recommendation.priority === 'medium'
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-green-500 bg-green-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-compliance-900">
                          {recommendation.category}
                        </h4>
                        <Badge
                          variant={
                            recommendation.priority === 'high'
                              ? 'destructive'
                              : recommendation.priority === 'medium'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {recommendation.priority} priority
                        </Badge>
                      </div>
                      <p className="text-compliance-700 mb-3">{recommendation.description}</p>
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm text-compliance-800">Action Items:</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {recommendation.actionItems.map((item, itemIndex) => (
                            <li key={itemIndex} className="text-sm text-compliance-600">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {/* Trends and Patterns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Completion Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.map((subPersona) => (
                      <div key={subPersona.subPersonaId} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-compliance-700">
                            {subPersona.subPersonaName}
                          </span>
                          <span className="text-sm text-compliance-600">
                            {subPersona.completionRate}%
                          </span>
                        </div>
                        <Progress value={subPersona.completionRate} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5" />
                    <span>Score Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.map((subPersona) => (
                      <div key={subPersona.subPersonaId} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-compliance-700">
                            {subPersona.subPersonaName}
                          </span>
                          <span className="text-sm text-compliance-600">
                            {subPersona.averageScore}%
                          </span>
                        </div>
                        <Progress value={subPersona.averageScore} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Feedback Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>User Feedback Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analytics.map((subPersona) => (
                    <div key={subPersona.subPersonaId} className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-compliance-900 mb-2">
                        {subPersona.subPersonaName}
                      </h4>
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(subPersona.userFeedback.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-compliance-600">
                          {subPersona.userFeedback.rating}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {subPersona.userFeedback.comments.map((comment: any, index: number) => (
                          <p key={index} className="text-xs text-compliance-600 italic">
                            "{comment}"
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SubPersonaAnalytics;
