import { Persona, SubPersona, TherapeuticArea, AssessmentSection, SectionCollaborationState } from '@prisma/client';

// Re-export types for easier importing
export type { Persona, SubPersona, TherapeuticArea, AssessmentSection, SectionCollaborationState as CollaborationState };

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  details?: string;
  count?: number;
  metadata?: any;
}

// Persona Types
export interface PersonaWithSubPersonas extends Persona {
  subPersonas: SubPersona[];
  _count: {
    subPersonas: number;
  };
}

// Assessment Types
export interface QuestionWithMappings {
  id: string;
  questionNumber: number;
  questionText: string;
  points: number;
  isCritical: boolean;
  isVisible: boolean;
  expertiseRequired: string;
  therapyConditions?: Array<{
    therapeuticArea: TherapeuticArea;
    conditionLogic: string;
  }>;
}

export interface SectionWithDetails extends AssessmentSection {
  questions: QuestionWithMappings[];
  collaboration: SectionCollaborationState[];
  personaAccess: Array<{
    accessLevel: string;
    responsibilityType: string;
    canEdit: boolean;
    canApprove: boolean;
    canReview: boolean;
    isRequired: boolean;
    priorityScore: number;
  }>;
  stats: {
    totalQuestions: number;
    visibleQuestions: number;
    completionRate: number;
  };
}

export interface DynamicAssessmentConfig {
  persona: {
    id: string;
    name: string;
    description: string;
    isAdmin: boolean;
    subPersona: SubPersona | null;
  };
  therapeuticArea: TherapeuticArea | null;
  company: { id: string; name: string } | null;
  aiModelTypes: Array<{
    id: string;
    name: string;
    complexityPoints: number;
  }>;
  deploymentScenarios: Array<{
    id: string;
    name: string;
    complexityPoints: number;
  }>;
  assessment: {
    type: string;
    totalSections: number;
    totalQuestions: number;
    totalPoints: number;
    criticalSections: number;
    nonCriticalSections: number;
    estimatedTimeMinutes: number;
  };
  sections: SectionWithDetails[];
}

export interface AssessmentProgress {
  persona: {
    id: string;
    name: string;
    isAdmin: boolean;
    subPersona: SubPersona | null;
  };
  assessment: {
    totalSections: number;
    totalQuestions: number;
    totalPoints: number;
    criticalSections: number;
    nonCriticalSections: number;
    overallCompletionRate: number;
    totalEarnedPoints: number;
    productionStatus: 'production_ready' | 'not_production_ready';
    estimatedTimeRemaining: number;
  };
  sections: Array<{
    sectionId: string;
    sectionNumber: number;
    title: string;
    isCriticalBlocker: boolean;
    totalQuestions: number;
    completedQuestions: number;
    completionRate: number;
    basePoints: number;
    earnedPoints: number;
    collaborationState: string;
    lastUpdated: string | null;
  }>;
  lastUpdated: string;
}

// API Client Class
export class AssessmentApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/assessment') {
    this.baseUrl = baseUrl;
  }

  // Personas API
  async getPersonas(includeSubPersonas: boolean = true): Promise<ApiResponse<PersonaWithSubPersonas[]>> {
    const response = await fetch(`${this.baseUrl}/personas?includeSubPersonas=${includeSubPersonas}`);
    return response.json();
  }

  async createPersona(data: { name: string; description?: string; isAdmin?: boolean }): Promise<ApiResponse<Persona>> {
    const response = await fetch(`${this.baseUrl}/personas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // Sections API
  async getSections(params: {
    personaId?: string;
    subPersonaId?: string;
    therapeuticAreaId?: string;
    includeQuestions?: boolean;
    includeCollaboration?: boolean;
  }): Promise<ApiResponse<SectionWithDetails[]>> {
    const searchParams = new URLSearchParams();
    if (params.personaId) searchParams.set('personaId', params.personaId);
    if (params.subPersonaId) searchParams.set('subPersonaId', params.subPersonaId);
    if (params.therapeuticAreaId) searchParams.set('therapeuticAreaId', params.therapeuticAreaId);
    if (params.includeQuestions) searchParams.set('includeQuestions', 'true');
    if (params.includeCollaboration) searchParams.set('includeCollaboration', 'true');

    const response = await fetch(`${this.baseUrl}/sections?${searchParams.toString()}`);
    return response.json();
  }

  async createSection(data: {
    sectionNumber: number;
    title: string;
    basePoints: number;
    isCriticalBlocker?: boolean;
    description?: string;
  }): Promise<ApiResponse<AssessmentSection>> {
    const response = await fetch(`${this.baseUrl}/sections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // Dynamic Assessment Loading
  async loadDynamicAssessment(data: {
    personaId: string;
    subPersonaId?: string;
    therapeuticAreaId?: string;
    companyId?: string;
    aiModelTypes?: string[];
    deploymentScenarios?: string[];
    assessmentType?: string;
  }): Promise<ApiResponse<DynamicAssessmentConfig>> {
    const response = await fetch(`${this.baseUrl}/dynamic-load`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // Collaboration API
  async getCollaborationStates(params: {
    sectionId?: string;
    personaId?: string;
    state?: string;
  }): Promise<ApiResponse<SectionCollaborationState[]>> {
    const searchParams = new URLSearchParams();
    if (params.sectionId) searchParams.set('sectionId', params.sectionId);
    if (params.personaId) searchParams.set('personaId', params.personaId);
    if (params.state) searchParams.set('state', params.state);

    const response = await fetch(`${this.baseUrl}/collaboration?${searchParams.toString()}`);
    return response.json();
  }

  async updateCollaborationState(data: {
    sectionId: string;
    currentState: string;
    assignedTo?: string;
    reviewedBy?: string;
    approvedBy?: string;
    comments?: string;
  }): Promise<ApiResponse<SectionCollaborationState>> {
    const response = await fetch(`${this.baseUrl}/collaboration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async updateCollaborationStateById(data: {
    id: string;
    currentState?: string;
    assignedTo?: string;
    reviewedBy?: string;
    approvedBy?: string;
    comments?: string;
  }): Promise<ApiResponse<SectionCollaborationState>> {
    const response = await fetch(`${this.baseUrl}/collaboration`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // Progress API
  async getAssessmentProgress(params: {
    personaId: string;
    subPersonaId?: string;
    assessmentId?: string;
  }): Promise<ApiResponse<AssessmentProgress>> {
    const searchParams = new URLSearchParams();
    searchParams.set('personaId', params.personaId);
    if (params.subPersonaId) searchParams.set('subPersonaId', params.subPersonaId);
    if (params.assessmentId) searchParams.set('assessmentId', params.assessmentId);

    const response = await fetch(`${this.baseUrl}/progress?${searchParams.toString()}`);
    return response.json();
  }

  async saveAssessmentResponse(data: {
    personaId: string;
    subPersonaId?: string;
    sectionId: string;
    questionId: string;
    response: any;
    points?: number;
    timestamp?: string;
  }): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // Therapeutic Areas API
  async getTherapeuticAreas(includeQuestions: boolean = false): Promise<ApiResponse<TherapeuticArea[]>> {
    const response = await fetch(`${this.baseUrl}/therapeutic-areas?includeQuestions=${includeQuestions}`);
    return response.json();
  }

  async createTherapeuticArea(data: {
    name: string;
    description?: string;
    code?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<TherapeuticArea>> {
    const response = await fetch(`${this.baseUrl}/therapeutic-areas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

// Company API methods
export class CompanyApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getCompanies(params: {
    includeAssessments?: boolean;
    isActive?: boolean;
  } = {}): Promise<ApiResponse<any[]>> {
    const searchParams = new URLSearchParams();
    if (params.includeAssessments) searchParams.set('includeAssessments', 'true');
    if (params.isActive !== undefined) searchParams.set('isActive', params.isActive.toString());

    const response = await fetch(`${this.baseUrl}/companies?${searchParams.toString()}`);
    return response.json();
  }

  async createCompany(data: {
    name: string;
    industryType?: string;
    description?: string;
    website?: string;
    subscriptionTier?: string;
    therapeuticFocus?: string[];
    aiInitiatives?: string[];
    deploymentScenarios?: string[];
    isActive?: boolean;
  }): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

// Export singleton instances
export const assessmentApi = new AssessmentApiClient();
export const companyApi = new CompanyApiClient();

// Utility functions
export const getPersonaDisplayName = (persona: Persona, subPersona?: SubPersona | null): string => {
  if (subPersona) {
    return `${persona.name} - ${subPersona.name}`;
  }
  return persona.name;
};

export const getSectionProgressColor = (completionRate: number): string => {
  if (completionRate >= 90) return 'text-green-600';
  if (completionRate >= 70) return 'text-yellow-600';
  if (completionRate >= 50) return 'text-orange-600';
  return 'text-red-600';
};

export const getProductionStatusColor = (status: string): string => {
  return status === 'production_ready' ? 'text-green-600' : 'text-red-600';
};

export const formatTimeEstimate = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};
