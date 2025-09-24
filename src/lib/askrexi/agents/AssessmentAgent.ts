/**
 * Assessment Support Agent
 * Specialized agent for assessment questions and guidance
 */

import { BaseAgent } from './BaseAgent';
import { AgentCapability, AgentContext, AgentResponse } from './AgentManager';
import { prisma } from '@/lib/prisma';

export class AssessmentAgent extends BaseAgent {
  constructor() {
    super('assessment');
  }

  protected initializeCapabilities(): AgentCapability {
    return {
      domain: 'assessment',
      subdomains: ['Data Governance', 'Model Validation', 'Risk Management', 'Quality Assurance', 'Training & Competency'],
      keywords: [
        'assessment', 'question', 'section', 'requirement', 'evidence', 'documentation',
        'validation', 'verification', 'testing', 'protocol', 'sop', 'checklist',
        'audit', 'inspection', 'governance', 'data governance', 'model validation',
        'quality assurance', 'risk assessment', 'production blocker', 'compliance',
        'evidence required', 'responsible roles', 'validation criteria', 'guidance',
        'best practice', 'implementation', 'training', 'competency', 'certification'
      ],
      expertise: [
        'Assessment Question Guidance',
        'Evidence Requirements',
        'Validation Procedures',
        'Compliance Documentation',
        'Best Practice Implementation'
      ]
    };
  }

  protected initializeSubAgents(): void {
    // Assessment agent doesn't have sub-agents yet, but could be expanded
  }

  protected getDefaultRelatedQuestions(): string[] {
    return [
      'How do I complete the data governance assessment section?',
      'What evidence is required for model validation?',
      'How do I conduct AI risk assessment?',
      'What are the QA requirements for AI systems?',
      'How do I validate AI model performance?',
      'What are the production blocker requirements?',
      'How do I document compliance evidence?',
      'What training is required for AI compliance?'
    ];
  }

  /**
   * Enhanced processing for assessment questions with database and training integration
   */
  async process(question: string, context?: AgentContext): Promise<AgentResponse> {
    const questionLower = question.toLowerCase();
    
    // Try to get assessment data from database
    const assessmentData = await this.searchAssessmentData(question);
    
    if (assessmentData && assessmentData.length > 0) {
      return await this.generateAssessmentResponse(question, assessmentData, context);
    }
    
    // Then try to find training data match
    const trainingMatch = await this.searchTrainingData(question);
    
    if (trainingMatch) {
      return await this.generateTrainingDataResponse(question, trainingMatch, context);
    }
    
    // Fallback to mock assessment guidance
    return await this.generateMockAssessmentResponse(question, context);
  }

  /**
   * Search assessment data from database
   */
  private async searchAssessmentData(question: string): Promise<any[]> {
    try {
      const searchTerms = this.extractAssessmentTerms(question);
      
      const results = await prisma.dynamicQuestion.findMany({
        where: {
          OR: [
            {
              questionText: {
                contains: searchTerms.join(' '),
                mode: 'insensitive'
              }
            },
            {
              category: {
                in: searchTerms
              }
            }
          ],
          status: 'approved'
        },
        include: {
          guidanceContent: true,
          section: true
        },
        take: 3
      });
      
      return results;
    } catch (error) {
      console.error('Error searching assessment data:', error);
      return [];
    }
  }

  /**
   * Extract assessment-specific terms from question
   */
  private extractAssessmentTerms(question: string): string[] {
    const terms = [];
    const questionLower = question.toLowerCase();
    
    // Assessment sections
    if (questionLower.includes('data governance')) terms.push('data governance');
    if (questionLower.includes('model validation')) terms.push('model validation');
    if (questionLower.includes('risk assessment')) terms.push('risk assessment');
    if (questionLower.includes('quality assurance')) terms.push('quality assurance');
    if (questionLower.includes('training')) terms.push('training');
    if (questionLower.includes('competency')) terms.push('competency');
    
    // Assessment-specific keywords
    const assessmentTerms = ['evidence', 'documentation', 'validation', 'verification', 'testing', 'protocol', 'sop', 'checklist', 'audit', 'inspection'];
    assessmentTerms.forEach(term => {
      if (questionLower.includes(term)) {
        terms.push(term);
      }
    });
    
    return terms.length > 0 ? terms : [question.split(' ').slice(0, 3).join(' ')];
  }

  /**
   * Generate response from assessment database data
   */
  private async generateAssessmentResponse(question: string, data: any[], context?: AgentContext): Promise<AgentResponse> {
    const primaryResult = data[0];
    const guidanceContent = primaryResult.guidanceContent[0];
    
    return {
      answer: `Assessment Support: ${guidanceContent ? guidanceContent.description : primaryResult.questionText}. ${guidanceContent ? guidanceContent.actionSteps.join('. ') : 'Please provide specific evidence and documentation as required.'}`,
      category: 'assessment',
      subcategory: primaryResult.category || 'General Assessment',
      sources: data.map(item => ({
        type: 'assessment' as const,
        title: `${item.section?.title || 'Assessment'} - ${item.questionText.substring(0, 50)}...`,
        content: item.questionText,
        url: `/assessment?section=${item.section?.id}&question=${item.id}`
      })),
      actionItems: this.generateAssessmentActionItems(primaryResult),
      impactLevel: primaryResult.isProductionBlocker ? 'critical' : 'medium',
      relatedQuestions: this.getDefaultRelatedQuestions(),
      confidence: 0.85,
      agentUsed: this.agentName,
      subAgentUsed: undefined
    };
  }

  /**
   * Generate mock assessment response when no database data available
   */
  private async generateMockAssessmentResponse(question: string, context?: AgentContext): Promise<AgentResponse> {
    const mockData = this.getMockAssessmentData(question);
    
    return {
      answer: mockData.answer,
      category: 'assessment',
      subcategory: mockData.subcategory,
      sources: mockData.sources,
      actionItems: mockData.actionItems,
      impactLevel: mockData.impactLevel,
      relatedQuestions: this.getDefaultRelatedQuestions(),
      confidence: 0.7,
      agentUsed: this.agentName,
      subAgentUsed: undefined
    };
  }

  /**
   * Get mock assessment data based on question
   */
  private getMockAssessmentData(question: string): any {
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes('data governance')) {
      return {
        answer: "Data Governance Assessment requires: 1) Data inventory and classification, 2) Data quality monitoring procedures, 3) Data access controls and permissions, 4) Data retention and disposal policies, 5) Data lineage documentation. Evidence required includes data governance policies, monitoring dashboards, access logs, and audit reports.",
        subcategory: 'Data Governance',
        sources: [
          {
            type: 'assessment',
            title: 'Data Governance Framework Assessment',
            content: 'Comprehensive data governance requirements and evidence collection',
            url: '/assessment?section=data-governance'
          }
        ],
        actionItems: [
          'Document data inventory and classification',
          'Implement data quality monitoring',
          'Establish data access controls',
          'Create data retention policies',
          'Maintain data lineage documentation'
        ],
        impactLevel: 'high'
      };
    }
    
    if (questionLower.includes('model validation')) {
      return {
        answer: "AI Model Validation Assessment requires: 1) Validation protocol development, 2) Performance testing across diverse datasets, 3) Bias detection and mitigation, 4) Clinical validation studies, 5) Ongoing performance monitoring. Evidence includes validation reports, test results, bias analysis, and monitoring dashboards.",
        subcategory: 'Model Validation',
        sources: [
          {
            type: 'assessment',
            title: 'AI Model Validation Requirements',
            content: 'Comprehensive model validation framework and testing procedures',
            url: '/assessment?section=model-validation'
          }
        ],
        actionItems: [
          'Develop validation protocols',
          'Conduct performance testing',
          'Implement bias detection',
          'Execute clinical validation',
          'Establish monitoring systems'
        ],
        impactLevel: 'critical'
      };
    }
    
    if (questionLower.includes('risk assessment')) {
      return {
        answer: "AI Risk Assessment requires: 1) Risk identification and categorization, 2) Impact and likelihood analysis, 3) Risk mitigation strategies, 4) Residual risk evaluation, 5) Risk monitoring and review. Evidence includes risk registers, impact assessments, mitigation plans, and monitoring reports.",
        subcategory: 'Risk Assessment',
        sources: [
          {
            type: 'assessment',
            title: 'AI Risk Management Framework',
            content: 'Comprehensive risk assessment methodology and requirements',
            url: '/assessment?section=risk-management'
          }
        ],
        actionItems: [
          'Identify and categorize risks',
          'Analyze impact and likelihood',
          'Develop mitigation strategies',
          'Evaluate residual risks',
          'Implement risk monitoring'
        ],
        impactLevel: 'high'
      };
    }
    
    // Default assessment response
    return {
      answer: "Assessment Support provides guidance on completing compliance assessments, including evidence requirements, documentation standards, and validation procedures. Each assessment section has specific requirements and responsible roles. I can provide detailed guidance on specific assessment areas.",
      subcategory: 'General Assessment',
      sources: [
        {
          type: 'assessment',
          title: 'Assessment Support Framework',
          content: 'Comprehensive assessment guidance and support',
          url: '/assessment'
        }
      ],
      actionItems: [
        'Review assessment requirements',
        'Gather required evidence',
        'Complete documentation',
        'Validate compliance',
        'Submit for review'
      ],
      impactLevel: 'medium'
    };
  }

  /**
   * Generate action items for assessment responses
   */
  private generateAssessmentActionItems(data: any): string[] {
    const items = [];
    
    if (data.evidenceRequired && data.evidenceRequired.length > 0) {
      items.push(`Gather required evidence: ${data.evidenceRequired.join(', ')}`);
    }
    
    if (data.responsibleRoles && data.responsibleRoles.length > 0) {
      items.push(`Engage responsible roles: ${data.responsibleRoles.join(', ')}`);
    }
    
    if (data.isProductionBlocker) {
      items.push('CRITICAL: This is a production blocker - immediate action required');
    }
    
    items.push('Complete assessment documentation');
    items.push('Validate compliance evidence');
    items.push('Submit for review and approval');
    
    return items;
  }

  /**
   * Search training data for assessment questions
   */
  private async searchTrainingData(question: string): Promise<any> {
    try {
      const searchTerms = this.extractAssessmentTerms(question);
      
      const results = await prisma.askRexiTrainingData.findMany({
        where: {
          AND: [
            { category: 'assessment' },
            {
              OR: [
                {
                  question: {
                    contains: question,
                    mode: 'insensitive'
                  }
                },
                {
                  variations: {
                    hasSome: searchTerms
                  }
                },
                {
                  keywords: {
                    hasSome: searchTerms
                  }
                }
              ]
            }
          ]
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      });
      
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Error searching assessment training data:', error);
      return null;
    }
  }

  /**
   * Generate response from training data
   */
  private async generateTrainingDataResponse(question: string, trainingData: any, context?: AgentContext): Promise<AgentResponse> {
    return {
      answer: trainingData.answer,
      category: 'assessment',
      subcategory: trainingData.subcategory || 'General Assessment',
      sources: trainingData.sources.map((source: string) => ({
        type: 'assessment' as const,
        title: `${source} - Assessment Guidance`,
        content: trainingData.answer.substring(0, 200) + '...',
        url: `/assessment?search=${encodeURIComponent(trainingData.subcategory)}`
      })),
      actionItems: trainingData.actionItems || [
        'Review assessment requirements',
        'Gather required evidence',
        'Complete documentation',
        'Validate responses'
      ],
      impactLevel: this.mapImpactLevel(trainingData.impactLevel),
      relatedQuestions: this.getDefaultRelatedQuestions(),
      confidence: 0.9,
      agentUsed: this.agentName,
      subAgentUsed: undefined
    };
  }

  /**
   * Map impact level from training data
   */
  private mapImpactLevel(level: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (level?.toLowerCase()) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'medium';
    }
  }
}
