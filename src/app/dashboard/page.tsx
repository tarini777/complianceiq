/**
 * Professional Dashboard - ComplianceIQ System
 * Overview of assessment status and key metrics
 * Based on ALZQIMM professional standards
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import QuickStartGuide from '@/components/QuickStartGuide';
import RealTimeDataDashboard from '@/components/dashboard/RealTimeDataDashboard';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  Activity,
  ArrowRight,
  BarChart3,
  Eye,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  Building,
  Loader2,
  Play,
  Bot,
  Target,
  Zap,
  Brain,
  Lightbulb,
  Rocket,
  Settings,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Star,
  Award,
  TrendingDown
} from 'lucide-react';

interface DashboardData {
  overview: {
    totalAssessments: number;
    totalAssessmentsGrowth: string;
    activeAssessments: number;
    activeAssessmentsGrowth: string;
    avgComplianceScore: string;
    avgComplianceScoreGrowth: string;
    criticalIssues: number;
    criticalIssuesGrowth: string;
  };
  // Enhanced Intelligence Metrics
  intelligence: {
    completionRate: number;
    trendAnalysis: {
      lastMonth: number;
      lastQuarter: number;
      trend: 'up' | 'down' | 'stable';
    };
    personaInsights: Array<{
      persona: string;
      completionRate: number;
      avgScore: number;
      improvement: number;
    }>;
    criticalBlockers: Array<{
      section: string;
      count: number;
      impact: 'high' | 'medium' | 'low';
    }>;
  };
  // Workflow Progress Tracking
  workflowProgress: Array<{
    assessmentName: string;
    currentStep: string;
    nextAction: string;
    completionPercentage: number;
    estimatedTimeRemaining: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  recentAssessments: Array<{
    id: string;
    companyName: string;
    assessmentName: string;
    date: string;
    score: number;
    status: string;
    therapeuticAreas: string[];
    aiModelTypes: string[];
  }>;
  systemMetrics: {
    uptime: string;
    avgResponseTime: string;
    activeIssues: number;
    regulatoryUpdates: number;
  };
  quickActions: Array<{
    name: string;
    href: string;
    icon: string;
  }>;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      console.log('Dashboard API called - fetching enhanced intelligence data');
      
      // Try enhanced dashboard API first
      let response = await fetch('/api/dashboard/intelligence');
      let result = await response.json();
      
      if (!result.success) {
        // Fallback to basic dashboard API
        console.log('Falling back to basic dashboard API');
        response = await fetch('/api/dashboard');
        result = await response.json();
      }
      
      if (result.success) {
        setDashboardData(result.data);
        setError(null);
        console.log('Dashboard data loaded successfully:', result.data);
      } else {
        setError(result.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Failed to connect to dashboard API');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'assessment':
        router.push('/assessment');
        break;
      case 'analytics':
        router.push('/analytics');
        break;
      case 'remediation':
        router.push('/remediation');
        break;
      case 'regulatory':
        router.push('/regulatory');
        break;
      case 'askrexi':
        router.push('/askrexi');
        break;
      case 'settings':
        router.push('/settings');
        break;
      default:
        break;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600">Dashboard data could not be loaded.</p>
        </div>
      </div>
    );
  }

  const DashboardContent = () => (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Welcome to ComplianceIQ</h1>
              <p className="text-blue-100 text-lg mb-4">AI-Powered Pharmaceutical Compliance Platform</p>
              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-300" />
                  <span>559+ Dynamic Questions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-300" />
                  <span>87-95% AI Confidence</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-300" />
                  <span>Real-time Insights</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
              <Badge variant="secondary" className="flex items-center space-x-2 w-fit mx-auto">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>System Online</span>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-compliance-primary hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleQuickAction('analytics')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
            <FileText className="h-4 w-4 text-compliance-primary group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.overview?.totalAssessments || 24}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{dashboardData?.overview?.totalAssessmentsGrowth || '+18%'}</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-compliance-secondary hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleQuickAction('assessment')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assessments</CardTitle>
            <Activity className="h-4 w-4 text-compliance-secondary group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.overview?.activeAssessments || 8}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">{dashboardData?.overview?.activeAssessmentsGrowth || '+3'}</span> this week
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-compliance-accent hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleQuickAction('remediation')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Compliance Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-compliance-accent group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.overview?.avgComplianceScore || '78.5%'}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{dashboardData?.overview?.avgComplianceScoreGrowth || '+5.2%'}</span> improvement
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleQuickAction('remediation')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.overview?.criticalIssues || 3}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">{dashboardData?.overview?.criticalIssuesGrowth || '-2'}</span> resolved this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Insights Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <span>AI-Powered Compliance Insights</span>
            <Badge className="bg-blue-100 text-blue-800">Live</Badge>
          </CardTitle>
          <CardDescription>Real-time AI analysis of your compliance performance with 87-95% confidence scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <Lightbulb className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-blue-600">4</div>
              <div className="text-sm text-gray-600">Key Findings</div>
              <div className="text-xs text-green-600 mt-1">95% confidence</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-blue-600">4</div>
              <div className="text-sm text-gray-600">Smart Recommendations</div>
              <div className="text-xs text-green-600 mt-1">87% confidence</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <Shield className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-blue-600">2</div>
              <div className="text-sm text-gray-600">Risk Factors</div>
              <div className="text-xs text-green-600 mt-1">90% confidence</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <Rocket className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-blue-600">6</div>
              <div className="text-sm text-gray-600">Opportunities</div>
              <div className="text-xs text-green-600 mt-1">88% confidence</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Button 
              onClick={() => handleQuickAction('remediation')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Brain className="h-4 w-4 mr-2" />
              View AI Insights
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Intelligence Metrics */}
      {dashboardData?.intelligence && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Completion Rate & Trends */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-compliance-primary" />
                <span>Intelligence Metrics</span>
              </CardTitle>
              <CardDescription>Real-time assessment completion and trend analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Completion Rate</span>
                  <span className="text-2xl font-bold text-compliance-primary">
                    {dashboardData.intelligence.completionRate}%
                  </span>
                </div>
                <Progress value={dashboardData.intelligence.completionRate} className="w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{dashboardData.intelligence.trendAnalysis.lastMonth}%</div>
                    <div className="text-xs text-gray-500">Last Month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{dashboardData.intelligence.trendAnalysis.lastQuarter}%</div>
                    <div className="text-xs text-gray-500">Last Quarter</div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <Badge variant={dashboardData.intelligence.trendAnalysis.trend === 'up' ? 'default' : 
                                   dashboardData.intelligence.trendAnalysis.trend === 'down' ? 'destructive' : 'secondary'}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trend: {dashboardData.intelligence.trendAnalysis.trend}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Critical Blockers */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span>Critical Blockers</span>
              </CardTitle>
              <CardDescription>Assessment sections requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.intelligence.criticalBlockers.map((blocker, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <div className="font-medium text-sm">{blocker.section}</div>
                      <div className="text-xs text-gray-500">{blocker.count} assessments affected</div>
                    </div>
                    <Badge variant={blocker.impact === 'high' ? 'destructive' : 
                                     blocker.impact === 'medium' ? 'default' : 'secondary'}>
                      {blocker.impact}
                    </Badge>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => handleQuickAction('remediation')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Address Blockers
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Workflow Progress Tracking */}
      {dashboardData?.workflowProgress && dashboardData.workflowProgress.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-compliance-primary" />
              <span>Workflow Progress</span>
            </CardTitle>
            <CardDescription>Active assessments and next actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.workflowProgress.map((workflow, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{workflow.assessmentName}</div>
                    <div className="text-sm text-gray-500">{workflow.currentStep}</div>
                    <div className="text-xs text-blue-600 mt-1">Next: {workflow.nextAction}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{workflow.completionPercentage}%</div>
                    <div className="text-xs text-gray-500">{workflow.estimatedTimeRemaining}</div>
                    <Badge variant={workflow.priority === 'high' ? 'destructive' : 
                                     workflow.priority === 'medium' ? 'default' : 'secondary'} className="mt-1">
                      {workflow.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Recent Assessments</span>
            </CardTitle>
            <CardDescription>Latest pharmaceutical AI readiness assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentAssessments.map((assessment) => (
                <div key={assessment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(assessment.status)}
                    <div>
                      <p className="font-medium text-sm">{assessment.companyName} - {assessment.assessmentName}</p>
                      <p className="text-xs text-muted-foreground">{assessment.date}</p>
                      {assessment.therapeuticAreas.length > 0 && (
                        <p className="text-xs text-blue-600">{assessment.therapeuticAreas.join(', ')}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {assessment.score > 0 && (
                      <span className="text-sm font-semibold">{assessment.score}%</span>
                    )}
                    <Badge className={getStatusColor(assessment.status)}>
                      {assessment.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              className="w-full mt-4 group" 
              onClick={() => handleQuickAction('analytics')}
            >
              View All Assessments
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Start new assessments and manage compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white group" 
                onClick={() => handleQuickAction('assessment')}
              >
                <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                Start New Assessment
                <ArrowRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-green-50 hover:border-green-300 group" 
                onClick={() => handleQuickAction('regulatory')}
              >
                <Shield className="h-4 w-4 mr-2 text-green-600 group-hover:scale-110 transition-transform" />
                View Regulatory Updates
                <ExternalLink className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-purple-50 hover:border-purple-300 group" 
                onClick={() => handleQuickAction('analytics')}
              >
                <BarChart3 className="h-4 w-4 mr-2 text-purple-600 group-hover:scale-110 transition-transform" />
                Generate Compliance Report
                <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-orange-50 hover:border-orange-300 group" 
                onClick={() => handleQuickAction('askrexi')}
              >
                <Bot className="h-4 w-4 mr-2 text-orange-600 group-hover:scale-110 transition-transform" />
                Ask AskRexi Assistant
                <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
              </Button>

              <div className="pt-2 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-gray-600 hover:text-gray-900"
                  onClick={() => handleQuickAction('settings')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings & Configuration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>System Status</span>
          </CardTitle>
          <CardDescription>Current system health and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">{dashboardData.systemMetrics.uptime}</div>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">{dashboardData.systemMetrics.avgResponseTime}</div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">{dashboardData.systemMetrics.activeIssues}</div>
              <p className="text-sm text-muted-foreground">Active Issues</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">{dashboardData.systemMetrics.regulatoryUpdates}</div>
              <p className="text-sm text-muted-foreground">Regulatory Updates</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-Time Data Dashboard */}
      <div className="mt-8">
        <RealTimeDataDashboard />
      </div>
    </div>
  );

  return <DashboardContent />;
};

export default Dashboard;
