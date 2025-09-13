/**
 * Remediation Dashboard - ComplianceIQ
 * Intelligent remediation plans and regulatory intelligence integration
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Target, 
  TrendingUp,
  Calendar,
  Shield,
  BookOpen,
  ArrowRight,
  Play,
  Pause,
  RefreshCw,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  RemediationPlan, 
  RemediationStep, 
  SuccessCriteria, 
  RegulatoryRequirement,
  RiskMitigation,
  Milestone,
  Blocker,
  remediationEngine
} from '@/lib/remediation/remediationEngine';

interface RemediationDashboardProps {
  insights?: any[];
  assessmentData?: any;
  companyId?: string;
}

const RemediationDashboard: React.FC<RemediationDashboardProps> = ({
  insights,
  assessmentData,
  companyId
}) => {
  const [remediationPlans, setRemediationPlans] = useState<RemediationPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('plans');
  const [expandedPlans, setExpandedPlans] = useState<Set<string>>(new Set());
  const [selectedPlan, setSelectedPlan] = useState<RemediationPlan | null>(null);

  useEffect(() => {
    loadRemediationPlans();
  }, []);

  useEffect(() => {
    if (insights && assessmentData) {
      generateNewPlan();
    }
  }, [insights, assessmentData]);

  const loadRemediationPlans = async () => {
    try {
      setLoading(true);
      const plans = remediationEngine.getRemediationPlans();
      setRemediationPlans(plans);
    } catch (error) {
      console.error('Error loading remediation plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewPlan = async () => {
    if (!insights || !assessmentData) return;
    
    try {
      const newPlan = await remediationEngine.generateRemediationPlan(insights, assessmentData);
      setRemediationPlans(prev => [newPlan, ...prev]);
    } catch (error) {
      console.error('Error generating remediation plan:', error);
    }
  };

  const togglePlanExpansion = (planId: string) => {
    const newExpanded = new Set(expandedPlans);
    if (newExpanded.has(planId)) {
      newExpanded.delete(planId);
    } else {
      newExpanded.add(planId);
    }
    setExpandedPlans(newExpanded);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'on_hold': return 'text-yellow-600 bg-yellow-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading remediation plans...</p>
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
            <Shield className="h-6 w-6 text-blue-600" />
            Remediation Plans
          </h1>
          <p className="text-gray-600">Intelligent remediation plans with regulatory intelligence integration</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={loadRemediationPlans}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => insights && assessmentData && generateNewPlan()}>
            <Play className="h-4 w-4 mr-2" />
            Generate New Plan
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Plans</p>
                <p className="text-2xl font-bold text-gray-900">{remediationPlans.length}</p>
              </div>
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Plans</p>
                <p className="text-2xl font-bold text-green-600">
                  {remediationPlans.filter(p => p.status === 'in_progress').length}
                </p>
              </div>
              <Play className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Plans</p>
                <p className="text-2xl font-bold text-red-600">
                  {remediationPlans.filter(p => p.priority === 'critical').length}
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
                <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(remediationPlans.reduce((sum, p) => sum + p.progress.overallProgress, 0) / remediationPlans.length) || 0}%
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
          <TabsTrigger value="plans">Remediation Plans</TabsTrigger>
          <TabsTrigger value="regulatory">Regulatory Intelligence</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
        </TabsList>

        {/* Remediation Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <div className="space-y-4">
            {remediationPlans.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Remediation Plans</h3>
                  <p className="text-gray-600">Generate a remediation plan based on assessment insights.</p>
                </CardContent>
              </Card>
            ) : (
              remediationPlans.map((plan) => (
                <Card key={plan.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{plan.title}</CardTitle>
                        <p className="text-gray-600 mb-4">{plan.description}</p>
                        <div className="flex items-center gap-4">
                          <Badge className={getPriorityColor(plan.priority)}>
                            {plan.priority}
                          </Badge>
                          <Badge className={getStatusColor(plan.status)}>
                            {plan.status}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            {plan.estimatedDuration}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <DollarSign className="h-4 w-4" />
                            {plan.estimatedCost}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePlanExpansion(plan.id)}
                        >
                          {expandedPlans.has(plan.id) ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPlan(plan)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {expandedPlans.has(plan.id) && (
                    <CardContent className="pt-0">
                      <div className="space-y-6">
                        {/* Progress Overview */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">Overall Progress</h4>
                            <span className="text-sm text-gray-600">
                              {plan.progress.overallProgress}% ({plan.progress.stepsCompleted}/{plan.progress.totalSteps} steps)
                            </span>
                          </div>
                          <Progress value={plan.progress.overallProgress} className="h-2" />
                        </div>

                        {/* Implementation Steps */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Implementation Steps</h4>
                          <div className="space-y-2">
                            {plan.implementationSteps.slice(0, 3).map((step) => (
                              <div key={step.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${
                                    step.status === 'completed' ? 'bg-green-500' :
                                    step.status === 'in_progress' ? 'bg-blue-500' :
                                    step.status === 'blocked' ? 'bg-red-500' : 'bg-gray-300'
                                  }`}></div>
                                  <div>
                                    <p className="font-medium text-sm">{step.title}</p>
                                    <p className="text-xs text-gray-600">{step.estimatedDuration}</p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {step.status}
                                </Badge>
                              </div>
                            ))}
                            {plan.implementationSteps.length > 3 && (
                              <p className="text-sm text-gray-500 text-center">
                                +{plan.implementationSteps.length - 3} more steps
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Required Resources */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Required Resources</h4>
                          <div className="flex flex-wrap gap-2">
                            {plan.requiredResources.slice(0, 5).map((resource, index) => (
                              <Badge key={index} variant="outline">{resource}</Badge>
                            ))}
                            {plan.requiredResources.length > 5 && (
                              <Badge variant="outline">+{plan.requiredResources.length - 5} more</Badge>
                            )}
                          </div>
                        </div>

                        {/* Next Actions */}
                        {plan.progress.nextActions.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Next Actions</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                              {plan.progress.nextActions.map((action, index) => (
                                <li key={index}>{action}</li>
                              ))}
                            </ul>
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

        {/* Regulatory Intelligence Tab */}
        <TabsContent value="regulatory" className="space-y-6">
          <div className="space-y-4">
            {remediationEngine.getRegulatoryIntelligence().map((regulation) => (
              <Card key={regulation.regulation}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {regulation.regulation}
                  </CardTitle>
                  <p className="text-gray-600">{regulation.summary}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Key Requirements */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Requirements</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {regulation.keyRequirements.map((requirement, index) => (
                          <li key={index}>{requirement}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Compliance Deadlines */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Compliance Deadlines</h4>
                      <div className="space-y-2">
                        {regulation.complianceDeadlines.map((deadline, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{deadline.requirement}</p>
                              <p className="text-xs text-gray-600">Deadline: {deadline.deadline}</p>
                            </div>
                            <Badge 
                              variant={deadline.status === 'overdue' ? 'destructive' : 'secondary'}
                            >
                              {deadline.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Industry Best Practices */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Industry Best Practices</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {regulation.industryBestPractices.map((practice, index) => (
                          <li key={index}>{practice}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Progress Tracking Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="space-y-4">
            {remediationPlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{plan.title}</span>
                    <Badge className={getPriorityColor(plan.priority)}>
                      {plan.priority}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Overall Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm text-gray-600">{plan.progress.overallProgress}%</span>
                      </div>
                      <Progress value={plan.progress.overallProgress} className="h-2" />
                    </div>

                    {/* Milestones */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Milestones</h4>
                      <div className="space-y-2">
                        {plan.progress.milestones.map((milestone) => (
                          <div key={milestone.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                milestone.status === 'completed' ? 'bg-green-500' :
                                milestone.status === 'overdue' ? 'bg-red-500' : 'bg-gray-300'
                              }`}></div>
                              <div>
                                <p className="font-medium text-sm">{milestone.title}</p>
                                <p className="text-xs text-gray-600">Target: {milestone.targetDate}</p>
                              </div>
                            </div>
                            <Badge 
                              variant={milestone.status === 'completed' ? 'default' : 'secondary'}
                            >
                              {milestone.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Blockers */}
                    {plan.progress.blockers.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Current Blockers</h4>
                        <div className="space-y-2">
                          {plan.progress.blockers.map((blocker) => (
                            <div key={blocker.id} className="p-3 border border-red-200 bg-red-50 rounded-lg">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium text-sm text-red-900">{blocker.description}</p>
                                  <p className="text-xs text-red-700 mt-1">Impact: {blocker.impact}</p>
                                </div>
                                <Badge variant="destructive" className="text-xs">
                                  {blocker.severity}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RemediationDashboard;
