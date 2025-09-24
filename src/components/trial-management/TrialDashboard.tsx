/**
 * Trial Management Dashboard - ComplianceIQ
 * Comprehensive dashboard for managing trials, participants, and analytics
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Star, 
  MessageSquare, 
  Settings,
  Plus,
  Download,
  Share2,
  Eye,
  Edit,
  Trash2,
  Send,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Pause,
  Play
} from 'lucide-react';

interface Trial {
  id: string;
  name: string;
  description: string;
  trialType: string;
  status: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  features: string[];
  limitations: string[];
  privacyLevel: string;
  allowSelfRegistration: boolean;
  requireApproval: boolean;
  sendNotifications: boolean;
  trackAnalytics: boolean;
  createdBy: string;
  createdAt: string;
  metrics: {
    totalParticipants: number;
    activeParticipants: number;
    completedParticipants: number;
    completionRate: number;
    averageRating: number;
    totalSessions: number;
    totalFeedback: number;
  };
}

interface TrialDashboardProps {
  trials?: Trial[];
  onTrialSelect?: (trial: Trial) => void;
  onCreateTrial?: () => void;
  onEditTrial?: (trial: Trial) => void;
  onDeleteTrial?: (trialId: string) => void;
}

const TrialDashboard: React.FC<TrialDashboardProps> = ({
  trials = [],
  onTrialSelect,
  onCreateTrial,
  onEditTrial,
  onDeleteTrial
}) => {
  const [selectedTrial, setSelectedTrial] = useState<Trial | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockTrials: Trial[] = [
    {
      id: 'trial-1',
      name: 'Pharma AI Compliance Beta',
      description: 'Beta testing for pharmaceutical AI compliance assessment',
      trialType: 'beta',
      status: 'active',
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      maxParticipants: 100,
      currentParticipants: 45,
      features: ['assessment', 'analytics', 'collaboration', 'askrexi'],
      limitations: ['limited_support', 'beta_features'],
      privacyLevel: 'private',
      allowSelfRegistration: true,
      requireApproval: true,
      sendNotifications: true,
      trackAnalytics: true,
      createdBy: 'admin@complianceiq.com',
      createdAt: '2025-01-01T00:00:00Z',
      metrics: {
        totalParticipants: 45,
        activeParticipants: 32,
        completedParticipants: 18,
        completionRate: 40,
        averageRating: 4.2,
        totalSessions: 156,
        totalFeedback: 23
      }
    },
    {
      id: 'trial-2',
      name: 'Oncology AI Pilot',
      description: 'Pilot program for oncology-specific AI compliance',
      trialType: 'pilot',
      status: 'planning',
      startDate: '2025-02-01',
      endDate: '2025-04-30',
      maxParticipants: 50,
      currentParticipants: 0,
      features: ['assessment', 'analytics', 'askrexi'],
      limitations: ['oncology_only'],
      privacyLevel: 'confidential',
      allowSelfRegistration: false,
      requireApproval: true,
      sendNotifications: true,
      trackAnalytics: true,
      createdBy: 'admin@complianceiq.com',
      createdAt: '2025-01-15T00:00:00Z',
      metrics: {
        totalParticipants: 0,
        activeParticipants: 0,
        completedParticipants: 0,
        completionRate: 0,
        averageRating: 0,
        totalSessions: 0,
        totalFeedback: 0
      }
    }
  ];

  const displayTrials = trials.length > 0 ? trials : mockTrials;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'planning': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrialTypeColor = (type: string) => {
    switch (type) {
      case 'beta': return 'bg-purple-100 text-purple-800';
      case 'pilot': return 'bg-blue-100 text-blue-800';
      case 'evaluation': return 'bg-green-100 text-green-800';
      case 'demo': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTrialSelect = (trial: Trial) => {
    setSelectedTrial(trial);
    onTrialSelect?.(trial);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Trial Management</h1>
              <p className="text-gray-600 mt-2">
                Manage your beta trials, pilots, and evaluations
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button onClick={onCreateTrial}>
                <Plus className="mr-2 h-4 w-4" />
                Create Trial
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trials</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayTrials.length}</div>
              <p className="text-xs text-muted-foreground">
                {displayTrials.filter(t => t.status === 'active').length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayTrials.reduce((sum, trial) => sum + trial.currentParticipants, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all trials
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayTrials.length > 0 
                  ? (displayTrials.reduce((sum, trial) => sum + trial.metrics.averageRating, 0) / displayTrials.length).toFixed(1)
                  : '0.0'
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Out of 5 stars
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayTrials.length > 0 
                  ? Math.round(displayTrials.reduce((sum, trial) => sum + trial.metrics.completionRate, 0) / displayTrials.length)
                  : 0
                }%
              </div>
              <p className="text-xs text-muted-foreground">
                Average across trials
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Trials List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {displayTrials.map((trial) => (
            <Card 
              key={trial.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedTrial?.id === trial.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleTrialSelect(trial)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-lg">{trial.name}</CardTitle>
                      <Badge className={getTrialTypeColor(trial.trialType)}>
                        {trial.trialType}
                      </Badge>
                    </div>
                    <CardDescription>{trial.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(trial.status)}`}></div>
                    <span className="text-sm text-gray-500 capitalize">{trial.status}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Participants</span>
                      <span>{trial.currentParticipants}/{trial.maxParticipants}</span>
                    </div>
                    <Progress 
                      value={(trial.currentParticipants / trial.maxParticipants) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-semibold">{trial.metrics.completionRate}%</div>
                      <div className="text-gray-500">Complete</div>
                    </div>
                    <div>
                      <div className="font-semibold">{trial.metrics.averageRating}/5</div>
                      <div className="text-gray-500">Rating</div>
                    </div>
                    <div>
                      <div className="font-semibold">{trial.metrics.totalFeedback}</div>
                      <div className="text-gray-500">Feedback</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        onEditTrial?.(trial);
                      }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTrial?.(trial.id);
                      }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500">
                      Created {new Date(trial.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Trial Details */}
        {selectedTrial && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{selectedTrial.name}</span>
                    <Badge className={getTrialTypeColor(selectedTrial.trialType)}>
                      {selectedTrial.trialType}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{selectedTrial.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="participants">Participants</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Participants</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedTrial.metrics.totalParticipants}</div>
                        <p className="text-xs text-muted-foreground">
                          {selectedTrial.metrics.activeParticipants} active
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Completion Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedTrial.metrics.completionRate}%</div>
                        <p className="text-xs text-muted-foreground">
                          {selectedTrial.metrics.completedParticipants} completed
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Average Rating</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedTrial.metrics.averageRating}/5</div>
                        <p className="text-xs text-muted-foreground">
                          Based on feedback
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Sessions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedTrial.metrics.totalSessions}</div>
                        <p className="text-xs text-muted-foreground">
                          User interactions
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="participants" className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Participants</h3>
                    <Button>
                      <Send className="mr-2 h-4 w-4" />
                      Invite Participants
                    </Button>
                  </div>
                  <p className="text-gray-500">Participant management interface will be implemented here.</p>
                </TabsContent>

                <TabsContent value="analytics" className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Analytics</h3>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </Button>
                  </div>
                  <p className="text-gray-500">Analytics dashboard will be implemented here.</p>
                </TabsContent>

                <TabsContent value="feedback" className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Feedback</h3>
                    <Badge variant="secondary">
                      {selectedTrial.metrics.totalFeedback} items
                    </Badge>
                  </div>
                  <p className="text-gray-500">Feedback management interface will be implemented here.</p>
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Trial Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Trial Name</label>
                          <input 
                            type="text" 
                            value={selectedTrial.name}
                            className="w-full p-2 border rounded-md"
                            readOnly
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Trial Type</label>
                          <input 
                            type="text" 
                            value={selectedTrial.trialType}
                            className="w-full p-2 border rounded-md"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-500">Full trial settings interface will be implemented here.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TrialDashboard;
