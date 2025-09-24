/**
 * AskRexi Multi-Agent System
 * Intelligent routing and coordination of specialized domain agents
 */

import { RegulatoryAgent } from './RegulatoryAgent';
import { AssessmentAgent } from './AssessmentAgent';
import { AnalyticsAgent } from './AnalyticsAgent';
import { ComplianceAgent } from './ComplianceAgent';

export interface AgentContext {
  userId?: string;
  companyId?: string;
  therapeuticArea?: string;
  persona?: string;
  assessmentId?: string;
  conversationHistory?: ConversationMessage[];
  userPreferences?: {
    responseStyle?: 'detailed' | 'concise' | 'conversational';
    expertiseLevel?: 'beginner' | 'intermediate' | 'expert';
    focusAreas?: string[];
  };
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: any;
}

export interface AgentResponse {
  answer: string;
  category: 'regulatory' | 'assessment' | 'analytics' | 'compliance' | 'general';
  subcategory: string;
  sources: {
    type: 'regulation' | 'guidance' | 'analytics' | 'assessment' | 'compliance';
    title: string;
    content: string;
    url?: string;
  }[];
  actionItems: string[];
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  relatedQuestions: string[];
  confidence: number;
  agentUsed: string;
  subAgentUsed?: string;
}

export interface AgentCapability {
  domain: string;
  subdomains: string[];
  keywords: string[];
  expertise: string[];
}

export class AgentManager {
  private static instance: AgentManager;
  private agents: Map<string, any> = new Map();
  private routingRules: Map<string, string[]> = new Map();

  static getInstance(): AgentManager {
    if (!AgentManager.instance) {
      AgentManager.instance = new AgentManager();
    }
    return AgentManager.instance;
  }

  constructor() {
    this.initializeAgents();
    this.initializeRoutingRules();
  }

  private initializeAgents(): void {
    // Initialize domain agents
    this.agents.set('regulatory', new RegulatoryAgent());
    this.agents.set('assessment', new AssessmentAgent());
    this.agents.set('analytics', new AnalyticsAgent());
    this.agents.set('compliance', new ComplianceAgent());
  }

  private initializeRoutingRules(): void {
    // Regulatory Intelligence routing
    this.routingRules.set('regulatory', [
      'fda', 'ema', 'ich', 'regulation', 'guideline', 'compliance', 'regulatory',
      'approval', 'submission', 'clinical trial', 'safety', 'efficacy', 'gcp',
      'gmp', 'glp', 'qms', 'risk management', 'pharmacovigilance', 'samd',
      'ai/ml action plan', 'gmlp', 'eu ai act', 'gdpr', '21 cfr part 11'
    ]);

    // Assessment Support routing
    this.routingRules.set('assessment', [
      'assessment', 'question', 'section', 'requirement', 'evidence', 'documentation',
      'validation', 'verification', 'testing', 'protocol', 'sop', 'checklist',
      'audit', 'inspection', 'governance', 'data governance', 'model validation',
      'quality assurance', 'risk assessment', 'production blocker'
    ]);

    // Analytics & Reporting routing
    this.routingRules.set('analytics', [
      'analytics', 'report', 'performance', 'score', 'trend', 'metric', 'dashboard',
      'insight', 'recommendation', 'benchmark', 'comparison', 'statistics', 'data',
      'kpi', 'roi', 'compliance score', 'industry benchmark', 'performance trend',
      'gap analysis', 'remediation plan'
    ]);

    // General Compliance routing
    this.routingRules.set('compliance', [
      'compliance', 'best practice', 'implementation', 'training', 'competency',
      'governance', 'policy', 'procedure', 'standard', 'framework', 'guidance',
      'help', 'support', 'getting started', 'how to', 'what is', 'explain'
    ]);
  }

  /**
   * Route question to appropriate agent and get response
   */
  async processQuestion(question: string, context?: AgentContext): Promise<AgentResponse> {
    const startTime = Date.now();
    
    try {
      // Determine the best agent for this question
      const targetAgent = this.routeToAgent(question, context);
      
      // Get response from the selected agent
      const response = await targetAgent.process(question, context);
      
      // Add metadata
      response.agentUsed = targetAgent.getName();
      response.confidence = this.calculateConfidence(response, question);
      
      // Log usage analytics
      await this.logAgentUsage(question, targetAgent.getName(), Date.now() - startTime, context);
      
      return response;
    } catch (error) {
      console.error('Error processing question with agents:', error);
      
      // Fallback to general compliance agent
      const fallbackAgent = this.agents.get('compliance');
      const fallbackResponse = await fallbackAgent.process(question, context);
      fallbackResponse.agentUsed = 'compliance-fallback';
      fallbackResponse.confidence = 0.5;
      
      return fallbackResponse;
    }
  }

  /**
   * Route question to the most appropriate agent with improved logic
   */
  private routeToAgent(question: string, context?: AgentContext): any {
    const questionLower = question.toLowerCase();
    
    // Priority-based routing for specific regulatory bodies
    if (questionLower.includes('fda') || questionLower.includes('food and drug administration')) {
      console.log('Routing to regulatory agent: FDA detected');
      return this.agents.get('regulatory');
    }
    
    if (questionLower.includes('ema') || questionLower.includes('european medicines agency')) {
      console.log('Routing to regulatory agent: EMA detected');
      return this.agents.get('regulatory');
    }
    
    if (questionLower.includes('ich') || questionLower.includes('international council for harmonisation')) {
      console.log('Routing to regulatory agent: ICH detected');
      return this.agents.get('regulatory');
    }
    
    // Regulatory-specific terms
    if (questionLower.includes('regulation') || questionLower.includes('guideline') || 
        questionLower.includes('regulatory') || questionLower.includes('samd') ||
        questionLower.includes('gmlp') || questionLower.includes('21 cfr') ||
        questionLower.includes('eu ai act') || questionLower.includes('clinical trial')) {
      console.log('Routing to regulatory agent: regulatory terms detected');
      return this.agents.get('regulatory');
    }
    
    // Assessment-specific terms
    if (questionLower.includes('assessment') || questionLower.includes('evidence') ||
        questionLower.includes('documentation') || questionLower.includes('validation') ||
        questionLower.includes('section') || questionLower.includes('question')) {
      console.log('Routing to assessment agent: assessment terms detected');
      return this.agents.get('assessment');
    }
    
    // Analytics-specific terms
    if (questionLower.includes('analytics') || questionLower.includes('performance') ||
        questionLower.includes('score') || questionLower.includes('trend') ||
        questionLower.includes('benchmark') || questionLower.includes('gap analysis')) {
      console.log('Routing to analytics agent: analytics terms detected');
      return this.agents.get('analytics');
    }
    
    // Default to compliance for general questions
    console.log('Routing to compliance agent: default routing');
    return this.agents.get('compliance');
  }

  /**
   * Calculate agent score based on keyword matches (deprecated - using priority routing)
   */
  private calculateAgentScore(question: string, keywords: string[], context?: AgentContext): number {
    let score = 0;
    
    // Count keyword matches with weighted scoring
    for (const keyword of keywords) {
      if (question.includes(keyword)) {
        // Give higher weight to more specific terms
        if (['fda', 'ema', 'ich', 'samd', 'gmlp'].includes(keyword)) {
          score += 3; // High priority regulatory terms
        } else if (['assessment', 'evidence', 'validation'].includes(keyword)) {
          score += 2; // Medium priority assessment terms
        } else {
          score += 1; // Standard terms
        }
      }
    }

    // Normalize score
    return keywords.length > 0 ? score / keywords.length : 0;
  }

  /**
   * Route by context when keyword matching is inconclusive
   */
  private routeByContext(context: AgentContext): string {
    // If user is in an assessment, prioritize assessment agent
    if (context.assessmentId) {
      return 'assessment';
    }

    // If user is viewing analytics, prioritize analytics agent
    if (context.conversationHistory?.some(msg => 
      msg.content.toLowerCase().includes('analytics') || 
      msg.content.toLowerCase().includes('dashboard')
    )) {
      return 'analytics';
    }

    // If user is asking about regulations, prioritize regulatory agent
    if (context.conversationHistory?.some(msg => 
      msg.content.toLowerCase().includes('regulation') || 
      msg.content.toLowerCase().includes('fda') ||
      msg.content.toLowerCase().includes('ema') ||
      msg.content.toLowerCase().includes('ich')
    )) {
      return 'regulatory';
    }

    return 'compliance';
  }

  /**
   * Calculate confidence score for the response
   */
  private calculateConfidence(response: AgentResponse, question: string): number {
    let confidence = 0.5; // Base confidence

    // Boost confidence for exact matches
    if (response.category !== 'general') {
      confidence += 0.2;
    }

    // Boost confidence for high impact responses
    if (response.impactLevel === 'critical' || response.impactLevel === 'high') {
      confidence += 0.1;
    }

    // Boost confidence for responses with sources
    if (response.sources.length > 0) {
      confidence += 0.1;
    }

    // Boost confidence for responses with action items
    if (response.actionItems.length > 0) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Log agent usage for analytics
   */
  private async logAgentUsage(question: string, agentName: string, responseTime: number, context?: AgentContext): Promise<void> {
    // In a real implementation, this would store analytics data
    console.log(`Agent Analytics: ${agentName} processed question (${responseTime}ms): ${question.substring(0, 50)}...`);
  }

  /**
   * Get agent capabilities for debugging
   */
  getAgentCapabilities(): Map<string, AgentCapability> {
    const capabilities = new Map<string, AgentCapability>();
    
    for (const [agentName, agent] of this.agents) {
      capabilities.set(agentName, agent.getCapabilities());
    }
    
    return capabilities;
  }

  /**
   * Get available agents
   */
  getAvailableAgents(): string[] {
    return Array.from(this.agents.keys());
  }
}

// Export singleton instance
export const agentManager = AgentManager.getInstance();
