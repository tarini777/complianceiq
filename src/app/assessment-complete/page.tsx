/**
 * Complete Assessment Page - ComplianceIQ System
 * Dynamic persona-driven assessment with real-time collaboration
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';
import DynamicAssessmentView from '@/components/assessment/DynamicAssessmentView';

interface AssessmentConfig {
  personaId: string;
  subPersonaId?: string;
  therapeuticAreaId: string;
  companyId?: string;
  companyName: string;
  assessmentId?: string;
  assessmentName?: string;
  assessmentStatus?: string;
  assessmentScore?: number;
  sectionId?: string;
}

const CompleteAssessmentPage: React.FC = () => {
  const [config, setConfig] = useState<AssessmentConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if coming from remediation page
    const currentAssessment = sessionStorage.getItem('currentAssessment');
    if (currentAssessment) {
      try {
        const assessmentData = JSON.parse(currentAssessment);
        setConfig({
          personaId: 'executive',
          subPersonaId: 'chief-medical-officer',
          therapeuticAreaId: 'oncology',
          companyId: 'gilead-sciences',
          companyName: 'Gilead Sciences',
          assessmentId: assessmentData.id,
          assessmentName: assessmentData.name,
          assessmentStatus: assessmentData.status,
          assessmentScore: assessmentData.score,
          sectionId: assessmentData.sectionId
        });
        setLoading(false);
        return;
      } catch (error) {
        console.error('Error parsing current assessment:', error);
      }
    }

    // Check if coming from collaboration page
    const urlParams = new URLSearchParams(window.location.search);
    const fromCollaboration = urlParams.get('collaboration') === 'true';
    
    if (fromCollaboration) {
      // Load collaboration session data
      const collaborationData = sessionStorage.getItem('collaborationSession');
      if (collaborationData) {
        const session = JSON.parse(collaborationData);
        setConfig({
          personaId: session.primaryPersona || 'executive',
          subPersonaId: session.primarySubPersona,
          therapeuticAreaId: session.therapeuticArea || 'general',
          companyId: session.companyId,
          companyName: session.companyName || 'Current Company'
        });
        setLoading(false);
        return;
      }
    }

    // Load assessment configuration from session storage
    const loadConfig = () => {
      try {
        const storedConfig = sessionStorage.getItem('assessmentConfig');
        if (storedConfig) {
          const parsedConfig = JSON.parse(storedConfig);
          setConfig(parsedConfig);
        } else {
          // Provide default configuration to prevent loading state
          setConfig({
            personaId: 'executive',
            subPersonaId: 'chief-medical-officer',
            therapeuticAreaId: 'oncology',
            companyId: 'gilead-sciences',
            companyName: 'Gilead Sciences'
          });
        }
      } catch (error) {
        console.error('Error loading assessment config:', error);
        // Provide default configuration as fallback
        setConfig({
          personaId: 'executive',
          subPersonaId: 'chief-medical-officer',
          therapeuticAreaId: 'oncology',
          companyId: 'gilead-sciences',
          companyName: 'Gilead Sciences'
        });
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const handleBackToConfig = () => {
    window.location.href = '/assessment';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading assessment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <div className="max-w-md">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Configuration Error
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">{error}</p>
                <div className="flex gap-2">
                  <Button onClick={handleBackToConfig} className="flex-1">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Assessment Header - Show when coming from remediation */}
      {config.assessmentId && (
        <div className="container mx-auto px-4 max-w-7xl">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Assessment Details
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Viewing assessment from Remediation Command Center
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    sessionStorage.removeItem('currentAssessment');
                    window.location.href = '/remediation';
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Remediation
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Assessment ID</p>
                  <p className="font-mono text-sm">{config.assessmentId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Name</p>
                  <p className="font-medium">{config.assessmentName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge className={
                    config.assessmentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                    config.assessmentStatus === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    config.assessmentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {config.assessmentStatus?.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Score</p>
                  <p className="font-bold text-lg">{config.assessmentScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <DynamicAssessmentView config={config} />
    </div>
  );
};

export default CompleteAssessmentPage;
