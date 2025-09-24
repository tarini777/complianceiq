/**
 * General Compliance Agent
 * Handles general compliance questions and provides overall guidance
 */

import { BaseAgent } from './BaseAgent';
import { AgentCapability, AgentContext, AgentResponse } from './AgentManager';

export class ComplianceAgent extends BaseAgent {
  constructor() {
    super('compliance');
  }

  protected initializeCapabilities(): AgentCapability {
    return {
      domain: 'compliance',
      subdomains: ['Best Practices', 'Implementation Guidance', 'Training & Competency', 'General Support'],
      keywords: [
        'compliance', 'best practice', 'implementation', 'training', 'competency',
        'governance', 'policy', 'procedure', 'standard', 'framework', 'guidance',
        'help', 'support', 'getting started', 'how to', 'what is', 'explain',
        'overview', 'introduction', 'basics', 'fundamentals', 'principles',
        'approach', 'methodology', 'process', 'workflow', 'checklist'
      ],
      expertise: [
        'Compliance Best Practices',
        'Implementation Guidance',
        'Training and Competency Development',
        'General Compliance Support'
      ]
    };
  }

  protected initializeSubAgents(): void {
    // Compliance agent doesn't have sub-agents
  }

  protected getDefaultRelatedQuestions(): string[] {
    return [
      'What can AskRexi help me with?',
      'How do I get started with compliance assessments?',
      'What are the key compliance principles?',
      'How do I implement compliance best practices?',
      'What training is available for compliance?',
      'How do I develop compliance competencies?',
      'What are the compliance fundamentals?',
      'How do I build a compliance framework?'
    ];
  }

  /**
   * Enhanced processing for compliance guidance questions
   */
  async process(question: string, context?: AgentContext): Promise<AgentResponse> {
    const questionLower = question.toLowerCase();
    
    // Provide comprehensive compliance guidance
    return await this.generateComplianceGuidanceResponse(question, context);
  }

  /**
   * Generate comprehensive compliance guidance response
   */
  private async generateComplianceGuidanceResponse(question: string, context?: AgentContext): Promise<AgentResponse> {
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes('what') && (questionLower.includes('askrexi') || questionLower.includes('help'))) {
      return {
        answer: "AskRexi is your intelligent regulatory compliance assistant. I can help you with: • **Regulatory Intelligence** - FDA, EMA, ICH guidelines and their impact • **Assessment Support** - Guidance on specific questions and requirements • **Analytics & Reporting** - Performance insights and recommendations • **Compliance Guidance** - What you need to do to meet requirements. I access real regulatory data when available and provide comprehensive mock guidance to ensure you always get helpful information.",
        category: 'compliance',
        subcategory: 'General Support',
        sources: [
          {
            type: 'compliance',
            title: 'AskRexi Capabilities Overview',
            content: 'Comprehensive AI-powered compliance assistance across all regulatory domains',
            url: '/help/askrexi-capabilities'
          }
        ],
        actionItems: [
          'Ask about specific FDA, EMA, or ICH regulations',
          'Get guidance on assessment questions',
          'Request analytics and performance insights',
          'Learn about compliance requirements for your area'
        ],
        impactLevel: 'low',
        relatedQuestions: this.getDefaultRelatedQuestions(),
        confidence: 0.95,
        agentUsed: this.agentName,
        subAgentUsed: undefined
      };
    }
    
    if (questionLower.includes('getting started') || questionLower.includes('how to start')) {
      return {
        answer: "Getting Started with Compliance: 1) **Assess Current State** - Complete initial compliance assessment to identify gaps, 2) **Prioritize Requirements** - Focus on critical and high-impact areas first, 3) **Develop Implementation Plan** - Create timeline and assign responsibilities, 4) **Implement Controls** - Deploy necessary processes and systems, 5) **Monitor and Improve** - Continuously monitor and optimize compliance posture.",
        category: 'compliance',
        subcategory: 'Implementation Guidance',
        sources: [
          {
            type: 'compliance',
            title: 'Compliance Implementation Guide',
            content: 'Step-by-step guidance for implementing compliance programs',
            url: '/guides/getting-started'
          }
        ],
        actionItems: [
          'Complete initial compliance assessment',
          'Identify critical compliance gaps',
          'Develop prioritized implementation plan',
          'Assign roles and responsibilities',
          'Establish monitoring processes'
        ],
        impactLevel: 'medium',
        relatedQuestions: this.getDefaultRelatedQuestions(),
        confidence: 0.9,
        agentUsed: this.agentName,
        subAgentUsed: undefined
      };
    }
    
    if (questionLower.includes('best practice') || questionLower.includes('principles')) {
      return {
        answer: "Compliance Best Practices: 1) **Risk-Based Approach** - Focus resources on highest risk areas, 2) **Documentation Excellence** - Maintain comprehensive, accurate records, 3) **Continuous Monitoring** - Implement ongoing compliance monitoring, 4) **Training & Competency** - Ensure staff understand requirements, 5) **Regular Reviews** - Conduct periodic assessments and updates, 6) **Stakeholder Engagement** - Involve all relevant parties in compliance efforts.",
        category: 'compliance',
        subcategory: 'Best Practices',
        sources: [
          {
            type: 'compliance',
            title: 'Compliance Best Practices Framework',
            content: 'Industry-leading practices for compliance program excellence',
            url: '/guides/best-practices'
          }
        ],
        actionItems: [
          'Implement risk-based compliance approach',
          'Establish documentation standards',
          'Deploy continuous monitoring systems',
          'Develop training programs',
          'Schedule regular compliance reviews'
        ],
        impactLevel: 'medium',
        relatedQuestions: this.getDefaultRelatedQuestions(),
        confidence: 0.85,
        agentUsed: this.agentName,
        subAgentUsed: undefined
      };
    }
    
    if (questionLower.includes('training') || questionLower.includes('competency')) {
      return {
        answer: "Compliance Training & Competency: 1) **Role-Based Training** - Tailor training to specific job functions, 2) **Regulatory Updates** - Keep current with changing requirements, 3) **Practical Application** - Include hands-on exercises and real scenarios, 4) **Competency Assessment** - Verify understanding through testing, 5) **Continuous Learning** - Provide ongoing education opportunities, 6) **Documentation** - Maintain training records and certifications.",
        category: 'compliance',
        subcategory: 'Training & Competency',
        sources: [
          {
            type: 'compliance',
            title: 'Compliance Training Program',
            content: 'Comprehensive training and competency development framework',
            url: '/training/compliance-program'
          }
        ],
        actionItems: [
          'Assess current competency levels',
          'Develop role-based training curricula',
          'Implement competency assessments',
          'Establish continuous learning programs',
          'Maintain training documentation'
        ],
        impactLevel: 'medium',
        relatedQuestions: this.getDefaultRelatedQuestions(),
        confidence: 0.8,
        agentUsed: this.agentName,
        subAgentUsed: undefined
      };
    }
    
    // Default comprehensive compliance response
    return {
      answer: "Compliance Guidance: I provide comprehensive support across all compliance domains including regulatory intelligence, assessment guidance, analytics insights, and implementation support. Whether you need specific regulatory information, help with assessments, performance analytics, or general compliance guidance, I can assist with both real-time data and comprehensive mock guidance to ensure you always get the support you need.",
      category: 'compliance',
      subcategory: 'General Guidance',
      sources: [
        {
          type: 'compliance',
          title: 'Comprehensive Compliance Support',
          content: 'Full-spectrum compliance assistance and guidance',
          url: '/compliance/support'
        }
      ],
      actionItems: [
        'Specify your compliance question or area of interest',
        'Provide context about your organization or situation',
        'Ask about specific regulatory requirements',
        'Request analytics or performance insights'
      ],
      impactLevel: 'medium',
      relatedQuestions: this.getDefaultRelatedQuestions(),
      confidence: 0.75,
      agentUsed: this.agentName,
      subAgentUsed: undefined
    };
  }
}
