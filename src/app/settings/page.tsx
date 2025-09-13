'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useSystemConfig } from '@/contexts/SystemConfigContext';
import { 
  Settings, 
  Shield, 
  Users, 
  Database, 
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Activity,
  Brain,
  TrendingUp,
  AlertCircle,
  Monitor,
  Zap,
  BarChart3,
  Clock,
  Target
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { config, loading, error, refreshConfig, updateConfig } = useSystemConfig();
  const [localConfig, setLocalConfig] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Admin dashboard state
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [learningInsights, setLearningInsights] = useState<any>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);

  // Initialize local config when system config loads
  React.useEffect(() => {
    if (config) {
      console.log('Config changed, updating local config:', config);
      setLocalConfig({
        collaboration_enabled: config.collaboration_enabled?.value === 'true',
        collaboration_require_roles: config.collaboration_require_roles?.value === 'true'
      });
    }
  }, [config]);

  // Fetch system health data
  const fetchSystemHealth = async () => {
    setHealthLoading(true);
    try {
      const response = await fetch('/api/monitoring/health?action=report');
      const data = await response.json();
      if (data.success) {
        setSystemHealth(data.data);
      }
    } catch (error) {
      console.error('Error fetching system health:', error);
    } finally {
      setHealthLoading(false);
    }
  };

  // Fetch learning insights
  const fetchLearningInsights = async () => {
    setInsightsLoading(true);
    try {
      const response = await fetch('/api/learning/insights?action=summary');
      const data = await response.json();
      if (data.success) {
        setLearningInsights(data.data);
      }
    } catch (error) {
      console.error('Error fetching learning insights:', error);
    } finally {
      setInsightsLoading(false);
    }
  };

  // Load admin data on component mount
  useEffect(() => {
    fetchSystemHealth();
    fetchLearningInsights();
  }, []);

  const handleToggle = (key: string, checked: boolean) => {
    setLocalConfig(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);

    try {
      console.log('Saving settings:', localConfig);
      
      // Update each configuration item using the context method
      let allSuccessful = true;
      for (const [key, value] of Object.entries(localConfig)) {
        console.log(`Updating ${key} to ${value}`);
        const success = await updateConfig(key, value.toString());
        if (!success) {
          allSuccessful = false;
          console.error(`Failed to update ${key}`);
        }
      }

      if (allSuccessful) {
        setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
        console.log('All settings saved successfully');
      } else {
        setSaveMessage({ type: 'error', text: 'Some settings failed to save. Please try again.' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const getConfigDescription = (key: string): string => {
    switch (key) {
      case 'collaboration_enabled':
        return 'Enable or disable team collaboration features';
      case 'collaboration_require_roles':
        return 'Require user role management for collaboration';
      default:
        return 'System configuration setting';
    }
  };

  const getConfigCategory = (key: string): string => {
    return key.startsWith('collaboration') ? 'features' : 'system';
  };

  const hasChanges = config && Object.keys(localConfig).some(key => {
    const currentValue = (config as any)[key] === 'true';
    const localValue = localConfig[key];
    return currentValue !== localValue;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Settings</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={refreshConfig}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ComplianceIQ Admin</h1>
          <p className="text-gray-600 mt-1">System health monitoring, learning insights, and configuration management</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              fetchSystemHealth();
              fetchLearningInsights();
              refreshConfig();
            }}
            disabled={loading || healthLoading || insightsLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${(loading || healthLoading || insightsLoading) ? 'animate-spin' : ''}`} />
            Refresh All
          </Button>
          <Badge variant="outline" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Database-Driven</span>
          </Badge>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${
          saveMessage.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {saveMessage.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* Admin Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center space-x-2">
            <Monitor className="h-4 w-4" />
            <span>System Health</span>
          </TabsTrigger>
          <TabsTrigger value="learning" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Learning Insights</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>User Management</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Data & API</span>
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Configuration</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* System Health Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {systemHealth ? `${systemHealth.summary.currentHealthScore}%` : '--'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {systemHealth ? systemHealth.summary.currentStatus : 'Loading...'}
                </p>
                {systemHealth && (
                  <Progress 
                    value={systemHealth.summary.currentHealthScore} 
                    className="mt-2"
                  />
                )}
              </CardContent>
            </Card>

            {/* Learning Insights */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Learning Insights</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {learningInsights ? learningInsights.lastCycle?.summary.totalInsights || 0 : '--'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {learningInsights ? `${learningInsights.criticalIssues} critical issues` : 'Loading...'}
                </p>
              </CardContent>
            </Card>

            {/* Active Users */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {systemHealth ? systemHealth.current.metrics.activeUsers : '--'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently online
                </p>
              </CardContent>
            </Card>

            {/* System Uptime */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.9%</div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={async () => {
                    await fetchSystemHealth();
                    setSaveMessage({ type: 'success', text: 'System health check completed successfully!' });
                  }}
                  disabled={healthLoading}
                >
                  <Monitor className="h-6 w-6" />
                  <span>Run Health Check</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/learning/insights?action=cycle');
                      const data = await response.json();
                      if (data.success) {
                        await fetchLearningInsights();
                        setSaveMessage({ type: 'success', text: `Learning cycle completed! Generated ${data.data.summary?.totalInsights || 0} insights.` });
                      } else {
                        setSaveMessage({ type: 'error', text: 'Learning cycle failed. Please try again.' });
                      }
                    } catch (error) {
                      setSaveMessage({ type: 'error', text: 'Failed to run learning cycle.' });
                    }
                  }}
                  disabled={insightsLoading}
                >
                  <Brain className="h-6 w-6" />
                  <span>Run Learning Cycle</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={async () => {
                    try {
                      await Promise.all([
                        fetchSystemHealth(),
                        fetchLearningInsights(),
                        refreshConfig()
                      ]);
                      setSaveMessage({ type: 'success', text: 'All systems refreshed successfully!' });
                    } catch (error) {
                      setSaveMessage({ type: 'error', text: 'Some systems failed to refresh.' });
                    }
                  }}
                  disabled={healthLoading || insightsLoading}
                >
                  <RefreshCw className="h-6 w-6" />
                  <span>Refresh All Data</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Health Tab */}
        <TabsContent value="health" className="space-y-6">
          {healthLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading system health data...</p>
              </div>
            </div>
          ) : systemHealth ? (
            <>
              {/* Health Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    <span>Health Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-3xl font-bold text-green-600">
                        {systemHealth.summary.currentHealthScore}%
                      </div>
                      <p className="text-sm text-gray-600">Overall Health Score</p>
                      <Badge variant={systemHealth.summary.currentStatus === 'excellent' ? 'default' : 
                                    systemHealth.summary.currentStatus === 'good' ? 'secondary' : 
                                    systemHealth.summary.currentStatus === 'warning' ? 'destructive' : 'outline'}>
                        {systemHealth.summary.currentStatus}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-blue-600">
                        {systemHealth.trend.trend}
                      </div>
                      <p className="text-sm text-gray-600">Trend Direction</p>
                      <Badge variant="outline">
                        {systemHealth.trend.trendScore > 0 ? '+' : ''}{systemHealth.trend.trendScore.toFixed(2)}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-600">
                        {systemHealth.current.metrics.activeUsers}
                      </div>
                      <p className="text-sm text-gray-600">Active Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <span>Performance Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">API Response Time</span>
                      <span className="text-sm text-gray-600">
                        {systemHealth.current.metrics.apiResponseTime.toFixed(0)}ms
                      </span>
                    </div>
                    <Progress value={Math.max(0, 100 - (systemHealth.current.metrics.apiResponseTime / 5))} />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database Query Time</span>
                      <span className="text-sm text-gray-600">
                        {systemHealth.current.metrics.databaseQueryTime.toFixed(0)}ms
                      </span>
                    </div>
                    <Progress value={Math.max(0, 100 - (systemHealth.current.metrics.databaseQueryTime / 2))} />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Memory Usage</span>
                      <span className="text-sm text-gray-600">
                        {systemHealth.current.metrics.memoryUsage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={Math.max(0, 100 - systemHealth.current.metrics.memoryUsage)} />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">CPU Usage</span>
                      <span className="text-sm text-gray-600">
                        {systemHealth.current.metrics.cpuUsage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={Math.max(0, 100 - systemHealth.current.metrics.cpuUsage)} />
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    <span>Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systemHealth.summary.recommendations.slice(0, 5).map((rec: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-gray-600">Failed to load system health data</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Learning Insights Tab */}
        <TabsContent value="learning" className="space-y-6">
          {insightsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading learning insights...</p>
              </div>
            </div>
          ) : learningInsights ? (
            <>
              {/* Learning Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span>Learning Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <div className="text-3xl font-bold text-purple-600">
                        {learningInsights.totalCycles}
                      </div>
                      <p className="text-sm text-gray-600">Total Learning Cycles</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-blue-600">
                        {learningInsights.lastCycle?.summary.totalInsights || 0}
                      </div>
                      <p className="text-sm text-gray-600">Total Insights Generated</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-red-600">
                        {learningInsights.criticalIssues}
                      </div>
                      <p className="text-sm text-gray-600">Critical Issues</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600">
                        {learningInsights.recommendations.length}
                      </div>
                      <p className="text-sm text-gray-600">Active Recommendations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>Recent Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {learningInsights.recentInsights.slice(0, 5).map((insight: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{insight.title}</h4>
                          <Badge variant={
                            insight.severity === 'critical' ? 'destructive' :
                            insight.severity === 'high' ? 'default' :
                            insight.severity === 'medium' ? 'secondary' : 'outline'
                          }>
                            {insight.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Category: {insight.category}</span>
                          <span>Confidence: {insight.confidence}%</span>
                          <span>Impact: {insight.impact.users} users</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-gray-600">Failed to load learning insights</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>User Management</span>
              </CardTitle>
              <CardDescription>
                Manage user accounts, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Active Users */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">156</div>
                      <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">89</div>
                      <p className="text-xs text-muted-foreground">Currently online</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8</div>
                      <p className="text-xs text-muted-foreground">System administrators</p>
                    </CardContent>
                  </Card>
                </div>

                {/* User Roles */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">User Roles & Permissions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Assessment Users</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Can create assessments</span>
                            <Checkbox defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Can view analytics</span>
                            <Checkbox defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Can access AskRexi</span>
                            <Checkbox defaultChecked />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Admin Users</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">System configuration</span>
                            <Checkbox defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">User management</span>
                            <Checkbox defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">API access</span>
                            <Checkbox defaultChecked />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Recent User Activity */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent User Activity</h3>
                  <div className="space-y-3">
                    {[
                      { user: 'Dr. Sarah Johnson', action: 'Completed AI Readiness Assessment', time: '2 minutes ago' },
                      { user: 'Mike Chen', action: 'Accessed Regulatory Intelligence', time: '5 minutes ago' },
                      { user: 'Lisa Rodriguez', action: 'Updated compliance mapping', time: '12 minutes ago' },
                      { user: 'Dr. Ahmed Hassan', action: 'Started new assessment', time: '18 minutes ago' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{activity.user}</p>
                          <p className="text-sm text-gray-600">{activity.action}</p>
                        </div>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data & API Management Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-green-600" />
                <span>Data & API Management</span>
              </CardTitle>
              <CardDescription>
                Manage data sources, API endpoints, and data pipelines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Data Sources */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Data Sources</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">FDA Database</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="default">Active</Badge>
                          <span className="text-xs text-gray-500">Last sync: 2 min ago</span>
                        </div>
                        <Progress value={100} className="mb-2" />
                        <p className="text-xs text-gray-600">1,247 regulations synced</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">EMA Database</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="default">Active</Badge>
                          <span className="text-xs text-gray-500">Last sync: 5 min ago</span>
                        </div>
                        <Progress value={95} className="mb-2" />
                        <p className="text-xs text-gray-600">892 guidelines synced</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">ICH Guidelines</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">Syncing</Badge>
                          <span className="text-xs text-gray-500">In progress</span>
                        </div>
                        <Progress value={67} className="mb-2" />
                        <p className="text-xs text-gray-600">156 documents processed</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* API Endpoints */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">API Endpoints</h3>
                  <div className="space-y-3">
                    {[
                      { endpoint: '/api/assessment/health-check', method: 'GET', status: 'Healthy', response: '45ms' },
                      { endpoint: '/api/dashboard/intelligence', method: 'GET', status: 'Healthy', response: '67ms' },
                      { endpoint: '/api/monitoring/health', method: 'GET', status: 'Healthy', response: '23ms' },
                      { endpoint: '/api/learning/insights', method: 'GET', status: 'Healthy', response: '89ms' },
                      { endpoint: '/api/regulatory/updates', method: 'POST', status: 'Warning', response: '234ms' }
                    ].map((api, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Badge variant={api.method === 'GET' ? 'default' : 'secondary'}>
                            {api.method}
                          </Badge>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{api.endpoint}</code>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant={api.status === 'Healthy' ? 'default' : 'destructive'}>
                            {api.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{api.response}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data Pipeline Status */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Data Pipeline Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Assessment Data</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Total Assessments</span>
                            <span className="font-medium">1,247</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Completed Today</span>
                            <span className="font-medium">23</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Data Quality Score</span>
                            <Badge variant="default">98.5%</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Regulatory Data</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Total Regulations</span>
                            <span className="font-medium">2,891</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Updated Today</span>
                            <span className="font-medium">15</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Sync Status</span>
                            <Badge variant="default">Up to date</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflows Tab */}
        <TabsContent value="workflows" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-purple-600" />
                <span>Workflow Management</span>
              </CardTitle>
              <CardDescription>
                Configure and monitor automated workflows and business processes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Workflow Status */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Active Workflows</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Assessment Workflow</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Status</span>
                            <Badge variant="default">Running</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Executions Today</span>
                            <span className="font-medium">47</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Success Rate</span>
                            <span className="text-green-600 font-medium">96.8%</span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full"
                            onClick={() => {
                              setSaveMessage({ type: 'success', text: 'Assessment workflow configuration opened!' });
                              // In a real app, this would open a configuration modal
                            }}
                          >
                            Configure Workflow
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Compliance Monitoring</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Status</span>
                            <Badge variant="default">Running</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Checks Today</span>
                            <span className="font-medium">156</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Success Rate</span>
                            <span className="text-green-600 font-medium">99.4%</span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full"
                            onClick={() => {
                              setSaveMessage({ type: 'success', text: 'Compliance monitoring workflow configuration opened!' });
                              // In a real app, this would open a configuration modal
                            }}
                          >
                            Configure Workflow
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Workflow Steps */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Assessment Workflow Steps</h3>
                  <div className="space-y-4">
                    {[
                      { step: 'User Authentication', status: 'completed', duration: '2s' },
                      { step: 'Persona Selection', status: 'completed', duration: '1s' },
                      { step: 'Question Loading', status: 'completed', duration: '3s' },
                      { step: 'Response Processing', status: 'active', duration: '5s' },
                      { step: 'Score Calculation', status: 'pending', duration: '-' },
                      { step: 'Report Generation', status: 'pending', duration: '-' }
                    ].map((workflow, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${
                          workflow.status === 'completed' ? 'bg-green-500' :
                          workflow.status === 'active' ? 'bg-blue-500 animate-pulse' :
                          'bg-gray-300'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium">{workflow.step}</p>
                          <p className="text-sm text-gray-600">
                            {workflow.status === 'completed' ? 'Completed' :
                             workflow.status === 'active' ? 'In Progress' :
                             'Pending'}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">{workflow.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Workflow Triggers */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Workflow Triggers</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Assessment Completion</p>
                        <p className="text-sm text-gray-600">Triggers compliance score calculation</p>
                      </div>
                      <Checkbox 
                        defaultChecked 
                        onCheckedChange={(checked) => {
                          setSaveMessage({ 
                            type: 'success', 
                            text: `Assessment completion trigger ${checked ? 'enabled' : 'disabled'}` 
                          });
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Regulatory Update</p>
                        <p className="text-sm text-gray-600">Triggers impact analysis workflow</p>
                      </div>
                      <Checkbox 
                        defaultChecked 
                        onCheckedChange={(checked) => {
                          setSaveMessage({ 
                            type: 'success', 
                            text: `Regulatory update trigger ${checked ? 'enabled' : 'disabled'}` 
                          });
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">System Health Alert</p>
                        <p className="text-sm text-gray-600">Triggers automated remediation</p>
                      </div>
                      <Checkbox 
                        defaultChecked 
                        onCheckedChange={(checked) => {
                          setSaveMessage({ 
                            type: 'success', 
                            text: `System health alert trigger ${checked ? 'enabled' : 'disabled'}` 
                          });
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">User Registration</p>
                        <p className="text-sm text-gray-600">Triggers onboarding workflow</p>
                      </div>
                      <Checkbox 
                        onCheckedChange={(checked) => {
                          setSaveMessage({ 
                            type: 'success', 
                            text: `User registration trigger ${checked ? 'enabled' : 'disabled'}` 
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-6">
          {/* Collaboration Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>Collaboration Features</span>
          </CardTitle>
          <CardDescription>
            Configure team collaboration and user management settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Enable Team Collaboration</h3>
              <p className="text-sm text-gray-600">
                Allow multiple team members to collaborate on assessments with role-based access control
              </p>
            </div>
            <Checkbox
              checked={localConfig.collaboration_enabled || false}
              onCheckedChange={(checked) => handleToggle('collaboration_enabled', !!checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Require User Roles</h3>
              <p className="text-sm text-gray-600">
                Enforce user role management for collaboration features (requires database setup)
              </p>
            </div>
            <Checkbox
              checked={localConfig.collaboration_require_roles || false}
              onCheckedChange={(checked) => handleToggle('collaboration_require_roles', !!checked)}
              disabled={!localConfig.collaboration_enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>System Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Collaboration Status:</span>
              <div className="mt-1">
                <Badge variant={localConfig.collaboration_enabled ? 'default' : 'secondary'}>
                  {localConfig.collaboration_enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Role Management:</span>
              <div className="mt-1">
                <Badge variant={localConfig.collaboration_require_roles ? 'default' : 'secondary'}>
                  {localConfig.collaboration_require_roles ? 'Required' : 'Optional'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="flex items-center space-x-2"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
