'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Calendar, 
  Globe, 
  Building, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock,
  FileText,
  ExternalLink,
  Download,
  Copy,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface HistoricalLegislation {
  id: string;
  title: string;
  description: string;
  jurisdiction: string;
  authority: string;
  category: string;
  subcategory: string;
  effectiveDate: string;
  lastUpdated: string;
  status: string;
  supersededBy?: string;
  documentUrl: string;
  officialUrl: string;
  isPartOfAssessment: boolean;
  assessmentSections: string[];
  impactLevel: string;
  requirements: string[];
  penalties: string[];
  implementationGuidance: string[];
  relatedLegislations: string[];
  timeline: {
    proposed: string;
    draft: string;
    effective: string;
    lastAmendment: string;
  };
  geographicScope: string[];
  industryScope: string[];
  aiModelTypes: string[];
  deploymentScenarios: string[];
  therapeuticAreas: string[];
}

export default function HistoricalLegislationsTab() {
  const [legislations, setLegislations] = useState<HistoricalLegislation[]>([]);
  const [filteredLegislations, setFilteredLegislations] = useState<HistoricalLegislation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAssessment, setSelectedAssessment] = useState('all');
  const [selectedAuthority, setSelectedAuthority] = useState('all');
  const [sortBy, setSortBy] = useState('effectiveDate');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    // Check if data is already cached in sessionStorage
    const cachedData = sessionStorage.getItem('historicalLegislations');
    const cacheTimestamp = sessionStorage.getItem('historicalLegislationsTimestamp');
    
    // Check if cache is less than 1 hour old
    const isCacheValid = cacheTimestamp && 
      (Date.now() - parseInt(cacheTimestamp)) < (60 * 60 * 1000);
    
    if (cachedData && isCacheValid) {
      try {
        const parsedData = JSON.parse(cachedData);
        setLegislations(parsedData);
        setLoading(false);
        return;
      } catch (error) {
        console.error('Error parsing cached data:', error);
      }
    }
    
    // Fetch fresh data (includes both static historical and aged regulations)
    fetchHistoricalLegislations();
  }, []);

  useEffect(() => {
    filterLegislations();
  }, [legislations, searchTerm, selectedCategory, selectedJurisdiction, selectedStatus, selectedAssessment, selectedAuthority, sortBy, sortOrder]);

  const fetchHistoricalLegislations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/regulatory/historical');
      const result = await response.json();
      
      if (result.success) {
        // Cache the data in sessionStorage with timestamp
        sessionStorage.setItem('historicalLegislations', JSON.stringify(result.data));
        sessionStorage.setItem('historicalLegislationsTimestamp', Date.now().toString());
        setLegislations(result.data);
        setFilteredLegislations(result.data);
      }
    } catch (error) {
      console.error('Error fetching historical legislations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLegislations = () => {
    let filtered = [...legislations];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(leg => 
        leg.title.toLowerCase().includes(searchLower) ||
        leg.description.toLowerCase().includes(searchLower) ||
        leg.authority.toLowerCase().includes(searchLower) ||
        leg.jurisdiction.toLowerCase().includes(searchLower) ||
        leg.requirements.some(req => req.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(leg => leg.category === selectedCategory);
    }

    // Jurisdiction filter
    if (selectedJurisdiction !== 'all') {
      filtered = filtered.filter(leg => leg.jurisdiction === selectedJurisdiction);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(leg => leg.status === selectedStatus);
    }

    // Assessment filter
    if (selectedAssessment !== 'all') {
      const isPart = selectedAssessment === 'true';
      filtered = filtered.filter(leg => leg.isPartOfAssessment === isPart);
    }

    // Authority filter
    if (selectedAuthority !== 'all') {
      filtered = filtered.filter(leg => leg.authority === selectedAuthority);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'effectiveDate':
          aValue = new Date(a.effectiveDate);
          bValue = new Date(b.effectiveDate);
          break;
        case 'lastUpdated':
          aValue = new Date(a.lastUpdated);
          bValue = new Date(b.lastUpdated);
          break;
        case 'impactLevel':
          const impactOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          aValue = impactOrder[a.impactLevel as keyof typeof impactOrder];
          bValue = impactOrder[b.impactLevel as keyof typeof impactOrder];
          break;
        default:
          aValue = new Date(a.effectiveDate);
          bValue = new Date(b.effectiveDate);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredLegislations(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Superseded': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'Draft': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Proposed': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'Withdrawn': return <XCircle className="h-4 w-4 text-gray-500" />;
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
      <Badge className={variants[status as keyof typeof variants]}>
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
      <Badge className={variants[impactLevel as keyof typeof variants]}>
        {impactLevel} Impact
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading historical legislations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Historical Legislations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <Input
                placeholder="Search legislations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Data Privacy">Data Privacy</option>
                <option value="Clinical Trials">Clinical Trials</option>
                <option value="Drug Safety">Drug Safety</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="Medical Devices">Medical Devices</option>
                <option value="General">General</option>
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
                <option value="United States">United States</option>
                <option value="European Union">European Union</option>
                <option value="Global">Global</option>
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
                <option value="Active">Active</option>
                <option value="Superseded">Superseded</option>
                <option value="Draft">Draft</option>
                <option value="Proposed">Proposed</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Assessment Status</label>
              <select
                value={selectedAssessment}
                onChange={(e) => setSelectedAssessment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All</option>
                <option value="true">Part of Assessment</option>
                <option value="false">Not Part of Assessment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Authority</label>
              <select
                value={selectedAuthority}
                onChange={(e) => setSelectedAuthority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Authorities</option>
                <option value="FDA">FDA</option>
                <option value="EMA">EMA</option>
                <option value="ICH">ICH</option>
                <option value="WHO">WHO</option>
                <option value="European Commission">European Commission</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="effectiveDate">Effective Date</option>
                <option value="lastUpdated">Last Updated</option>
                <option value="title">Title</option>
                <option value="impactLevel">Impact Level</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sort Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Historical Legislations ({filteredLegislations.length})
          </h3>
        </div>

        {filteredLegislations.map((legislation) => (
          <Card key={legislation.id} className="hover:shadow-md transition-shadow">
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
                        Part of Assessment
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
                    {legislation.assessmentSections.slice(0, 3).map((section) => (
                      <Badge key={section} variant="outline" className="text-xs">
                        {section}
                      </Badge>
                    ))}
                    {legislation.assessmentSections.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{legislation.assessmentSections.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
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
                <div>
                  <h4 className="font-semibold mb-2">Scope</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>AI Models:</strong> {legislation.aiModelTypes.join(', ')}</p>
                    <p><strong>Deployment:</strong> {legislation.deploymentScenarios.join(', ')}</p>
                    <p><strong>Therapeutic Areas:</strong> {legislation.therapeuticAreas.slice(0, 3).join(', ')}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                {legislation.documentUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.open(legislation.documentUrl, '_blank');
                      console.log(`Downloaded: ${legislation.title}`);
                    }}
                    className="hover:bg-blue-50 transition-colors"
                    title={`Download ${legislation.title} document`}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
                {legislation.officialUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.open(legislation.officialUrl, '_blank');
                      console.log(`Viewed source: ${legislation.title}`);
                    }}
                    className="hover:bg-blue-50 transition-colors"
                    title={`View official ${legislation.authority} source for ${legislation.title}`}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Source
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const linkToCopy = legislation.documentUrl || legislation.officialUrl || window.location.href;
                    navigator.clipboard.writeText(linkToCopy).then(() => {
                      console.log(`Copied link: ${legislation.title}`);
                    });
                  }}
                  className="hover:bg-gray-50 transition-colors"
                  title="Copy link to this legislation"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
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
