/**
 * Assessment Page - ComplianceIQ System
 * Dynamic persona-based assessment with API integration
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Target, Clock, CheckCircle } from 'lucide-react';
import { assessmentApi, PersonaWithSubPersonas, TherapeuticArea } from '@/lib/api/assessment';
import { companies, Company, getCompanyById } from '@/data/companies';
import { Checkbox } from '@/components/ui/checkbox';

interface AssessmentConfig {
  personaId: string;
  subPersonaId: string;
  therapeuticAreaId: string;
  companyId: string;
  companyName: string;
  aiModelTypes: string[];
  deploymentScenarios: string[];
}

const AssessmentPage: React.FC = () => {
  const [personas, setPersonas] = useState<PersonaWithSubPersonas[]>([]);
  const [therapeuticAreas, setTherapeuticAreas] = useState<TherapeuticArea[]>([]);
  const [aiModelTypes, setAiModelTypes] = useState<any[]>([]);
  const [deploymentScenarios, setDeploymentScenarios] = useState<any[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const [selectedSubPersona, setSelectedSubPersona] = useState<string>('');
  const [selectedTherapy, setSelectedTherapy] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedAiModelTypes, setSelectedAiModelTypes] = useState<string[]>([]);
  const [selectedDeploymentScenarios, setSelectedDeploymentScenarios] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState<string>('ComplianceIQ Demo');
  const [loading, setLoading] = useState<boolean>(true);
  const [assessmentPreview, setAssessmentPreview] = useState<any>(null);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);

  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [personasResponse, therapeuticAreasResponse, aiModelTypesResponse, deploymentScenariosResponse] = await Promise.all([
          assessmentApi.getPersonas(true),
          assessmentApi.getTherapeuticAreas(),
          fetch('/api/assessment/ai-model-types').then(res => res.json()),
          fetch('/api/assessment/deployment-scenarios').then(res => res.json())
        ]);

        if (personasResponse.success) {
          setPersonas(personasResponse.data);
        }

        if (therapeuticAreasResponse.success) {
          setTherapeuticAreas(therapeuticAreasResponse.data);
        }

        if (aiModelTypesResponse.success) {
          setAiModelTypes(aiModelTypesResponse.data);
        }

        if (deploymentScenariosResponse.success) {
          setDeploymentScenarios(deploymentScenariosResponse.data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load therapeutic areas filtered by company when company changes
  useEffect(() => {
    const loadTherapeuticAreas = async () => {
      if (!selectedCompany || selectedCompany === 'custom') {
        // Load all therapeutic areas if no company or custom company selected
        try {
          const response = await assessmentApi.getTherapeuticAreas();
          if (response.success) {
            setTherapeuticAreas(response.data);
          }
        } catch (error) {
          console.error('Error loading therapeutic areas:', error);
        }
        return;
      }

      try {
        const response = await fetch(`/api/assessment/therapeutic-areas?companyId=${selectedCompany}`);
        const data = await response.json();
        if (data.success) {
          setTherapeuticAreas(data.data);
          // Reset selected therapy if it's not available for the new company
          if (selectedTherapy && !data.data.find((area: any) => area.id === selectedTherapy)) {
            setSelectedTherapy('');
          }
        }
      } catch (error) {
        console.error('Error loading company-specific therapeutic areas:', error);
      }
    };

    loadTherapeuticAreas();
  }, [selectedCompany]);

  // Generate assessment preview when configuration changes
  useEffect(() => {
    const generatePreview = async () => {
      if (!selectedPersona || !selectedTherapy) {
        setAssessmentPreview(null);
        return;
      }

      try {
        setPreviewLoading(true);
        
        // Load real sections with questions from the API with comprehensive filtering
        const aiModelTypesParam = selectedAiModelTypes.length > 0 ? selectedAiModelTypes.join(',') : '';
        const deploymentScenariosParam = selectedDeploymentScenarios.length > 0 ? selectedDeploymentScenarios.join(',') : '';
        
        const sectionsResponse = await fetch(`/api/assessment/sections?personaId=${selectedPersona}&subPersonaId=${selectedSubPersona}&therapeuticAreaId=${selectedTherapy}&aiModelTypes=${aiModelTypesParam}&deploymentScenarios=${deploymentScenariosParam}&includeQuestions=true`);
        const sectionsResult = await sectionsResponse.json();
        
        if (sectionsResult.success) {
          // Transform the API data into the expected format
          const sections = sectionsResult.data.map((section: any) => ({
            id: section.id,
            title: section.title,
            description: section.description || '',
            questionCount: section.questions?.length || 0,
            questions: section.questions || [],
            status: 'pending',
            points: section.basePoints || 0,
            isCriticalBlocker: section.isCriticalBlocker || false
          }));

          // Calculate totals with production blocker analysis
          const totalSections = sections.length;
          const totalQuestions = sections.reduce((sum: number, section: any) => sum + section.questionCount, 0);
          const totalPoints = sections.reduce((sum: number, section: any) => sum + section.points, 0);
          const criticalSections = sections.filter((section: any) => section.isCriticalBlocker).length;
          const productionBlockers = sections.reduce((sum: number, section: any) => sum + (section.stats?.productionBlockers || 0), 0);
          const estimatedTimeMinutes = Math.ceil(totalQuestions * 2.5); // 2.5 minutes per question
          
          const assessmentPreview = {
            persona: { id: selectedPersona, name: 'Selected Persona' },
            statistics: {
              totalSections,
              totalQuestions,
              totalPoints,
              criticalSections,
              productionBlockers
            },
            sections,
            configuration: {
              personaId: selectedPersona,
              subPersonaId: selectedSubPersona,
              therapeuticAreaId: selectedTherapy,
              companyId: selectedCompany,
              aiModelTypes: selectedAiModelTypes,
              deploymentScenarios: selectedDeploymentScenarios
            },
            totalSections,
            totalQuestions,
            totalPoints,
            criticalSections,
            productionBlockers,
            estimatedTime: `${Math.ceil(estimatedTimeMinutes / 60)}-${Math.ceil(estimatedTimeMinutes / 60) + 1} hours`,
            estimatedTimeMinutes
          };
          
          setAssessmentPreview(assessmentPreview);
        } else {
          console.error('Failed to load assessment sections:', sectionsResult.error);
        }
      } catch (error) {
        console.error('Error generating preview:', error);
      } finally {
        setPreviewLoading(false);
      }
    };

    generatePreview();
  }, [selectedPersona, selectedSubPersona, selectedTherapy, selectedCompany, selectedAiModelTypes, selectedDeploymentScenarios]);

  const handleStartAssessment = () => {
    if (!selectedPersona || !selectedTherapy) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Get selected company details
    const selectedCompanyData = getCompanyById(selectedCompany);
    const finalCompanyName = selectedCompanyData ? selectedCompanyData.name : companyName;
    
    // Store assessment configuration in session storage
    const config: AssessmentConfig = {
      personaId: selectedPersona,
      subPersonaId: selectedSubPersona,
      therapeuticAreaId: selectedTherapy,
      companyId: selectedCompany,
      companyName: finalCompanyName,
      aiModelTypes: selectedAiModelTypes,
      deploymentScenarios: selectedDeploymentScenarios
    };
    
    sessionStorage.setItem('assessmentConfig', JSON.stringify(config));
    
    // Navigate to assessment-complete page
    window.location.href = '/assessment-complete';
  };

  const selectedPersonaData = personas.find((p: any) => p.id === selectedPersona);
  const selectedSubPersonaData = selectedPersonaData?.subPersonas.find((sp: any) => sp.id === selectedSubPersona);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading assessment configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dynamic Assessment Configuration</h1>
          <p className="text-gray-600 mt-2">Configure your persona-driven assessment with real-time preview</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Assessment Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Company Selection */}
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium">Company *</label>
                <Select value={selectedCompany} onValueChange={(value) => {
                  setSelectedCompany(value);
                  if (value) {
                    const company = getCompanyById(value);
                    if (company) {
                      setCompanyName(company.name);
                    }
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company or enter custom name" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <div className="font-medium">{company.name}</div>
                            <div className="text-xs text-gray-500">{company.industryType}</div>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {company.subscriptionTier}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Company Name (shown when custom is selected) */}
              {selectedCompany === 'custom' && (
                <div className="space-y-2">
                  <label htmlFor="customCompany" className="text-sm font-medium">Custom Company Name</label>
                  <input
                    id="customCompany"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter custom company name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Therapeutic Area */}
              <div className="space-y-2">
                <label htmlFor="therapy" className="text-sm font-medium">Therapeutic Area *</label>
                <Select value={selectedTherapy} onValueChange={setSelectedTherapy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select therapeutic area" />
                  </SelectTrigger>
                  <SelectContent>
                    {therapeuticAreas.map((area) => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Persona */}
              <div className="space-y-2">
                <label htmlFor="persona" className="text-sm font-medium">Primary Role *</label>
                <Select value={selectedPersona} onValueChange={(value) => {
                  setSelectedPersona(value);
                  setSelectedSubPersona(''); // Reset sub-persona when persona changes
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary role" />
                  </SelectTrigger>
                  <SelectContent>
                    {personas.map((persona: any) => (
                      <SelectItem key={persona.id} value={persona.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{persona.name}</span>
                          {persona.isAdmin && <Badge variant="secondary" className="ml-2">Admin</Badge>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sub-Persona */}
              {selectedPersonaData && selectedPersonaData.subPersonas.length > 0 && (
                <div className="space-y-2">
                  <label htmlFor="subPersona" className="text-sm font-medium">Specialization</label>
                  <Select value={selectedSubPersona} onValueChange={setSelectedSubPersona}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your specialization (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedPersonaData.subPersonas.map((subPersona) => (
                        <SelectItem key={subPersona.id} value={subPersona.id}>
                          <div>
                            <div className="font-medium">{subPersona.name}</div>
                            <div className="text-xs text-gray-500">{subPersona.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* AI Model Types */}
              <div className="space-y-3">
                <label className="text-sm font-medium">AI Model Architectures</label>
                <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto border rounded-md p-3">
                  {aiModelTypes.map((model) => (
                    <div key={model.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={`ai-model-${model.id}`}
                        checked={selectedAiModelTypes.includes(model.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAiModelTypes([...selectedAiModelTypes, model.id]);
                          } else {
                            setSelectedAiModelTypes(selectedAiModelTypes.filter(id => id !== model.id));
                          }
                        }}
                      />
                      <div className="flex-1">
                        <label htmlFor={`ai-model-${model.id}`} className="text-sm font-medium cursor-pointer">
                          {model.name}
                        </label>
                        <div className="text-xs text-gray-500 mt-1">
                          Complexity: {model.complexityPoints} points
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  Select one or more AI model architectures that apply to your use case
                </div>
              </div>

              {/* Deployment Scenarios */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Deployment Scenarios</label>
                <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto border rounded-md p-3">
                  {deploymentScenarios.map((scenario) => (
                    <div key={scenario.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={`deployment-${scenario.id}`}
                        checked={selectedDeploymentScenarios.includes(scenario.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedDeploymentScenarios([...selectedDeploymentScenarios, scenario.id]);
                          } else {
                            setSelectedDeploymentScenarios(selectedDeploymentScenarios.filter(id => id !== scenario.id));
                          }
                        }}
                      />
                      <div className="flex-1">
                        <label htmlFor={`deployment-${scenario.id}`} className="text-sm font-medium cursor-pointer">
                          {scenario.name}
                        </label>
                        <div className="text-xs text-gray-500 mt-1">
                          Complexity: {scenario.complexityPoints} points
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  Select one or more deployment scenarios that apply to your AI implementation
                </div>
              </div>

              {/* Start Assessment Button */}
              <div className="pt-4">
                <Button 
                  onClick={handleStartAssessment}
                  className="w-full"
                  disabled={!selectedPersona || !selectedTherapy}
                >
                  Start Dynamic Assessment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Assessment Preview
                {previewLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assessmentPreview ? (
                <div className="space-y-4">
                  {/* Company Info */}
                  {selectedCompany && selectedCompany !== 'custom' && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-semibold text-green-900">
                        {companyName}
                      </h3>
                      <p className="text-sm text-green-700 mt-1">
                        {getCompanyById(selectedCompany)?.industryType} • {getCompanyById(selectedCompany)?.subscriptionTier} Tier
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {getCompanyById(selectedCompany)?.therapeuticFocus.map((focus) => (
                          <Badge key={focus} variant="outline" className="text-xs">
                            {focus.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Persona Info */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900">
                      {assessmentPreview.persona.name}
                      {assessmentPreview.persona.subPersona && (
                        <span className="text-blue-700"> - {assessmentPreview.persona.subPersona.name}</span>
                      )}
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">
                      {assessmentPreview.persona.description}
                    </p>
                    {assessmentPreview.persona.isAdmin && (
                      <Badge variant="secondary" className="mt-2">Full Access to All Sections</Badge>
                    )}
                  </div>

                  {/* Therapeutic Area Info */}
                  {assessmentPreview.therapeuticArea && (
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h3 className="font-semibold text-purple-900">
                        {assessmentPreview.therapeuticArea.name}
                      </h3>
                      <p className="text-sm text-purple-700 mt-1">
                        Therapeutic Focus Area
                      </p>
                    </div>
                  )}

                  {/* AI Model Types Info */}
                  {assessmentPreview.aiModelTypes && assessmentPreview.aiModelTypes.length > 0 && (
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h3 className="font-semibold text-orange-900 mb-2">AI Model Architectures</h3>
                      <div className="flex flex-wrap gap-2">
                        {assessmentPreview.aiModelTypes.map((model: any) => (
                          <Badge key={model.id} variant="outline" className="text-xs">
                            {model.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Deployment Scenarios Info */}
                  {assessmentPreview.deploymentScenarios && assessmentPreview.deploymentScenarios.length > 0 && (
                    <div className="p-4 bg-teal-50 rounded-lg">
                      <h3 className="font-semibold text-teal-900 mb-2">Deployment Scenarios</h3>
                      <div className="flex flex-wrap gap-2">
                        {assessmentPreview.deploymentScenarios.map((scenario: any) => (
                          <Badge key={scenario.id} variant="outline" className="text-xs">
                            {scenario.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assessment Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {assessmentPreview?.totalSections || 0}
                      </div>
                      <div className="text-sm text-gray-600">Sections</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {assessmentPreview?.totalQuestions || 0}
                      </div>
                      <div className="text-sm text-gray-600">Questions</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {assessmentPreview?.totalPoints || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Points</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {assessmentPreview?.estimatedTimeMinutes || 0}
                      </div>
                      <div className="text-sm text-gray-600">Minutes</div>
                    </div>
                  </div>

                  {/* Critical Sections */}
                  {assessmentPreview?.criticalSections > 0 && (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2 text-red-800">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">
                          {assessmentPreview.criticalSections} Critical Sections
                        </span>
                      </div>
                      <p className="text-sm text-red-700 mt-1">
                        These sections must be completed for production readiness
                      </p>
                    </div>
                  )}

                  {/* Production Blockers */}
                  {assessmentPreview?.productionBlockers > 0 && (
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-2 text-orange-800">
                        <span className="text-lg">🚨</span>
                        <span className="font-medium">
                          {assessmentPreview.productionBlockers} Production Blockers
                        </span>
                      </div>
                      <p className="text-sm text-orange-700 mt-1">
                        These questions must be resolved before production deployment
                      </p>
                    </div>
                  )}

                  {/* Section List */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Assessment Sections:</h4>
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {assessmentPreview.sections.map((section: any) => (
                        <div key={section.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                          <span className="font-medium">{section.title}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant={section.isCriticalBlocker ? "destructive" : "secondary"}>
                              {section.isCriticalBlocker ? "Critical" : "Standard"}
                            </Badge>
                            {section.stats?.productionBlockers > 0 && (
                              <Badge variant="outline" className="text-orange-600 border-orange-300">
                                🚨 {section.stats.productionBlockers} Blockers
                              </Badge>
                            )}
                            <span className="text-gray-500">{section.questions?.length || 0} questions</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a persona and therapeutic area to see assessment preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;