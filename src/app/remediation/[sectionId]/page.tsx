'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  ArrowLeft,
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  Target,
  FileText,
  BookOpen,
  Brain,
  Calendar,
  Play,
  Pause,
  RefreshCw,
  Download,
  Eye,
  ExternalLink,
  User,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

interface SectionDetailData {
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
  assessmentsList: any[];
  criticalGaps: any[];
  successFactors: any[];
  regulatoryRequirements: any[];
  teamMembers: any[];
  timeline: any[];
  insights: any;
}

const SectionDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const sectionId = params?.sectionId as string;
  
  const [sectionData, setSectionData] = useState<SectionDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assessments');
  const [focusedAssessmentId, setFocusedAssessmentId] = useState<string | null>(null);

  useEffect(() => {
    if (sectionId) {
      fetchSectionData();
      
      // Check for URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const assessmentId = urlParams.get('assessmentId');
      const tab = urlParams.get('tab');
      
      if (assessmentId) {
        setFocusedAssessmentId(assessmentId);
      }
      
      if (tab) {
        setActiveTab(tab);
      }
    }
  }, [sectionId]);

  const fetchSectionData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/remediation/sections?sectionId=${sectionId}`);
      const result = await response.json();
      
      if (result.success) {
        setSectionData(result.data);
      }
    } catch (error) {
      console.error('Error fetching section data:', error);
    } finally {
      setLoading(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading section details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!sectionData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Section Not Found</h2>
          <p className="text-gray-600 mb-4">The requested section could not be found.</p>
          <Link href="/remediation">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/remediation">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{sectionData.title}</h1>
            <p className="text-gray-600 mt-1">Section ID: {sectionData.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Section Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Performance</p>
                <Badge className={getPerformanceColor(sectionData.performanceLevel)}>
                  {sectionData.performanceLevel.replace('-', ' ')}
                </Badge>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Score</p>
                <p className="text-2xl font-bold text-gray-900">{sectionData.score}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion</p>
                <p className="text-2xl font-bold text-gray-900">{sectionData.completionRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Gaps</p>
                <p className="text-2xl font-bold text-red-600">{sectionData.criticalGaps.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="rules">Rules & Citations</TabsTrigger>
          <TabsTrigger value="remediation">Remediation Plan</TabsTrigger>
          <TabsTrigger value="team">Team Matrix</TabsTrigger>
          <TabsTrigger value="ai">AI Insights</TabsTrigger>
        </TabsList>

        {/* Tab 1: Assessment Consolidation */}
        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Assessment Consolidation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assessment ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Completion</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sectionData.assessmentsList.map((assessment) => (
                      <TableRow 
                        key={assessment.id}
                        className={focusedAssessmentId === assessment.id ? 'bg-blue-50 border-blue-200' : ''}
                      >
                        <TableCell className="font-mono text-sm">
                          {assessment.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell className="font-medium">
                          {assessment.assessmentName}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(assessment.status)}>
                            {assessment.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{assessment.currentScore || 0}%</span>
                            <Progress value={assessment.currentScore || 0} className="w-16 h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {assessment.status === 'completed' ? 100 : 
                               assessment.status === 'in_progress' ? 65 : 
                               assessment.status === 'failed' ? 30 : 0}%
                            </span>
                            <Progress 
                              value={assessment.status === 'completed' ? 100 : 
                                     assessment.status === 'in_progress' ? 65 : 
                                     assessment.status === 'failed' ? 30 : 0} 
                              className="w-16 h-2" 
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(assessment.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                // Store assessment data in session storage for the assessment-complete page
                                const assessmentData = {
                                  id: assessment.id,
                                  name: assessment.assessmentName,
                                  status: assessment.status,
                                  score: assessment.currentScore || 0,
                                  createdAt: assessment.createdAt,
                                  sectionId: sectionId
                                };
                                sessionStorage.setItem('currentAssessment', JSON.stringify(assessmentData));
                                router.push('/assessment-complete');
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {assessment.status === 'failed' && (
                              <Button 
                                size="sm" 
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => {
                                  // Navigate to the same section but with focus on this assessment
                                  router.push(`/remediation/${sectionId}?assessmentId=${assessment.id}&tab=remediation`);
                                }}
                              >
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

        {/* Tab 2: Rule Analysis */}
        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Rule Analysis & Citations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rule ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Citation</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Gap</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sectionData.regulatoryRequirements.map((req, index) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-mono text-sm">
                          R-{String(index + 1).padStart(3, '0')}
                        </TableCell>
                        <TableCell className="font-medium">
                          {req.title}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{req.citation}</div>
                            <div className="text-gray-500">{req.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(req.status)}>
                            {req.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {req.status === 'pending' ? 85 : 
                               req.status === 'in_progress' ? 45 : 15}%
                            </span>
                            <Progress 
                              value={req.status === 'pending' ? 85 : 
                                     req.status === 'in_progress' ? 45 : 15} 
                              className="w-16 h-2" 
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor('high')}>
                            {req.status === 'pending' ? 'Critical' : 'High'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Learn
                            </Button>
                            <Button size="sm">
                              <Play className="h-4 w-4 mr-1" />
                              Remediate
                            </Button>
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

        {/* Tab 3: Remediation Plan */}
        <TabsContent value="remediation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Remediation Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Phase</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Timeline</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sectionData.timeline.map((phase) => (
                      <TableRow key={phase.id}>
                        <TableCell className="font-medium">
                          {phase.title}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {phase.tasks.map((task: string, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                {task}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            {phase.duration}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {phase.title.includes('Immediate') ? 'Data Team' :
                             phase.title.includes('Short') ? 'QA Team' : 'DevOps Team'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(phase.status)}>
                            {phase.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {phase.status === 'urgent' ? 0 : 
                               phase.status === 'pending' ? 25 : 75}%
                            </span>
                            <Progress 
                              value={phase.status === 'urgent' ? 0 : 
                                     phase.status === 'pending' ? 25 : 75} 
                              className="w-16 h-2" 
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {phase.status === 'urgent' ? (
                              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                                <Play className="h-4 w-4 mr-1" />
                                Start
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                Track
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

        {/* Tab 4: Team Responsibility Matrix */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Responsibility Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Responsibility</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sectionData.teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-gray-500">ID: {member.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{member.role}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {member.responsibility}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(member.status)}>
                            {member.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{member.progress}%</span>
                            <Progress value={member.progress} className="w-16 h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4 mr-1" />
                              Contact
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Chat
                            </Button>
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

        {/* Tab 5: Explainable AI Insights */}
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Explainable AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Key Findings */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Findings</h3>
                  <div className="space-y-2">
                    {sectionData.insights.keyFindings.map((finding: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">{finding}</p>
                          <p className="text-xs text-blue-700 mt-1">Confidence: 95%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                  <div className="space-y-2">
                    {sectionData.insights.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <Target className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-900">{rec}</p>
                          <p className="text-xs text-green-700 mt-1">Impact: High</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Factors */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Risk Factors</h3>
                  <div className="space-y-2">
                    {sectionData.insights.riskFactors.map((risk: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-900">{risk}</p>
                          <p className="text-xs text-red-700 mt-1">Severity: Critical</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Opportunities */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Opportunities</h3>
                  <div className="space-y-2">
                    {sectionData.insights.opportunities.map((opp: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-purple-900">{opp}</p>
                          <p className="text-xs text-purple-700 mt-1">Potential: High</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SectionDetailPage;
