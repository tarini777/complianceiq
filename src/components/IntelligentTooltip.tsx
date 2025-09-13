'use client';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InfoIcon } from 'lucide-react';
import { Question } from '@/types';

interface IntelligentTooltipProps {
  question: Question;
  therapeuticArea?: string;
  aiModelType?: string;
}

export const IntelligentTooltip: React.FC<IntelligentTooltipProps> = ({
  question,
  therapeuticArea = 'general',
  aiModelType = 'general'
}) => {
  const getTherapySpecificGuidance = (questionId: string, therapeuticArea: string): string => {
    const guidanceMap: Record<string, Record<string, string>> = {
      'bias_detection': {
        'oncology': 'Configure for cancer stage, genetic markers, age-related treatment responses',
        'cardiology': 'Configure for cardiovascular risk factors across demographic groups',
        'neurology': 'Configure for cognitive assessment cultural bias and neurological diversity',
        'rare_disease': 'Focus on rare disease population representation and genetic diversity',
        'infectious_disease': 'Consider geographic and socioeconomic factors in disease prevalence',
        'mental_health': 'Address cultural and socioeconomic factors in mental health assessment',
        'pediatrics': 'Account for age-appropriate bias and developmental considerations',
        'emergency_medicine': 'Consider time-sensitive bias in emergency decision making'
      },
      'data_privacy_compliance': {
        'oncology': 'Extra protection for genetic data and treatment history',
        'cardiology': 'Special handling for cardiac monitoring data and lifestyle information',
        'neurology': 'Protection for cognitive assessment data and neurological imaging',
        'rare_disease': 'Heightened privacy for genetic information and family history',
        'infectious_disease': 'Contact tracing data protection and public health considerations',
        'mental_health': 'Strict confidentiality for psychiatric records and therapy notes',
        'pediatrics': 'Enhanced protection for minor patient data and parental consent',
        'emergency_medicine': 'Rapid access protocols while maintaining privacy standards'
      },
      'model_validation': {
        'oncology': 'Validation across cancer types, stages, and treatment responses',
        'cardiology': 'Validation across cardiovascular conditions and risk factors',
        'neurology': 'Validation across neurological conditions and cognitive assessments',
        'rare_disease': 'Validation with limited datasets and patient populations',
        'infectious_disease': 'Validation across different pathogens and geographic regions',
        'mental_health': 'Validation across mental health conditions and cultural contexts',
        'pediatrics': 'Validation across age groups and developmental stages',
        'emergency_medicine': 'Validation under time pressure and critical conditions'
      }
    };
    
    return guidanceMap[questionId]?.[therapeuticArea] || 'No specific guidance available';
  };

  const getAIModelGuidance = (questionId: string, aiModelType: string): string => {
    const guidanceMap: Record<string, Record<string, string>> = {
      'bias_detection': {
        'traditional_ml': 'Focus on algorithmic bias in classical machine learning models',
        'computer_vision': 'Address visual bias in medical imaging AI systems',
        'nlp': 'Mitigate language bias in clinical text processing',
        'generative_ai': 'Prevent hallucination bias in AI-generated medical content',
        'agentic_ai': 'Monitor autonomous decision-making bias in AI agents',
        'multimodal_ai': 'Ensure balanced representation across different data modalities',
        'federated_learning': 'Address bias aggregation in distributed learning systems',
        'edge_ai': 'Monitor bias in edge-deployed AI models'
      },
      'data_privacy_compliance': {
        'traditional_ml': 'Standard privacy protection for structured data',
        'computer_vision': 'Enhanced privacy for medical imaging data',
        'nlp': 'Text anonymization and clinical note protection',
        'generative_ai': 'Prevent data leakage in generative models',
        'agentic_ai': 'Privacy protection in autonomous data collection',
        'multimodal_ai': 'Cross-modal privacy protection strategies',
        'federated_learning': 'Privacy-preserving distributed learning protocols',
        'edge_ai': 'Local privacy protection in edge computing'
      }
    };
    
    return guidanceMap[questionId]?.[aiModelType] || 'No specific AI model guidance available';
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="sm">
          <InfoIcon className="h-4 w-4" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-96">
        <Tabs defaultValue="explanation">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="explanation">Guide</TabsTrigger>
            <TabsTrigger value="validation">How To</TabsTrigger>
            <TabsTrigger value="pitfalls">Pitfalls</TabsTrigger>
            <TabsTrigger value="regulatory">Legal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="explanation" className="space-y-2">
            <h4 className="font-medium">What This Means</h4>
            <p className="text-sm text-gray-600">{question.guidance?.explanation}</p>
            
            {/* Therapy-specific guidance */}
            {therapeuticArea !== 'general' && (
              <div className="mt-3">
                <h5 className="font-medium text-sm">For {therapeuticArea}:</h5>
                <p className="text-xs text-blue-600">
                  {getTherapySpecificGuidance(question.id, therapeuticArea)}
                </p>
              </div>
            )}
            
            {/* AI model-specific guidance */}
            {aiModelType !== 'general' && (
              <div className="mt-3">
                <h5 className="font-medium text-sm">For {aiModelType}:</h5>
                <p className="text-xs text-green-600">
                  {getAIModelGuidance(question.id, aiModelType)}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="validation" className="space-y-2">
            <h4 className="font-medium">Validation Steps</h4>
            <ol className="list-decimal list-inside text-sm space-y-1">
              {question.guidance?.howToValidate?.map((step: string, idx: number) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </TabsContent>
          
          <TabsContent value="pitfalls" className="space-y-2">
            <h4 className="font-medium">Common Pitfalls</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {question.guidance?.commonPitfalls?.map((pitfall: string, idx: number) => (
                <li key={idx} className="text-orange-600">{pitfall}</li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="regulatory" className="space-y-2">
            <h4 className="font-medium">Regulatory Citations</h4>
            <ul className="text-sm space-y-1">
              {question.guidance?.regulatoryCitations?.map((citation: string, idx: number) => (
                <li key={idx} className="text-blue-600 underline cursor-pointer">
                  {citation}
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </HoverCardContent>
    </HoverCard>
  );
};
