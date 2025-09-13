'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface CleanCompleteAssessmentViewProps {
  config: any;
  responses: Record<string, any>;
  onResponseChange: (questionId: string, value: any) => void;
  onSave: () => void;
}

const CleanCompleteAssessmentView: React.FC<CleanCompleteAssessmentViewProps> = ({
  config,
  responses,
  onResponseChange,
  onSave
}) => {
  const [currentTab, setCurrentTab] = useState('regulatory');
  const [localResponses, setLocalResponses] = useState<Record<string, string>>({});

  const handleResponse = (questionId: string, response: string) => {
    const newResponses = {
      ...localResponses,
      [questionId]: response
    };
    setLocalResponses(newResponses);
    onResponseChange(questionId, { value: response, completed: true, timestamp: '2025-01-12T00:00:00.000Z' });
  };

  const questions = {
    regulatory: [
      {
        id: 'reg-001',
        text: 'Is your Context of Use (COU) production-defined for each AI model\'s specific regulatory question and decision impact?',
        points: 6,
        isCritical: true
      },
      {
        id: 'reg-002',
        text: 'Do you have documented regulatory processes for AI/ML model validation?',
        points: 5,
        isCritical: false
      },
      {
        id: 'reg-003',
        text: 'Is your regulatory compliance framework production-implemented?',
        points: 8,
        isCritical: true
      },
      {
        id: 'reg-004',
        text: 'Do you have FDA submission documentation for AI/ML models?',
        points: 7,
        isCritical: true
      },
      {
        id: 'reg-005',
        text: 'Is your premarket review process established for AI models?',
        points: 6,
        isCritical: false
      },
      {
        id: 'reg-006',
        text: 'Do you have post-market surveillance protocols for AI systems?',
        points: 5,
        isCritical: false
      },
      {
        id: 'reg-007',
        text: 'Is your regulatory strategy aligned with FDA 2025 guidance?',
        points: 8,
        isCritical: true
      },
      {
        id: 'reg-008',
        text: 'Do you have change control procedures for AI model updates?',
        points: 4,
        isCritical: false
      }
    ],
    international: [
      {
        id: 'int-001',
        text: 'Is your EU AI Act compliance framework implemented?',
        points: 10,
        isCritical: true
      },
      {
        id: 'int-002',
        text: 'Do you have international regulatory compliance for AI/ML models?',
        points: 7,
        isCritical: false
      },
      {
        id: 'int-003',
        text: 'Is your CE marking process established for AI medical devices?',
        points: 8,
        isCritical: true
      },
      {
        id: 'int-004',
        text: 'Do you have MDR compliance documentation for AI systems?',
        points: 6,
        isCritical: false
      },
      {
        id: 'int-005',
        text: 'Is your international regulatory strategy documented?',
        points: 5,
        isCritical: false
      },
      {
        id: 'int-006',
        text: 'Do you have country-specific regulatory requirements mapped?',
        points: 4,
        isCritical: false
      }
    ],
    ai: [
      {
        id: 'ai-001',
        text: 'Is your AI model validation framework production-ready?',
        points: 10,
        isCritical: true
      },
      {
        id: 'ai-002',
        text: 'Do you have model governance protocols in place?',
        points: 8,
        isCritical: true
      },
      {
        id: 'ai-003',
        text: 'Is your machine learning lifecycle management production-deployed?',
        points: 9,
        isCritical: false
      },
      {
        id: 'ai-004',
        text: 'Do you have AI model bias detection and mitigation procedures?',
        points: 7,
        isCritical: true
      },
      {
        id: 'ai-005',
        text: 'Is your explainable AI framework implemented?',
        points: 6,
        isCritical: false
      },
      {
        id: 'ai-006',
        text: 'Do you have AI model performance monitoring systems?',
        points: 5,
        isCritical: false
      },
      {
        id: 'ai-007',
        text: 'Is your AI risk management framework established?',
        points: 8,
        isCritical: true
      },
      {
        id: 'ai-008',
        text: 'Do you have AI model versioning and rollback procedures?',
        points: 4,
        isCritical: false
      }
    ],
    quality: [
      {
        id: 'qual-001',
        text: 'Is your quality assurance framework production-implemented?',
        points: 7,
        isCritical: false
      },
      {
        id: 'qual-002',
        text: 'Do you have quality metrics and monitoring systems?',
        points: 5,
        isCritical: false
      },
      {
        id: 'qual-003',
        text: 'Is your CAPA (Corrective and Preventive Action) system implemented?',
        points: 6,
        isCritical: false
      },
      {
        id: 'qual-004',
        text: 'Do you have quality management system documentation?',
        points: 4,
        isCritical: false
      },
      {
        id: 'qual-005',
        text: 'Is your internal audit program established?',
        points: 3,
        isCritical: false
      },
      {
        id: 'qual-006',
        text: 'Do you have supplier quality management procedures?',
        points: 4,
        isCritical: false
      }
    ],
    data: [
      {
        id: 'data-001',
        text: 'Is your data privacy compliance framework production-deployed?',
        points: 9,
        isCritical: true
      },
      {
        id: 'data-002',
        text: 'Do you have data governance and privacy controls?',
        points: 7,
        isCritical: false
      },
      {
        id: 'data-003',
        text: 'Is your GDPR compliance framework implemented?',
        points: 8,
        isCritical: true
      },
      {
        id: 'data-004',
        text: 'Do you have data retention and deletion policies?',
        points: 5,
        isCritical: false
      },
      {
        id: 'data-005',
        text: 'Is your data security framework established?',
        points: 6,
        isCritical: false
      },
      {
        id: 'data-006',
        text: 'Do you have data anonymization and pseudonymization procedures?',
        points: 4,
        isCritical: false
      }
    ],
    clinical: [
      {
        id: 'clin-001',
        text: 'Is your clinical trial AI integration framework production-ready?',
        points: 8,
        isCritical: true
      },
      {
        id: 'clin-002',
        text: 'Do you have clinical decision support validation protocols?',
        points: 6,
        isCritical: false
      },
      {
        id: 'clin-003',
        text: 'Is your clinical evidence generation framework established?',
        points: 7,
        isCritical: true
      },
      {
        id: 'clin-004',
        text: 'Do you have clinical safety monitoring procedures for AI?',
        points: 5,
        isCritical: false
      },
      {
        id: 'clin-005',
        text: 'Is your real-world evidence collection system implemented?',
        points: 4,
        isCritical: false
      },
      {
        id: 'clin-006',
        text: 'Do you have clinical trial protocol documentation for AI?',
        points: 3,
        isCritical: false
      }
    ],
    business: [
      {
        id: 'bus-001',
        text: 'Is your business continuity plan established for AI systems?',
        points: 6,
        isCritical: false
      },
      {
        id: 'bus-002',
        text: 'Do you have AI investment and ROI tracking mechanisms?',
        points: 4,
        isCritical: false
      },
      {
        id: 'bus-003',
        text: 'Is your AI strategy aligned with business objectives?',
        points: 5,
        isCritical: false
      },
      {
        id: 'bus-004',
        text: 'Do you have stakeholder communication protocols for AI initiatives?',
        points: 3,
        isCritical: false
      }
    ],
    thirdParty: [
      {
        id: 'tp-001',
        text: 'Do you have third-party AI vendor management procedures?',
        points: 7,
        isCritical: false
      },
      {
        id: 'tp-002',
        text: 'Is your AI vendor risk assessment framework implemented?',
        points: 6,
        isCritical: false
      },
      {
        id: 'tp-003',
        text: 'Do you have third-party AI integration security protocols?',
        points: 5,
        isCritical: false
      },
      {
        id: 'tp-004',
        text: 'Is your AI vendor contract management system established?',
        points: 4,
        isCritical: false
      }
    ],
    advanced: [
      {
        id: 'adv-001',
        text: 'Do you have advanced AI model interpretability frameworks?',
        points: 8,
        isCritical: false
      },
      {
        id: 'adv-002',
        text: 'Is your federated learning infrastructure established?',
        points: 7,
        isCritical: false
      },
      {
        id: 'adv-003',
        text: 'Do you have AI model ensemble and ensemble validation procedures?',
        points: 6,
        isCritical: false
      },
      {
        id: 'adv-004',
        text: 'Is your continuous learning AI framework implemented?',
        points: 5,
        isCritical: false
      }
    ]
  };

  const getTotalScore = () => {
    const allQuestions = Object.values(questions).flat();
    const answeredQuestions = allQuestions.filter(q => localResponses[q.id] === 'yes');
    const totalPossible = allQuestions.reduce((sum, q) => sum + q.points, 0);
    const earned = answeredQuestions.reduce((sum, q) => sum + q.points, 0);
    return Math.round((earned / totalPossible) * 100);
  };

  const getAnsweredCount = () => {
    return Object.keys(localResponses).length;
  };

  const getTotalQuestions = () => {
    return Object.values(questions).flat().length;
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="container mx-auto px-4 py-8">
        {/* Compact Header */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Complete Assessment</h1>
          <p className="text-sm text-gray-600">{getTotalQuestions()} questions across {Object.keys(questions).length} sections</p>
        </div>

        {/* Compact Progress */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-4 bg-white rounded-lg shadow-sm border px-4 py-2">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{getTotalScore()}%</div>
              <div className="text-xs text-gray-600">Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{getAnsweredCount()}</div>
              <div className="text-xs text-gray-600">Answered</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{getTotalQuestions()}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
          </div>
        </div>

        {/* Clean Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 bg-white shadow-sm overflow-x-auto">
            <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
            <TabsTrigger value="international">International</TabsTrigger>
            <TabsTrigger value="ai">AI Model</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="data">Data Privacy</TabsTrigger>
            <TabsTrigger value="clinical">Clinical</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="thirdParty">Third Party</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {Object.entries(questions).map(([category, categoryQuestions]) => (
            <TabsContent key={category} value={category}>
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 capitalize">{category} Compliance</h2>
                  <p className="text-gray-600">
                    {categoryQuestions.length} questions • {categoryQuestions.reduce((sum, q) => sum + q.points, 0)} total points
                  </p>
                </div>

                {categoryQuestions.map((question, index) => (
                  <Card key={question.id} className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>Question {index + 1}</span>
                        <div className="flex items-center space-x-2">
                          {question.isCritical && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              Critical
                            </span>
                          )}
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {question.points} points
                          </span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        {question.text}
                      </p>
                      
                      <RadioGroup
                        value={localResponses[question.id] || ''}
                        onValueChange={(value) => handleResponse(question.id, value)}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer">
                          <RadioGroupItem value="yes" id={`${question.id}-yes`} />
                          <Label htmlFor={`${question.id}-yes`} className="cursor-pointer flex items-center space-x-2">
                            <span className="text-xl">✅</span>
                            <span className="font-semibold text-green-700 text-lg">
                              Yes, We Have This
                            </span>
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all cursor-pointer">
                          <RadioGroupItem value="no" id={`${question.id}-no`} />
                          <Label htmlFor={`${question.id}-no`} className="cursor-pointer flex items-center space-x-2">
                            <span className="text-xl">❌</span>
                            <span className="font-semibold text-red-700 text-lg">
                              No, We Need This
                            </span>
                          </Label>
                        </div>
                      </RadioGroup>

                      {localResponses[question.id] && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                          ✓ Response recorded: {localResponses[question.id] === 'yes' ? 'Implemented' : 'Needs Implementation'}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Action Bar */}
        <Card className="mt-8 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Progress: {getAnsweredCount()}/{getTotalQuestions()} questions
                </span>
                <span className="text-sm text-gray-600">
                  Score: {getTotalScore()}%
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={onSave}>
                  Save Progress
                </Button>
                <Button 
                  onClick={() => {
                    alert(`Assessment completed! Score: ${getTotalScore()}%`);
                    onSave();
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Complete Assessment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CleanCompleteAssessmentView;
