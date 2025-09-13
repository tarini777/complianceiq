/**
 * Collaboration Analytics Dashboard
 * Real-time analytics and insights for collaboration sessions
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageSquare, 
  Clock, 
  Target,
  AlertTriangle,
  CheckCircle,
  Brain,
  Activity,
  Zap,
  PieChart,
  LineChart,
  Globe,
  User,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

interface CollaborationMetrics {
  id: string;
  sessionId: string;
  userId: string;
  messagesSent: number;
  messagesReceived: number;
  responseTime?: number;
  activeMinutes: number;
  threadsCreated: number;
  reactionsGiven: number;
  reactionsReceived: number;
  assessmentProgress: number;
  lastActivityAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  session: {
    id: string;
    sessionName: string;
    status: string;
  };
}

interface TeamPerformanceMetrics {
  id: string;
  sessionId: string;
  totalParticipants: number;
  activeParticipants: number;
  averageResponseTime?: number;
  messageVolume: number;
  collaborationScore?: number;
  engagementScore?: number;
  productivityScore?: number;
  assessmentCompletionRate: number;
  bottleneckSeverity?: number;
  bottleneckType?: string;
  riskScore?: number;
  successProbability?: number;
  session: {
    id: string;
    sessionName: string;
    status: string;
  };
}

interface PredictiveInsight {
  id: string;
  sessionId: string;
  insightType: string;
  insightCategory: string;
  severity: number;
  confidence: number;
  title: string;
  description: string;
  recommendation?: string;
  timeframe?: string;
  status: string;
  createdAt: string;
  session: {
    id: string;
    sessionName: string;
  };
}

interface CollaborationAnalyticsProps {
  sessionId?: string;
  organizationId?: string;
}

export const CollaborationAnalytics: React.FC<CollaborationAnalyticsProps> = ({
  sessionId,
  organizationId
}) => {
  const [collaborationMetrics, setCollaborationMetrics] = useState<CollaborationMetrics[]>([]);
  const [teamMetrics, setTeamMetrics] = useState<TeamPerformanceMetrics[]>([]);
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'individual' | 'insights'>('overview');

  useEffect(() => {
    loadAnalyticsData();
  }, [sessionId, organizationId]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Load collaboration metrics
      const metricsParams = new URLSearchParams();
      if (sessionId) metricsParams.append('sessionId', sessionId);
      if (organizationId) metricsParams.append('organizationId', organizationId);
      
      const [metricsRes, teamRes, insightsRes] = await Promise.all([
        fetch(`/api/analytics/collaboration?${metricsParams}`),
        fetch(`/api/analytics/team-performance?${metricsParams}`),
        fetch(`/api/analytics/predictive-insights?${metricsParams}`)
      ]);

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setCollaborationMetrics(metricsData.data || []);
      }

      if (teamRes.ok) {
        const teamData = await teamRes.json();
        setTeamMetrics(teamData.data || []);
      }

      if (insightsRes.ok) {
        const insightsData = await insightsRes.json();
        setPredictiveInsights(insightsData.data || []);
      }

    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 0.8) return 'bg-red-500';
    if (severity >= 0.6) return 'bg-orange-500';
    if (severity >= 0.4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-blue-600';
    if (confidence >= 0.4) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'bottleneck': return <AlertTriangle className="h-4 w-4" />;
      case 'risk': return <AlertTriangle className="h-4 w-4" />;
      case 'opportunity': return <Target className="h-4 w-4" />;
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-compliance-primary" />
            <span>Collaboration Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-compliance-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-compliance-primary" />
              <span>Collaboration Analytics</span>
            </CardTitle>
            <CardDescription>
              Real-time insights and performance metrics
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={loadAnalyticsData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team Performance</TabsTrigger>
            <TabsTrigger value="individual">Individual Metrics</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Key Metrics Cards */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {teamMetrics.reduce((sum, tm) => sum + tm.totalParticipants, 0)}
                      </p>
                      <p className="text-sm text-gray-600">Total Participants</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {collaborationMetrics.reduce((sum, cm) => sum + cm.messagesSent, 0)}
                      </p>
                      <p className="text-sm text-gray-600">Messages Sent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {Math.round(teamMetrics.reduce((sum, tm) => sum + (tm.averageResponseTime || 0), 0) / teamMetrics.length) || 0}s
                      </p>
                      <p className="text-sm text-gray-600">Avg Response Time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Target className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {Math.round(teamMetrics.reduce((sum, tm) => sum + tm.assessmentCompletionRate, 0) / teamMetrics.length * 100) || 0}%
                      </p>
                      <p className="text-sm text-gray-600">Completion Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-compliance-primary" />
                  <span>Recent AI Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {predictiveInsights.slice(0, 3).map((insight) => (
                  <div key={insight.id} className="flex items-start space-x-3 p-3 border rounded-lg mb-3">
                    <div className={`p-2 rounded-full ${getSeverityColor(insight.severity)} text-white`}>
                      {getInsightIcon(insight.insightType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {insight.insightType}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getConfidenceColor(insight.confidence)}`}>
                          {Math.round(insight.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                      {insight.recommendation && (
                        <p className="text-sm text-blue-600">
                          <strong>Recommendation:</strong> {insight.recommendation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {predictiveInsights.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No insights available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Performance Tab */}
          <TabsContent value="team" className="space-y-6">
            {teamMetrics.map((metric) => (
              <Card key={metric.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{metric.session.sessionName}</span>
                    <Badge variant={metric.session.status === 'active' ? 'default' : 'secondary'}>
                      {metric.session.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{metric.totalParticipants}</p>
                      <p className="text-sm text-gray-600">Total Participants</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{metric.activeParticipants}</p>
                      <p className="text-sm text-gray-600">Active Participants</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{metric.messageVolume}</p>
                      <p className="text-sm text-gray-600">Message Volume</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {Math.round(metric.assessmentCompletionRate * 100)}%
                      </p>
                      <p className="text-sm text-gray-600">Completion Rate</p>
                    </div>
                  </div>

                  {/* Performance Scores */}
                  {(metric.collaborationScore || metric.engagementScore || metric.productivityScore) && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Performance Scores</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {metric.collaborationScore && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">
                              {Math.round(metric.collaborationScore * 100)}%
                            </div>
                            <p className="text-sm text-gray-600">Collaboration Score</p>
                          </div>
                        )}
                        {metric.engagementScore && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">
                              {Math.round(metric.engagementScore * 100)}%
                            </div>
                            <p className="text-sm text-gray-600">Engagement Score</p>
                          </div>
                        )}
                        {metric.productivityScore && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">
                              {Math.round(metric.productivityScore * 100)}%
                            </div>
                            <p className="text-sm text-gray-600">Productivity Score</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bottleneck Analysis */}
                  {metric.bottleneckSeverity && metric.bottleneckType && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">Bottleneck Detected</h4>
                      <p className="text-sm text-yellow-700">
                        <strong>Type:</strong> {metric.bottleneckType}
                      </p>
                      <p className="text-sm text-yellow-700">
                        <strong>Severity:</strong> {Math.round(metric.bottleneckSeverity * 100)}%
                      </p>
                      {(metric as any).bottleneckDescription && (
                        <p className="text-sm text-yellow-700 mt-1">{(metric as any).bottleneckDescription}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {teamMetrics.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No team performance data available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Individual Metrics Tab */}
          <TabsContent value="individual" className="space-y-6">
            {collaborationMetrics.map((metric) => (
              <Card key={metric.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>{metric.user.name}</span>
                    </div>
                    <Badge variant="outline">
                      {metric.session.sessionName}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{metric.messagesSent}</p>
                      <p className="text-sm text-gray-600">Messages Sent</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{metric.messagesReceived}</p>
                      <p className="text-sm text-gray-600">Messages Received</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{metric.activeMinutes}</p>
                      <p className="text-sm text-gray-600">Active Minutes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {Math.round(metric.assessmentProgress * 100)}%
                      </p>
                      <p className="text-sm text-gray-600">Assessment Progress</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-indigo-600">{metric.threadsCreated}</p>
                      <p className="text-sm text-gray-600">Threads Created</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-pink-600">{metric.reactionsGiven}</p>
                      <p className="text-sm text-gray-600">Reactions Given</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-teal-600">{metric.reactionsReceived}</p>
                      <p className="text-sm text-gray-600">Reactions Received</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-600">
                        {metric.responseTime ? `${metric.responseTime}s` : 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">Response Time</p>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-500">
                    Last active: {new Date(metric.lastActivityAt).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
            {collaborationMetrics.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No individual metrics available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            {predictiveInsights.map((insight) => (
              <Card key={insight.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-full ${getSeverityColor(insight.severity)} text-white`}>
                        {getInsightIcon(insight.insightType)}
                      </div>
                      <span>{insight.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {insight.insightType}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getConfidenceColor(insight.confidence)}`}>
                        {Math.round(insight.confidence * 100)}% confidence
                      </Badge>
                      <Badge variant={insight.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {insight.status}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-gray-700">{insight.description}</p>
                    </div>

                    {insight.recommendation && (
                      <div>
                        <h4 className="font-semibold mb-2">Recommendation</h4>
                        <p className="text-blue-700">{insight.recommendation}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Severity</p>
                        <p className="font-semibold">{Math.round(insight.severity * 100)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Confidence</p>
                        <p className="font-semibold">{Math.round(insight.confidence * 100)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="font-semibold">{insight.insightCategory}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Timeframe</p>
                        <p className="font-semibold">{insight.timeframe || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500">
                      Created: {new Date(insight.createdAt).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {predictiveInsights.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No AI insights available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
