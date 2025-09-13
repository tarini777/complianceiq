/**
 * Persona Selector Component - ComplianceIQ System
 * Allows users to select their role/persona for focused assessment
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Brain, 
  Shield, 
  CheckCircle, 
  Scale, 
  Heart, 
  Database, 
  Cog,
  Crown,
  Target,
  Clock,
  ArrowRight
} from 'lucide-react';

interface SubPersona {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  estimatedTime: string;
  specificRoles: string[];
  focusQuestions: string[];
}

interface Persona {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  questionCount: number;
  estimatedTime: string;
  primaryRoles: string[];
  focusAreas: string[];
  sections: string[];
  subPersonas?: SubPersona[];
}

interface PersonaSelectorProps {
  onPersonaSelected: (persona: Persona) => void;
  useEnhancedView?: boolean;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ onPersonaSelected }) => {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [selectedSubPersona, setSelectedSubPersona] = useState<string | null>(null);

  const personas: Persona[] = [
    {
      id: 'executive-leadership',
      name: 'Executive Leadership',
      description: 'Strategic oversight and governance for AI implementation',
      icon: Crown,
      color: 'from-purple-500 to-purple-700',
      questionCount: 28,
      estimatedTime: '20-25 minutes',
      primaryRoles: ['CEO', 'CTO', 'Chief Medical Officer', 'Chief Compliance Officer'],
      focusAreas: ['Strategic Planning', 'Governance Structure', 'Business Impact'],
      sections: ['AI Governance Committee', 'Business Impact & ROI', 'Strategic Planning'],
      subPersonas: [
        {
          id: 'ceo-csuite',
          name: 'CEO & C-Suite',
          description: 'Top-level strategic decisions and board oversight',
          questionCount: 12,
          estimatedTime: '10-15 minutes',
          specificRoles: ['CEO', 'Board Members', 'Executive Committee'],
          focusQuestions: ['Strategic AI governance', 'Business impact assessment', 'Executive oversight']
        },
        {
          id: 'chief-medical',
          name: 'Chief Medical Officer',
          description: 'Medical oversight and patient safety governance',
          questionCount: 10,
          estimatedTime: '8-12 minutes',
          specificRoles: ['Chief Medical Officer', 'Medical Affairs Director', 'Clinical Leadership'],
          focusQuestions: ['Clinical AI governance', 'Patient safety oversight', 'Medical device compliance']
        },
        {
          id: 'chief-compliance',
          name: 'Chief Compliance Officer',
          description: 'Regulatory compliance and risk management oversight',
          questionCount: 14,
          estimatedTime: '12-18 minutes',
          specificRoles: ['Chief Compliance Officer', 'Risk Management Director', 'Audit Director'],
          focusQuestions: ['Compliance frameworks', 'Risk assessment', 'Audit oversight']
        }
      ]
    },
    {
      id: 'data-science-ai',
      name: 'Data Science & AI Team',
      description: 'Technical implementation and model development',
      icon: Brain,
      color: 'from-blue-500 to-blue-700',
      questionCount: 42,
      estimatedTime: '30-35 minutes',
      primaryRoles: ['Data Science/AI Head', 'ML Engineers', 'MLOps Engineers', 'AI Specialists'],
      focusAreas: ['Model Development', 'Validation', 'Technical Implementation'],
      sections: ['AI Model Validation', 'Technology-Specific Governance', 'MLOps Framework'],
      subPersonas: [
        {
          id: 'ai-head-manager',
          name: 'AI Head & Manager',
          description: 'Leadership and strategic oversight of AI initiatives',
          questionCount: 18,
          estimatedTime: '15-20 minutes',
          specificRoles: ['Data Science/AI Head', 'AI Manager', 'Technical Director'],
          focusQuestions: ['AI strategy oversight', 'Team governance', 'Technical architecture decisions']
        },
        {
          id: 'ml-engineer',
          name: 'ML Engineer',
          description: 'Model development and machine learning implementation',
          questionCount: 16,
          estimatedTime: '12-18 minutes',
          specificRoles: ['ML Engineer', 'Deep Learning Engineer', 'NLP Engineer', 'Computer Vision Engineer'],
          focusQuestions: ['Model development', 'Algorithm validation', 'Technical implementation']
        },
        {
          id: 'mlops-engineer',
          name: 'MLOps Engineer',
          description: 'Model deployment, monitoring, and operations',
          questionCount: 14,
          estimatedTime: '12-15 minutes',
          specificRoles: ['MLOps Engineer', 'DevOps Engineer', 'Platform Engineer'],
          focusQuestions: ['Model deployment', 'Monitoring systems', 'Operations management']
        }
      ]
    },
    {
      id: 'regulatory-affairs',
      name: 'Regulatory Affairs',
      description: 'Compliance and regulatory submissions expertise',
      icon: Shield,
      color: 'from-green-500 to-green-700',
      questionCount: 38,
      estimatedTime: '25-30 minutes',
      primaryRoles: ['Regulatory Affairs Director', 'International Regulatory Specialists', 'FDA Specialists'],
      focusAreas: ['Compliance', 'Regulatory Submissions', 'International Harmonization'],
      sections: ['FDA 2025 Guidance', 'International Regulatory Harmonization', 'Standards Compliance'],
      subPersonas: [
        {
          id: 'regulatory-director',
          name: 'Regulatory Director',
          description: 'Strategic regulatory oversight and submissions management',
          questionCount: 16,
          estimatedTime: '12-18 minutes',
          specificRoles: ['Regulatory Affairs Director', 'Senior Regulatory Manager'],
          focusQuestions: ['Regulatory strategy', 'Submission management', 'FDA interactions']
        },
        {
          id: 'fda-specialist',
          name: 'FDA Specialist',
          description: 'FDA-specific compliance and guidance expertise',
          questionCount: 12,
          estimatedTime: '10-15 minutes',
          specificRoles: ['FDA Specialist', 'US Regulatory Manager', 'FDA Liaison'],
          focusQuestions: ['FDA 2025 guidance', 'US regulatory requirements', 'FDA submission processes']
        },
        {
          id: 'international-regulatory',
          name: 'International Regulatory',
          description: 'Global regulatory harmonization and compliance',
          questionCount: 14,
          estimatedTime: '12-18 minutes',
          specificRoles: ['International Regulatory Specialist', 'EMA Specialist', 'Global Regulatory Manager'],
          focusQuestions: ['International harmonization', 'EMA requirements', 'Global compliance']
        }
      ]
    },
    {
      id: 'quality-risk',
      name: 'Quality Assurance & Risk',
      description: 'Quality systems and risk management oversight',
      icon: CheckCircle,
      color: 'from-orange-500 to-orange-700',
      questionCount: 32,
      estimatedTime: '20-25 minutes',
      primaryRoles: ['Quality Assurance Director', 'Risk Management Specialists', 'Audit Managers'],
      focusAreas: ['Quality Systems', 'Risk Assessment', 'Compliance Monitoring'],
      sections: ['GMLP Framework', 'Quality Assurance', 'Risk Assessment'],
      subPersonas: [
        {
          id: 'quality-director',
          name: 'Quality Director',
          description: 'Quality systems oversight and GMLP framework management',
          questionCount: 14,
          estimatedTime: '12-18 minutes',
          specificRoles: ['Quality Assurance Director', 'Senior Quality Manager'],
          focusQuestions: ['Quality systems', 'GMLP framework', 'Quality oversight']
        },
        {
          id: 'risk-specialist',
          name: 'Risk Specialist',
          description: 'Risk assessment and management expertise',
          questionCount: 10,
          estimatedTime: '8-12 minutes',
          specificRoles: ['Risk Management Specialist', 'Risk Analyst', 'Risk Manager'],
          focusQuestions: ['Risk assessment', 'Risk mitigation', 'Risk monitoring']
        },
        {
          id: 'audit-manager',
          name: 'Audit Manager',
          description: 'Audit oversight and compliance monitoring',
          questionCount: 12,
          estimatedTime: '10-15 minutes',
          specificRoles: ['Audit Manager', 'Compliance Auditor', 'Internal Audit Director'],
          focusQuestions: ['Audit oversight', 'Compliance monitoring', 'Audit procedures']
        }
      ]
    },
    {
      id: 'legal-privacy',
      name: 'Legal & Privacy',
      description: 'Legal compliance and data protection expertise',
      icon: Scale,
      color: 'from-red-500 to-red-700',
      questionCount: 28,
      estimatedTime: '20-25 minutes',
      primaryRoles: ['Legal Counsel', 'Privacy Officer', 'Data Protection Officer'],
      focusAreas: ['Legal Compliance', 'Privacy', 'Liability', 'Intellectual Property'],
      sections: ['Legal Compliance & Liability', 'Data Privacy', 'Third-Party Risk'],
      subPersonas: [
        {
          id: 'legal-counsel',
          name: 'Legal Counsel',
          description: 'Legal compliance and liability management',
          questionCount: 12,
          estimatedTime: '10-15 minutes',
          specificRoles: ['Legal Counsel', 'Senior Legal Counsel', 'Legal Director'],
          focusQuestions: ['Legal compliance', 'Liability management', 'Legal frameworks']
        },
        {
          id: 'privacy-officer',
          name: 'Privacy Officer',
          description: 'Data privacy and protection expertise',
          questionCount: 10,
          estimatedTime: '8-12 minutes',
          specificRoles: ['Privacy Officer', 'Data Protection Officer', 'Privacy Manager'],
          focusQuestions: ['Data privacy', 'Privacy frameworks', 'Data protection']
        },
        {
          id: 'compliance-manager',
          name: 'Compliance Manager',
          description: 'Regulatory compliance and third-party risk management',
          questionCount: 14,
          estimatedTime: '12-18 minutes',
          specificRoles: ['Compliance Manager', 'Compliance Officer', 'Risk Manager'],
          focusQuestions: ['Regulatory compliance', 'Third-party risk', 'Compliance monitoring']
        }
      ]
    },
    {
      id: 'clinical-operations',
      name: 'Clinical Operations',
      description: 'Clinical trials and patient safety management',
      icon: Heart,
      color: 'from-pink-500 to-pink-700',
      questionCount: 35,
      estimatedTime: '25-30 minutes',
      primaryRoles: ['Clinical Operations Director', 'Medical Affairs Director', 'Pharmacovigilance Director'],
      focusAreas: ['Clinical Trials', 'Patient Safety', 'Medical Affairs'],
      sections: ['Clinical Validation', 'Pharmacovigilance', 'Human-in-the-Loop'],
      subPersonas: [
        {
          id: 'clinical-director',
          name: 'Clinical Director',
          description: 'Clinical operations oversight and trial management',
          questionCount: 14,
          estimatedTime: '12-18 minutes',
          specificRoles: ['Clinical Operations Director', 'Clinical Trial Manager'],
          focusQuestions: ['Clinical operations', 'Trial management', 'Clinical oversight']
        },
        {
          id: 'medical-affairs',
          name: 'Medical Affairs',
          description: 'Medical oversight and clinical decision support',
          questionCount: 12,
          estimatedTime: '10-15 minutes',
          specificRoles: ['Medical Affairs Director', 'Medical Affairs Manager'],
          focusQuestions: ['Medical oversight', 'Clinical decision support', 'Medical affairs']
        },
        {
          id: 'pharmacovigilance',
          name: 'Pharmacovigilance',
          description: 'Patient safety and adverse event monitoring',
          questionCount: 13,
          estimatedTime: '10-15 minutes',
          specificRoles: ['Pharmacovigilance Director', 'Safety Officer', 'PV Manager'],
          focusQuestions: ['Patient safety', 'Adverse event monitoring', 'Safety oversight']
        }
      ]
    },
    {
      id: 'data-it-governance',
      name: 'Data & IT Governance',
      description: 'Data management and technical infrastructure',
      icon: Database,
      color: 'from-cyan-500 to-cyan-700',
      questionCount: 38,
      estimatedTime: '30-35 minutes',
      primaryRoles: ['Chief Data Officer', 'Data Governance Director', 'IT Security Director'],
      focusAreas: ['Data Management', 'Security', 'Infrastructure', 'Interoperability'],
      sections: ['Advanced Data Governance', 'AI System Interoperability', 'Security & Access Control'],
      subPersonas: [
        {
          id: 'data-officer',
          name: 'Data Officer',
          description: 'Data governance and management oversight',
          questionCount: 16,
          estimatedTime: '12-18 minutes',
          specificRoles: ['Chief Data Officer', 'Data Governance Director'],
          focusQuestions: ['Data governance', 'Data management', 'Data strategy']
        },
        {
          id: 'it-security',
          name: 'IT Security',
          description: 'Information security and access control',
          questionCount: 12,
          estimatedTime: '10-15 minutes',
          specificRoles: ['IT Security Director', 'Security Manager', 'CISO'],
          focusQuestions: ['Information security', 'Access control', 'Security frameworks']
        },
        {
          id: 'system-architect',
          name: 'System Architect',
          description: 'System interoperability and infrastructure',
          questionCount: 14,
          estimatedTime: '12-18 minutes',
          specificRoles: ['System Architect', 'Infrastructure Manager', 'Integration Specialist'],
          focusQuestions: ['System interoperability', 'Infrastructure', 'Integration']
        }
      ]
    },
    {
      id: 'technical-operations',
      name: 'Technical Operations',
      description: 'System operations and technical implementation',
      icon: Cog,
      color: 'from-gray-500 to-gray-700',
      questionCount: 27,
      estimatedTime: '20-25 minutes',
      primaryRoles: ['System Integration Managers', 'Technical Writers', 'Operations Managers'],
      focusAreas: ['System Operations', 'Integration', 'Documentation', 'Training'],
      sections: ['Technical Infrastructure', 'System Operations', 'Documentation'],
      subPersonas: [
        {
          id: 'system-integration',
          name: 'System Integration',
          description: 'System integration and operations management',
          questionCount: 12,
          estimatedTime: '10-15 minutes',
          specificRoles: ['System Integration Manager', 'Integration Specialist', 'Operations Manager'],
          focusQuestions: ['System integration', 'Operations management', 'Infrastructure']
        },
        {
          id: 'technical-writer',
          name: 'Technical Writer',
          description: 'Documentation and knowledge management',
          questionCount: 8,
          estimatedTime: '6-10 minutes',
          specificRoles: ['Technical Writer', 'Documentation Specialist', 'Knowledge Manager'],
          focusQuestions: ['Technical documentation', 'Knowledge management', 'Documentation standards']
        },
        {
          id: 'training-manager',
          name: 'Training Manager',
          description: 'Training and user adoption management',
          questionCount: 10,
          estimatedTime: '8-12 minutes',
          specificRoles: ['Training Manager', 'User Adoption Specialist', 'Learning Manager'],
          focusQuestions: ['Training programs', 'User adoption', 'Learning management']
        }
      ]
    }
  ];

  const handlePersonaSelect = (persona: Persona) => {
    setSelectedPersona(persona.id);
    setSelectedSubPersona(null); // Reset sub-persona selection
  };

  const handleSubPersonaSelect = (subPersona: SubPersona) => {
    setSelectedSubPersona(subPersona.id);
  };

  const handleContinue = () => {
    const persona = personas.find(p => p.id === selectedPersona);
    if (persona) {
      // If sub-personas exist and one is selected, create a modified persona
      if (persona.subPersonas && selectedSubPersona) {
        const subPersona = persona.subPersonas.find(sp => sp.id === selectedSubPersona);
        if (subPersona) {
          const modifiedPersona: Persona = {
            ...persona,
            name: `${persona.name} - ${subPersona.name}`,
            description: subPersona.description,
            questionCount: subPersona.questionCount,
            estimatedTime: subPersona.estimatedTime,
            primaryRoles: subPersona.specificRoles,
            focusAreas: subPersona.focusQuestions,
            sections: [`${persona.name} - ${subPersona.name}`]
          };
          onPersonaSelected(modifiedPersona);
          return;
        }
      }
      onPersonaSelected(persona);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-compliance-50 to-compliance-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-compliance-600 to-compliance-800 rounded-full mb-6">
            <Users className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-compliance-900 to-compliance-700 bg-clip-text text-transparent">
            Select Your Role
          </h1>
          <p className="text-xl text-compliance-600 max-w-3xl mx-auto">
            Choose your primary role to see a focused assessment tailored to your expertise. 
            This helps reduce complexity and ensures you answer questions most relevant to your responsibilities.
          </p>
        </div>

        {/* Persona Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {personas.map((persona) => (
            <Card
              key={persona.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedPersona === persona.id
                  ? 'ring-2 ring-compliance-500 shadow-lg scale-105'
                  : 'hover:scale-102'
              }`}
              onClick={() => handlePersonaSelect(persona)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${persona.color} rounded-full mb-4 mx-auto`}>
                  <persona.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-compliance-900">
                  {persona.name}
                </CardTitle>
                <CardDescription className="text-sm text-compliance-600">
                  {persona.description}
                </CardDescription>
                {persona.subPersonas && (
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs bg-blue-50 border-blue-300 text-blue-700">
                      {persona.subPersonas.length} Specializations
                    </Badge>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-compliance-50 border-compliance-300 text-compliance-700">
                    <Target className="h-3 w-3 mr-1" />
                    {persona.questionCount} questions
                  </Badge>
                  <Badge variant="outline" className="bg-compliance-50 border-compliance-300 text-compliance-700">
                    <Clock className="h-3 w-3 mr-1" />
                    {persona.estimatedTime}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-compliance-800">Primary Roles:</h4>
                  <div className="flex flex-wrap gap-1">
                    {persona.primaryRoles.slice(0, 2).map((role, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                    {persona.primaryRoles.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{persona.primaryRoles.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-compliance-800">Focus Areas:</h4>
                  <div className="flex flex-wrap gap-1">
                    {persona.focusAreas.slice(0, 2).map((area, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sub-Persona Selection */}
        {selectedPersona && personas.find(p => p.id === selectedPersona)?.subPersonas && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Choose Your Specialization</span>
              </CardTitle>
              <CardDescription>
                Select your specific role for a more focused assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {personas.find(p => p.id === selectedPersona)?.subPersonas?.map((subPersona) => (
                  <Card
                    key={subPersona.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                      selectedSubPersona === subPersona.id
                        ? 'ring-2 ring-compliance-500 shadow-md bg-compliance-50'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleSubPersonaSelect(subPersona)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-compliance-900">
                        {subPersona.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-compliance-600">
                        {subPersona.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-blue-50 border-blue-300 text-blue-700 text-xs">
                          <Target className="h-3 w-3 mr-1" />
                          {subPersona.questionCount} questions
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 border-green-300 text-green-700 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {subPersona.estimatedTime}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-xs text-compliance-800">Your Roles:</h4>
                        <div className="flex flex-wrap gap-1">
                          {subPersona.specificRoles.slice(0, 2).map((role, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                          {subPersona.specificRoles.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{subPersona.specificRoles.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Continue Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedPersona}
            className="bg-gradient-to-r from-compliance-600 to-compliance-800 hover:from-compliance-700 hover:to-compliance-900 text-white px-8 py-3 text-lg"
          >
            <ArrowRight className="h-5 w-5 mr-2" />
            Continue with Selected Role
          </Button>
          {!selectedPersona && (
            <p className="text-sm text-compliance-500 mt-2">
              Please select a role to continue
            </p>
          )}
        </div>

        {/* Benefits Section */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border border-compliance-200 p-8">
          <h3 className="text-2xl font-bold text-compliance-900 text-center mb-6">
            Why Choose Your Role?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-compliance-800">Focused Assessment</h4>
              <p className="text-sm text-compliance-600">
                See only questions relevant to your expertise and responsibilities
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-compliance-800">Faster Completion</h4>
              <p className="text-sm text-compliance-600">
                Complete your assessment in 20-35 minutes instead of hours
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-compliance-800">Better Accuracy</h4>
              <p className="text-sm text-compliance-600">
                Answer questions within your domain expertise for more accurate results
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaSelector;
