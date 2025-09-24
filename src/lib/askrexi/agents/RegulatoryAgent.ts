/**
 * Regulatory Intelligence Agent
 * Specialized agent for FDA, EMA, ICH, and other regulatory guidance
 */

import { BaseAgent } from './BaseAgent';
import { AgentCapability, AgentContext, AgentResponse } from './AgentManager';
import { FDAAgent } from './sub-agents/FDAAgent';
import { EMAAgent } from './sub-agents/EMAAgent';
import { ICHAgent } from './sub-agents/ICHAgent';
import { GeneralRegulatoryAgent } from './sub-agents/GeneralRegulatoryAgent';
import { prisma } from '@/lib/prisma';

export class RegulatoryAgent extends BaseAgent {
  constructor() {
    super('regulatory');
  }

  protected initializeCapabilities(): AgentCapability {
    return {
      domain: 'regulatory',
      subdomains: ['FDA Guidelines', 'EMA Requirements', 'ICH Standards', 'General Regulatory'],
      keywords: [
        'fda', 'ema', 'ich', 'regulation', 'guideline', 'compliance', 'regulatory',
        'approval', 'submission', 'clinical trial', 'safety', 'efficacy', 'gcp',
        'gmp', 'glp', 'qms', 'risk management', 'pharmacovigilance', 'samd',
        'ai/ml action plan', 'gmlp', 'eu ai act', 'gdpr', '21 cfr part 11',
        'good clinical practice', 'good manufacturing practice', 'good laboratory practice',
        'quality management system', 'adverse event', 'drug safety', 'regulatory pathway',
        'premarket approval', '510k', 'de novo', 'breakthrough therapy', 'fast track',
        'orphan drug', 'biosimilar', 'generic', 'new drug application', 'nda',
        'investigational new drug', 'ind', 'biologics license application', 'bla'
      ],
      expertise: [
        'FDA AI/ML Guidelines',
        'EMA Reflection Papers',
        'ICH Harmonization',
        'Regulatory Submissions',
        'Clinical Trial Regulations',
        'Drug Safety Requirements',
        'Quality Standards',
        'Compliance Frameworks'
      ]
    };
  }

  protected initializeSubAgents(): void {
    this.subAgents.set('fda', new FDAAgent());
    this.subAgents.set('ema', new EMAAgent());
    this.subAgents.set('ich', new ICHAgent());
    this.subAgents.set('general', new GeneralRegulatoryAgent());
  }

  protected getDefaultRelatedQuestions(): string[] {
    return [
      'What are the latest FDA guidelines for AI in healthcare?',
      'How do EMA regulations affect our therapeutic area?',
      'What are the ICH requirements for clinical trials?',
      'What is the impact of new GCP guidelines?',
      'How do I prepare for regulatory submissions?',
      'What are the key regulatory milestones for our product?',
      'How do I ensure compliance with international regulations?',
      'What are the consequences of regulatory non-compliance?'
    ];
  }

  /**
   * Enhanced processing for regulatory questions with database and training integration
   */
  async process(question: string, context?: AgentContext): Promise<AgentResponse> {
    const questionLower = question.toLowerCase();
    
    // First try to get data from regulatory intelligence database
    const regulatoryData = await this.searchRegulatoryIntelligence(question);
    
    if (regulatoryData && regulatoryData.length > 0) {
      return await this.generateRegulatoryResponse(question, regulatoryData, context);
    }
    
    // Then try to find training data match
    const trainingMatch = await this.searchTrainingData(question);
    
    if (trainingMatch) {
      return await this.generateTrainingDataResponse(question, trainingMatch, context);
    }
    
    // Check for specific regulatory body mentions
    if (questionLower.includes('fda') || questionLower.includes('food and drug administration')) {
      return await this.subAgents.get('fda')?.process(question, context) || await super.process(question, context);
    }
    
    if (questionLower.includes('ema') || questionLower.includes('european medicines agency')) {
      return await this.subAgents.get('ema')?.process(question, context) || await super.process(question, context);
    }
    
    if (questionLower.includes('ich') || questionLower.includes('international council for harmonisation')) {
      return await this.subAgents.get('ich')?.process(question, context) || await super.process(question, context);
    }
    
    // Check for specific regulatory topics
    if (this.isClinicalTrialQuestion(questionLower)) {
      return await this.subAgents.get('ich')?.process(question, context) || await super.process(question, context);
    }
    
    if (this.isAIMLQuestion(questionLower)) {
      return await this.subAgents.get('fda')?.process(question, context) || await super.process(question, context);
    }
    
    if (this.isDataPrivacyQuestion(questionLower)) {
      return await this.subAgents.get('ema')?.process(question, context) || await super.process(question, context);
    }
    
    // Fallback to mock data if no database results
    return await this.generateMockRegulatoryResponse(question, context);
  }

  /**
   * Check if question is about clinical trials
   */
  private isClinicalTrialQuestion(question: string): boolean {
    const clinicalTrialTerms = [
      'clinical trial', 'clinical study', 'gcp', 'good clinical practice',
      'protocol', 'patient recruitment', 'informed consent', 'irb', 'iec',
      'adverse event', 'serious adverse event', 'data monitoring committee'
    ];
    
    return clinicalTrialTerms.some(term => question.includes(term));
  }

  /**
   * Check if question is about AI/ML
   */
  private isAIMLQuestion(question: string): boolean {
    const aiMlTerms = [
      'ai', 'artificial intelligence', 'machine learning', 'ml', 'algorithm',
      'samd', 'software as medical device', 'gmlp', 'ai/ml action plan',
      'clinical decision support', 'predictive analytics'
    ];
    
    return aiMlTerms.some(term => question.includes(term));
  }

  /**
   * Check if question is about data privacy
   */
  private isDataPrivacyQuestion(question: string): boolean {
    const privacyTerms = [
      'gdpr', 'data protection', 'privacy', 'personal data', 'consent',
      'data subject rights', 'data minimization', 'purpose limitation',
      'data retention', 'cross-border transfer'
    ];
    
    return privacyTerms.some(term => question.includes(term));
  }

  /**
   * Generate regulatory-specific response
   */
  protected async generateGeneralResponse(question: string, context?: AgentContext): Promise<AgentResponse> {
    const questionLower = question.toLowerCase();
    
    // Provide more specific guidance based on question content
    if (questionLower.includes('requirement') || questionLower.includes('need')) {
      return {
        answer: `For regulatory requirements, I can help you with specific guidance from FDA, EMA, ICH, and other regulatory bodies. Please specify which regulatory authority or area you're interested in.`,
        category: 'regulatory',
        subcategory: 'requirements',
        sources: [
          {
            type: 'regulation',
            title: 'Regulatory Requirements Database',
            content: 'Comprehensive database of regulatory requirements',
            url: '/regulatory/requirements'
          }
        ],
        actionItems: [
          'Specify the regulatory authority (FDA, EMA, ICH)',
          'Clarify the specific area of interest',
          'Provide context about your product or process'
        ],
        impactLevel: 'medium',
        relatedQuestions: this.getDefaultRelatedQuestions(),
        confidence: 0.6,
        agentUsed: this.agentName,
        subAgentUsed: undefined
      };
    }
    
    if (questionLower.includes('compliance') || questionLower.includes('compliant')) {
      return {
        answer: `Regulatory compliance involves adhering to guidelines from multiple authorities. I can help you understand specific compliance requirements for FDA, EMA, ICH, and other regulatory bodies.`,
        category: 'regulatory',
        subcategory: 'compliance',
        sources: [
          {
            type: 'guidance',
            title: 'Compliance Framework',
            content: 'Comprehensive compliance guidance',
            url: '/regulatory/compliance'
          }
        ],
        actionItems: [
          'Identify applicable regulatory authorities',
          'Review specific compliance requirements',
          'Develop compliance implementation plan',
          'Establish monitoring and reporting processes'
        ],
        impactLevel: 'high',
        relatedQuestions: this.getDefaultRelatedQuestions(),
        confidence: 0.7,
        agentUsed: this.agentName,
        subAgentUsed: undefined
      };
    }
    
    return await super.generateGeneralResponse(question, context);
  }

  /**
   * Search regulatory intelligence database
   */
  private async searchRegulatoryIntelligence(question: string): Promise<any[]> {
    try {
      const searchTerms = this.extractSearchTerms(question);
      
      const results = await prisma.regulatoryIntelligence.findMany({
        where: {
          OR: [
            {
              title: {
                contains: searchTerms.join(' '),
                mode: 'insensitive'
              }
            },
            {
              content: {
                contains: searchTerms.join(' '),
                mode: 'insensitive'
              }
            },
            {
              source: {
                in: searchTerms.filter(term => ['FDA', 'EMA', 'ICH', 'WHO'].includes(term.toUpperCase()))
              }
            }
          ],
          status: 'active'
        },
        orderBy: {
          lastUpdated: 'desc'
        },
        take: 5
      });
      
      return results;
    } catch (error) {
      console.error('Error searching regulatory intelligence:', error);
      return [];
    }
  }

  /**
   * Extract search terms from question
   */
  private extractSearchTerms(question: string): string[] {
    const terms = [];
    const questionLower = question.toLowerCase();
    
    // Regulatory bodies
    if (questionLower.includes('fda')) terms.push('FDA');
    if (questionLower.includes('ema')) terms.push('EMA');
    if (questionLower.includes('ich')) terms.push('ICH');
    if (questionLower.includes('who')) terms.push('WHO');
    
    // Key regulatory topics
    const topicTerms = ['ai', 'artificial intelligence', 'machine learning', 'clinical trial', 'gdpr', 'data protection', 'samd', 'gmlp', 'compliance', 'validation', 'risk management'];
    topicTerms.forEach(term => {
      if (questionLower.includes(term)) {
        terms.push(term);
      }
    });
    
    return terms.length > 0 ? terms : [question.split(' ').slice(0, 3).join(' ')];
  }

  /**
   * Generate response from regulatory intelligence data
   */
  private async generateRegulatoryResponse(question: string, data: any[], context?: AgentContext): Promise<AgentResponse> {
    const primaryResult = data[0];
    
    return {
      answer: `Based on ${primaryResult.source} regulatory intelligence: ${primaryResult.content.substring(0, 300)}...`,
      category: 'regulatory',
      subcategory: this.categorizeRegulatoryContent(primaryResult),
      sources: data.map(item => ({
        type: 'regulation' as const,
        title: item.title,
        content: item.content.substring(0, 200) + '...',
        url: this.generateSourceUrl(item.source)
      })),
      actionItems: this.generateActionItems(primaryResult),
      impactLevel: this.mapImpactLevel(primaryResult.impactLevel),
      relatedQuestions: this.getDefaultRelatedQuestions(),
      confidence: 0.9,
      agentUsed: this.agentName,
      subAgentUsed: undefined
    };
  }

  /**
   * Generate mock regulatory response when no database data available
   */
  private async generateMockRegulatoryResponse(question: string, context?: AgentContext): Promise<AgentResponse> {
    const mockData = this.getMockRegulatoryData(question);
    
    return {
      answer: mockData.answer,
      category: 'regulatory',
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
   * Get mock regulatory data based on question
   */
  private getMockRegulatoryData(question: string): any {
    const questionLower = question.toLowerCase();
    
    if (this.isAIMLQuestion(questionLower)) {
      return {
        answer: "For AI/ML regulatory compliance, key requirements include: FDA's Software as a Medical Device (SaMD) guidance, Good Machine Learning Practice (GMLP) principles, and EU AI Act compliance. These regulations require comprehensive validation, risk management, and post-market surveillance.",
        subcategory: 'AI/ML Compliance',
        sources: [
          {
            type: 'regulation',
            title: 'FDA AI/ML Software as Medical Device Guidance',
            content: 'Comprehensive guidance for AI/ML medical device development and validation',
            url: 'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device'
          },
          {
            type: 'regulation',
            title: 'EU AI Act Requirements',
            content: 'Risk-based approach to AI system regulation in the European Union',
            url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52021PC0206'
          }
        ],
        actionItems: [
          'Conduct AI system risk assessment',
          'Implement validation protocols',
          'Establish post-market monitoring',
          'Document compliance evidence'
        ],
        impactLevel: 'high'
      };
    }
    
    if (this.isClinicalTrialQuestion(questionLower)) {
      return {
        answer: "Clinical trial regulations require adherence to Good Clinical Practice (GCP) guidelines, including ICH E6(R3) for AI integration. Key requirements include protocol development, informed consent, data integrity, and safety reporting.",
        subcategory: 'Clinical Trials',
        sources: [
          {
            type: 'guidance',
            title: 'ICH E6(R3) Good Clinical Practice',
            content: 'Updated GCP guidelines addressing AI integration in clinical trials',
            url: 'https://www.ich.org/page/e6-good-clinical-practice'
          }
        ],
        actionItems: [
          'Develop compliant clinical protocols',
          'Implement data integrity measures',
          'Establish safety monitoring',
          'Train clinical staff on GCP requirements'
        ],
        impactLevel: 'critical'
      };
    }
    
    // Default regulatory response
    return {
      answer: "Regulatory compliance requires understanding applicable guidelines from FDA, EMA, ICH, and other authorities. Key areas include risk management, quality assurance, validation, and post-market surveillance. I can provide specific guidance based on your regulatory authority and product type.",
      subcategory: 'General Compliance',
      sources: [
        {
          type: 'guidance',
          title: 'Regulatory Compliance Framework',
          content: 'Comprehensive regulatory compliance guidance',
          url: '/regulatory/compliance'
        }
      ],
      actionItems: [
        'Identify applicable regulatory authorities',
        'Conduct regulatory gap analysis',
        'Develop compliance implementation plan',
        'Establish monitoring processes'
      ],
      impactLevel: 'medium'
    };
  }

  /**
   * Categorize regulatory content
   */
  private categorizeRegulatoryContent(data: any): string {
    const content = (data.title + ' ' + data.content).toLowerCase();
    
    if (content.includes('ai') || content.includes('machine learning')) return 'AI/ML';
    if (content.includes('clinical trial') || content.includes('gcp')) return 'Clinical Trials';
    if (content.includes('privacy') || content.includes('gdpr')) return 'Data Privacy';
    if (content.includes('quality') || content.includes('validation')) return 'Quality Assurance';
    
    return 'General';
  }

  /**
   * Generate action items based on regulatory data
   */
  private generateActionItems(data: any): string[] {
    const items = [];
    const impactLevel = data.impactLevel.toLowerCase();
    
    if (impactLevel === 'critical') {
      items.push('Implement immediate compliance measures');
      items.push('Conduct urgent risk assessment');
    } else if (impactLevel === 'high') {
      items.push('Review compliance requirements within 30 days');
      items.push('Update existing procedures');
    } else {
      items.push('Schedule compliance review');
      items.push('Monitor regulatory updates');
    }
    
    items.push('Document compliance evidence');
    items.push('Train relevant staff on requirements');
    
    return items;
  }

  /**
   * Map impact level from database to response format
   */
  private mapImpactLevel(level: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (level.toLowerCase()) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'medium';
    }
  }

  /**
   * Generate source URL based on regulatory authority
   */
  protected generateSourceUrl(source: string): string {
    const urls: Record<string, string> = {
      'FDA': 'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device',
      'EMA': 'https://www.ema.europa.eu/en/documents/report/reflection-paper-artificial-intelligence-use-medicinal-products-human-medicine_en.pdf',
      'ICH': 'https://www.ich.org/page/quality-guidelines',
      'WHO': 'https://www.who.int/publications/i/item/9789240029200'
    };
    
    return urls[source] || 'https://www.fda.gov/';
  }

  /**
   * Search training data for regulatory questions
   */
  private async searchTrainingData(question: string): Promise<any> {
    try {
      const searchTerms = this.extractSearchTerms(question);
      
      const results = await prisma.askRexiTrainingData.findMany({
        where: {
          AND: [
            { category: 'regulatory' },
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
        take: 3
      });
      
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Error searching training data:', error);
      return null;
    }
  }

  /**
   * Generate response from training data
   */
  private async generateTrainingDataResponse(question: string, trainingData: any, context?: AgentContext): Promise<AgentResponse> {
    return {
      answer: trainingData.answer,
      category: 'regulatory',
      subcategory: trainingData.subcategory || 'General',
      sources: trainingData.sources.map((source: string) => ({
        type: 'regulation' as const,
        title: `${source} Regulatory Guidance`,
        content: trainingData.answer.substring(0, 200) + '...',
        url: this.generateSourceUrl(source)
      })),
      actionItems: trainingData.actionItems || [
        'Review regulatory requirements',
        'Implement compliance measures',
        'Document evidence',
        'Monitor compliance'
      ],
      impactLevel: this.mapImpactLevel(trainingData.impactLevel),
      relatedQuestions: this.getDefaultRelatedQuestions(),
      confidence: 0.95,
      agentUsed: this.agentName,
      subAgentUsed: undefined
    };
  }
}
