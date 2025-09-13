/**
 * Document Management Component - ComplianceIQ
 * Handles document upload, storage, and version control for assessments
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// Using native HTML elements instead of shadcn/ui components
import { 
  Upload, 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  Clock,
  User,
  FileType,
  HardDrive,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface AssessmentDocument {
  id: string;
  assessmentId: string;
  documentType: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  version: string;
  description?: string;
  uploadedBy: string;
  uploadedAt: string;
  isActive: boolean;
}

interface DocumentManagementProps {
  assessmentId: string;
  currentUserId: string;
}

const DocumentManagement: React.FC<DocumentManagementProps> = ({ 
  assessmentId, 
  currentUserId 
}) => {
  const [documents, setDocuments] = useState<AssessmentDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('evidence');
  const [description, setDescription] = useState<string>('');
  const [version, setVersion] = useState<string>('1.0');

  useEffect(() => {
    loadDocuments();
  }, [assessmentId]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/assessment/documents?assessmentId=${assessmentId}`);
      const result = await response.json();
      
      if (result.success) {
        setDocuments(result.data);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !currentUserId) {
      alert('Please select a file and ensure you are logged in');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('assessmentId', assessmentId);
      formData.append('documentType', documentType);
      formData.append('description', description);
      formData.append('uploadedBy', currentUserId);
      formData.append('version', version);

      const response = await fetch('/api/assessment/documents', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setDocuments(prev => [result.data, ...prev]);
        setSelectedFile(null);
        setDescription('');
        alert('Document uploaded successfully');
      } else {
        alert(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentTypeIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('sheet')) return '📊';
    if (mimeType.includes('image')) return '🖼️';
    return '📁';
  };

  const getDocumentTypeColor = (documentType: string) => {
    const colors = {
      'assessment_report': 'bg-blue-100 text-blue-800',
      'compliance_report': 'bg-green-100 text-green-800',
      'remediation_plan': 'bg-orange-100 text-orange-800',
      'evidence': 'bg-purple-100 text-purple-800',
      'audit_report': 'bg-red-100 text-red-800'
    };
    return colors[documentType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Document
          </CardTitle>
          <CardDescription>
            Upload compliance documents, evidence, and reports for this assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="file" className="block text-sm font-medium text-gray-700">Select File</label>
              <input
                id="file"
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {selectedFile && (
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FileType className="h-4 w-4" />
                    {selectedFile.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4" />
                    {formatFileSize(selectedFile.size)}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">Document Type</label>
              <select
                id="documentType"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="evidence">Evidence</option>
                <option value="assessment_report">Assessment Report</option>
                <option value="compliance_report">Compliance Report</option>
                <option value="remediation_plan">Remediation Plan</option>
                <option value="audit_report">Audit Report</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="version" className="block text-sm font-medium text-gray-700">Version</label>
              <input
                id="version"
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Document description..."
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          <Button 
            onClick={handleFileUpload} 
            disabled={!selectedFile || uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assessment Documents ({documents.length})
          </CardTitle>
          <CardDescription>
            All documents uploaded for this assessment with version control
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No documents uploaded yet</p>
              <p className="text-sm text-gray-500">Upload your first document using the form above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <Card key={doc.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{getDocumentTypeIcon(doc.mimeType)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{doc.fileName}</h4>
                            <Badge className={getDocumentTypeColor(doc.documentType)}>
                              {doc.documentType.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline">v{doc.version}</Badge>
                            {doc.isActive ? (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Archived
                              </Badge>
                            )}
                          </div>
                          
                          {doc.description && (
                            <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <HardDrive className="h-4 w-4" />
                              {formatFileSize(doc.fileSize)}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {doc.uploadedBy}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(doc.uploadedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentManagement;
