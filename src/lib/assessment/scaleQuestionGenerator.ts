import { ScaleQuestion } from '@/types';

/**
 * Generate a sample scale question for testing
 */
export function createSampleScaleQuestion(): ScaleQuestion {
  return {
    id: 'scale-sample-1',
    text: 'Our organization has established comprehensive AI governance policies',
    questionText: 'Our organization has established comprehensive AI governance policies',
    questionType: 'scale_1_5',
    points: 5,
    isBlocker: false,
    isProductionBlocker: false,
    complexityPoints: 5,
    category: 'AI Governance',
    evidenceRequired: [
      'Written AI governance policy document',
      'Policy approval from senior leadership',
      'Policy communication to all relevant staff'
    ],
    responsibleRole: ['AI Governance Committee', 'Legal Team', 'Senior Leadership'],
    personaRelevant: ['ai-governance', 'legal', 'compliance'],
    therapySpecific: false,
    aiModelTypeSpecific: false,
    deploymentScenarioSpecific: false,
    sectionTitle: 'AI Governance Framework',
    validationCriteria: {
      minScore: 3,
      requiredForProduction: true
    },
    responsibleRoles: ['AI Governance Committee', 'Legal Team'],
    scaleLabels: {
      1: "Strongly Disagree",
      2: "Disagree",
      3: "Neutral", 
      4: "Agree",
      5: "Strongly Agree"
    },
    scaleConfiguration: {
      min: 1,
      max: 5,
      step: 1,
      defaultLabels: true
    },
    guidance: {
      explanation: "This question assesses whether your organization has established formal governance policies for AI systems.",
      howToValidate: [
        "Review existing policy documents",
        "Confirm policy approval process",
        "Verify policy communication to staff"
      ],
      commonPitfalls: [
        "Policies exist but are not communicated",
        "Policies are outdated or incomplete",
        "No formal approval process"
      ],
      regulatoryCitations: [
        "FDA AI/ML Software as a Medical Device",
        "EMA Guideline on Computerised Systems",
        "ICH E6(R2) Good Clinical Practice"
      ],
      examples: [
        "AI Governance Policy v2.1 approved by Board",
        "Policy training completed for all staff",
        "Regular policy review schedule established"
      ]
    }
  };
}

/**
 * Generate multiple sample scale questions for different categories
 */
export function createSampleScaleQuestions(): ScaleQuestion[] {
  return [
    createSampleScaleQuestion(),
    {
      ...createSampleScaleQuestion(),
      id: 'scale-sample-2',
      text: 'Our AI models undergo rigorous validation before deployment',
      questionText: 'Our AI models undergo rigorous validation before deployment',
      category: 'AI Model Validation',
      evidenceRequired: [
        'Model validation protocol',
        'Validation test results',
        'Independent validation report'
      ],
      responsibleRole: ['AI/ML Team', 'Quality Assurance', 'Regulatory Affairs'],
      scaleLabels: {
        1: "Not at all",
        2: "Minimal",
        3: "Somewhat",
        4: "Mostly",
        5: "Completely"
      }
    },
    {
      ...createSampleScaleQuestion(),
      id: 'scale-sample-3',
      text: 'We have comprehensive data privacy controls in place',
      questionText: 'We have comprehensive data privacy controls in place',
      category: 'Data Privacy',
      evidenceRequired: [
        'Data privacy policy',
        'Privacy impact assessments',
        'Data protection officer appointment'
      ],
      responsibleRole: ['Data Protection Officer', 'Legal Team', 'IT Security'],
      scaleLabels: {
        1: "No controls",
        2: "Basic controls",
        3: "Adequate controls",
        4: "Good controls",
        5: "Excellent controls"
      }
    }
  ];
}

/**
 * Default scale labels for different question types
 */
export const DEFAULT_SCALE_LABELS = {
  agreement: {
    1: "Strongly Disagree",
    2: "Disagree",
    3: "Neutral",
    4: "Agree", 
    5: "Strongly Agree"
  },
  frequency: {
    1: "Never",
    2: "Rarely",
    3: "Sometimes",
    4: "Often",
    5: "Always"
  },
  quality: {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent"
  },
  confidence: {
    1: "Not at all confident",
    2: "Slightly confident",
    3: "Moderately confident",
    4: "Very confident",
    5: "Extremely confident"
  }
};
