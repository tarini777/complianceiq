/**
 * Data Source Status Component
 * Shows users what data is real vs mock
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Database,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  Shield,
  Users,
  FileText,
  Zap,
  Clock,
  TrendingUp
} from 'lucide-react';

interface DataSource {
  name: string;
  description: string;
  status: 'live' | 'mock' | 'partial';
  recordCount: number | string;
  lastUpdated: string;
  icon: React.ReactNode;
  endpoint?: string;
}

export default function DataSourceStatus() {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  const checkDataSources = async () => {
    try {
      setLoading(true);

      // Check multiple data sources
      const [
        assessmentResponse,
        dashboardResponse,
        regulatoryResponse,
        companiesResponse
      ] = await Promise.all([
        fetch('/api/analytics/assessment'),
        fetch('/api/dashboard/intelligence'),
        fetch('/api/regulatory/historical'),
        fetch('/api/companies')
      ]);

      const assessmentData = await assessmentResponse.json();
      const dashboardData = await dashboardResponse.json();
      const regulatoryData = await regulatoryResponse.json();
      const companiesData = await companiesResponse.json();

      const sources: DataSource[] = [
        {
          name: 'Assessment Analytics',
          description: 'Real assessment data from database',
          status: 'live',
          recordCount: assessmentData.success ? assessmentData.data.overview.totalAssessments : 0,
          lastUpdated: 'Live',
          icon: <BarChart3 className="h-5 w-5 text-green-500" />,
          endpoint: '/api/analytics/assessment'
        },
        {
          name: 'Dashboard Intelligence',
          description: 'Enhanced dashboard metrics',
          status: dashboardData.success ? 'live' : 'mock',
          recordCount: dashboardData.success ? dashboardData.data.overview.totalAssessments : 'N/A',
          lastUpdated: 'Real-time',
          icon: <Database className="h-5 w-5 text-blue-500" />,
          endpoint: '/api/dashboard/intelligence'
        },
        {
          name: 'Historical Legislations',
          description: 'Static regulatory legislation data',
          status: 'live',
          recordCount: regulatoryData.success ? regulatoryData.data.length : 0,
          lastUpdated: 'Static dataset',
          icon: <Shield className="h-5 w-5 text-purple-500" />,
          endpoint: '/api/regulatory/historical'
        },
        {
          name: 'Company Data',
          description: 'Tenant and company information',
          status: 'live',
          recordCount: companiesData.success ? companiesData.data.length : 0,
          lastUpdated: 'Live',
          icon: <Users className="h-5 w-5 text-orange-500" />,
          endpoint: '/api/companies'
        },
        {
          name: 'AskRexi Intelligence',
          description: 'AI assistant with regulatory knowledge',
          status: 'partial',
          recordCount: 'Multi-agent',
          lastUpdated: 'Real + Mock fallback',
          icon: <Zap className="h-5 w-5 text-yellow-500" />,
          endpoint: '/api/askrexi'
        },
        {
          name: 'Regulatory Updates',
          description: 'Live regulatory intelligence updates',
          status: 'mock',
          recordCount: 'Mock data',
          lastUpdated: 'Fallback mode',
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
          endpoint: '/api/regulatory/updates'
        },
        {
          name: 'Rules Intelligence',
          description: 'ML-powered rules analysis',
          status: 'mock',
          recordCount: 'Sample data',
          lastUpdated: 'Mock analysis',
          icon: <TrendingUp className="h-5 w-5 text-indigo-500" />,
          endpoint: '/api/intelligence/rules'
        }
      ];

      setDataSources(sources);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error checking data sources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDataSources();
  }, []);

  const getStatusBadge = (status: 'live' | 'mock' | 'partial') => {
    switch (status) {
      case 'live':
        return <Badge className="bg-green-100 text-green-800">Live Data</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800">Hybrid</Badge>;
      case 'mock':
        return <Badge className="bg-red-100 text-red-800">Mock Data</Badge>;
    }
  };

  const getStatusIcon = (status: 'live' | 'mock' | 'partial') => {
    switch (status) {
      case 'live':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'partial':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'mock':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const liveCount = dataSources.filter(ds => ds.status === 'live').length;
  const mockCount = dataSources.filter(ds => ds.status === 'mock').length;
  const partialCount = dataSources.filter(ds => ds.status === 'partial').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Database className="h-6 w-6 text-blue-600" />
            Data Source Status
          </h2>
          <p className="text-gray-600 mt-1">
            Real-time overview of data sources • Last checked: {lastChecked.toLocaleTimeString()}
          </p>
        </div>
        <Button variant="outline" onClick={checkDataSources} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Check Status
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Live Data Sources</p>
                <p className="text-2xl font-bold text-green-600">{liveCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-gray-600 mt-2">Connected to real database</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hybrid Sources</p>
                <p className="text-2xl font-bold text-yellow-600">{partialCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-xs text-gray-600 mt-2">Real data with mock fallback</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mock Data Sources</p>
                <p className="text-2xl font-bold text-red-600">{mockCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-xs text-gray-600 mt-2">Using sample/fallback data</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Sources List */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sources Detail</CardTitle>
          <CardDescription>
            Detailed status of all data sources in the ComplianceIQ platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {source.icon}
                    {getStatusIcon(source.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold">{source.name}</h3>
                      {getStatusBadge(source.status)}
                    </div>
                    <p className="text-sm text-gray-600">{source.description}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span>Records: {source.recordCount}</span>
                      <span>Updated: {source.lastUpdated}</span>
                      {source.endpoint && (
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {source.endpoint}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {source.endpoint && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`${window.location.origin}${source.endpoint}`, '_blank')}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    API
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockCount > 0 && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm font-medium text-red-800">
                  {mockCount} data source{mockCount > 1 ? 's' : ''} using mock data
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Consider populating these with real data for production use
                </p>
              </div>
            )}
            
            {partialCount > 0 && (
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm font-medium text-yellow-800">
                  {partialCount} hybrid data source{partialCount > 1 ? 's' : ''} available
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  These provide real data when available, with intelligent fallbacks
                </p>
              </div>
            )}

            {liveCount >= 4 && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-800">
                  Excellent! {liveCount} live data sources connected
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Your platform is using real database data for core functionality
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
