/**
 * Base Agent Class for AskRexi Multi-Agent System
 * Provides common functionality for all domain agents
 */

import { AgentContext, AgentResponse, AgentCapability, ConversationMessage } from './AgentManager';
import { prisma } from '@/lib/prisma';

export abstract class BaseAgent {
  protected agentName: string;
  protected subAgents: Map<string, any> = new Map();
  protected capabilities: AgentCapability;

  constructor(agentName: string) {
    this.agentName = agentName;
    this.capabilities = this.initializeCapabilities();
    this.initializeSubAgents();
  }

  /**
   * Initialize agent capabilities - to be implemented by subclasses
   */
  protected abstract initializeCapabilities(): AgentCapability;

  /**
   * Initialize sub-agents - to be implemented by subclasses
   */
  protected abstract initializeSubAgents(): void;

  /**
   * Process a question and return response
   */
  async process(question: string, context?: AgentContext): Promise<AgentResponse> {
    try {
      // First, try to find exact match in training data
      const trainingMatch = await this.findTrainingDataMatch(question, context);
      if (trainingMatch) {
        return this.enhanceResponse(trainingMatch, question, context);
      }

      // If no training match, use sub-agents for specialized knowledge
      const subAgentResponse = await this.routeToSubAgent(question, context);
      if (subAgentResponse) {
        return this.enhanceResponse(subAgentResponse, question, context);
      }

      // Fallback to general domain knowledge
      return await this.generateGeneralResponse(question, context);
    } catch (error) {
      console.error(`Error in ${this.agentName} agent:`, error);
      return this.createErrorResponse(question);
    }
  }

  /**
   * Find training data match for this agent's domain
   */
  protected async findTrainingDataMatch(question: string, context?: AgentContext): Promise<AgentResponse | null> {
    try {
      const normalizedQuestion = question.toLowerCase().trim();
      const questionKeywords = this.extractKeywords(normalizedQuestion);
      
      const trainingData = await prisma.askRexiTrainingData.findMany({
        where: {
          AND: [
            { category: this.agentName },
            {
              OR: [
                { question: { contains: normalizedQuestion, mode: 'insensitive' } },
                { variations: { hasSome: [normalizedQuestion] } },
                { keywords: { hasSome: questionKeywords } }
              ]
            }
          ]
        },
        take: 5
      });

      if (trainingData.length === 0) {
        return null;
      }

      // Find best match using scoring
      const bestMatch = this.findBestMatch(trainingData, normalizedQuestion, questionKeywords);
      
      return this.convertTrainingDataToResponse(bestMatch);
    } catch (error) {
      console.error(`Error finding training data match in ${this.agentName}:`, error);
      return null;
    }
  }

  /**
   * Route question to appropriate sub-agent
   */
  protected async routeToSubAgent(question: string, context?: AgentContext): Promise<AgentResponse | null> {
    const targetSubAgent = this.selectSubAgent(question, context);
    
    if (targetSubAgent) {
      return await targetSubAgent.process(question, context);
    }
    
    return null;
  }

  /**
   * Select the most appropriate sub-agent for the question
   */
  protected selectSubAgent(question: string, context?: AgentContext): any {
    const questionLower = question.toLowerCase();
    let bestSubAgent = null;
    let bestScore = 0;

    for (const [subAgentName, subAgent] of this.subAgents) {
      const score = this.calculateSubAgentScore(questionLower, subAgent.getKeywords());
      if (score > bestScore) {
        bestScore = score;
        bestSubAgent = subAgent;
      }
    }

    return bestSubAgent;
  }

  /**
   * Calculate score for sub-agent selection
   */
  protected calculateSubAgentScore(question: string, keywords: string[]): number {
    let score = 0;
    
    for (const keyword of keywords) {
      if (question.includes(keyword)) {
        score += 1;
      }
    }
    
    return score / keywords.length;
  }

  /**
   * Find best match from training data
   */
  protected findBestMatch(trainingData: any[], question: string, keywords: string[]): any {
    const scoredMatches = trainingData.map(data => ({
      data,
      score: this.calculateMatchScore(data, question, keywords)
    })).sort((a, b) => b.score - a.score);

    return scoredMatches[0].data;
  }

  /**
   * Calculate match score for training data
   */
  protected calculateMatchScore(trainingData: any, question: string, keywords: string[]): number {
    let score = 0;
    
    // Exact question match
    if (trainingData.question.toLowerCase() === question) {
      score += 100;
    }
    
    // Partial question match
    if (trainingData.question.toLowerCase().includes(question) || question.includes(trainingData.question.toLowerCase())) {
      score += 70;
    }
    
    // Variation match
    if (trainingData.variations.some((variation: string) => 
      variation.toLowerCase() === question || variation.toLowerCase().includes(question)
    )) {
      score += 80;
    }
    
    // Keyword matches
    const keywordMatches = trainingData.keywords.filter((keyword: string) => 
      keywords.includes(keyword.toLowerCase())
    ).length;
    score += keywordMatches * 10;
    
    return score;
  }

  /**
   * Convert training data to agent response
   */
  protected convertTrainingDataToResponse(trainingData: any): AgentResponse {
    return {
      answer: trainingData.answer,
      category: trainingData.category as any,
      subcategory: trainingData.subcategory,
      sources: this.generateSources(trainingData.sources),
      actionItems: trainingData.actionItems || [],
      impactLevel: trainingData.impactLevel as any,
      relatedQuestions: this.generateRelatedQuestions(trainingData.category, trainingData.question),
      confidence: 0.9, // High confidence for training data matches
      agentUsed: this.agentName,
      subAgentUsed: undefined
    };
  }

  /**
   * Enhance response with context and personalization
   */
  protected enhanceResponse(response: AgentResponse, question: string, context?: AgentContext): AgentResponse {
    let enhancedAnswer = response.answer;
    
    // Add context-specific enhancements
    if (context?.userPreferences?.expertiseLevel === 'beginner') {
      enhancedAnswer = this.simplifyLanguage(enhancedAnswer);
    } else if (context?.userPreferences?.expertiseLevel === 'expert') {
      enhancedAnswer = this.addTechnicalDetails(enhancedAnswer);
    }
    
    // Add therapeutic area context
    if (context?.therapeuticArea) {
      enhancedAnswer = this.addTherapeuticContext(enhancedAnswer, context.therapeuticArea);
    }
    
    // Add company context
    if (context?.companyId) {
      enhancedAnswer = this.addCompanyContext(enhancedAnswer, context.companyId);
    }
    
    return {
      ...response,
      answer: enhancedAnswer
    };
  }

  /**
   * Generate general response when no specific match is found
   */
  protected async generateGeneralResponse(question: string, context?: AgentContext): Promise<AgentResponse> {
    return {
      answer: `I can help you with ${this.agentName} questions. Could you be more specific about what you need to know?`,
      category: this.agentName as any,
      subcategory: 'general',
      sources: [],
      actionItems: [
        `Ask specific questions about ${this.agentName}`,
        'Provide more context about your situation',
        'Try rephrasing your question'
      ],
      impactLevel: 'low',
      relatedQuestions: this.getDefaultRelatedQuestions(),
      confidence: 0.3,
      agentUsed: this.agentName,
      subAgentUsed: undefined
    };
  }

  /**
   * Create error response
   */
  protected createErrorResponse(question: string): AgentResponse {
    return {
      answer: `I encountered an error processing your ${this.agentName} question. Please try rephrasing or ask a different question.`,
      category: this.agentName as any,
      subcategory: 'error',
      sources: [],
      actionItems: [
        'Try rephrasing your question',
        'Check if your question is related to compliance',
        'Contact support if the issue persists'
      ],
      impactLevel: 'low',
      relatedQuestions: this.getDefaultRelatedQuestions(),
      confidence: 0.1,
      agentUsed: this.agentName,
      subAgentUsed: undefined
    };
  }

  /**
   * Extract keywords from question
   */
  protected extractKeywords(question: string): string[] {
    const allKeywords = [
      ...this.capabilities.keywords,
      ...Array.from(this.subAgents.values()).flatMap(subAgent => subAgent.getKeywords())
    ];
    
    return allKeywords.filter(keyword => question.includes(keyword.toLowerCase()));
  }

  /**
   * Generate sources from training data
   */
  protected generateSources(sources: string[]): AgentResponse['sources'] {
    return sources.map(source => ({
      type: this.getSourceType(source),
      title: source,
      content: `Information from ${source}`,
      url: this.generateSourceUrl(source)
    }));
  }

  /**
   * Get source type based on source name
   */
  protected getSourceType(source: string): 'regulation' | 'guidance' | 'analytics' | 'assessment' | 'compliance' {
    const sourceLower = source.toLowerCase();
    
    if (sourceLower.includes('fda') || sourceLower.includes('ema') || sourceLower.includes('ich')) {
      return 'regulation';
    }
    if (sourceLower.includes('guideline') || sourceLower.includes('guidance')) {
      return 'guidance';
    }
    if (sourceLower.includes('analytics') || sourceLower.includes('dashboard')) {
      return 'analytics';
    }
    if (sourceLower.includes('assessment') || sourceLower.includes('question')) {
      return 'assessment';
    }
    
    return 'compliance';
  }

  /**
   * Generate source URL
   */
  protected generateSourceUrl(source: string): string {
    const sourceLower = source.toLowerCase();
    
    if (sourceLower.includes('fda')) {
      return 'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device';
    }
    if (sourceLower.includes('ema')) {
      return 'https://www.ema.europa.eu/en/documents/report/reflection-paper-artificial-intelligence-use-medicinal-products-human-medicine_en.pdf';
    }
    if (sourceLower.includes('ich')) {
      return 'https://www.ich.org/page/e6-r3-gcp';
    }
    
    return `/${this.agentName}-guidance`;
  }

  /**
   * Generate related questions
   */
  protected generateRelatedQuestions(category: string, originalQuestion: string): string[] {
    return this.getDefaultRelatedQuestions();
  }

  /**
   * Get default related questions - to be implemented by subclasses
   */
  protected abstract getDefaultRelatedQuestions(): string[];

  /**
   * Simplify language for beginners
   */
  protected simplifyLanguage(text: string): string {
    const simplifications = {
      'regulatory compliance': 'following rules and regulations',
      'pharmaceutical': 'drug and medicine',
      'clinical validation': 'testing in real medical settings',
      'algorithmic transparency': 'being able to explain how the AI works',
      'data governance': 'managing and protecting data properly'
    };
    
    let simplified = text;
    Object.entries(simplifications).forEach(([complex, simple]) => {
      simplified = simplified.replace(new RegExp(complex, 'gi'), simple);
    });
    
    return simplified;
  }

  /**
   * Add technical details for experts
   */
  protected addTechnicalDetails(text: string): string {
    const technicalAdditions = {
      'FDA guidelines': 'FDA guidelines (21 CFR Part 11, ICH E6(R3))',
      'data quality': 'data quality (completeness, accuracy, consistency, validity)',
      'model validation': 'model validation (cross-validation, hold-out testing, bias assessment)'
    };
    
    let enhanced = text;
    Object.entries(technicalAdditions).forEach(([term, addition]) => {
      enhanced = enhanced.replace(new RegExp(term, 'gi'), addition);
    });
    
    return enhanced;
  }

  /**
   * Add therapeutic area context
   */
  protected addTherapeuticContext(text: string, therapeuticArea: string): string {
    return text.replace(/your organization/g, `${therapeuticArea} organizations`)
              .replace(/your therapeutic area/g, therapeuticArea);
  }

  /**
   * Add company context
   */
  protected addCompanyContext(text: string, companyId: string): string {
    return text.replace(/your organization/g, 'your organization')
              .replace(/your company/g, 'your company');
  }

  /**
   * Get agent name
   */
  getName(): string {
    return this.agentName;
  }

  /**
   * Get agent capabilities
   */
  getCapabilities(): AgentCapability {
    return this.capabilities;
  }

  /**
   * Get sub-agents
   */
  getSubAgents(): Map<string, any> {
    return this.subAgents;
  }
}
