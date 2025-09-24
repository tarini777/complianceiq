/**
 * ICH Sub-Agent
 * Specialized knowledge for ICH guidelines and harmonization
 */

import { BaseAgent } from '../BaseAgent';
import { AgentCapability, AgentContext, AgentResponse } from '../AgentManager';

export class ICHAgent extends BaseAgent {
  constructor() {
    super('ich');
  }

  protected initializeCapabilities(): AgentCapability {
    return {
      domain: 'ich',
      subdomains: ['GCP Guidelines', 'Clinical Study Design', 'Statistical Principles', 'Quality Guidelines', 'Safety Guidelines'],
      keywords: [
        'ich', 'international council for harmonisation', 'e6', 'e6(r3)', 'good clinical practice', 'gcp',
        'e8', 'e8(r1)', 'general considerations', 'clinical studies', 'e9', 'e9(r1)', 'statistical principles',
        'e10', 'choice of control group', 'e17', 'multi-regional clinical trials', 'mrct',
        'e3', 'clinical study report', 'csr', 'e2a', 'clinical safety data management',
        'e2b', 'clinical safety data management', 'e2c', 'periodic benefit-risk evaluation report',
        'e2d', 'post-approval safety data management', 'e2e', 'pharmacovigilance planning',
        'e4', 'dose-response information', 'e5', 'ethnic factors', 'e7', 'geriatric populations',
        'e11', 'clinical investigation of medicinal products', 'e12', 'clinical evaluation',
        'e13', 'bioequivalence', 'e14', 'clinical evaluation', 'e15', 'genomic biomarkers',
        'e16', 'genomic biomarkers', 'e18', 'genomic sampling', 'e19', 'safety data collection',
        'clinical trial', 'clinical study', 'protocol', 'informed consent', 'irb', 'iec',
        'adverse event', 'serious adverse event', 'sae', 'ae', 'data monitoring committee', 'dmc',
        'investigator brochure', 'ib', 'case report form', 'crf', 'source data verification', 'sdv',
        'monitoring', 'audit', 'inspection', 'regulatory authority', 'sponsor', 'investigator'
      ],
      expertise: [
        'ICH E6(R3) Good Clinical Practice',
        'ICH E8(R1) General Considerations for Clinical Studies',
        'ICH E9(R1) Statistical Principles for Clinical Trials',
        'ICH E17 Multi-Regional Clinical Trials',
        'Clinical Trial Design and Conduct',
        'Data Integrity and Quality',
        'Safety Data Management',
        'Regulatory Harmonization'
      ]
    };
  }

  protected initializeSubAgents(): void {
    // ICH agent doesn't have sub-agents, it's already specialized
  }

  protected getDefaultRelatedQuestions(): string[] {
    return [
      'What are the ICH requirements for clinical trials?',
      'What is ICH E6(R3) Good Clinical Practice?',
      'How do ICH guidelines affect clinical study design?',
      'What are the ICH statistical principles for clinical trials?',
      'How do ICH guidelines ensure data integrity?',
      'What are the ICH requirements for multi-regional clinical trials?',
      'How do ICH guidelines address AI in clinical trials?',
      'What are the key changes in ICH E6(R3)?'
    ];
  }

  /**
   * Enhanced processing for ICH-specific questions
   */
  async process(question: string, context?: AgentContext): Promise<AgentResponse> {
    const questionLower = question.toLowerCase();
    
    // Handle specific ICH topics
    if (questionLower.includes('e6') || questionLower.includes('good clinical practice') || questionLower.includes('gcp')) {
      return this.handleE6GCP(question, context);
    }
    
    if (questionLower.includes('e8') || questionLower.includes('general considerations')) {
      return this.handleE8(question, context);
    }
    
    if (questionLower.includes('e9') || questionLower.includes('statistical principles')) {
      return this.handleE9(question, context);
    }
    
    if (questionLower.includes('e17') || questionLower.includes('multi-regional') || questionLower.includes('mrct')) {
      return this.handleE17(question, context);
    }
    
    if (questionLower.includes('clinical trial') || questionLower.includes('clinical study')) {
      return this.handleClinicalTrials(question, context);
    }
    
    // Default to base processing
    return await super.process(question, context);
  }

  /**
   * Handle ICH E6(R3) Good Clinical Practice questions
   */
  private handleE6GCP(question: string, context?: AgentContext): AgentResponse {
    return {
      answer: `ICH E6(R3) Good Clinical Practice provides comprehensive guidelines for clinical trials:

**Key ICH E6(R3) Requirements:**
• **Data Integrity** - Ensuring AI-generated data meets GCP standards
• **Protocol Compliance** - AI systems must align with approved study protocols
• **Quality Assurance** - Comprehensive QA programs for AI systems
• **Documentation** - Detailed documentation of AI system development and validation
• **Risk Management** - Risk assessment and mitigation for AI applications

**Core GCP Principles:**
• **Ethical Conduct** - Clinical trials must be conducted in accordance with ethical principles
• **Scientific Rigor** - Trials must be scientifically sound and described in clear protocols
• **Regulatory Compliance** - Trials must comply with applicable regulatory requirements
• **Data Quality** - All clinical trial data must be accurate, complete, and verifiable
• **Subject Protection** - Rights, safety, and well-being of trial subjects are paramount

**AI-Specific Considerations:**
• AI systems used in clinical trials must be validated and documented
• Data generated by AI must meet the same quality standards as human-generated data
• AI algorithms must be transparent and explainable
• Risk management must address AI-specific risks and failures`,
      category: 'regulatory',
      subcategory: 'ICH E6(R3) Good Clinical Practice',
      sources: [
        {
          type: 'regulation',
          title: 'ICH E6(R3) Good Clinical Practice',
          content: 'International guidelines for clinical trial conduct',
          url: 'https://www.ich.org/page/e6-r3-gcp'
        },
        {
          type: 'guidance',
          title: 'ICH E6(R3) Questions & Answers',
          content: 'Frequently asked questions about GCP guidelines',
          url: 'https://www.ich.org/page/e6-r3-gcp'
        }
      ],
      actionItems: [
        'Review ICH E6(R3) for AI-specific GCP requirements',
        'Implement data integrity controls for AI systems',
        'Establish QA programs for AI applications',
        'Document AI system validation and performance',
        'Conduct risk assessments for AI in clinical trials'
      ],
      impactLevel: 'high',
      relatedQuestions: this.getDefaultRelatedQuestions(),
      confidence: 0.95,
      agentUsed: 'ich',
      subAgentUsed: undefined
    };
  }

  /**
   * Handle ICH E8(R1) General Considerations questions
   */
  private handleE8(question: string, context?: AgentContext): AgentResponse {
    return {
      answer: `ICH E8(R1) General Considerations for Clinical Studies provides guidance on clinical study design and conduct:

**Key E8(R1) Principles:**
• **Quality by Design** - Quality should be built into clinical studies from the beginning
• **Patient Focus** - Studies should be designed with patient needs and safety in mind
• **Risk-Based Approach** - Study design should be based on risk assessment
• **Flexibility** - Study designs should be flexible to accommodate new technologies and methods
• **Efficiency** - Studies should be designed to be as efficient as possible

**AI Integration Considerations:**
• AI can be used to optimize study design and patient selection
• AI systems must be validated before use in clinical studies
• Data quality requirements apply to AI-generated data
• Risk management must address AI-specific risks
• Study protocols must clearly define AI system use and limitations`,
      category: 'regulatory',
      subcategory: 'ICH E8(R1) General Considerations',
      sources: [
        {
          type: 'guidance',
          title: 'ICH E8(R1) General Considerations for Clinical Studies',
          content: 'Guidance on clinical study design and conduct',
          url: 'https://www.ich.org/page/e8-r1-general-considerations-clinical-studies'
        }
      ],
      actionItems: [
        'Review E8(R1) for study design principles',
        'Implement quality by design approach',
        'Conduct risk-based study design',
        'Validate AI systems before study use',
        'Document AI system integration in study protocols'
      ],
      impactLevel: 'high',
      relatedQuestions: this.getDefaultRelatedQuestions(),
      confidence: 0.9,
      agentUsed: 'ich',
      subAgentUsed: undefined
    };
  }

  /**
   * Handle ICH E9(R1) Statistical Principles questions
   */
  private handleE9(question: string, context?: AgentContext): AgentResponse {
    return {
      answer: `ICH E9(R1) Statistical Principles for Clinical Trials provides guidance on statistical aspects of clinical trials:

**Key E9(R1) Concepts:**
• **Estimands** - Clear definition of what is being estimated in the trial
• **Statistical Analysis Plan** - Detailed plan for statistical analysis
• **Missing Data** - Strategies for handling missing data
• **Intercurrent Events** - How to handle events that occur during the trial
• **Sensitivity Analyses** - Additional analyses to assess robustness of results

**AI and Machine Learning Considerations:**
• AI models used for statistical analysis must be validated
• Machine learning algorithms must be transparent and explainable
• Data used for AI training must meet quality standards
• AI-generated insights must be statistically sound
• Risk management must address AI model failures and biases`,
      category: 'regulatory',
      subcategory: 'ICH E9(R1) Statistical Principles',
      sources: [
        {
          type: 'guidance',
          title: 'ICH E9(R1) Statistical Principles for Clinical Trials',
          content: 'Guidance on statistical aspects of clinical trials',
          url: 'https://www.ich.org/page/e9-r1-statistical-principles-clinical-trials'
        }
      ],
      actionItems: [
        'Review E9(R1) for statistical analysis requirements',
        'Define clear estimands for your trial',
        'Develop comprehensive statistical analysis plan',
        'Validate AI models used for statistical analysis',
        'Implement sensitivity analyses for AI-generated results'
      ],
      impactLevel: 'high',
      relatedQuestions: this.getDefaultRelatedQuestions(),
      confidence: 0.9,
      agentUsed: 'ich',
      subAgentUsed: undefined
    };
  }

  /**
   * Handle ICH E17 Multi-Regional Clinical Trials questions
   */
  private handleE17(question: string, context?: AgentContext): AgentResponse {
    return {
      answer: `ICH E17 Multi-Regional Clinical Trials provides guidance on conducting clinical trials across multiple regions:

**Key E17 Principles:**
• **Regional Considerations** - Account for regional differences in medical practice and regulations
• **Ethnic Sensitivity** - Consider ethnic factors in study design and analysis
• **Regulatory Harmonization** - Align with regional regulatory requirements
• **Data Integration** - Ensure data quality and consistency across regions
• **Risk Management** - Address regional-specific risks and challenges

**AI Considerations for Multi-Regional Trials:**
• AI systems must be validated across different regions and populations
• Data quality standards must be consistent across all regions
• AI algorithms must account for regional differences in medical practice
• Risk management must address region-specific AI challenges
• Regulatory compliance must be maintained across all regions`,
      category: 'regulatory',
      subcategory: 'ICH E17 Multi-Regional Clinical Trials',
      sources: [
        {
          type: 'guidance',
          title: 'ICH E17 Multi-Regional Clinical Trials',
          content: 'Guidance on multi-regional clinical trial conduct',
          url: 'https://www.ich.org/page/e17-multi-regional-clinical-trials'
        }
      ],
      actionItems: [
        'Review E17 for multi-regional trial requirements',
        'Assess regional differences and requirements',
        'Validate AI systems across different regions',
        'Implement consistent data quality standards',
        'Develop region-specific risk management plans'
      ],
      impactLevel: 'high',
      relatedQuestions: this.getDefaultRelatedQuestions(),
      confidence: 0.9,
      agentUsed: 'ich',
      subAgentUsed: undefined
    };
  }

  /**
   * Handle general clinical trials questions
   */
  private handleClinicalTrials(question: string, context?: AgentContext): AgentResponse {
    return {
      answer: `ICH provides comprehensive guidelines for clinical trials through multiple guidelines:

**Key ICH Guidelines for Clinical Trials:**
• **ICH E6(R3): Good Clinical Practice (GCP)** - International ethical and scientific quality standard
• **ICH E8(R1): General Considerations for Clinical Studies** - Study design and conduct principles
• **ICH E9(R1): Statistical Principles for Clinical Trials** - Statistical analysis guidance
• **ICH E17: Multi-Regional Clinical Trials** - Cross-regional trial conduct
• **ICH E3: Structure and Content of Clinical Study Reports** - Report formatting and content

**Core Requirements:**
• **Data Integrity** - Ensuring AI-generated data meets GCP standards
• **Protocol Compliance** - AI systems must align with approved study protocols
• **Quality Assurance** - Comprehensive QA programs for AI systems
• **Documentation** - Detailed documentation of AI system development and validation
• **Risk Management** - Risk assessment and mitigation for AI applications

**AI Applications in Clinical Trials:**
• Patient recruitment and screening
• Protocol optimization and adaptive trial design
• Data collection and monitoring
• Safety signal detection
• Statistical analysis and reporting`,
      category: 'regulatory',
      subcategory: 'ICH Clinical Trials',
      sources: [
        {
          type: 'regulation',
          title: 'ICH Guidelines',
          content: 'Comprehensive ICH guidelines for clinical trials',
          url: 'https://www.ich.org/page/efficacy-guidelines'
        },
        {
          type: 'guidance',
          title: 'ICH E6(R3) Good Clinical Practice',
          content: 'GCP guidelines for clinical trial conduct',
          url: 'https://www.ich.org/page/e6-r3-gcp'
        }
      ],
      actionItems: [
        'Review relevant ICH guidelines for your clinical trial',
        'Implement data integrity controls for AI systems',
        'Establish QA programs for AI applications',
        'Document AI system validation and performance',
        'Conduct risk assessments for AI in clinical trials'
      ],
      impactLevel: 'high',
      relatedQuestions: this.getDefaultRelatedQuestions(),
      confidence: 0.95,
      agentUsed: 'ich',
      subAgentUsed: undefined
    };
  }
}
