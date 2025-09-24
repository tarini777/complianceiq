'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  Target,
  Eye,
  Play,
  RefreshCw,
  Download,
  Search,
  Brain,
  Lightbulb,
  Shield,
  Zap
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

interface SectionData {
  id: string;
  title: string;
  category: string;
  performanceLevel: string;
  score: number;
  completionRate: number;
  totalAssessments: number;
  assessments: {
    completed: number;
    inProgress: number;
    failed: number;
    pending: number;
  };
  criticalGaps: number;
  priority: string;
}

interface AIInsights {
  keyFindings: Array<{
    finding: string;
    impact: string;
    category: string;
    confidence?: number;
    details?: string;
  }>;
  recommendations: Array<{
    recommendation: string;
    priority: string;
    category: string;
    estimatedImpact: string;
    confidence?: number;
    timeframe?: string;
    details?: string;
  }>;
  riskFactors: Array<{
    risk: string;
    severity: string;
    probability: number;
    impact: string;
    confidence?: number;
    details?: string;
    mitigation?: string;
  }>;
  opportunities: Array<{
    opportunity: string;
    potential: string;
    effort: string;
    impact: string;
    confidence?: number;
    timeframe?: string;
    details?: string;
    roi?: string;
  }>;
}

const RemediationDashboard: React.FC = () => {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPerformance, setFilterPerformance] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchSections();
    fetchAIInsights();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/remediation/sections');
      const result = await response.json();
      
      if (result.success) {
        setSections(result.data);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIInsights = async () => {
    try {
      setInsightsLoading(true);
      const response = await fetch('/api/analytics/assessment');
      const result = await response.json();
      
      if (result.success && result.data.insights) {
        setAiInsights(result.data.insights);
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error);
    } finally {
      setInsightsLoading(false);
    }
  };

  const getPerformanceColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'average': return 'text-yellow-600 bg-yellow-100';
      case 'needs-improvement': return 'text-orange-600 bg-orange-100';
      case 'critical-gap': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (level: string) => {
    switch (level) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'average': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'needs-improvement': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'critical-gap': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredSections = sections.filter(section => {
    const matchesSearch = section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || section.category === filterCategory;
    const matchesPerformance = filterPerformance === 'all' || section.performanceLevel === filterPerformance;
    
    return matchesSearch && matchesCategory && matchesPerformance;
  });

  const sortedSections = [...filteredSections].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
      case 'score':
        return b.score - a.score;
      case 'assessments':
        return b.totalAssessments - a.totalAssessments;
      case 'gaps':
        return b.criticalGaps - a.criticalGaps;
      default:
        return 0;
    }
  });

  const getOverallStats = () => {
    const totalSections = sections.length;
    const criticalGaps = sections.filter(s => s.performanceLevel === 'critical-gap').length;
    const excellentSections = sections.filter(s => s.performanceLevel === 'excellent').length;
    const totalAssessments = sections.reduce((sum, s) => sum + s.totalAssessments, 0);
    const avgScore = sections.length > 0 ? Math.round(sections.reduce((sum, s) => sum + s.score, 0) / sections.length) : 0;

    return { totalSections, criticalGaps, excellentSections, totalAssessments, avgScore };
  };

  const stats = getOverallStats();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading remediation dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Remediation Command Center</h1>
          <p className="text-gray-600 mt-2">Comprehensive compliance remediation across all 26 sections</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm" onClick={() => { fetchSections(); fetchAIInsights(); }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="plans">Remediation Plans</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sections</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSections}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Gaps</p>
                <p className="text-2xl font-bold text-red-600">{stats.criticalGaps}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Excellent Sections</p>
                <p className="text-2xl font-bold text-green-600">{stats.excellentSections}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAssessments}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgScore}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
          </div>

          {/* Filters and Search */}
          <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search sections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPerformance} onValueChange={setFilterPerformance}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by performance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Performance</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="average">Average</SelectItem>
                <SelectItem value="needs-improvement">Needs Improvement</SelectItem>
                <SelectItem value="critical-gap">Critical Gap</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="score">Score</SelectItem>
                <SelectItem value="assessments">Assessments</SelectItem>
                <SelectItem value="gaps">Critical Gaps</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
          </Card>

          {/* Sections Table */}
          <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Section Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Section</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Assessments</TableHead>
                  <TableHead>Critical Gaps</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSections.map((section) => (
                  <TableRow key={section.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{section.title}</div>
                        <div className="text-sm text-gray-500">{section.id}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(section.performanceLevel)}
                        <Badge className={getPerformanceColor(section.performanceLevel)}>
                          {section.performanceLevel.replace('-', ' ')}
                        </Badge>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{section.score}%</span>
                        <Progress value={section.score} className="w-16 h-2" />
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{section.completionRate}%</span>
                        <Progress value={section.completionRate} className="w-16 h-2" />
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            {section.assessments.completed}✓
                          </Badge>
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            {section.assessments.inProgress}⏳
                          </Badge>
                          <Badge variant="outline" className="text-red-600 border-red-600">
                            {section.assessments.failed}✗
                          </Badge>
                        </div>
                        <div className="text-gray-500 mt-1">Total: {section.totalAssessments}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant={section.criticalGaps > 0 ? "destructive" : "secondary"}
                        className={section.criticalGaps > 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                      >
                        {section.criticalGaps} gaps
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getPriorityColor(section.priority)}>
                        {section.priority}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex gap-1">
                        <Link href={`/remediation/${section.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        {section.performanceLevel === 'critical-gap' && (
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            <Play className="h-4 w-4 mr-1" />
                            Remediate
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          {insightsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Loading AI insights...</p>
              </div>
            </div>
          ) : aiInsights ? (
            <div className="space-y-6">
              {/* Key Findings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    Key Findings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiInsights.keyFindings.map((finding, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{finding.finding}</h4>
                        <Badge className={getImpactColor(finding.impact)}>
                          {finding.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{finding.details}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Category: {finding.category}</span>
                        {finding.confidence && <span>Confidence: {finding.confidence}%</span>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiInsights.recommendations.map((rec, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{rec.recommendation}</h4>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority}
                          </Badge>
                          {rec.timeframe && (
                            <Badge variant="outline">
                              {rec.timeframe}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rec.estimatedImpact}</p>
                      <p className="text-sm text-gray-500 mb-2">{rec.details}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Category: {rec.category}</span>
                        {rec.confidence && <span>Confidence: {rec.confidence}%</span>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Risk Factors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiInsights.riskFactors.map((risk, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{risk.risk}</h4>
                        <div className="flex gap-2">
                          <Badge className={getSeverityColor(risk.severity)}>
                            {risk.severity}
                          </Badge>
                          <Badge variant="outline">
                            {(risk.probability * 100).toFixed(0)}% probability
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{risk.impact}</p>
                      <p className="text-sm text-gray-500 mb-2">{risk.details}</p>
                      {risk.mitigation && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                          <strong>Mitigation:</strong> {risk.mitigation}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                        {risk.confidence && <span>Confidence: {risk.confidence}%</span>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Opportunities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiInsights.opportunities.map((opp, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{opp.opportunity}</h4>
                        <div className="flex gap-2">
                          <Badge className={getImpactColor(opp.potential)}>
                            {opp.potential} potential
                          </Badge>
                          <Badge variant="outline">
                            {opp.effort} effort
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{opp.impact}</p>
                      <p className="text-sm text-gray-500 mb-2">{opp.details}</p>
                      {opp.roi && (
                        <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                          <strong>ROI:</strong> {opp.roi}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                        {opp.timeframe && <span>Timeframe: {opp.timeframe}</span>}
                        {opp.confidence && <span>Confidence: {opp.confidence}%</span>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No AI Insights Available</h3>
                <p className="text-gray-600">Unable to load AI insights. Please try refreshing the data.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Sections Tab */}
        <TabsContent value="sections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                All Sections Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Section</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Completion</TableHead>
                      <TableHead>Assessments</TableHead>
                      <TableHead>Critical Gaps</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedSections.map((section) => (
                      <TableRow key={section.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{section.title}</div>
                            <div className="text-sm text-gray-500">{section.id}</div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(section.performanceLevel)}
                            <Badge className={getPerformanceColor(section.performanceLevel)}>
                              {section.performanceLevel.replace('-', ' ')}
                            </Badge>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{section.score}%</span>
                            <Progress value={section.score} className="w-16 h-2" />
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{section.completionRate}%</span>
                            <Progress value={section.completionRate} className="w-16 h-2" />
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex gap-1">
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                {section.assessments.completed}✓
                              </Badge>
                              <Badge variant="outline" className="text-blue-600 border-blue-600">
                                {section.assessments.inProgress}⏳
                              </Badge>
                              <Badge variant="outline" className="text-red-600 border-red-600">
                                {section.assessments.failed}✗
                              </Badge>
                            </div>
                            <div className="text-gray-500 mt-1">Total: {section.totalAssessments}</div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge 
                            variant={section.criticalGaps > 0 ? "destructive" : "secondary"}
                            className={section.criticalGaps > 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                          >
                            {section.criticalGaps} gaps
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <Badge className={getPriorityColor(section.priority)}>
                            {section.priority}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex gap-1">
                            <Link href={`/remediation/${section.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>
                            {section.performanceLevel === 'critical-gap' && (
                              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                                <Play className="h-4 w-4 mr-1" />
                                Remediate
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Remediation Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          {/* Priority Remediation Plans */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* High Priority Plans */}
          <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  High Priority Plans
                </CardTitle>
                <CardDescription>
                  Critical sections requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sections
                  .filter(s => s.priority === 'high' && s.performanceLevel === 'critical-gap')
                  .slice(0, 3)
                  .map((section) => (
                    <div key={section.id} className="p-4 border-l-4 border-l-red-500 bg-red-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-red-900">{section.title}</h4>
                        <Badge className="bg-red-100 text-red-800">
                          {section.score}% Score
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-red-700">
                          <strong>Critical Issues:</strong> {section.criticalGaps} gaps identified
                        </p>
                        <p className="text-red-600">
                          <strong>Impact:</strong> Regulatory non-compliance risk
                        </p>
                        <div className="bg-white p-3 rounded border">
                          <p className="font-medium text-gray-900 mb-2">Immediate Actions:</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            <li>Conduct urgent compliance review</li>
                            <li>Implement missing controls within 30 days</li>
                            <li>Assign dedicated remediation team</li>
                            <li>Schedule weekly progress reviews</li>
                          </ul>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-red-600 font-medium">Timeline: 30 days</span>
                          <Link href={`/remediation/${section.id}`}>
                            <Button size="sm" variant="destructive">
                              <Play className="h-3 w-3 mr-1" />
                              Start Plan
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Medium Priority Plans */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  Medium Priority Plans
                </CardTitle>
                <CardDescription>
                  Sections needing improvement over next 60-90 days
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sections
                  .filter(s => s.priority === 'medium' && s.performanceLevel === 'needs-improvement')
                  .slice(0, 3)
                  .map((section) => (
                    <div key={section.id} className="p-4 border-l-4 border-l-yellow-500 bg-yellow-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-yellow-900">{section.title}</h4>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          {section.score}% Score
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-yellow-700">
                          <strong>Improvement Areas:</strong> {section.criticalGaps} areas identified
                        </p>
                        <p className="text-yellow-600">
                          <strong>Impact:</strong> Performance optimization opportunity
                        </p>
                        <div className="bg-white p-3 rounded border">
                          <p className="font-medium text-gray-900 mb-2">Planned Actions:</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            <li>Review current procedures and documentation</li>
                            <li>Update policies and training materials</li>
                            <li>Implement enhanced monitoring</li>
                            <li>Validate improvements through testing</li>
                          </ul>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-yellow-600 font-medium">Timeline: 60-90 days</span>
                          <Link href={`/remediation/${section.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              Review Plan
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>

          {/* AI-Generated Recommendations */}
          {aiInsights && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI-Generated Remediation Recommendations
                </CardTitle>
                <CardDescription>
                  Intelligent recommendations based on assessment data analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiInsights.recommendations.slice(0, 5).map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{rec.recommendation}</h4>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                        {rec.confidence && (
                          <Badge variant="outline">
                            {rec.confidence}% confidence
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{rec.estimatedImpact}</p>
                    <p className="text-xs text-gray-500 mb-3">{rec.details}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Category: {rec.category}</span>
                        {rec.timeframe && <span>Timeframe: {rec.timeframe}</span>}
                      </div>
                      <Button size="sm" variant="outline">
                        <Play className="h-3 w-3 mr-1" />
                        Implement
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Section-Specific Remediation Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Section-Specific Remediation Plans
              </CardTitle>
              <CardDescription>
                Detailed remediation plans for each assessment section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sections
                  .filter(s => s.performanceLevel === 'critical-gap' || s.performanceLevel === 'needs-improvement')
                  .map((section) => (
                    <Card key={section.id} className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">{section.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getPerformanceColor(section.performanceLevel)}>
                            {section.performanceLevel.replace('-', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(section.priority)}>
                            {section.priority}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Current Score</span>
                            <span className="font-bold">{section.score}%</span>
                          </div>
                          <Progress value={section.score} className="h-2" />
                          
                          <div className="text-sm space-y-1">
                            <p><strong>Target:</strong> 85% compliance</p>
                            <p><strong>Gap:</strong> {85 - section.score} points</p>
                            <p><strong>Timeline:</strong> {section.priority === 'high' ? '30' : section.priority === 'medium' ? '60' : '90'} days</p>
                          </div>

                          <div className="pt-2 border-t">
                            <p className="text-xs font-medium text-gray-700 mb-2">Key Actions:</p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              <li>• Review compliance requirements</li>
                              <li>• Update documentation and procedures</li>
                              <li>• Implement monitoring controls</li>
                              <li>• Validate effectiveness</li>
                            </ul>
                          </div>

                          <Link href={`/remediation/${section.id}`}>
                            <Button size="sm" className="w-full mt-3">
                              <Play className="h-3 w-3 mr-1" />
                              Execute Plan
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RemediationDashboard;
