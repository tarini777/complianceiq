/**
 * Learning Insights Dashboard - ComplianceIQ
 * AI-powered insights and intelligent recommendations
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  Lightbulb, 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  Clock, 
  DollarSign,
  Users,
  FileText,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Filter,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  learningInsightsEngine, 
  AssessmentInsight, 
  Recommendation,
  getInsightIcon,
  getSeverityColor,
  getPriorityColor
} from '@/lib/insights/learningEngine';

interface AssessmentRemediationDashboardProps {
  assessmentData?: any;
  companyId?: string;
  personaId?: string;
}

const AssessmentRemediationDashboard: React.FC<AssessmentRemediationDashboardProps> = ({
  assessmentData,
  companyId,
  personaId
}) => {
  const [insights, setInsights] = useState<AssessmentInsight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('insights');
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadInsights();
  }, [assessmentData]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      
      // If assessment data is provided, analyze it
      if (assessmentData) {
        const newInsights = await learningInsightsEngine.analyzeAssessmentData(assessmentData);
        setInsights(newInsights);
      } else {
        // Load existing insights
        const existingInsights = learningInsightsEngine.getInsights();
        setInsights(existingInsights);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleInsightExpansion = (insightId: string) => {
    const newExpanded = new Set(expandedInsights);
    if (newExpanded.has(insightId)) {
      newExpanded.delete(insightId);
    } else {
      newExpanded.add(insightId);
    }
    setExpandedInsights(newExpanded);
  };

  const filteredInsights = insights.filter(insight => {
    if (filterType !== 'all' && insight.type !== filterType) return false;
    if (filterSeverity !== 'all' && insight.severity !== filterSeverity) return false;
    return true;
  });

  const insightsByType = {
    gap_analysis: insights.filter(i => i.type === 'gap_analysis'),
    pattern_recognition: insights.filter(i => i.type === 'pattern_recognition'),
    risk_assessment: insights.filter(i => i.type === 'risk_assessment'),
    opportunity_identification: insights.filter(i => i.type === 'opportunity_identification'),
    trend_analysis: insights.filter(i => i.type === 'trend_analysis'),
  };

  const allRecommendations = insights.flatMap(insight => insight.recommendations);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Analyzing assessment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Learning Insights
          </h1>
          <p className="text-gray-600">AI-powered analysis and intelligent recommendations</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="gap_analysis">Gap Analysis</SelectItem>
              <SelectItem value="pattern_recognition">Patterns</SelectItem>
              <SelectItem value="risk_assessment">Risks</SelectItem>
              <SelectItem value="opportunity_identification">Opportunities</SelectItem>
              <SelectItem value="trend_analysis">Trends</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadInsights}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Insights</p>
                <p className="text-2xl font-bold text-gray-900">{insights.length}</p>
              </div>
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                <p className="text-2xl font-bold text-red-600">
                  {insights.filter(i => i.severity === 'critical').length}
                </p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Opportunities</p>
                <p className="text-2xl font-bold text-green-600">
                  {insightsByType.opportunity_identification.length}
                </p>
              </div>
              <Lightbulb className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recommendations</p>
                <p className="text-2xl font-bold text-blue-600">{allRecommendations.length}</p>
              </div>
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Confidence</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length) || 0}%
                </p>
              </div>
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="analysis">Deep Analysis</TabsTrigger>
        </TabsList>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="space-y-4">
            {filteredInsights.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Insights Found</h3>
                  <p className="text-gray-600">No insights match your current filters.</p>
                </CardContent>
              </Card>
            ) : (
              filteredInsights.map((insight) => (
                <Card key={insight.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{getInsightIcon(insight.type)}</div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                          <p className="text-gray-600 mt-1">{insight.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={insight.severity === 'critical' ? 'destructive' : 'secondary'}
                          className={getSeverityColor(insight.severity)}
                        >
                          {insight.severity}
                        </Badge>
                        <Badge variant="outline">{insight.confidence}% confidence</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleInsightExpansion(insight.id)}
                        >
                          {expandedInsights.has(insight.id) ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {expandedInsights.has(insight.id) && (
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Evidence */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Evidence</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                            {insight.evidence.map((evidence, index) => (
                              <li key={index}>{evidence}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Affected Areas */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Affected Areas</h4>
                          <div className="flex flex-wrap gap-2">
                            {insight.affectedAreas.map((area, index) => (
                              <Badge key={index} variant="outline">{area}</Badge>
                            ))}
                          </div>
                        </div>

                        {/* Recommendations Preview */}
                        {insight.recommendations.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Key Recommendations</h4>
                            <div className="space-y-2">
                              {insight.recommendations.slice(0, 2).map((rec, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">{rec.title}</p>
                                      <p className="text-xs text-gray-600 mt-1">{rec.description}</p>
                                    </div>
                                    <Badge 
                                      variant="outline" 
                                      className={`ml-2 ${getPriorityColor(rec.priority)}`}
                                    >
                                      {rec.priority}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                              {insight.recommendations.length > 2 && (
                                <p className="text-sm text-gray-500">
                                  +{insight.recommendations.length - 2} more recommendations
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="space-y-4">
            {allRecommendations.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recommendations</h3>
                  <p className="text-gray-600">No recommendations available at this time.</p>
                </CardContent>
              </Card>
            ) : (
              allRecommendations.map((recommendation) => (
                <Card key={recommendation.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {recommendation.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{recommendation.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={recommendation.priority === 'critical' ? 'destructive' : 'secondary'}
                          className={getPriorityColor(recommendation.priority)}
                        >
                          {recommendation.priority}
                        </Badge>
                        <Badge variant="outline">{recommendation.effort} effort</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{recommendation.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{recommendation.estimatedCost}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{recommendation.requiredResources.length} resources</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Implementation Steps</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                          {recommendation.implementationSteps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Success Metrics</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          {recommendation.successMetrics.map((metric, index) => (
                            <li key={index}>{metric}</li>
                          ))}
                        </ul>
                      </div>

                      {recommendation.relatedRegulations.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Related Regulations</h4>
                          <div className="flex flex-wrap gap-2">
                            {recommendation.relatedRegulations.map((regulation, index) => (
                              <Badge key={index} variant="outline">{regulation}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <Button className="w-full">
                            Implement Recommendation
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Deep Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Insights by Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Insights by Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(insightsByType).map(([type, typeInsights]) => (
                    <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getInsightIcon(type as any)}</span>
                        <div>
                          <p className="font-medium capitalize">{type.replace('_', ' ')}</p>
                          <p className="text-sm text-gray-600">{typeInsights.length} insights</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{typeInsights.length}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Severity Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Severity Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['critical', 'high', 'medium', 'low'].map((severity) => {
                    const count = insights.filter(i => i.severity === severity).length;
                    const percentage = insights.length > 0 ? Math.round((count / insights.length) * 100) : 0;
                    
                    return (
                      <div key={severity} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={severity === 'critical' ? 'destructive' : 'secondary'}
                            className={getSeverityColor(severity as any)}
                          >
                            {severity}
                          </Badge>
                          <span className="text-sm text-gray-600">{count} insights</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                severity === 'critical' ? 'bg-red-600' :
                                severity === 'high' ? 'bg-orange-600' :
                                severity === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Confidence Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Confidence Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length) || 0}%
                    </p>
                    <p className="text-sm text-gray-600">Average Confidence</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">
                      {insights.filter(i => i.confidence >= 80).length}
                    </p>
                    <p className="text-sm text-gray-600">High Confidence</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">
                      {insights.filter(i => i.confidence < 70).length}
                    </p>
                    <p className="text-sm text-gray-600">Low Confidence</p>
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

export default AssessmentRemediationDashboard;
