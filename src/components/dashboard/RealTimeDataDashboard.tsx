/**
 * Real-Time Data Dashboard Component
 * Shows live data from database with enhanced UX
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  Users,
  BarChart3,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  RefreshCw,
  Zap,
  Target
} from 'lucide-react';

interface RealTimeData {
  overview: {
    totalAssessments: number;
    activeAssessments: number;
    avgComplianceScore: string;
    criticalIssues: number;
  };
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
  recentAssessments: Array<{
    id: string;
    companyName: string;
    assessmentName: string;
    date: string;
    score: number;
    status: string;
  }>;
}

interface RealTimeDataDashboardProps {
  className?: string;
}

export default function RealTimeDataDashboard({ className = '' }: RealTimeDataDashboardProps) {
  const [data, setData] = useState<RealTimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch('/api/dashboard/intelligence');
      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching real-time data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No real-time data available</p>
          <Button onClick={() => fetchData()} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Real-Time Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Database className="h-6 w-6 text-blue-600" />
            Real-Time Analytics Dashboard
          </h2>
          <p className="text-gray-600 mt-1">
            Live data from database • Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Live Data
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchData(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data.overview.totalAssessments}</div>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <Database className="h-3 w-3" />
              From live database
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assessments</CardTitle>
            <Activity className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{data.overview.activeAssessments}</div>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Compliance Score</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.overview.avgComplianceScore}</div>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Real-time calculation
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.overview.criticalIssues}</div>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Intelligence Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Persona Performance
            </CardTitle>
            <CardDescription>Real-time completion rates by user persona</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.intelligence.personaInsights.map((persona, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{persona.persona}</span>
                  <Badge variant="secondary">{persona.completionRate}%</Badge>
                </div>
                <Progress value={persona.completionRate} className="h-2" />
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Avg Score: {persona.avgScore}%</span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    +{persona.improvement}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Critical Blockers
            </CardTitle>
            <CardDescription>Sections requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.intelligence.criticalBlockers.map((blocker, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{blocker.section}</p>
                  <p className="text-xs text-gray-600">{blocker.count} issues found</p>
                </div>
                <Badge className={getImpactColor(blocker.impact)}>
                  {blocker.impact}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Assessment Activity
          </CardTitle>
          <CardDescription>Latest assessments from the database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recentAssessments.map((assessment, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{assessment.companyName}</p>
                  <p className="text-sm text-gray-600">{assessment.assessmentName}</p>
                  <p className="text-xs text-gray-500">{assessment.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{assessment.score}%</p>
                  <Badge 
                    className={assessment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  >
                    {assessment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completion Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getTrendIcon(data.intelligence.trendAnalysis.trend)}
            Completion Trend
          </CardTitle>
          <CardDescription>Assessment completion rate over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {data.intelligence.completionRate}%
              </div>
              <p className="text-sm text-gray-600">Current completion rate</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm font-medium">Last Month</p>
                <p className="text-lg font-bold">{data.intelligence.trendAnalysis.lastMonth}%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Quarter</p>
                <p className="text-lg font-bold">{data.intelligence.trendAnalysis.lastQuarter}%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Trend</p>
                <div className="flex items-center justify-center">
                  {getTrendIcon(data.intelligence.trendAnalysis.trend)}
                  <span className="ml-1 capitalize">{data.intelligence.trendAnalysis.trend}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
