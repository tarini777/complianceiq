/**
 * Dynamic Question Generator - ComplianceIQ System
 * Automatically generates assessment questions from regulatory requirements
 * Flags new questions for admin approval
 */

import { regulatoryTypes } from '@/lib/regulatory/regulatoryTypes';

export interface GeneratedQuestion {
  id: string;
  text: string;
  type: 'boolean' | 'text' | 'radio' | 'checkbox' | 'rating';
  points: number;
  isBlocker: boolean;
  category: string;
  evidenceRequired: string[];
  responsibleRole: string[];
  validationCriteria: Record<string, any>;
  source: {
    regulatoryType: string;
    regulation: string;
    requirement: string;
    jurisdiction: string;
    authority: string;
  };
  status: 'pending_approval' | 'approved' | 'rejected' | 'draft';
  generatedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
}

export interface QuestionTemplate {
  id: string;
  name: string;
  pattern: string;
  questionType: 'boolean' | 'text' | 'radio' | 'checkbox' | 'rating';
  defaultPoints: number;
  isBlocker: boolean;
  evidenceTemplate: string[];
  roleTemplate: string[];
  validationTemplate: Record<string, any>;
}

// Question templates for different types of regulatory requirements
const questionTemplates: QuestionTemplate[] = [
  {
    id: 'compliance-implementation',
    name: 'Compliance Implementation',
    pattern: 'Is your {system} production-implemented and {authority}-approved for {requirement}?',
    questionType: 'boolean',
    defaultPoints: 5,
    isBlocker: true,
    evidenceTemplate: ['{authority} approval documentation', '{requirement} implementation evidence'],
    roleTemplate: ['Regulatory Affairs Director', 'Compliance Officer'],
    validationTemplate: { authorityApproval: true, implementationComplete: true }
  },
  {
    id: 'validation-framework',
    name: 'Validation Framework',
    pattern: 'Is your {system} validation framework production-deployed meeting {authority} {requirement} requirements?',
    questionType: 'boolean',
    defaultPoints: 4,
    isBlocker: true,
    evidenceTemplate: ['Validation framework documentation', '{authority} compliance certificates'],
    roleTemplate: ['AI/ML Engineer', 'Quality Assurance Manager'],
    validationTemplate: { validationComplete: true, authorityCompliant: true }
  },
  {
    id: 'monitoring-system',
    name: 'Monitoring System',
    pattern: 'Are your {system} monitoring systems production-configured for {requirement} compliance?',
    questionType: 'boolean',
    defaultPoints: 3,
    isBlocker: false,
    evidenceTemplate: ['Monitoring system documentation', 'Compliance tracking reports'],
    roleTemplate: ['Data Engineer', 'Compliance Officer'],
    validationTemplate: { monitoringActive: true, complianceTracked: true }
  },
  {
    id: 'documentation-system',
    name: 'Documentation System',
    pattern: 'Is your {system} documentation production-formatted and validated for {authority} {requirement} submissions?',
    questionType: 'boolean',
    defaultPoints: 4,
    isBlocker: false,
    evidenceTemplate: ['Documentation system', '{authority} submission templates'],
    roleTemplate: ['Documentation Specialist', 'Regulatory Affairs Director'],
    validationTemplate: { documentationComplete: true, authorityFormatted: true }
  },
  {
    id: 'risk-assessment',
    name: 'Risk Assessment',
    pattern: 'Have you conducted a comprehensive risk assessment for {requirement} compliance in your {system}?',
    questionType: 'boolean',
    defaultPoints: 3,
    isBlocker: false,
    evidenceTemplate: ['Risk assessment documentation', 'Mitigation strategies'],
    roleTemplate: ['Risk Manager', 'Compliance Officer'],
    validationTemplate: { riskAssessed: true, mitigationPlanned: true }
  },
  {
    id: 'training-program',
    name: 'Training Program',
    pattern: 'Is your staff training program production-implemented for {requirement} compliance?',
    questionType: 'boolean',
    defaultPoints: 2,
    isBlocker: false,
    evidenceTemplate: ['Training program documentation', 'Staff competency records'],
    roleTemplate: ['Training Manager', 'HR Director'],
    validationTemplate: { trainingComplete: true, competencyVerified: true }
  }
];

export class DynamicQuestionGenerator {
  private generatedQuestions: GeneratedQuestion[] = [];
  private processedRequirements: Set<string> = new Set();

  /**
   * Generate questions from NEW regulatory requirements only (incremental)
   */
  async generateIncrementalQuestions(): Promise<GeneratedQuestion[]> {
    const newQuestions: GeneratedQuestion[] = [];
    
    // Get already processed requirements from database
    await this.loadProcessedRequirements();

    for (const regulatoryType of regulatoryTypes) {
      for (const regulation of regulatoryType.regulations) {
        for (const requirement of regulation.requirements) {
          const requirementKey = this.getRequirementKey(regulatoryType.id, regulation.id, requirement);
          
          // Only process if this requirement hasn't been processed before
          if (!this.processedRequirements.has(requirementKey)) {
            const questions = this.generateQuestionsForRequirement(
              regulatoryType,
              regulation,
              requirement
            );
            newQuestions.push(...questions);
            
            // Mark as processed
            this.processedRequirements.add(requirementKey);
          }
        }
      }
    }

    return newQuestions;
  }

  /**
   * Generate questions from regulatory requirements (legacy method for full generation)
   */
  generateQuestionsFromRegulations(): GeneratedQuestion[] {
    const newQuestions: GeneratedQuestion[] = [];

    for (const regulatoryType of regulatoryTypes) {
      for (const regulation of regulatoryType.regulations) {
        for (const requirement of regulation.requirements) {
          // Generate questions for each requirement
          const questions = this.generateQuestionsForRequirement(
            regulatoryType,
            regulation,
            requirement
          );
          newQuestions.push(...questions);
        }
      }
    }

    return newQuestions;
  }

  /**
   * Load already processed requirements from database
   */
  private async loadProcessedRequirements(): Promise<void> {
    try {
      // This would query the database for existing questions to determine what's been processed
      // For now, we'll use a simple approach - check existing question IDs
      const response = await fetch('/api/assessment/dynamic-questions');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          // Extract requirement keys from existing questions
          result.data.forEach((question: any) => {
            if (question.source && question.source.regulatoryType && question.source.regulation && question.source.requirement) {
              const key = this.getRequirementKey(
                question.source.regulatoryType,
                question.source.regulation,
                question.source.requirement
              );
              this.processedRequirements.add(key);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error loading processed requirements:', error);
    }
  }

  /**
   * Generate unique key for a requirement
   */
  private getRequirementKey(regulatoryTypeId: string, regulationId: string, requirement: string): string {
    return `${regulatoryTypeId}-${regulationId}-${requirement.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  }

  /**
   * Generate questions from specific regulatory changes
   */
  async generateQuestionsFromChanges(changes: any[]): Promise<GeneratedQuestion[]> {
    const newQuestions: GeneratedQuestion[] = [];
    
    for (const change of changes) {
      // Find the corresponding regulatory type and regulation
      const regulatoryType = regulatoryTypes.find(rt => rt.authority === change.source);
      
      if (regulatoryType) {
        // Create a mock regulation object for the change
        const mockRegulation = {
          id: change.id,
          title: change.title,
          description: change.description,
          requirements: change.requirements || [change.description]
        };
        
        // Generate questions for each requirement in the change
        for (const requirement of mockRegulation.requirements) {
          const questions = this.generateQuestionsForRequirement(
            regulatoryType,
            mockRegulation,
            requirement
          );
          newQuestions.push(...questions);
        }
      }
    }
    
    return newQuestions;
  }

  /**
   * Generate questions for a specific regulatory requirement
   */
  private generateQuestionsForRequirement(
    regulatoryType: any,
    regulation: any,
    requirement: string
  ): GeneratedQuestion[] {
    const questions: GeneratedQuestion[] = [];

    // Determine which templates to use based on requirement content
    const applicableTemplates = this.getApplicableTemplates(requirement);

    for (const template of applicableTemplates) {
      const question = this.createQuestionFromTemplate(
        template,
        regulatoryType,
        regulation,
        requirement
      );
      questions.push(question);
    }

    return questions;
  }

  /**
   * Get applicable question templates based on requirement content
   */
  private getApplicableTemplates(requirement: string): QuestionTemplate[] {
    const lowerRequirement = requirement.toLowerCase();
    const templates: QuestionTemplate[] = [];

    // Map requirement keywords to templates
    if (lowerRequirement.includes('validation') || lowerRequirement.includes('validation')) {
      templates.push(questionTemplates.find(t => t.id === 'validation-framework')!);
    }
    
    if (lowerRequirement.includes('monitoring') || lowerRequirement.includes('oversight')) {
      templates.push(questionTemplates.find(t => t.id === 'monitoring-system')!);
    }
    
    if (lowerRequirement.includes('documentation') || lowerRequirement.includes('documentation')) {
      templates.push(questionTemplates.find(t => t.id === 'documentation-system')!);
    }
    
    if (lowerRequirement.includes('risk') || lowerRequirement.includes('assessment')) {
      templates.push(questionTemplates.find(t => t.id === 'risk-assessment')!);
    }
    
    if (lowerRequirement.includes('training') || lowerRequirement.includes('competency')) {
      templates.push(questionTemplates.find(t => t.id === 'training-program')!);
    }

    // Always include compliance implementation for critical requirements
    if (lowerRequirement.includes('clinical') || lowerRequirement.includes('safety') || 
        lowerRequirement.includes('quality') || lowerRequirement.includes('regulatory')) {
      templates.push(questionTemplates.find(t => t.id === 'compliance-implementation')!);
    }

    // Default to compliance implementation if no specific template matches
    if (templates.length === 0) {
      templates.push(questionTemplates.find(t => t.id === 'compliance-implementation')!);
    }

    return templates;
  }

  /**
   * Create a question from a template
   */
  private createQuestionFromTemplate(
    template: QuestionTemplate,
    regulatoryType: any,
    regulation: any,
    requirement: string
  ): GeneratedQuestion {
    const questionId = this.generateQuestionId(regulatoryType.id, regulation.id, requirement);
    
    // Replace placeholders in template
    const questionText = template.pattern
      .replace('{system}', this.getSystemName(requirement))
      .replace('{authority}', regulatoryType.authority)
      .replace('{requirement}', requirement);

    const evidenceRequired = template.evidenceTemplate.map(evidence =>
      evidence
        .replace('{authority}', regulatoryType.authority)
        .replace('{requirement}', requirement)
    );

    const responsibleRole = template.roleTemplate;

    const validationCriteria = { ...template.validationTemplate };

    return {
      id: questionId,
      text: questionText,
      type: template.questionType,
      points: template.defaultPoints,
      isBlocker: template.isBlocker,
      category: `${regulatoryType.category} - ${template.name}`,
      evidenceRequired,
      responsibleRole,
      validationCriteria,
      source: {
        regulatoryType: regulatoryType.id,
        regulation: regulation.id,
        requirement,
        jurisdiction: regulatoryType.jurisdiction,
        authority: regulatoryType.authority
      },
      status: 'pending_approval',
      generatedAt: new Date()
    };
  }

  /**
   * Generate unique question ID
   */
  private generateQuestionId(regulatoryTypeId: string, regulationId: string, requirement: string): string {
    const requirementHash = requirement
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 10);
    
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    
    return `auto-${regulatoryTypeId}-${regulationId}-${requirementHash}-${timestamp}-${random}`;
  }

  /**
   * Get system name based on requirement context
   */
  private getSystemName(requirement: string): string {
    const lowerRequirement = requirement.toLowerCase();
    
    if (lowerRequirement.includes('ai') || lowerRequirement.includes('machine learning')) {
      return 'AI/ML system';
    }
    if (lowerRequirement.includes('clinical')) {
      return 'clinical system';
    }
    if (lowerRequirement.includes('data')) {
      return 'data management system';
    }
    if (lowerRequirement.includes('quality')) {
      return 'quality management system';
    }
    if (lowerRequirement.includes('safety')) {
      return 'safety monitoring system';
    }
    
    return 'system';
  }

  /**
   * Get questions pending approval
   */
  getPendingQuestions(): GeneratedQuestion[] {
    return this.generatedQuestions.filter(q => q.status === 'pending_approval');
  }

  /**
   * Get questions by status
   */
  getQuestionsByStatus(status: GeneratedQuestion['status']): GeneratedQuestion[] {
    return this.generatedQuestions.filter(q => q.status === status);
  }

  /**
   * Approve a question
   */
  approveQuestion(questionId: string, approvedBy: string): boolean {
    const question = this.generatedQuestions.find(q => q.id === questionId);
    if (question && question.status === 'pending_approval') {
      question.status = 'approved';
      question.approvedBy = approvedBy;
      question.approvedAt = new Date();
      return true;
    }
    return false;
  }

  /**
   * Reject a question
   */
  rejectQuestion(questionId: string, rejectionReason: string): boolean {
    const question = this.generatedQuestions.find(q => q.id === questionId);
    if (question && question.status === 'pending_approval') {
      question.status = 'rejected';
      question.rejectionReason = rejectionReason;
      return true;
    }
    return false;
  }
}

export default DynamicQuestionGenerator;
