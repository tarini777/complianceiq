/**
 * Analytics Dashboard - ComplianceIQ
 * Comprehensive analytics and reporting dashboard
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users, 
  Building2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Award,
  Brain,
  FileText,
  Download,
  RefreshCw,
  Filter,
  Calendar
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalAssessments: number;
    completedAssessments: number;
    inProgressAssessments: number;
    averageScore: number;
    averageCompletionTime: number;
    productionReadyRate: number;
  };
  scoring: {
    scoreDistribution: Array<{ range: string; count: number }>;
    scoreTrends: Array<{ month: string; averageScore: number; count: number }>;
    criticalGaps: Array<{ sectionTitle: string; count: number; severity: string }>;
    improvementAreas: Array<{ sectionTitle: string; averageScore: number; totalResponses: number }>;
  };
  sections: {
    sectionPerformance: Array<{ sectionTitle: string; completionRate: number; averageScore: number; isCritical: boolean }>;
    criticalSections: Array<{ sectionTitle: string; completionRate: number; averageScore: number }>;
    collaborationMetrics: any;
  };
  companies: {
    companyComparison: Array<{ companyName: string; averageScore: number; completionRate: number; industryType: string }>;
    industryBenchmarks: Array<{ industry: string; averageScore: number; totalAssessments: number; totalCompanies: number }>;
    topPerformers: Array<{ companyName: string; averageScore: number; completionRate: number }>;
  };
  personas: {
    personaPerformance: Array<{ persona: string; averageScore: number; completionRate: number; efficiency: number }>;
    expertiseGaps: Array<{ persona: string; gap: string; severity: string }>;
    collaborationEfficiency: any;
  };
  insights: {
    keyFindings: Array<{ finding: string; impact: string; category: string }>;
    recommendations: Array<{ recommendation: string; priority: string; category: string; estimatedImpact: string }>;
    riskFactors: Array<{ risk: string; severity: string; probability: number; impact: string }>;
    opportunities: Array<{ opportunity: string; potential: string; effort: string; impact: string }>;
  };
}

interface AnalyticsDashboardProps {
  companyId?: string;
  personaId?: string;
  assessmentId?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  companyId,
  personaId,
  assessmentId
}) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<string>('30d');
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    loadAnalytics();
  }, [companyId, personaId, assessmentId, dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (companyId) params.set('companyId', companyId);
      if (personaId) params.set('personaId', personaId);
      if (assessmentId) params.set('assessmentId', assessmentId);
      params.set('dateRange', dateRange);

      const response = await fetch(`/api/analytics/assessment?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setAnalyticsData(result.data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    // Export functionality would be implemented here
    console.log('Exporting analytics report...');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Data</h3>
        <p className="text-gray-600">Unable to load analytics data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive assessment analytics and insights</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalAssessments}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">{analyticsData.overview.completedAssessments} completed</span>
              </div>
              <div className="flex items-center text-sm mt-1">
                <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-yellow-600">{analyticsData.overview.inProgressAssessments} in progress</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.averageScore}%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${analyticsData.overview.averageScore}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Production Ready</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.productionReadyRate}%</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${analyticsData.overview.productionReadyRate}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Completion Time</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.averageCompletionTime}h</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">12% faster than last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scoring">Scoring</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="personas">Personas</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Score Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.scoring.scoreDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.range}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(item.count / analyticsData.overview.totalAssessments) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Top Performing Companies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.companies.topPerformers.map((company, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{company.companyName}</p>
                          <p className="text-sm text-gray-600">{company.completionRate}% completion</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{company.averageScore}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Scoring Tab */}
        <TabsContent value="scoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Critical Gaps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Gaps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.scoring.criticalGaps.slice(0, 5).map((gap, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{gap.sectionTitle}</p>
                        <p className="text-sm text-gray-600">{gap.count} instances</p>
                      </div>
                      <Badge variant={gap.severity === 'high' ? 'destructive' : 'secondary'}>
                        {gap.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Improvement Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Improvement Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.scoring.improvementAreas.slice(0, 5).map((area, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{area.sectionTitle}</p>
                        <p className="text-sm text-gray-600">{area.totalResponses} responses</p>
                      </div>
                      <Badge variant="outline">{area.averageScore}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sections Tab */}
        <TabsContent value="sections" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Section Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Section Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.sections.sectionPerformance.slice(0, 8).map((section, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {section.isCritical && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        <div>
                          <p className="font-medium">{section.sectionTitle}</p>
                          <p className="text-sm text-gray-600">{section.completionRate}% completion</p>
                        </div>
                      </div>
                      <Badge variant="outline">{section.averageScore}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Critical Sections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Sections Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.sections.criticalSections.map((section, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{section.sectionTitle}</p>
                        <p className="text-sm text-gray-600">{section.completionRate}% completion</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={section.completionRate >= 90 ? 'default' : 'destructive'}>
                          {section.averageScore}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Companies Tab */}
        <TabsContent value="companies" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Company Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.companies.companyComparison.map((company, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{company.companyName}</p>
                        <p className="text-sm text-gray-600">{company.industryType}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{company.averageScore}%</Badge>
                        <p className="text-sm text-gray-600">{company.completionRate}% completion</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Industry Benchmarks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Industry Benchmarks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.companies.industryBenchmarks.map((benchmark, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{benchmark.industry}</p>
                        <p className="text-sm text-gray-600">{benchmark.totalCompanies} companies</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{benchmark.averageScore}%</Badge>
                        <p className="text-sm text-gray-600">{benchmark.totalAssessments} assessments</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Personas Tab */}
        <TabsContent value="personas" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Persona Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Persona Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.personas.personaPerformance.map((persona, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{persona.persona}</p>
                        <p className="text-sm text-gray-600">{persona.completionRate}% completion</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{persona.averageScore}%</Badge>
                        <p className="text-sm text-gray-600">{persona.efficiency}% efficiency</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Expertise Gaps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Expertise Gaps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.personas.expertiseGaps.map((gap, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{gap.persona}</p>
                        <p className="text-sm text-gray-600">{gap.gap}</p>
                      </div>
                      <Badge variant={gap.severity === 'high' ? 'destructive' : 'secondary'}>
                        {gap.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Findings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Key Findings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.insights.keyFindings.map((finding, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="font-medium">{finding.finding}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={finding.impact === 'high' ? 'destructive' : 'secondary'}>
                          {finding.impact}
                        </Badge>
                        <Badge variant="outline">{finding.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.insights.recommendations.map((rec, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="font-medium">{rec.recommendation}</p>
                      <p className="text-sm text-gray-600 mt-1">{rec.estimatedImpact}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                          {rec.priority}
                        </Badge>
                        <Badge variant="outline">{rec.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Factors and Opportunities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.insights.riskFactors.map((risk, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="font-medium">{risk.risk}</p>
                      <p className="text-sm text-gray-600 mt-1">{risk.impact}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={risk.severity === 'high' ? 'destructive' : 'secondary'}>
                          {risk.severity}
                        </Badge>
                        <Badge variant="outline">{Math.round(risk.probability * 100)}% probability</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.insights.opportunities.map((opp, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="font-medium">{opp.opportunity}</p>
                      <p className="text-sm text-gray-600 mt-1">{opp.impact}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={opp.potential === 'high' ? 'default' : 'secondary'}>
                          {opp.potential} potential
                        </Badge>
                        <Badge variant="outline">{opp.effort} effort</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
