'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Search,
  Download,
  Eye,
  BarChart3,
  Globe,
  Building,
  Zap
} from 'lucide-react';

interface RegulatoryRequirement {
  id: string;
  title: string;
  authority: string;
  jurisdiction: string;
  category: string;
  effectiveDate: string;
  status: 'Active' | 'Superseded' | 'Draft';
  requirements: string[];
  penalties: string[];
  assessmentSections: string[];
  coverage: {
    total: number;
    covered: number;
    percentage: number;
  };
}

interface AssessmentSection {
  id: string;
  name: string;
  description: string;
  category: string;
  questionCount: number;
  regulatoryRequirements: string[];
  coverage: {
    total: number;
    covered: number;
    percentage: number;
  };
  status: 'Complete' | 'Partial' | 'Missing';
}

interface ComplianceMapping {
  assessmentSections: AssessmentSection[];
  regulatoryRequirements: RegulatoryRequirement[];
  coverageMatrix: {
    [sectionId: string]: {
      [requirementId: string]: {
        coverage: number;
        questions: string[];
        gaps: string[];
      };
    };
  };
  gapAnalysis: {
    uncoveredRequirements: string[];
    missingSections: string[];
    recommendations: string[];
  };
  regulatoryImpactAnalysis?: {
    highRiskRegulations?: Array<{
      id: string;
      title: string;
      impactScore: number;
      complianceDeadline: string;
      penalties: string;
      criticalGaps: string[];
    }>;
    complianceTimeline?: Array<{
      phase: string;
      deadline: string;
      status: string;
      requirements: string[];
      priority: string;
      actions: string[];
    }>;
  };
  complianceScoring?: {
    overallScore: number;
    benchmarkComparison?: {
      industryAverage: number;
      topPerformers: number;
      ourPosition: string;
    };
    scoreBreakdown?: {
      [key: string]: number;
    };
    scoreTrends?: {
      lastMonth: number;
      lastQuarter: number;
      lastYear: number;
      trend: string;
    };
  };
}

export default function ComplianceMappingDashboard() {
  const [mapping, setMapping] = useState<ComplianceMapping | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedRequirement, setSelectedRequirement] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchComplianceMapping();
  }, []);

  const fetchComplianceMapping = async () => {
    try {
      const response = await fetch('/api/regulatory/compliance-mapping');
      const result = await response.json();
      
      if (result.success) {
        setMapping(result.data);
      }
    } catch (error) {
      console.error('Error fetching compliance mapping:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCoverageColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Complete': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Partial': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'Missing': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredSections = mapping?.assessmentSections.filter(section => {
    const matchesSearch = section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || section.category === filterCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const filteredRequirements = mapping?.regulatoryRequirements.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.authority.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || req.category === filterCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-compliance-900">Compliance Mapping Dashboard</h1>
          <p className="text-compliance-600 mt-1">
            Comprehensive mapping between assessment sections and regulatory requirements
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Gap Analysis
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search sections or requirements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-full"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Categories</option>
          <option value="Data Management">Data Management</option>
          <option value="AI/ML">AI/ML</option>
          <option value="Regulatory">Regulatory</option>
          <option value="Clinical">Clinical</option>
          <option value="Quality">Quality</option>
        </select>
      </div>

      {/* Coverage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sections</p>
                <p className="text-2xl font-bold">{mapping?.assessmentSections.length || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Regulatory Requirements</p>
                <p className="text-2xl font-bold">{mapping?.regulatoryRequirements.length || 0}</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Coverage Rate</p>
                <p className="text-2xl font-bold">
                  {mapping ? Math.round(
                    mapping.assessmentSections.reduce((acc, section) => acc + section.coverage.percentage, 0) / 
                    mapping.assessmentSections.length
                  ) : 0}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gaps Identified</p>
                <p className="text-2xl font-bold">{mapping?.gapAnalysis.uncoveredRequirements.length || 0}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="sections" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="sections">Assessment Sections</TabsTrigger>
          <TabsTrigger value="requirements">Regulatory Requirements</TabsTrigger>
          <TabsTrigger value="mapping">Coverage Matrix</TabsTrigger>
          <TabsTrigger value="gaps">Gap Analysis</TabsTrigger>
          <TabsTrigger value="impact">Risk Analysis</TabsTrigger>
          <TabsTrigger value="scoring">Compliance Scoring</TabsTrigger>
        </TabsList>

        {/* Assessment Sections Tab */}
        <TabsContent value="sections" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredSections.map((section) => (
              <Card key={section.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{section.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(section.status)}
                      <Badge variant="outline">{section.category}</Badge>
                    </div>
                  </div>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Questions</span>
                      <span className="font-medium">{section.questionCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Regulatory Coverage</span>
                      <span className="font-medium">{section.regulatoryRequirements.length} requirements</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Coverage</span>
                        <span className={`text-sm font-medium px-2 py-1 rounded ${getCoverageColor(section.coverage.percentage)}`}>
                          {section.coverage.percentage}%
                        </span>
                      </div>
                      <Progress value={section.coverage.percentage} className="h-2" />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setSelectedSection(section.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Regulatory Requirements Tab */}
        <TabsContent value="requirements" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredRequirements.map((requirement) => (
              <Card key={requirement.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{requirement.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{requirement.authority}</Badge>
                      <Badge variant="secondary">{requirement.jurisdiction}</Badge>
                    </div>
                  </div>
                  <CardDescription>
                    Effective: {new Date(requirement.effectiveDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Category</span>
                      <Badge variant="outline">{requirement.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <Badge 
                        variant={requirement.status === 'Active' ? 'default' : 'secondary'}
                      >
                        {requirement.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Assessment Sections</span>
                      <span className="font-medium">{requirement.assessmentSections.length}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Coverage</span>
                        <span className={`text-sm font-medium px-2 py-1 rounded ${getCoverageColor(requirement.coverage.percentage)}`}>
                          {requirement.coverage.percentage}%
                        </span>
                      </div>
                      <Progress value={requirement.coverage.percentage} className="h-2" />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setSelectedRequirement(requirement.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Mapping
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Coverage Matrix Tab */}
        <TabsContent value="mapping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Coverage Matrix</CardTitle>
              <CardDescription>
                Detailed mapping between assessment sections and regulatory requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Assessment Section</th>
                      <th className="text-left p-2">Regulatory Requirement</th>
                      <th className="text-left p-2">Coverage</th>
                      <th className="text-left p-2">Questions</th>
                      <th className="text-left p-2">Gaps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mapping && Object.entries(mapping.coverageMatrix).map(([sectionId, requirements]) => {
                      const section = mapping.assessmentSections.find(s => s.id === sectionId);
                      return Object.entries(requirements).map(([requirementId, coverageData]) => {
                        const requirement = mapping.regulatoryRequirements.find(r => r.id === requirementId);
                        return (
                          <tr key={`${sectionId}-${requirementId}`} className="border-b">
                            <td className="p-2">{section?.name}</td>
                            <td className="p-2">{requirement?.title}</td>
                            <td className="p-2">
                              <div className="flex items-center space-x-2">
                                <Progress value={coverageData.coverage} className="w-16 h-2" />
                                <span className="text-sm">{coverageData.coverage}%</span>
                              </div>
                            </td>
                            <td className="p-2">{coverageData.questions.length}</td>
                            <td className="p-2">
                              {coverageData.gaps.length > 0 ? (
                                <Badge variant="destructive">{coverageData.gaps.length}</Badge>
                              ) : (
                                <Badge variant="default">None</Badge>
                              )}
                            </td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gap Analysis Tab */}
        <TabsContent value="gaps" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <span>Uncovered Requirements</span>
                </CardTitle>
                <CardDescription>
                  Regulatory requirements with insufficient assessment coverage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mapping?.gapAnalysis.uncoveredRequirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">{requirement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span>Missing Sections</span>
                </CardTitle>
                <CardDescription>
                  Assessment sections that need to be added
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mapping?.gapAnalysis.missingSections.map((section, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{section}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-purple-500" />
                  <span>Recommendations</span>
                </CardTitle>
                <CardDescription>
                  Actionable recommendations to improve compliance coverage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mapping?.gapAnalysis.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 border rounded">
                      <Zap className="h-4 w-4 text-purple-500 mt-0.5" />
                      <span className="text-sm">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="impact" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* High Risk Regulations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span>High Risk Regulations</span>
                </CardTitle>
                <CardDescription>Critical regulations requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mapping?.regulatoryImpactAnalysis?.highRiskRegulations?.map((regulation) => (
                    <div key={regulation.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-red-900">{regulation.title}</h4>
                        <Badge variant="destructive">High Risk</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><strong>Impact Score:</strong> {regulation.impactScore}/100</p>
                        <p><strong>Deadline:</strong> {regulation.complianceDeadline}</p>
                        <p><strong>Penalties:</strong> {regulation.penalties}</p>
                        <div>
                          <strong>Critical Gaps:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {regulation.criticalGaps.map((gap, index) => (
                              <li key={index} className="text-red-700">{gap}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Compliance Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  <span>Compliance Timeline</span>
                </CardTitle>
                <CardDescription>Recommended implementation phases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mapping?.regulatoryImpactAnalysis?.complianceTimeline?.map((phase, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{phase.phase}</h4>
                        <Badge variant={phase.priority === 'Critical' ? 'destructive' : phase.priority === 'High' ? 'default' : 'secondary'}>
                          {phase.priority}
                        </Badge>
                      </div>
                      <ul className="space-y-1">
                        {phase.actions.map((action, actionIndex) => (
                          <li key={actionIndex} className="text-sm flex items-start space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Scoring Tab */}
        <TabsContent value="scoring" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overall Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  <span>Overall Compliance Score</span>
                </CardTitle>
                <CardDescription>Current compliance performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-green-600">
                    {mapping?.complianceScoring?.overallScore}%
                  </div>
                  <Progress value={mapping?.complianceScoring?.overallScore || 0} className="h-3" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Industry Avg: {mapping?.complianceScoring?.benchmarkComparison?.industryAverage}%</span>
                    <span>Top Performers: {mapping?.complianceScoring?.benchmarkComparison?.topPerformers}%</span>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {mapping?.complianceScoring?.benchmarkComparison?.ourPosition?.replace('_', ' ')}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Score Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span>Score Breakdown by Category</span>
                </CardTitle>
                <CardDescription>Performance across different compliance areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mapping?.complianceScoring?.scoreBreakdown && Object.entries(mapping.complianceScoring.scoreBreakdown).map(([category, score]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="font-semibold">{score}%</span>
                      </div>
                      <Progress value={score as number} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Score Trends */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  <span>Score Trends & Benchmarking</span>
                </CardTitle>
                <CardDescription>Historical performance and industry comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {mapping?.complianceScoring?.scoreTrends?.lastMonth}%
                    </div>
                    <p className="text-sm text-gray-600">Last Month</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {mapping?.complianceScoring?.scoreTrends?.lastQuarter}%
                    </div>
                    <p className="text-sm text-gray-600">Last Quarter</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {mapping?.complianceScoring?.scoreTrends?.lastYear}%
                    </div>
                    <p className="text-sm text-gray-600">Last Year</p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Badge variant="outline" className="capitalize">
                    Trend: {mapping?.complianceScoring?.scoreTrends?.trend}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
