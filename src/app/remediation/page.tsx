'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  Target,
  ArrowRight,
  Eye,
  Play,
  Pause,
  RefreshCw,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

interface SectionData {
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
  criticalGaps: number;
  priority: string;
}

const RemediationDashboard: React.FC = () => {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPerformance, setFilterPerformance] = useState('all');
  const [sortBy, setSortBy] = useState('priority');

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/remediation/sections');
      const result = await response.json();
      
      if (result.success) {
        setSections(result.data);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (level: string) => {
    switch (level) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'average': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'needs-improvement': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'critical-gap': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredSections = sections.filter(section => {
    const matchesSearch = section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || section.category === filterCategory;
    const matchesPerformance = filterPerformance === 'all' || section.performanceLevel === filterPerformance;
    
    return matchesSearch && matchesCategory && matchesPerformance;
  });

  const sortedSections = [...filteredSections].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
      case 'score':
        return b.score - a.score;
      case 'assessments':
        return b.totalAssessments - a.totalAssessments;
      case 'gaps':
        return b.criticalGaps - a.criticalGaps;
      default:
        return 0;
    }
  });

  const getOverallStats = () => {
    const totalSections = sections.length;
    const criticalGaps = sections.filter(s => s.performanceLevel === 'critical-gap').length;
    const excellentSections = sections.filter(s => s.performanceLevel === 'excellent').length;
    const totalAssessments = sections.reduce((sum, s) => sum + s.totalAssessments, 0);
    const avgScore = sections.length > 0 ? Math.round(sections.reduce((sum, s) => sum + s.score, 0) / sections.length) : 0;

    return { totalSections, criticalGaps, excellentSections, totalAssessments, avgScore };
  };

  const stats = getOverallStats();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading remediation dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Remediation Command Center</h1>
          <p className="text-gray-600 mt-2">Comprehensive compliance remediation across all 26 sections</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sections</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSections}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Gaps</p>
                <p className="text-2xl font-bold text-red-600">{stats.criticalGaps}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Excellent Sections</p>
                <p className="text-2xl font-bold text-green-600">{stats.excellentSections}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAssessments}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgScore}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search sections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPerformance} onValueChange={setFilterPerformance}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by performance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Performance</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="average">Average</SelectItem>
                <SelectItem value="needs-improvement">Needs Improvement</SelectItem>
                <SelectItem value="critical-gap">Critical Gap</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="score">Score</SelectItem>
                <SelectItem value="assessments">Assessments</SelectItem>
                <SelectItem value="gaps">Critical Gaps</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sections Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Section Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Section</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Assessments</TableHead>
                  <TableHead>Critical Gaps</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSections.map((section) => (
                  <TableRow key={section.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{section.title}</div>
                        <div className="text-sm text-gray-500">{section.id}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(section.performanceLevel)}
                        <Badge className={getPerformanceColor(section.performanceLevel)}>
                          {section.performanceLevel.replace('-', ' ')}
                        </Badge>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{section.score}%</span>
                        <Progress value={section.score} className="w-16 h-2" />
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{section.completionRate}%</span>
                        <Progress value={section.completionRate} className="w-16 h-2" />
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            {section.assessments.completed}✓
                          </Badge>
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            {section.assessments.inProgress}⏳
                          </Badge>
                          <Badge variant="outline" className="text-red-600 border-red-600">
                            {section.assessments.failed}✗
                          </Badge>
                        </div>
                        <div className="text-gray-500 mt-1">Total: {section.totalAssessments}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant={section.criticalGaps > 0 ? "destructive" : "secondary"}
                        className={section.criticalGaps > 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                      >
                        {section.criticalGaps} gaps
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getPriorityColor(section.priority)}>
                        {section.priority}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex gap-1">
                        <Link href={`/remediation/${section.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        {section.performanceLevel === 'critical-gap' && (
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
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
    </div>
  );
};

export default RemediationDashboard;
