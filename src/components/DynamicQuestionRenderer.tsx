'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { IntelligentTooltip } from './IntelligentTooltip';
import { Question, AssessmentResponse } from '@/types';

interface DynamicQuestionRendererProps {
  questions: Question[];
  responses: Record<string, AssessmentResponse>;
  onResponseChange: (questionId: string, response: AssessmentResponse) => void;
  onSectionComplete: (sectionId: string) => void;
  therapeuticArea?: string;
  aiModelType?: string;
}

export const DynamicQuestionRenderer: React.FC<DynamicQuestionRendererProps> = ({
  questions,
  responses,
  onResponseChange,
  onSectionComplete,
  therapeuticArea,
  aiModelType
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const sections = [...new Set(questions.map(q => q.sectionTitle))];

  const getCurrentSectionQuestions = () => {
    return questions.filter(q => q.sectionTitle === sections[currentSection]);
  };

  const renderQuestion = (question: Question) => {
    const response = responses[question.id];

    return (
      <Card key={question.id} className={`mb-4 ${question.isBlocker ? 'border-red-500' : ''}`}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg flex items-center gap-2">
              {question.isBlocker && <span className="text-red-500">🚨</span>}
              {question.questionText}
              <span className="text-sm text-gray-500">({question.points} pts)</span>
            </CardTitle>
            <IntelligentTooltip 
              question={question}
              therapeuticArea={therapeuticArea}
              aiModelType={aiModelType}
            />
          </div>
        </CardHeader>
        <CardContent>
          {question.questionType === 'boolean' && (
            <RadioGroup
              value={typeof response?.responseValue === 'string' ? response.responseValue : ''}
              onValueChange={(value) => onResponseChange(question.id, { 
                questionId: question.id,
                responseValue: value, 
                completionStatus: value === 'complete' ? 'complete' : value === 'in_progress' ? 'in_progress' : 'not_started'
              })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="complete" id={`${question.id}-complete`} />
                <label htmlFor={`${question.id}-complete`}>Complete</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in_progress" id={`${question.id}-progress`} />
                <label htmlFor={`${question.id}-progress`}>In Progress</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not_started" id={`${question.id}-not`} />
                <label htmlFor={`${question.id}-not`}>Not Started</label>
              </div>
            </RadioGroup>
          )}

          {question.questionType === 'text' && (
            <Textarea
              placeholder="Provide detailed information..."
              value={typeof response?.responseValue === 'string' ? response.responseValue : ''}
              onChange={(e) => onResponseChange(question.id, { 
                questionId: question.id,
                responseValue: e.target.value, 
                completionStatus: e.target.value ? 'complete' : 'not_started'
              })}
            />
          )}

          {/* Evidence Upload Section */}
          {question.evidenceRequired.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Evidence Required:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {question.evidenceRequired.map((evidence, idx) => (
                  <li key={idx}>{evidence}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Responsible Roles */}
          <div className="mt-4">
            <h4 className="font-medium mb-2">Validation Authority:</h4>
            <div className="flex flex-wrap gap-2">
              {question.responsibleRoles?.map((role, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const getSectionProgress = () => {
    const currentQuestions = getCurrentSectionQuestions();
    const completedQuestions = currentQuestions.filter(q => 
      responses[q.id]?.completionStatus === 'complete'
    ).length;
    return (completedQuestions / currentQuestions.length) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="flex space-x-2 overflow-x-auto">
        {sections.map((section, idx) => {
          const sectionQuestions = questions.filter(q => q.sectionTitle === section);
          const completedInSection = sectionQuestions.filter(q => 
            responses[q.id]?.completionStatus === 'complete'
          ).length;
          const totalInSection = sectionQuestions.length;
          
          return (
            <Button
              key={idx}
              variant={idx === currentSection ? 'default' : 'outline'}
              onClick={() => setCurrentSection(idx)}
              className="whitespace-nowrap"
            >
              {section} ({completedInSection}/{totalInSection})
            </Button>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${getSectionProgress()}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600">
        Section Progress: {Math.round(getSectionProgress())}% complete
      </p>

      {/* Current Section Questions */}
      <div>
        <h2 className="text-2xl font-bold mb-6">{sections[currentSection]}</h2>
        {getCurrentSectionQuestions().map(renderQuestion)}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
        >
          Previous Section
        </Button>
        <Button
          onClick={() => {
            if (currentSection < sections.length - 1) {
              setCurrentSection(currentSection + 1);
            } else if (sections[currentSection]) {
              onSectionComplete(sections[currentSection]);
            }
          }}
        >
          {currentSection < sections.length - 1 ? 'Next Section' : 'Complete Assessment'}
        </Button>
      </div>
    </div>
  );
};
