export interface AssessmentConfig {
  selectedPersona: Persona | null;
  selectedSubPersona?: SubPersona | null;
  therapeuticAreas: string[];
  aiModelTypes: string[];
  deploymentScenarios: string[];
  geographicScope: 'local' | 'global' | 'regional';
  ipStrategy: 'proprietary' | 'licensed' | 'open_source';
  regulatoryPathway?: string;
  enableCollaboration?: boolean;
}

export interface SubPersona {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  estimatedTime: string;
  specificRoles: string[];
  focusQuestions: string[];
}

export interface Persona {
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

export interface Question {
  id: string;
  text: string;
  points: number;
  isBlocker: boolean;
  isProductionBlocker?: boolean;
  complexityPoints?: number;
  category: string;
  evidenceRequired: string[];
  responsibleRole: string[];
  personaRelevant: string[];
  therapySpecific?: boolean;
  aiModelTypeSpecific?: boolean;
  deploymentScenarioSpecific?: boolean;
  sectionTitle?: string;
  questionText?: string;
  questionType?: 'boolean' | 'multiple_choice' | 'text' | 'file_upload' | 'scale_1_5';
  validationCriteria?: Record<string, unknown>;
  // Scale question support
  scaleLabels?: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
  scaleConfiguration?: {
    min: number;
    max: number;
    step: number;
    defaultLabels?: boolean;
  };
  responsibleRoles?: string[];
  guidance?: {
    explanation: string;
    howToValidate: string[];
    commonPitfalls: string[];
    regulatoryCitations: string[];
    examples: string[];
  };
}

// Scale response types
export interface ScaleResponse {
  questionId: string;
  responseValue: number; // 1-5
  completionStatus: 'complete' | 'in_progress' | 'not_started';
  timestamp: Date;
  evidenceDocuments?: string[];
  validatedBy?: string;
  validationDate?: Date;
}

export interface ScaleQuestion extends Question {
  questionType: 'scale_1_5';
  scaleLabels: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
  scaleConfiguration: {
    min: number;
    max: number;
    step: number;
    defaultLabels: boolean;
  };
}

export interface TherapeuticArea {
  id: string;
  name: string;
  complexity: number;
  description?: string;
}

export interface AIModelType {
  id: string;
  name: string;
  complexity: number;
  description?: string;
}

export interface DeploymentScenario {
  id: string;
  name: string;
  complexity: number;
  description?: string;
}

export interface AssessmentResponse {
  questionId: string;
  responseValue: string | boolean | number | Record<string, unknown>;
  evidenceDocuments?: string[];
  completionStatus: 'complete' | 'in_progress' | 'not_started';
  timestamp?: Date;
}

export interface AssessmentScore {
  currentScore: number;
  maxPossibleScore: number;
  completionPercentage: number;
  criticalBlockers: number;
  sectionsCompleted: number;
  totalSections: number;
}

export interface ProgressTracking {
  personaId: string;
  subPersonaId?: string;
  currentQuestion: number;
  totalQuestions: number;
  completionPercentage: number;
  timeSpent: number;
  estimatedTimeRemaining: number;
  milestones: ProgressMilestone[];
  categoryProgress: CategoryProgress[];
}

export interface ProgressMilestone {
  id: string;
  label: string;
  threshold: number;
  achieved: boolean;
  achievedAt?: Date;
}

export interface CategoryProgress {
  category: string;
  questionsTotal: number;
  questionsCompleted: number;
  pointsEarned: number;
  pointsTotal: number;
  completionPercentage: number;
  blockers: number;
}

export interface SubPersonaAnalytics {
  subPersonaId: string;
  subPersonaName: string;
  averageCompletionTime: number;
  averageScore: number;
  completionRate: number;
  commonBlockers: string[];
  improvementAreas: string[];
  bestPractices: string[];
  userFeedback: {
    rating: number;
    comments: string[];
  };
}

export interface PersonaInsights {
  personaId: string;
  personaName: string;
  subPersonaAnalytics: SubPersonaAnalytics[];
  overallPerformance: {
    averageCompletionTime: number;
    averageScore: number;
    completionRate: number;
  };
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    category: string;
    description: string;
    actionItems: string[];
  }[];
}
