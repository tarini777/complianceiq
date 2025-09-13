/**
 * Persona-Based Assessment View - ComplianceIQ System
 * Shows filtered questions based on selected persona
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Shield,
  Brain,
  Users,
  Settings,
  Database,
  Lock,
  Eye,
  Archive,
  Cog,
  Save,
  Target,
  TrendingUp,
  AlertCircle,
  Info,
  Star,
  Award,
  Zap,
  Clock,
  Globe,
  Scale,
  ArrowLeft,
  Crown,
  Heart
} from 'lucide-react';

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
}

interface PersonaAssessmentViewProps {
  persona: Persona;
  config: any;
  responses: Record<string, any>;
  onResponseChange: (questionId: string, value: any) => void;
  onSave: () => void;
  onBack: () => void;
}

const PersonaAssessmentView: React.FC<PersonaAssessmentViewProps> = ({
  persona,
  config,
  responses,
  onResponseChange,
  onSave,
  onBack
}) => {
  const [activeSection, setActiveSection] = useState<string>('');

  // Persona-based question filtering
  const getPersonaQuestions = () => {
    // This would be dynamically generated based on persona
    // For now, returning a subset of questions based on persona type
    const baseQuestions = [
      // Executive Leadership Questions
      ...(persona.id === 'executive-leadership' ? [
        {
          id: 'gov-committee-001',
          text: '🚨 PRODUCTION BLOCKER: Is your AI governance committee structure production-established with clear executive leadership and cross-functional representation?',
          points: 8,
          isBlocker: true,
          category: 'AI Governance Committee',
          evidenceRequired: ['AI governance committee charter', 'Executive leadership documentation', 'Cross-functional representation proof'],
          responsibleRole: ['Chief Executive Officer', 'Chief Technology Officer']
        },
        {
          id: 'roi-001',
          text: '🚨 PRODUCTION BLOCKER: Is your business impact and ROI assessment framework production-implemented with comprehensive financial impact analysis and cost-benefit validation?',
          points: 8,
          isBlocker: true,
          category: 'Business Impact & ROI',
          evidenceRequired: ['Business impact assessment framework', 'ROI calculation methodology', 'Financial impact analysis documentation'],
          responsibleRole: ['Chief Financial Officer', 'Business Development Director']
        }
      ] : []),
      
      // Data Science & AI Team Questions
      ...(persona.id === 'data-science-ai' ? [
        {
          id: 'ai-val-001',
          text: '🚨 PRODUCTION BLOCKER: Are your AI models production-validated with comprehensive test coverage across all therapeutic areas?',
          points: 5,
          isBlocker: true,
          category: 'AI Model Validation',
          evidenceRequired: ['Model validation documentation', 'Test coverage reports', 'Therapeutic area validation'],
          responsibleRole: ['Data Science/AI Head', 'Quality Assurance Director']
        },
        {
          id: 'ai-tech-001',
          text: '🚨 PRODUCTION BLOCKER: Is your machine learning governance framework production-implemented with comprehensive ML model lifecycle management and validation protocols?',
          points: 8,
          isBlocker: true,
          category: 'AI Technology-Specific Governance',
          evidenceRequired: ['ML governance framework documentation', 'Model lifecycle management protocols', 'ML validation procedures'],
          responsibleRole: ['Data Science/AI Head', 'MLOps Engineer']
        }
      ] : []),
      
      // Regulatory Affairs Questions
      ...(persona.id === 'regulatory-affairs' ? [
        {
          id: 'fda-cred-001',
          text: '🚨 PRODUCTION BLOCKER: Is your Context of Use (COU) production-defined for each AI model\'s specific regulatory question and decision impact?',
          points: 6,
          isBlocker: true,
          category: 'Regulatory Compliance',
          evidenceRequired: ['COU documentation', 'Regulatory question mapping', 'Decision impact analysis'],
          responsibleRole: ['Regulatory Affairs Director', 'Data Science/AI Head']
        },
        {
          id: 'standards-001',
          text: '🚨 PRODUCTION BLOCKER: Is your IEEE 7000™ compliance framework production-implemented with comprehensive ethical AI governance and human values integration?',
          points: 8,
          isBlocker: true,
          category: 'International Standards Compliance',
          evidenceRequired: ['IEEE 7000™ compliance framework documentation', 'Ethical AI governance protocols', 'Human values integration procedures'],
          responsibleRole: ['Chief Ethics Officer', 'IEEE Standards Compliance Specialist']
        }
      ] : []),
      
      // Add more persona-specific questions as needed...
    ];

    return baseQuestions;
  };

  const personaQuestions = getPersonaQuestions();

  // Group questions by section
  const questionsBySection = personaQuestions.reduce((acc, question) => {
    const section = question.category;
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(question);
    return acc;
  }, {} as Record<string, any[]>);

  const sections = Object.keys(questionsBySection);

  // Set default active section
  React.useEffect(() => {
    if (sections.length > 0 && !activeSection) {
      setActiveSection(sections[0]);
    }
  }, [sections, activeSection]);

  const calculatePersonaScore = () => {
    let totalScore = 0;
    let maxScore = 0;
    let completedQuestions = 0;

    personaQuestions.forEach(question => {
      maxScore += question.points;
      const response = responses[question.id];
      if (response && response.completed && response.value === 'yes') {
        totalScore += question.points;
        completedQuestions++;
      }
    });

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const completion = personaQuestions.length > 0 ? Math.round((completedQuestions / personaQuestions.length) * 100) : 0;

    return {
      totalScore,
      maxScore,
      percentage,
      completion,
      completedQuestions,
      totalQuestions: personaQuestions.length
    };
  };

  const score = calculatePersonaScore();

  const handleResponseChange = (questionId: string, value: string) => {
    onResponseChange(questionId, {
      value,
      completed: true,
      timestamp: new Date().toISOString()
    });
  };

  const getSectionIcon = (sectionName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'AI Governance Committee': Users,
      'Business Impact & ROI': TrendingUp,
      'AI Model Validation': Brain,
      'AI Technology-Specific Governance': Cog,
      'Regulatory Compliance': Shield,
      'International Standards Compliance': Globe,
      'Quality Assurance': CheckCircle,
      'Legal Compliance': Scale,
      'Clinical Validation': Heart,
      'Data Governance': Database
    };
    return iconMap[sectionName] || FileText;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-compliance-50 to-compliance-100">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Role Selection
            </Button>
            <div className="flex items-center space-x-3">
              <div className={`p-2 bg-gradient-to-r ${persona.color} rounded-lg`}>
                <persona.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-compliance-900">{persona.name} Assessment</h1>
                <p className="text-compliance-600">{persona.description}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-compliance-50 border-compliance-300 text-compliance-700 px-3 py-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              {score.completion}% Complete
            </Badge>
            <Button onClick={onSave} className="bg-compliance-600 hover:bg-compliance-700">
              <Save className="h-4 w-4 mr-2" />
              Save Progress
            </Button>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Your Score</CardTitle>
              <div className="p-2 bg-blue-500 rounded-lg">
                <Target className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{score.totalScore}/{score.maxScore}</div>
              <p className="text-sm text-blue-600 mt-1">
                {score.percentage}% of maximum
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">Questions</CardTitle>
              <div className="p-2 bg-green-500 rounded-lg">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{score.completedQuestions}/{score.totalQuestions}</div>
              <p className="text-sm text-green-600 mt-1">
                {score.completion}% complete
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Sections</CardTitle>
              <div className="p-2 bg-purple-500 rounded-lg">
                <FileText className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">{sections.length}</div>
              <p className="text-sm text-purple-600 mt-1">
                Focus areas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-900">Time</CardTitle>
              <div className="p-2 bg-orange-500 rounded-lg">
                <Clock className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">{persona.estimatedTime}</div>
              <p className="text-sm text-orange-600 mt-1">
                Estimated
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Section Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment Sections</CardTitle>
            <CardDescription>Navigate through your role-specific assessment areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sections.map((section) => {
                const sectionQuestions = questionsBySection[section];
                const completedInSection = sectionQuestions.filter(q => responses[q.id]?.completed).length;
                const Icon = getSectionIcon(section);
                
                return (
                  <Button
                    key={section}
                    variant={activeSection === section ? "default" : "outline"}
                    className="justify-start h-auto p-4"
                    onClick={() => setActiveSection(section)}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <Icon className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium text-sm">{section}</div>
                        <div className="text-xs text-muted-foreground">
                          {completedInSection}/{sectionQuestions.length} complete
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        {activeSection && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {React.createElement(getSectionIcon(activeSection), { className: "h-5 w-5" })}
                <span>{activeSection}</span>
              </CardTitle>
              <CardDescription>
                {questionsBySection[activeSection].length} questions in this section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {questionsBySection[activeSection].map((question) => {
                const response = responses[question.id];
                
                return (
                  <div key={question.id} className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-compliance-900 mb-2">
                          {question.text}
                        </h3>
                        {question.isBlocker && (
                          <Badge variant="destructive" className="mb-3">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Production Blocker
                          </Badge>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-compliance-600">
                          <span>Points: {question.points}</span>
                          <span>Category: {question.category}</span>
                        </div>
                      </div>
                    </div>

                    <RadioGroup
                      value={response?.value || ''}
                      onValueChange={(value) => handleResponseChange(question.id, value)}
                      className="flex space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`${question.id}-yes`} />
                        <Label htmlFor={`${question.id}-yes`} className="text-green-700 font-medium">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`${question.id}-no`} />
                        <Label htmlFor={`${question.id}-no`} className="text-red-700 font-medium">
                          No
                        </Label>
                      </div>
                    </RadioGroup>

                    {question.evidenceRequired && (
                      <div className="bg-compliance-50 rounded-lg p-4">
                        <h4 className="font-semibold text-compliance-800 mb-2">Evidence Required:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-compliance-600">
                          {question.evidenceRequired.map((evidence: string, index: number) => (
                            <li key={index}>{evidence}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PersonaAssessmentView;
