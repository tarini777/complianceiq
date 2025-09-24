/**
 * EMA Sub-Agent
 * Specialized knowledge for EMA regulations and guidelines
 */

import { BaseAgent } from '../BaseAgent';
import { AgentCapability, AgentContext, AgentResponse } from '../AgentManager';

export class EMAAgent extends BaseAgent {
  constructor() {
    super('ema');
  }

  protected initializeCapabilities(): AgentCapability {
    return {
      domain: 'ema',
      subdomains: ['AI Reflection Paper', 'GDPR Compliance', 'EU AI Act', 'Clinical Trials', 'Drug Development'],
      keywords: [
        'ema', 'european medicines agency', 'eu', 'european union', 'reflection paper', 'ai reflection paper',
        'gdpr', 'general data protection regulation', 'data protection', 'privacy', 'personal data',
        'eu ai act', 'artificial intelligence act', 'ai act', 'algorithmic accountability',
        'data governance', 'transparency', 'explainability', 'human oversight', 'risk-based approach',
        'clinical trial', 'clinical study', 'gcp', 'good clinical practice', 'pharmacovigilance',
        'drug development', 'medicinal product', 'marketing authorization', 'centralized procedure',
        'decentralized procedure', 'mutual recognition', 'national procedure'
      ],
      expertise: [
        'EMA AI Reflection Paper',
        'GDPR Compliance for AI',
        'EU AI Act Requirements',
        'European Clinical Trial Regulations',
        'Data Protection and Privacy',
        'Algorithmic Accountability',
        'Risk-Based AI Regulation'
      ]
    };
  }

  protected initializeSubAgents(): void {
    // EMA agent doesn't have sub-agents, it's already specialized
  }

  protected getDefaultRelatedQuestions(): string[] {
    return [
      'What are the EMA requirements for AI in pharmaceutical development?',
      'How does GDPR affect AI systems in pharmaceutical companies?',
      'What is the EU AI Act and how does it impact pharma?',
      'What are the EMA guidelines for AI in clinical trials?',
      'How do I ensure GDPR compliance for AI data processing?',
      'What are the EMA requirements for algorithmic accountability?',
      'How does the EU AI Act classify AI systems?',
      'What are the EMA data governance requirements?'
    ];
  }

  /**
   * Enhanced processing for EMA-specific questions
   */
  async process(question: string, context?: AgentContext): Promise<AgentResponse> {
    const questionLower = question.toLowerCase();
    
    // Handle specific EMA topics
    if (questionLower.includes('reflection paper') || questionLower.includes('ai reflection paper')) {
      return this.handleReflectionPaper(question, context);
    }
    
    if (questionLower.includes('gdpr') || questionLower.includes('data protection')) {
      return this.handleGDPR(question, context);
    }
    
    if (questionLower.includes('eu ai act') || questionLower.includes('ai act')) {
      return this.handleEUAIAct(question, context);
    }
    
    if (questionLower.includes('algorithmic accountability')) {
      return this.handleAlgorithmicAccountability(question, context);
    }
    
    // Default to base processing
    return await super.process(question, context);
  }

  /**
   * Handle EMA AI Reflection Paper questions
   */
  private handleReflectionPaper(question: string, context?: AgentContext): AgentResponse {
    return {
      answer: `The EMA Reflection Paper on AI in Medicinal Product Development provides comprehensive guidance for AI use in pharmaceutical development:

**Key EMA AI Requirements:**
• **Algorithmic Accountability** - Clear responsibility for AI system outcomes
• **Data Governance** - Robust data management and protection protocols
• **Transparency and Explainability** - Ability to explain AI decision-making processes
• **Risk-Based Approach** - Risk assessment based on AI system impact and complexity
• **Human Oversight** - Human-in-the-loop requirements for critical decisions

**Pharmaceutical AI Applications:**
• Drug discovery and development AI tools
• Clinical trial optimization and patient selection
• Pharmacovigilance and safety monitoring
• Manufacturing process optimization
• Real-world evidence generation

**Core Principles:**
• AI systems must be scientifically sound and clinically relevant
• Data quality and integrity are paramount
• AI systems must be validated and monitored
• Regulatory compliance must be maintained throughout the AI lifecycle
• Patient safety and data protection are top priorities`,
      category: 'regulatory',
      subcategory: 'EMA AI Reflection Paper',
      sources: [
        {
          type: 'guidance',
          title: 'EMA Reflection Paper on AI in Medicinal Product Development',
          content: 'EMA guidance on AI use in pharmaceutical development',
          url: 'https://www.ema.europa.eu/en/documents/report/reflection-paper-artificial-intelligence-use-medicinal-products-human-medicine_en.pdf'
        }
      ],
      actionItems: [
        'Review EMA Reflection Paper on AI in Medicinal Product Development',
        'Implement algorithmic accountability frameworks',
        'Establish data governance protocols',
        'Develop AI transparency and explainability measures',
        'Conduct risk assessments for AI applications'
      ],
      impactLevel: 'high',
      relatedQuestions: this.getDefaultRelatedQuestions(),
      confidence: 0.95,
      agentUsed: 'ema',
      subAgentUsed: undefined
    };
  }

  /**
   * Handle GDPR questions
   */
  private handleGDPR(question: string, context?: AgentContext): AgentResponse {
    return {
      answer: `GDPR significantly impacts AI systems in pharmaceutical companies:

**Key GDPR Requirements for AI:**
• **Data Protection by Design** - Privacy considerations in AI system development
• **Lawful Basis for Processing** - Clear legal grounds for AI data processing
• **Data Subject Rights** - Right to explanation for AI decisions
• **Data Minimization** - Collecting only necessary data for AI training
• **Cross-Border Data Transfers** - Adequate protection for international AI data sharing

**AI-Specific GDPR Considerations:**
• AI systems must be transparent and explainable
• Data subjects have the right to understand AI decision-making
• AI training data must be lawfully obtained and processed
• Data retention policies must be defined for AI systems
• Privacy impact assessments are required for AI systems

**Compliance Requirements:**
• Implement Privacy by Design in AI systems
• Establish lawful basis for AI data processing
• Develop AI explainability frameworks
• Conduct data protection impact assessments
• Implement data subject rights procedures`,
      category: 'regulatory',
      subcategory: 'GDPR Compliance',
      sources: [
        {
          type: 'regulation',
          title: 'General Data Protection Regulation (GDPR)',
          content: 'EU data protection regulation',
          url: 'https://gdpr.eu/'
        },
        {
          type: 'guidance',
          title: 'GDPR and AI Guidelines',
          content: 'Guidance on GDPR compliance for AI systems',
          url: 'https://edpb.europa.eu/our-work-tools/general-guidance/artificial-intelligence-and-data-protection_en'
        }
      ],
      actionItems: [
        'Implement Privacy by Design in AI systems',
        'Establish lawful basis for AI data processing',
        'Develop AI explainability frameworks',
        'Conduct data protection impact assessments',
        'Implement data subject rights procedures'
      ],
      impactLevel: 'high',
      relatedQuestions: this.getDefaultRelatedQuestions(),
      confidence: 0.9,
      agentUsed: 'ema',
      subAgentUsed: undefined
    };
  }

  /**
   * Handle EU AI Act questions
   */
  private handleEUAIAct(question: string, context?: AgentContext): AgentResponse {
    return {
      answer: `The EU AI Act establishes comprehensive regulation for AI systems in the European Union:

**AI Act Classification:**
• **Minimal Risk** - AI systems with minimal risk (e.g., spam filters)
• **Limited Risk** - AI systems with limited risk (e.g., chatbots)
• **High Risk** - AI systems with high risk (e.g., medical devices, critical infrastructure)
• **Prohibited** - AI systems that are prohibited (e.g., social scoring, subliminal manipulation)

**High-Risk AI Requirements:**
• **Risk Management System** - Comprehensive risk assessment and mitigation
• **Data Governance** - High-quality training data and data management
• **Technical Documentation** - Detailed technical documentation
• **Record Keeping** - Comprehensive record keeping requirements
• **Transparency and Information** - Clear information to users
• **Human Oversight** - Human oversight and monitoring
• **Accuracy, Robustness, and Cybersecurity** - System accuracy and security

**Pharmaceutical AI Implications:**
• Medical AI systems are classified as high-risk
• Comprehensive compliance requirements apply
• Regulatory oversight and monitoring required
• Significant penalties for non-compliance`,
      category: 'regulatory',
      subcategory: 'EU AI Act',
      sources: [
        {
          type: 'regulation',
          title: 'EU AI Act',
          content: 'European Union Artificial Intelligence Act',
          url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai'
        }
      ],
      actionItems: [
        'Assess AI system risk classification under EU AI Act',
        'Implement risk management systems for high-risk AI',
        'Develop comprehensive technical documentation',
        'Establish human oversight and monitoring procedures',
        'Ensure compliance with EU AI Act requirements'
      ],
      impactLevel: 'high',
      relatedQuestions: this.getDefaultRelatedQuestions(),
      confidence: 0.9,
      agentUsed: 'ema',
      subAgentUsed: undefined
    };
  }

  /**
   * Handle Algorithmic Accountability questions
   */
  private handleAlgorithmicAccountability(question: string, context?: AgentContext): AgentResponse {
    return {
      answer: `Algorithmic Accountability is a key requirement for AI systems in pharmaceutical applications:

**Key Principles:**
• **Clear Responsibility** - Defined roles and responsibilities for AI system outcomes
• **Transparency** - Openness about AI system design, operation, and limitations
• **Explainability** - Ability to explain AI decision-making processes
• **Auditability** - Systems must be auditable and monitorable
• **Human Oversight** - Human control and intervention capabilities

**Implementation Requirements:**
• Establish clear governance structures for AI systems
• Define roles and responsibilities for AI outcomes
• Implement transparency and explainability measures
• Develop audit and monitoring procedures
• Ensure human oversight and control mechanisms

**Pharmaceutical Applications:**
• AI systems used in drug discovery must be accountable
• Clinical decision support systems require clear responsibility
• AI-powered manufacturing systems need oversight
• Pharmacovigilance AI must be transparent and auditable`,
      category: 'regulatory',
      subcategory: 'Algorithmic Accountability',
      sources: [
        {
          type: 'guidance',
          title: 'Algorithmic Accountability Framework',
          content: 'Framework for ensuring AI system accountability',
          url: 'https://www.ema.europa.eu/en/documents/report/reflection-paper-artificial-intelligence-use-medicinal-products-human-medicine_en.pdf'
        }
      ],
      actionItems: [
        'Establish AI governance structures',
        'Define clear roles and responsibilities',
        'Implement transparency and explainability measures',
        'Develop audit and monitoring procedures',
        'Ensure human oversight and control'
      ],
      impactLevel: 'high',
      relatedQuestions: this.getDefaultRelatedQuestions(),
      confidence: 0.9,
      agentUsed: 'ema',
      subAgentUsed: undefined
    };
  }
}
