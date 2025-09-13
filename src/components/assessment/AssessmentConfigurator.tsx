/**
 * Assessment Configurator - ComplianceIQ System
 * Comprehensive configuration interface for pharmaceutical AI production readiness assessment
 * Dynamic configuration based on therapeutic areas, AI model types, and deployment scenarios
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Brain, 
  Stethoscope, 
  Rocket, 
  AlertTriangle, 
  CheckCircle,
  Info,
  Target,
  Zap,
  Shield,
  FileText
} from 'lucide-react';

interface AssessmentConfiguratorProps {
  onConfigurationComplete: (config: any) => void;
  initialConfig?: any;
}

const AssessmentConfigurator: React.FC<AssessmentConfiguratorProps> = ({
  onConfigurationComplete,
  initialConfig
}) => {
  const [selectedTherapies, setSelectedTherapies] = useState<string[]>(initialConfig?.therapeuticAreas || []);
  const [selectedModels, setSelectedModels] = useState<string[]>(initialConfig?.aiModelTypes || []);
  const [selectedDeployments, setSelectedDeployments] = useState<string[]>(initialConfig?.deploymentScenarios || []);
  const [companyName, setCompanyName] = useState<string>(initialConfig?.companyName || '');
  const [assessmentDate, setAssessmentDate] = useState<string>(initialConfig?.assessmentDate || new Date().toISOString().split('T')[0]);

  // Mock data - in production, this would come from the assessment engine
  const therapeuticAreas = [
    {
      id: 'oncology',
      name: 'Oncology',
      complexity: 'Critical',
      overlayPoints: 20,
      description: 'Cancer treatment, genomics, biomarkers, tumor heterogeneity',
      requirements: ['Genomics', 'Biomarkers', 'Tumor heterogeneity', 'Clinical endpoints'],
      icon: '🧬'
    },
    {
      id: 'cardiology',
      name: 'Cardiology',
      complexity: 'High',
      overlayPoints: 18,
      description: 'Cardiovascular health, ECG interpretation, device integration',
      requirements: ['Cardiovascular endpoints', 'ECG interpretation', 'Device integration'],
      icon: '❤️'
    },
    {
      id: 'neurology',
      name: 'Neurology',
      complexity: 'High',
      overlayPoints: 16,
      description: 'Brain and nervous system, cognitive assessment, imaging',
      requirements: ['Cognitive assessment', 'Brain imaging', 'Neurological outcomes'],
      icon: '🧠'
    },
    {
      id: 'rare-disease',
      name: 'Rare Disease',
      complexity: 'Medium',
      overlayPoints: 15,
      description: 'Small populations, specialized protocols, patient registries',
      requirements: ['Small populations', 'Natural history modeling', 'Patient registries'],
      icon: '🔬'
    },
    {
      id: 'infectious-disease',
      name: 'Infectious Disease',
      complexity: 'Medium',
      overlayPoints: 12,
      description: 'Outbreak response, antimicrobial resistance, vaccine development',
      requirements: ['Outbreak response', 'Antimicrobial resistance', 'Epidemiological modeling'],
      icon: '🦠'
    },
    {
      id: 'mental-health',
      name: 'Mental Health',
      complexity: 'Medium',
      overlayPoints: 14,
      description: 'Behavioral assessment, privacy concerns, therapy adherence',
      requirements: ['Behavioral assessment', 'Privacy concerns', 'Cognitive evaluation'],
      icon: '🧘'
    },
    {
      id: 'pediatrics',
      name: 'Pediatrics',
      complexity: 'Medium',
      overlayPoints: 13,
      description: 'Age-specific considerations, safety protocols, dosage adjustments',
      requirements: ['Age-specific considerations', 'Safety protocols', 'Dosage adjustments'],
      icon: '👶'
    },
    {
      id: 'emergency-medicine',
      name: 'Emergency Medicine',
      complexity: 'High',
      overlayPoints: 17,
      description: 'Rapid response, critical decisions, emergency protocols',
      requirements: ['Rapid response', 'Critical decisions', 'Emergency protocols'],
      icon: '🚨'
    }
  ];

  const aiModelTypes = [
    {
      id: 'traditional-ml',
      name: 'Traditional AI/ML',
      complexity: 'Low',
      complexityPoints: 8,
      description: 'Supervised/unsupervised learning with deterministic outputs',
      requirements: ['Statistical validation', 'Model explainability', 'Performance monitoring'],
      icon: '📊'
    },
    {
      id: 'generative-ai',
      name: 'Generative AI (GenAI)',
      complexity: 'High',
      complexityPoints: 15,
      description: 'Large language models, content generation, creative AI',
      requirements: ['Hallucination detection', 'Content validation', 'Citation tracking'],
      icon: '🤖'
    },
    {
      id: 'agentic-ai',
      name: 'Agentic AI',
      complexity: 'Critical',
      complexityPoints: 20,
      description: 'Multi-agent systems, autonomous decision-making',
      requirements: ['Decision audit trails', 'Agent behavior monitoring', 'Safety constraints'],
      icon: '🤝'
    },
    {
      id: 'computer-vision',
      name: 'Computer Vision AI',
      complexity: 'Medium',
      complexityPoints: 12,
      description: 'Medical imaging, pathology, radiology analysis',
      requirements: ['Image preprocessing', 'Quality assessment', 'Radiologist integration'],
      icon: '👁️'
    },
    {
      id: 'nlp',
      name: 'Natural Language Processing',
      complexity: 'Medium',
      complexityPoints: 10,
      description: 'Clinical text analysis, documentation automation',
      requirements: ['Text validation', 'Medical accuracy', 'Privacy preservation'],
      icon: '📝'
    },
    {
      id: 'multimodal',
      name: 'Multimodal AI',
      complexity: 'High',
      complexityPoints: 18,
      description: 'Combined text, image, sensor data processing',
      requirements: ['Data integration', 'Validation complexity', 'Performance monitoring'],
      icon: '🔄'
    },
    {
      id: 'federated-learning',
      name: 'Federated Learning',
      complexity: 'High',
      complexityPoints: 16,
      description: 'Distributed training across institutions',
      requirements: ['Privacy protection', 'Model security', 'Federation governance'],
      icon: '🌐'
    },
    {
      id: 'edge-ai',
      name: 'Edge AI',
      complexity: 'High',
      complexityPoints: 14,
      description: 'Point-of-care, real-time clinical decision support',
      requirements: ['Latency requirements', 'Resource limitations', 'Offline capabilities'],
      icon: '⚡'
    }
  ];

  const deploymentScenarios = [
    {
      id: 'clinical-decision-support',
      name: 'Clinical Decision Support',
      complexity: 'Medium',
      complexityPoints: 10,
      description: 'Real-time patient care assistance',
      requirements: ['Real-time inference', 'Clinical workflow integration', 'Alert management'],
      icon: '🏥'
    },
    {
      id: 'drug-discovery',
      name: 'Drug Discovery & Development',
      complexity: 'Low',
      complexityPoints: 8,
      description: 'R&D acceleration and optimization',
      requirements: ['Research timelines', 'Data quality', 'Collaboration tools'],
      icon: '🔬'
    },
    {
      id: 'clinical-trials',
      name: 'Clinical Trial Operations',
      complexity: 'High',
      complexityPoints: 12,
      description: 'Trial design, patient recruitment, monitoring',
      requirements: ['Trial design', 'Patient recruitment', 'Data collection'],
      icon: '📋'
    },
    {
      id: 'regulatory-submission',
      name: 'Regulatory Submission',
      complexity: 'High',
      complexityPoints: 15,
      description: 'Automated documentation and evidence generation',
      requirements: ['Document automation', 'Quality assurance', 'Submission timelines'],
      icon: '📄'
    },
    {
      id: 'real-world-evidence',
      name: 'Real-World Evidence',
      complexity: 'Medium',
      complexityPoints: 10,
      description: 'Post-market surveillance and outcomes research',
      requirements: ['Data collection', 'Outcome measurement', 'Long-term monitoring'],
      icon: '📈'
    },
    {
      id: 'commercial-analytics',
      name: 'Commercial Analytics',
      complexity: 'Low',
      complexityPoints: 6,
      description: 'Market access, health economics, competitive intelligence',
      requirements: ['Data analytics', 'Market research', 'Business intelligence'],
      icon: '📊'
    }
  ];

  const handleTherapyToggle = (therapyId: string) => {
    setSelectedTherapies(prev => 
      prev.includes(therapyId) 
        ? prev.filter(id => id !== therapyId)
        : [...prev, therapyId]
    );
  };

  const handleModelToggle = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const handleDeploymentToggle = (deploymentId: string) => {
    setSelectedDeployments(prev => 
      prev.includes(deploymentId) 
        ? prev.filter(id => id !== deploymentId)
        : [...prev, deploymentId]
    );
  };

  const calculateComplexityScore = () => {
    const therapyScore = selectedTherapies.reduce((sum, therapyId) => {
      const therapy = therapeuticAreas.find(t => t.id === therapyId);
      return sum + (therapy?.overlayPoints || 0);
    }, 0);

    const modelScore = selectedModels.reduce((sum, modelId) => {
      const model = aiModelTypes.find(m => m.id === modelId);
      return sum + (model?.complexityPoints || 0);
    }, 0);

    const deploymentScore = selectedDeployments.reduce((sum, deploymentId) => {
      const deployment = deploymentScenarios.find(d => d.id === deploymentId);
      return sum + (deployment?.complexityPoints || 0);
    }, 0);

    return { therapyScore, modelScore, deploymentScore, total: therapyScore + modelScore + deploymentScore };
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStartAssessment = () => {
    const config = {
      therapeuticAreas: selectedTherapies,
      aiModelTypes: selectedModels,
      deploymentScenarios: selectedDeployments,
      companyName,
      assessmentDate
    };

    onConfigurationComplete(config);
  };

  const complexityScores = calculateComplexityScore();
  const isConfigurationValid = selectedTherapies.length > 0 && selectedModels.length > 0 && selectedDeployments.length > 0;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-compliance-900">Assessment Configuration</h1>
          <p className="text-compliance-600 mt-1">Configure your pharmaceutical AI production readiness assessment</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Dynamic Configuration</span>
          </Badge>
        </div>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Company Information</span>
          </CardTitle>
          <CardDescription>Basic information for the assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-compliance-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assessment Date
              </label>
              <input
                type="date"
                value={assessmentDate}
                onChange={(e) => setAssessmentDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-compliance-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Tabs */}
      <Tabs defaultValue="therapies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="therapies">Therapeutic Areas</TabsTrigger>
          <TabsTrigger value="models">AI Model Types</TabsTrigger>
          <TabsTrigger value="deployments">Deployment Scenarios</TabsTrigger>
          <TabsTrigger value="summary">Configuration Summary</TabsTrigger>
        </TabsList>

        {/* Therapeutic Areas */}
        <TabsContent value="therapies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Stethoscope className="h-5 w-5" />
                <span>Select Therapeutic Areas</span>
              </CardTitle>
              <CardDescription>
                Choose the therapeutic areas your AI systems will operate in. Each area has specific regulatory requirements and complexity overlays.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {therapeuticAreas.map((therapy) => (
                  <Card key={therapy.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={selectedTherapies.includes(therapy.id)}
                          onCheckedChange={() => handleTherapyToggle(therapy.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">
                              {therapy.icon} {therapy.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Badge className={getComplexityColor(therapy.complexity)}>
                                {therapy.complexity}
                              </Badge>
                              <Badge variant="outline">
                                +{therapy.overlayPoints} pts
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{therapy.description}</p>
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-700">Key Requirements:</p>
                            <div className="flex flex-wrap gap-1">
                              {therapy.requirements.map((req, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Model Types */}
        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Select AI Model Types</span>
              </CardTitle>
              <CardDescription>
                Choose the AI model types you're deploying. Each type has specific safety considerations and complexity requirements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiModelTypes.map((model) => (
                  <Card key={model.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={selectedModels.includes(model.id)}
                          onCheckedChange={() => handleModelToggle(model.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">
                              {model.icon} {model.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Badge className={getComplexityColor(model.complexity)}>
                                {model.complexity}
                              </Badge>
                              <Badge variant="outline">
                                +{model.complexityPoints} pts
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-700">Safety Considerations:</p>
                            <div className="flex flex-wrap gap-1">
                              {model.requirements.map((req, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deployment Scenarios */}
        <TabsContent value="deployments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Rocket className="h-5 w-5" />
                <span>Select Deployment Scenarios</span>
              </CardTitle>
              <CardDescription>
                Choose how your AI systems will be deployed. Each scenario has specific operational and regulatory requirements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deploymentScenarios.map((scenario) => (
                  <Card key={scenario.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={selectedDeployments.includes(scenario.id)}
                          onCheckedChange={() => handleDeploymentToggle(scenario.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">
                              {scenario.icon} {scenario.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Badge className={getComplexityColor(scenario.complexity)}>
                                {scenario.complexity}
                              </Badge>
                              <Badge variant="outline">
                                +{scenario.complexityPoints} pts
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-700">Key Requirements:</p>
                            <div className="flex flex-wrap gap-1">
                              {scenario.requirements.map((req, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Summary */}
        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Selected Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Selected Configuration</span>
                </CardTitle>
                <CardDescription>Review your assessment configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Therapeutic Areas ({selectedTherapies.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTherapies.map(therapyId => {
                      const therapy = therapeuticAreas.find(t => t.id === therapyId);
                      return (
                        <Badge key={therapyId} variant="outline">
                          {therapy?.icon} {therapy?.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI Model Types ({selectedModels.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedModels.map(modelId => {
                      const model = aiModelTypes.find(m => m.id === modelId);
                      return (
                        <Badge key={modelId} variant="outline">
                          {model?.icon} {model?.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Deployment Scenarios ({selectedDeployments.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDeployments.map(scenarioId => {
                      const scenario = deploymentScenarios.find(d => d.id === scenarioId);
                      return (
                        <Badge key={scenarioId} variant="outline">
                          {scenario?.icon} {scenario?.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Complexity Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Complexity Analysis</span>
                </CardTitle>
                <CardDescription>Assessment complexity and scoring breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Therapy Overlay Score</span>
                    <Badge variant="outline">+{complexityScores.therapyScore} pts</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Model Complexity Score</span>
                    <Badge variant="outline">+{complexityScores.modelScore} pts</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Deployment Complexity Score</span>
                    <Badge variant="outline">+{complexityScores.deploymentScore} pts</Badge>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Complexity Score</span>
                      <Badge className="bg-compliance-100 text-compliance-800">
                        +{complexityScores.total} pts
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Assessment Scope</p>
                      <p className="text-xs text-blue-700 mt-1">
                        This configuration will generate a comprehensive assessment with therapy-specific, 
                        model-type-specific, and deployment-specific questions tailored to your requirements.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Start Assessment Button */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Ready to Start Assessment?</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {isConfigurationValid 
                      ? 'Your configuration is complete. Click below to begin the comprehensive assessment.'
                      : 'Please select at least one option from each category to proceed.'
                    }
                  </p>
                </div>
                <Button 
                  onClick={handleStartAssessment}
                  disabled={!isConfigurationValid}
                  size="lg"
                  className="flex items-center space-x-2"
                >
                  <Shield className="h-5 w-5" />
                  <span>Start Comprehensive Assessment</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssessmentConfigurator;
