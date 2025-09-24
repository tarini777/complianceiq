/**
 * Enhanced Regulatory Intelligence Component
 * Shows real regulatory data with improved UX
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  Search,
  Filter,
  Calendar,
  ExternalLink,
  Download,
  Database,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Building,
  FileText,
  Zap,
  TrendingUp
} from 'lucide-react';

interface HistoricalLegislation {
  id: string;
  title: string;
  description: string;
  jurisdiction: string;
  authority: string;
  category: string;
  effectiveDate: string;
  lastUpdated: string;
  status: string;
  documentUrl: string;
  officialUrl: string;
  isPartOfAssessment: boolean;
  assessmentSections: string[];
  impactLevel: string;
  requirements: string[];
}

export default function EnhancedRegulatoryIntelligence() {
  const [legislations, setLegislations] = useState<HistoricalLegislation[]>([]);
  const [filteredLegislations, setFilteredLegislations] = useState<HistoricalLegislation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/regulatory/historical');
      const result = await response.json();

      if (result.success) {
        setLegislations(result.data);
        setFilteredLegislations(result.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching regulatory data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterLegislations();
  }, [legislations, searchTerm, selectedCategory, selectedJurisdiction, selectedStatus]);

  const filterLegislations = () => {
    let filtered = [...legislations];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(leg => 
        leg.title.toLowerCase().includes(searchLower) ||
        leg.description.toLowerCase().includes(searchLower) ||
        leg.authority.toLowerCase().includes(searchLower)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(leg => leg.category === selectedCategory);
    }

    if (selectedJurisdiction !== 'all') {
      filtered = filtered.filter(leg => leg.jurisdiction === selectedJurisdiction);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(leg => leg.status === selectedStatus);
    }

    setFilteredLegislations(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Superseded': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'Draft': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Active: 'bg-green-100 text-green-800',
      Superseded: 'bg-red-100 text-red-800',
      Draft: 'bg-yellow-100 text-yellow-800',
      Proposed: 'bg-blue-100 text-blue-800',
      Withdrawn: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const getImpactBadge = (impactLevel: string) => {
    const variants = {
      Critical: 'bg-red-100 text-red-800',
      High: 'bg-orange-100 text-orange-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-green-100 text-green-800'
    };

    return (
      <Badge className={variants[impactLevel as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {impactLevel} Impact
      </Badge>
    );
  };

  const getUniqueValues = (field: keyof HistoricalLegislation) => {
    return [...new Set(legislations.map(leg => leg[field]))];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            Regulatory Intelligence
          </h1>
          <p className="text-gray-600 mt-2">
            Real regulatory data • {legislations.length} historical legislations • Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="flex items-center gap-2">
            <Database className="h-3 w-3" />
            Live Database
          </Badge>
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Legislations</p>
                <p className="text-2xl font-bold text-blue-600">{legislations.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Regulations</p>
                <p className="text-2xl font-bold text-green-600">
                  {legislations.filter(l => l.status === 'Active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assessment Linked</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {legislations.filter(l => l.isPartOfAssessment).length}
                </p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Impact</p>
                <p className="text-2xl font-bold text-red-600">
                  {legislations.filter(l => l.impactLevel === 'Critical').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search legislations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                {getUniqueValues('category').filter((v): v is string => typeof v === 'string').map((category: string) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Jurisdiction</label>
              <select
                value={selectedJurisdiction}
                onChange={(e) => setSelectedJurisdiction(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Jurisdictions</option>
                {getUniqueValues('jurisdiction').filter((v): v is string => typeof v === 'string').map((jurisdiction: string) => (
                  <option key={jurisdiction} value={jurisdiction}>{jurisdiction}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                {getUniqueValues('status').filter((v): v is string => typeof v === 'string').map((status: string) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Regulatory Legislations ({filteredLegislations.length})
          </h3>
        </div>

        {filteredLegislations.map((legislation) => (
          <Card key={legislation.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(legislation.status)}
                    {getStatusBadge(legislation.status)}
                    {getImpactBadge(legislation.impactLevel)}
                    <Badge variant="outline">{legislation.category}</Badge>
                    {legislation.isPartOfAssessment && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Assessment Linked
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{legislation.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {legislation.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Authority & Jurisdiction
                  </h4>
                  <p className="text-sm text-gray-600">
                    <strong>{legislation.authority}</strong> - {legislation.jurisdiction}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Timeline
                  </h4>
                  <p className="text-sm text-gray-600">
                    Effective: {new Date(legislation.effectiveDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Updated: {new Date(legislation.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Assessment Impact
                  </h4>
                  <p className="text-sm text-gray-600">
                    {legislation.assessmentSections.length} sections affected
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {legislation.assessmentSections.slice(0, 2).map((section) => (
                      <Badge key={section} variant="outline" className="text-xs">
                        {section}
                      </Badge>
                    ))}
                    {legislation.assessmentSections.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{legislation.assessmentSections.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">Key Requirements</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {legislation.requirements.slice(0, 3).map((req, index) => (
                    <li key={index}>• {req}</li>
                  ))}
                  {legislation.requirements.length > 3 && (
                    <li className="text-blue-600">+ {legislation.requirements.length - 3} more requirements</li>
                  )}
                </ul>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                {legislation.documentUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(legislation.documentUrl, '_blank')}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
                {legislation.officialUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(legislation.officialUrl, '_blank')}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Source
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredLegislations.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">No legislations found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
