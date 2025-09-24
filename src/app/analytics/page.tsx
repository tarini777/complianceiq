/**
 * Analytics Page - ComplianceIQ
 * Comprehensive analytics, insights, and remediation dashboard
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Brain, 
  Shield, 
  Target, 
  FileText,
  Download,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import SectionLevelAnalytics from '@/components/analytics/SectionLevelAnalytics';
import AssessmentRemediationDashboard from '@/components/insights/LearningInsightsDashboard';
import RemediationDashboard from '@/components/remediation/RemediationDashboard';

const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [assessmentData, setAssessmentData] = useState<Record<string, unknown> | null>(null);
  const [insights, setInsights] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      console.log('Loading analytics data...');
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('/api/analytics/assessment', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      console.log('Analytics API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Analytics API result:', result);

      if (result.success) {
        setAssessmentData(result.data);
        console.log('Assessment data set:', result.data);
        
        try {
          const insightsResponse = await fetch('/api/insights/learning', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assessmentData: result.data }),
          });
          
          if (insightsResponse.ok) {
            const insightsResult = await insightsResponse.json();
            console.log('Insights API result:', insightsResult);
            if (insightsResult.success) {
              setInsights(insightsResult.data.insights);
            }
          } else {
            console.warn('Insights API failed:', insightsResponse.status);
            setInsights([]); // Set empty insights if API fails
          }
        } catch (insightsError) {
          console.error('Error loading insights:', insightsError);
          setInsights([]); // Set empty insights if API fails
        }
      } else {
        console.error('Analytics API returned error:', result.error);
        // Set fallback data
        setAssessmentData({
          overview: {
            totalAssessments: 0,
            completedAssessments: 0,
            inProgressAssessments: 0,
            averageScore: 0,
            averageCompletionTime: 0,
            productionReadyRate: 0
          }
        });
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Request timed out after 10 seconds');
      }
      
      // Set fallback data
      setAssessmentData({
        overview: {
          totalAssessments: 0,
          completedAssessments: 0,
          inProgressAssessments: 0,
          averageScore: 0,
          averageCompletionTime: 0,
          productionReadyRate: 0
        }
      });
      setInsights([]);
    } finally {
      setLoading(false);
      console.log('Analytics loading completed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Analytics & Intelligence
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive analytics, AI-powered insights, and intelligent remediation plans
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={loadAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(assessmentData as any)?.overview?.totalAssessments || 0}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(assessmentData as any)?.overview?.averageScore || 0}%
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Insights</p>
                <p className="text-2xl font-bold text-gray-900">{insights.length}</p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Production Ready</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(assessmentData as any)?.overview?.productionReadyRate || 0}%
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Analytics Overview</TabsTrigger>
          <TabsTrigger value="sections">Section Details</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="remediation">Remediation Plans</TabsTrigger>
          <TabsTrigger value="intelligence">Regulatory Intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="sections" className="space-y-6">
          <SectionLevelAnalytics />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <AssessmentRemediationDashboard 
            assessmentData={assessmentData}
          />
        </TabsContent>

        <TabsContent value="remediation" className="space-y-6">
          <RemediationDashboard 
            insights={insights}
            assessmentData={assessmentData}
          />
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Regulatory Intelligence Hub
              </CardTitle>
              <p className="text-gray-600">How Gilead leverages regulatory intelligence to achieve compliance</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* High Priority Alerts */}
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    High-Priority Regulatory Alerts
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-red-900">FDA AI/ML Software as Medical Device - Final Guidance</h5>
                        <Badge className="bg-red-100 text-red-800">High Priority</Badge>
                      </div>
                      <p className="text-sm text-red-700 mb-2">Final guidance on AI/ML software as medical device, including validation requirements and lifecycle management.</p>
                      <div className="flex items-center justify-between text-xs text-red-600">
                        <span>Source: FDA</span>
                        <span>Updated: Jan 15, 2024</span>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-red-900">Data Observability Best Practices for Pharmaceutical AI</h5>
                        <Badge className="bg-red-100 text-red-800">High Priority</Badge>
                      </div>
                      <p className="text-sm text-red-700 mb-2">Comprehensive guide on implementing data observability frameworks for pharmaceutical AI applications.</p>
                      <div className="flex items-center justify-between text-xs text-red-600">
                        <span>Source: Pharmaceutical AI Consortium</span>
                        <span>Updated: Feb 1, 2024</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Regulatory Requirements by Section */}
                <div>
                  <h4 className="font-semibold mb-4">Regulatory Requirements by Section</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Data Observability</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-600" />
                            <span className="text-sm">FDA 21 CFR Part 11 - Electronic Records</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-600" />
                            <span className="text-sm">FDA AI/ML Software as Medical Device</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-600" />
                            <span className="text-sm">GDPR Article 25 - Data Protection by Design</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">FDA AI Governance 2025</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-600" />
                            <span className="text-sm">FDA AI/ML Software as Medical Device - Final Guidance</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-600" />
                            <span className="text-sm">FDA Good Machine Learning Practices</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-600" />
                            <span className="text-sm">ICH E6(R2) Good Clinical Practice</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Compliance Impact Analysis */}
                <div>
                  <h4 className="font-semibold mb-4">Compliance Impact Analysis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">Data Observability Gaps</h5>
                          <Badge className="bg-red-100 text-red-800">Critical</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">60% of failed assessments</p>
                        <p className="text-xs text-gray-500">High risk of model drift and performance degradation</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">FDA AI Governance</h5>
                          <Badge className="bg-orange-100 text-orange-800">High</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">70% of in-progress assessments</p>
                        <p className="text-xs text-gray-500">Risk of regulatory non-compliance</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">Model Validation</h5>
                          <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">50% of all assessments</p>
                        <p className="text-xs text-gray-500">Incomplete validation protocols</p>
                      </CardContent>
                    </Card>
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

export default AnalyticsPage;
