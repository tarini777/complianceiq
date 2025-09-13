'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Play, 
  Trash2, 
  BarChart3, 
  Users, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface DataStatistics {
  tenants: number;
  assessments: number;
  completedAssessments: number;
  inProgressAssessments: number;
  pendingAssessments: number;
  userResponses: number;
  averageScore: { _avg: { currentScore: number | null } };
}

const DataPipelineManager: React.FC = () => {
  const [statistics, setStatistics] = useState<DataStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/data-pipeline');
      const result = await response.json();
      
      if (result.success) {
        setStatistics(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch statistics');
      }
    } catch (err) {
      setError('Failed to connect to data pipeline API');
      console.error('Statistics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string) => {
    try {
      setActionLoading(action);
      setError(null);
      
      const response = await fetch('/api/data-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh statistics after successful action
        await fetchStatistics();
      } else {
        setError(result.error || `Failed to ${action}`);
      }
    } catch (err) {
      setError(`Failed to ${action}`);
      console.error(`${action} error:`, err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading data pipeline statistics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-compliance-900">Data Pipeline Manager</h1>
          <p className="text-compliance-600 mt-1">Manage assessment data and system statistics</p>
        </div>
        <Button onClick={fetchStatistics} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Overview */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.tenants}</div>
              <p className="text-xs text-muted-foreground">Active tenants</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
              <FileText className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.assessments}</div>
              <p className="text-xs text-muted-foreground">
                {statistics.completedAssessments} completed, {statistics.inProgressAssessments} in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Responses</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.userResponses}</div>
              <p className="text-xs text-muted-foreground">Total responses collected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.averageScore._avg.currentScore?.toFixed(1) || '0.0'}%
              </div>
              <p className="text-xs text-muted-foreground">Across all assessments</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Assessment Status Breakdown */}
      {statistics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Assessment Status Breakdown</span>
            </CardTitle>
            <CardDescription>Distribution of assessments by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold">{statistics.completedAssessments}</span>
                  <Progress 
                    value={(statistics.completedAssessments / statistics.assessments) * 100} 
                    className="w-20 h-2" 
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">In Progress</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold">{statistics.inProgressAssessments}</span>
                  <Progress 
                    value={(statistics.inProgressAssessments / statistics.assessments) * 100} 
                    className="w-20 h-2" 
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold">{statistics.pendingAssessments}</span>
                  <Progress 
                    value={(statistics.pendingAssessments / statistics.assessments) * 100} 
                    className="w-20 h-2" 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Pipeline Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Data Pipeline Actions</span>
          </CardTitle>
          <CardDescription>Generate, clear, or manage sample data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => handleAction('generate-sample-data')}
              disabled={actionLoading === 'generate-sample-data'}
              className="w-full"
            >
              {actionLoading === 'generate-sample-data' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Generate Sample Data
            </Button>
            
            <Button
              onClick={() => handleAction('clear-sample-data')}
              disabled={actionLoading === 'clear-sample-data'}
              variant="destructive"
              className="w-full"
            >
              {actionLoading === 'clear-sample-data' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Clear Sample Data
            </Button>
            
            <Button
              onClick={() => handleAction('get-statistics')}
              disabled={actionLoading === 'get-statistics'}
              variant="outline"
              className="w-full"
            >
              {actionLoading === 'get-statistics' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <BarChart3 className="h-4 w-4 mr-2" />
              )}
              Refresh Statistics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataPipelineManager;
