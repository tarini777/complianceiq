'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Users, 
  Shield, 
  AlertTriangle,
  Check,
  X,
  RefreshCw,
  Download,
  Eye
} from 'lucide-react';

interface DynamicQuestion {
  id: string;
  text: string;
  type: string;
  points: number;
  isBlocker: boolean;
  category: string;
  evidenceRequired: string[];
  responsibleRole: string[];
  validationCriteria: any;
  source: {
    regulatoryType: string;
    regulation: string;
    requirement: string;
    jurisdiction: string;
    authority: string;
  };
  status: 'pending_approval' | 'approved' | 'rejected' | 'draft';
  generatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  assessmentSection: string;
}

interface QuestionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function DynamicQuestionApproval() {
  const [questions, setQuestions] = useState<DynamicQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<DynamicQuestion[]>([]);
  const [stats, setStats] = useState<QuestionStats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvedBy, setApprovedBy] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('pending_approval');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, statusFilter, categoryFilter]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/assessment/dynamic-questions');
      const result = await response.json();
      
      if (result.success) {
        setQuestions(result.data);
        setStats({
          total: result.data.length,
          pending: result.meta.statusCounts.pending_approval || 0,
          approved: result.meta.statusCounts.approved || 0,
          rejected: result.meta.statusCounts.rejected || 0
        });
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = questions;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(q => q.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(q => q.category.includes(categoryFilter));
    }

    setFilteredQuestions(filtered);
  };

  const generateNewQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/assessment/dynamic-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate' })
      });
      
      const result = await response.json();
      if (result.success) {
        await fetchQuestions();
        alert(`Generated ${result.meta.generated} new questions`);
      }
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveQuestion = async (questionId: string) => {
    if (!approvedBy.trim()) {
      alert('Please enter your name for approval');
      return;
    }

    try {
      const response = await fetch('/api/assessment/dynamic-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          questionId,
          approvedBy
        })
      });
      
      const result = await response.json();
      if (result.success) {
        await fetchQuestions();
        alert('Question approved and added to assessment');
      }
    } catch (error) {
      console.error('Error approving question:', error);
    }
  };

  const rejectQuestion = async (questionId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      const response = await fetch('/api/assessment/dynamic-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          questionId,
          rejectionReason
        })
      });
      
      const result = await response.json();
      if (result.success) {
        await fetchQuestions();
        setRejectionReason('');
        alert('Question rejected');
      }
    } catch (error) {
      console.error('Error rejecting question:', error);
    }
  };

  const bulkApprove = async () => {
    if (selectedQuestions.length === 0) {
      alert('Please select questions to approve');
      return;
    }

    if (!approvedBy.trim()) {
      alert('Please enter your name for approval');
      return;
    }

    try {
      const response = await fetch('/api/assessment/dynamic-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bulk-approve',
          questionIds: selectedQuestions,
          approvedBy
        })
      });
      
      const result = await response.json();
      if (result.success) {
        await fetchQuestions();
        setSelectedQuestions([]);
        alert(`${result.data.count} questions approved and added to assessment`);
      }
    } catch (error) {
      console.error('Error bulk approving questions:', error);
    }
  };

  const toggleQuestionSelection = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_approval': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending_approval: 'default',
      approved: 'default',
      rejected: 'destructive'
    } as const;

    const colors = {
      pending_approval: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading questions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dynamic Question Approval</h1>
          <p className="text-gray-600">Review and approve automatically generated assessment questions</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateNewQuestions} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate New Questions
          </Button>
          <Button onClick={fetchQuestions} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Bulk Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="all">All Status</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <Label htmlFor="category-filter">Category</Label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="all">All Categories</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Data Privacy">Data Privacy</option>
                <option value="Clinical Trials">Clinical Trials</option>
                <option value="Quality Assurance">Quality Assurance</option>
              </select>
            </div>
            <div>
              <Label htmlFor="approved-by">Approved By</Label>
              <Input
                id="approved-by"
                value={approvedBy}
                onChange={(e) => setApprovedBy(e.target.value)}
                placeholder="Your name"
                className="w-48"
              />
            </div>
            {selectedQuestions.length > 0 && (
              <Button onClick={bulkApprove} className="bg-green-600 hover:bg-green-700">
                <Check className="h-4 w-4 mr-2" />
                Approve Selected ({selectedQuestions.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <Card key={question.id} className={`${selectedQuestions.includes(question.id) ? 'ring-2 ring-blue-500' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(question.status)}
                    {getStatusBadge(question.status)}
                    <Badge variant="outline">{question.category}</Badge>
                    {question.isBlocker && (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Blocker
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{question.text}</CardTitle>
                  <CardDescription>
                    {question.points} points • {question.type} • {question.assessmentSection}
                  </CardDescription>
                </div>
                {question.status === 'pending_approval' && (
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question.id)}
                      onChange={() => toggleQuestionSelection(question.id)}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Evidence Required</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {question.evidenceRequired.map((evidence, index) => (
                      <li key={index}>• {evidence}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Responsible Roles</h4>
                  <div className="flex flex-wrap gap-1">
                    {question.responsibleRole.map((role, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Regulatory Source</h4>
                <div className="text-sm text-gray-600">
                  <p><strong>Authority:</strong> {question.source.authority}</p>
                  <p><strong>Jurisdiction:</strong> {question.source.jurisdiction}</p>
                  <p><strong>Requirement:</strong> {question.source.requirement}</p>
                  <p><strong>Generated:</strong> {new Date(question.generatedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {question.status === 'pending_approval' && (
                <div className="mt-4 flex gap-2">
                  <Button 
                    onClick={() => approveQuestion(question.id)}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    onClick={() => rejectQuestion(question.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}

              {question.status === 'rejected' && question.rejectionReason && (
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Rejection Reason:</strong> {question.rejectionReason}
                  </AlertDescription>
                </Alert>
              )}

              {question.status === 'approved' && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Approved by:</strong> {question.approvedBy} on {new Date(question.approvedAt!).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">No questions found</h3>
            <p className="text-gray-500">Try adjusting your filters or generate new questions</p>
          </CardContent>
        </Card>
      )}

      {/* Rejection Modal */}
      {rejectionReason && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Reject Question</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this question is being rejected..."
                className="mt-2"
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={() => setRejectionReason('')} variant="outline">
                  Cancel
                </Button>
                <Button onClick={() => {/* Handle rejection */}} variant="destructive">
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
