/**
 * Section Level Analytics - ComplianceIQ
 * Detailed section-level insights and analytics using seeded Gilead data
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Users,
  FileText,
  Shield,
  Brain,
  Target,
  Award,
  Lightbulb,
  ExternalLink,
  RefreshCw,
  Download,
  Eye,
  Edit,
  PlayCircle,
  PauseCircle,
  XCircle
} from 'lucide-react';

interface SectionAnalytics {
  sectionTitle: string;
  isCritical: boolean;
  totalAssessments: number;
  completedAssessments: number;
  failedAssessments: number;
  inProgressAssessments: number;
  averageScore: number;
  completionRate: number;
  criticalGaps: Array<{
    gap: string;
    severity: string;
    count: number;
    impact: string;
    recommendations: string[];
  }>;
  successFactors: string[];
  regulatoryRequirements: string[];
  teamMembers: Array<{
    role: string;
    responsibility: string;
    status: string;
  }>;
  timeline: Array<{
    phase: string;
    status: string;
    date: string;
  }>;
}

interface SectionLevelAnalyticsProps {
  companyId?: string;
  dateRange?: string;
}

const SectionLevelAnalytics: React.FC<SectionLevelAnalyticsProps> = ({
  companyId,
  dateRange = '30d'
}) => {
  const [sectionData, setSectionData] = useState<Record<string, SectionAnalytics> | null>(null);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<string>('dataObservability');
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    loadSectionAnalytics();
  }, [companyId, dateRange]);

  const loadSectionAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (companyId) params.set('companyId', companyId);
      params.set('dateRange', dateRange);

      const response = await fetch(`/api/analytics/section-details?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setSectionData(result.data.sectionAnalytics);
        setInsights(result.data.insights);
      }
    } catch (error) {
      console.error('Error loading section analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <PlayCircle className="h-4 w-4 text-blue-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading section-level analytics...</p>
        </div>
      </div>
    );
  }

  if (!sectionData || !insights) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Section Data</h3>
        <p className="text-gray-600">Unable to load section-level analytics. Please try again.</p>
      </div>
    );
  }

  const sections = Object.entries(sectionData);
  const currentSection = sectionData[selectedSection];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Section-Level Analytics</h2>
          <p className="text-gray-600">Detailed insights for each compliance section using Gilead data</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={loadSectionAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Section Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {sections.map(([key, section]) => (
          <Card 
            key={key} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedSection === key ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedSection(key)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {section.isCritical && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  <h3 className="font-semibold text-sm">{section.sectionTitle}</h3>
                </div>
                <Badge className={getSeverityColor(section.completionRate >= 90 ? 'low' : section.completionRate >= 70 ? 'medium' : 'high')}>
                  {section.completionRate}%
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Completed:</span>
                  <span className="font-medium text-green-600">{section.completedAssessments}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Failed:</span>
                  <span className="font-medium text-red-600">{section.failedAssessments}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>In Progress:</span>
                  <span className="font-medium text-blue-600">{section.inProgressAssessments}</span>
                </div>
                <Progress value={section.completionRate} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Section Details */}
      {currentSection && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {currentSection.isCritical && <AlertTriangle className="h-5 w-5 text-red-500" />}
                  <CardTitle className="text-xl">{currentSection.sectionTitle}</CardTitle>
                </div>
                <Badge className={getSeverityColor(currentSection.completionRate >= 90 ? 'low' : currentSection.completionRate >= 70 ? 'medium' : 'high')}>
                  {currentSection.completionRate}% Complete
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {currentSection.averageScore}% Avg Score
                </Badge>
                <Badge variant="outline">
                  {currentSection.totalAssessments} Assessments
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="gaps">Critical Gaps</TabsTrigger>
                <TabsTrigger value="team">Team Progress</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Assessment Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Assessment Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium">Completed</p>
                              <p className="text-sm text-gray-600">{currentSection.completedAssessments} assessments</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {Math.round((currentSection.completedAssessments / currentSection.totalAssessments) * 100)}%
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <PlayCircle className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium">In Progress</p>
                              <p className="text-sm text-gray-600">{currentSection.inProgressAssessments} assessments</p>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">
                            {Math.round((currentSection.inProgressAssessments / currentSection.totalAssessments) * 100)}%
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <XCircle className="h-5 w-5 text-red-600" />
                            <div>
                              <p className="font-medium">Failed</p>
                              <p className="text-sm text-gray-600">{currentSection.failedAssessments} assessments</p>
                            </div>
                          </div>
                          <Badge className="bg-red-100 text-red-800">
                            {Math.round((currentSection.failedAssessments / currentSection.totalAssessments) * 100)}%
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Success Factors */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Success Factors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {currentSection.successFactors.map((factor, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-green-800">{factor}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Critical Gaps Tab */}
              <TabsContent value="gaps" className="space-y-6">
                <div className="space-y-4">
                  {currentSection.criticalGaps.map((gap, index) => (
                    <Card key={index} className="border-l-4 border-l-red-500">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-2">{gap.gap}</h4>
                            <p className="text-gray-600 mb-3">{gap.impact}</p>
                            <div className="flex items-center space-x-4">
                              <Badge className={getSeverityColor(gap.severity)}>
                                {gap.severity} severity
                              </Badge>
                              <Badge variant="outline">
                                {gap.count} affected assessments
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h5 className="font-medium mb-3 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" />
                            Recommendations
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {gap.recommendations.map((rec, recIndex) => (
                              <div key={recIndex} className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                                <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-blue-800">{rec}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Team Progress Tab */}
              <TabsContent value="team" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentSection.teamMembers.map((member, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{member.role}</h4>
                            <p className="text-sm text-gray-600">{member.responsibility}</p>
                          </div>
                          <Badge className={getStatusColor(member.status)}>
                            {getStatusIcon(member.status)}
                            <span className="ml-1 capitalize">{member.status.replace('_', ' ')}</span>
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress:</span>
                            <span className="font-medium">
                              {member.status === 'completed' ? '100%' : 
                               member.status === 'in_progress' ? '65%' : 
                               member.status === 'pending' ? '0%' : '0%'}
                            </span>
                          </div>
                          <Progress 
                            value={member.status === 'completed' ? 100 : 
                                   member.status === 'in_progress' ? 65 : 0} 
                            className="h-2" 
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="space-y-6">
                <div className="space-y-4">
                  {currentSection.timeline.map((phase, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        phase.status === 'completed' ? 'bg-green-100 text-green-600' :
                        phase.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {getStatusIcon(phase.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{phase.phase}</h4>
                          <Badge className={getStatusColor(phase.status)}>
                            {phase.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {new Date(phase.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Regulatory Tab */}
              <TabsContent value="regulatory" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Regulatory Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentSection.regulatoryRequirements.map((requirement, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <FileText className="h-4 w-4 text-gray-600" />
                          <p className="text-sm font-medium">{requirement}</p>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Key Insights Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Key Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Findings */}
            <div>
              <h4 className="font-semibold mb-3">Key Findings</h4>
              <div className="space-y-3">
                {insights.keyFindings.map((finding: any, index: number) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <p className="font-medium text-sm mb-2">{finding.finding}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(finding.impact)}>
                        {finding.impact} impact
                      </Badge>
                      <Badge variant="outline">{finding.category}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-semibold mb-3">Priority Recommendations</h4>
              <div className="space-y-3">
                {insights.recommendations.slice(0, 3).map((rec: any, index: number) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <p className="font-medium text-sm mb-2">{rec.recommendation}</p>
                    <p className="text-xs text-gray-600 mb-2">{rec.estimatedImpact}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(rec.priority)}>
                        {rec.priority} priority
                      </Badge>
                      <Badge variant="outline">{rec.timeline}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SectionLevelAnalytics;
