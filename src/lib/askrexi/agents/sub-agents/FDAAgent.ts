/**
 * FDA Sub-Agent
 * Specialized knowledge for FDA regulations and guidelines
 */

import { BaseAgent } from '../BaseAgent';
import { AgentCapability, AgentContext, AgentResponse } from '../AgentManager';

export class FDAAgent extends BaseAgent {
  constructor() {
    super('fda');
  }

  protected initializeCapabilities(): AgentCapability {
    return {
      domain: 'fda',
      subdomains: ['AI/ML Guidelines', 'SaMD Framework', 'Clinical Trials', 'Drug Development', 'Quality Systems'],
      keywords: [
        'fda', 'food and drug administration', 'ai/ml action plan', 'gmlp', 'good machine learning practice',
        'samd', 'software as medical device', 'clinical decision support', 'cds', '21 cfr part 11',
        'electronic records', 'electronic signatures', 'validation', 'verification', 'risk management',
        'quality system regulation', 'qsr', 'design controls', 'human factors', 'usability',
        'premarket approval', 'pma', '510k', 'de novo', 'breakthrough therapy', 'fast track',
        'orphan drug', 'biosimilar', 'generic', 'new drug application', 'nda',
        'investigational new drug', 'ind', 'biologics license application', 'bla',
        'adverse event reporting', 'medwatch', 'postmarket surveillance', 'recall',
        'inspection', '483', 'warning letter', 'enforcement action'
      ],
      expertise: [
        'FDA AI/ML Action Plan',
        'Good Machine Learning Practice',
        'Software as Medical Device',
        'Clinical Decision Support',
        'Electronic Records and Signatures',
        'Quality System Regulation',
        'Premarket Submissions',
        'Postmarket Surveillance'
      ]
    };
  }

  protected initializeSubAgents(): void {
    // FDA agent doesn't have sub-agents, it's already specialized
  }

  protected getDefaultRelatedQuestions(): string[] {
    return [
      'What are the latest FDA guidelines for AI in healthcare?',
      'How does FDA regulate AI/ML software as medical devices?',
      'What is the FDA AI/ML Action Plan?',
      'What are Good Machine Learning Practice requirements?',
      'How do I submit AI software to FDA for approval?',
      'What are the FDA requirements for clinical decision support?',
      'How does 21 CFR Part 11 apply to AI systems?',
      'What are the FDA quality system requirements for AI?'
    ];
  }

  /**
   * Enhanced processing for FDA-specific questions
   */
  async process(question: string, context?: AgentContext): Promise<AgentResponse> {
    const questionLower = question.toLowerCase();
    
    // Handle specific FDA topics
    if (questionLower.includes('ai/ml action plan') || questionLower.includes('action plan')) {
      return this.handleAIMLActionPlan(question, context);
    }
    
    if (questionLower.includes('gmlp') || questionLower.includes('good machine learning practice')) {
      return this.handleGMLP(question, context);
    }
    
    if (questionLower.includes('samd') || questionLower.includes('software as medical device')) {
      return this.handleSaMD(question, context);
    }
    
    if (questionLower.includes('21 cfr part 11') || questionLower.includes('electronic records')) {
      return this.handlePart11(question, context);
    }
    
    if (questionLower.includes('clinical decision support') || questionLower.includes('cds')) {
      return this.handleCDS(question, context);
    }
    
    // Default to base processing
    return await super.process(question, context);
  }

  /**
   * Handle AI/ML Action Plan questions
   */
  private handleAIMLActionPlan(question: string, context?: AgentContext): AgentResponse {
    return {
      answer: `The FDA AI/ML Action Plan (2021) provides a comprehensive framework for regulating AI/ML in medical devices:

**Key Components:**
• **Good Machine Learning Practice (GMLP)** - Best practices for AI/ML development
• **Predetermined Change Control Plans** - Framework for managing AI model updates
• **Real-World Performance Monitoring** - Continuous monitoring of AI performance
• **Algorithm Transparency** - Requirements for explainable AI systems
• **Clinical Validation** - Rigorous testing in real-world clinical settings

**Core Requirements:**
• Establish AI/ML development lifecycle management
• Implement continuous learning protocols
• Maintain comprehensive documentation
• Conduct bias and fairness assessments
• Ensure clinical validation and monitoring

**Impact on Pharmaceutical AI:**
• AI models used in drug discovery must meet FDA validation standards
• Clinical trial AI tools require appropriate regulatory pathway
• Real-world evidence from AI systems can support regulatory submissions`,
      category: 'regulatory',
      subcategory: 'FDA AI/ML Action Plan',
      sources: [
        {
          type: 'regulation',
          title: 'FDA AI/ML Action Plan',
          content: 'Official FDA guidance on AI/ML in medical devices',
          url: 'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device'
        },
        {
          type: 'guidance',
          title: 'Good Machine Learning Practice',
          content: 'GMLP guidelines for AI/ML development',
          url: 'https://www.fda.gov/medical-devices/software-medical-device-samd/good-machine-learning-practice-medical-device-development'
        }
      ],
      actionItems: [
        'Review FDA AI/ML Action Plan for your specific use case',
        'Implement GMLP principles in your AI development process',
        'Develop predetermined change control plans',
        'Establish real-world performance monitoring protocols',
        'Conduct clinical validation studies for AI models'
      ],
      impactLevel: 'high',
      relatedQuestions: this.getDefaultRelatedQuestions(),
      confidence: 0.95,
      agentUsed: 'fda',
      subAgentUsed: undefined
    };
  }

  /**
   * Handle Good Machine Learning Practice questions
   */
  private handleGMLP(question: string, context?: AgentContext): AgentResponse {
    return {
      answer: `Good Machine Learning Practice (GMLP) provides best practices for AI/ML development in medical devices:

**Core GMLP Principles:**
• **Multi-Disciplinary Expertise** - Include clinical, statistical, and software engineering expertise
• **Good Software Engineering Practices** - Follow established software development standards
• **Clinical Study Participants and Data** - Ensure representative and high-quality data
• **Training Data** - Use diverse, representative datasets with proper validation
• **Reference Datasets** - Establish benchmark datasets for performance evaluation
• **Model Design** - Design for intended use with appropriate complexity
• **Robustness** - Ensure model performance across different populations and conditions

**Implementation Requirements:**
• Establish AI/ML development lifecycle management
• Implement comprehensive testing and validation protocols
• Maintain detailed documentation of model development
• Conduct bias and fairness assessments
• Ensure clinical validation and real-world performance monitoring`,
      category: 'regulatory',
      subcategory: 'Good Machine Learning Practice',
      sources: [
        {
          type: 'guidance',
          title: 'Good Machine Learning Practice for Medical Device Development',
          content: 'Official FDA GMLP guidance document',
          url: 'https://www.fda.gov/medical-devices/software-medical-device-samd/good-machine-learning-practice-medical-device-development'
        }
      ],
      actionItems: [
        'Implement GMLP principles in your AI development process',
        'Establish multi-disciplinary development teams',
        'Develop comprehensive testing and validation protocols',
        'Create detailed model documentation',
        'Implement bias and fairness assessment procedures'
      ],
      impactLevel: 'high',
      relatedQuestions: this.getDefaultRelatedQuestions(),
      confidence: 0.95,
      agentUsed: 'fda',
      subAgentUsed: undefined
    };
  }

  /**
   * Handle Software as Medical Device questions
   */
  private handleSaMD(question: string, context?: AgentContext): AgentResponse {
    return {
      answer: `Software as Medical Device (SaMD) refers to software intended for medical purposes that performs these purposes without being part of a hardware medical device:

**SaMD Classification:**
• **Class I** - Low risk, general controls
• **Class II** - Moderate risk, special controls
• **Class III** - High risk, premarket approval

**Key Requirements:**
• **Risk Management** - Comprehensive risk assessment and mitigation
• **Quality Management System** - QMS compliance (21 CFR 820)
• **Clinical Evaluation** - Evidence of safety and effectiveness
• **Cybersecurity** - Protection against security threats
• **Human Factors** - Usability and user interface design
• **Labeling** - Clear instructions for use and limitations

**Regulatory Pathways:**
• **510(k) Clearance** - Substantial equivalence to predicate device
• **De Novo Classification** - Novel device with no predicate
• **Premarket Approval (PMA)** - High-risk devices requiring clinical data`,
      category: 'regulatory',
      subcategory: 'Software as Medical Device',
      sources: [
        {
          type: 'guidance',
          title: 'Software as Medical Device (SaMD)',
          content: 'FDA guidance on SaMD regulation',
          url: 'https://www.fda.gov/medical-devices/software-medical-device-samd'
        }
      ],
      actionItems: [
        'Determine SaMD classification for your software',
        'Develop risk management plan',
        'Implement quality management system',
        'Conduct clinical evaluation',
        'Prepare appropriate regulatory submission'
      ],
      impactLevel: 'high',
      relatedQuestions: this.getDefaultRelatedQuestions(),
      confidence: 0.9,
      agentUsed: 'fda',
      subAgentUsed: undefined
    };
  }

  /**
   * Handle 21 CFR Part 11 questions
   */
  private handlePart11(question: string, context?: AgentContext): AgentResponse {
    return {
      answer: `21 CFR Part 11 establishes criteria for electronic records and electronic signatures that are equivalent to paper records and handwritten signatures:

**Key Requirements:**
• **Electronic Records** - Must be trustworthy, reliable, and equivalent to paper records
• **Electronic Signatures** - Must be legally binding and equivalent to handwritten signatures
• **Access Controls** - User identification and authentication
• **Audit Trails** - Complete record of system access and changes
• **System Validation** - Comprehensive validation of electronic systems
• **Documentation** - Detailed system documentation and procedures

**Compliance Requirements:**
• Implement user access controls and authentication
• Maintain comprehensive audit trails
• Validate all electronic systems
• Establish data integrity controls
• Document all procedures and processes
• Train personnel on Part 11 requirements`,
      category: 'regulatory',
      subcategory: '21 CFR Part 11',
      sources: [
        {
          type: 'regulation',
          title: '21 CFR Part 11 - Electronic Records and Electronic Signatures',
          content: 'FDA regulation on electronic records and signatures',
          url: 'https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfcfr/CFRSearch.cfm?CFRPart=11'
        }
      ],
      actionItems: [
        'Conduct Part 11 compliance assessment',
        'Implement access controls and authentication',
        'Establish audit trail systems',
        'Validate all electronic systems',
        'Develop Part 11 compliance procedures'
      ],
      impactLevel: 'high',
      relatedQuestions: this.getDefaultRelatedQuestions(),
      confidence: 0.9,
      agentUsed: 'fda',
      subAgentUsed: undefined
    };
  }

  /**
   * Handle Clinical Decision Support questions
   */
  private handleCDS(question: string, context?: AgentContext): AgentResponse {
    return {
      answer: `FDA regulates Clinical Decision Support (CDS) software based on its intended use and risk level:

**CDS Classification:**
• **Non-Device CDS** - Software that provides general information without specific patient recommendations
• **Device CDS** - Software that provides specific patient recommendations and may be regulated as a medical device

**Key Factors for Device Classification:**
• **Intended Use** - Whether software provides specific patient recommendations
• **Risk Level** - Potential for patient harm if software fails
• **Clinical Impact** - Whether software influences clinical decision-making
• **User Expertise** - Level of clinical expertise required to use the software

**Regulatory Requirements for Device CDS:**
• Appropriate regulatory pathway (510(k), De Novo, or PMA)
• Clinical validation and performance testing
• Risk management and quality systems
• Labeling and instructions for use
• Postmarket surveillance and reporting`,
      category: 'regulatory',
      subcategory: 'Clinical Decision Support',
      sources: [
        {
          type: 'guidance',
          title: 'Clinical Decision Support Software',
          content: 'FDA guidance on CDS software regulation',
          url: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software'
        }
      ],
      actionItems: [
        'Determine if your CDS software is a medical device',
        'Assess risk level and appropriate regulatory pathway',
        'Conduct clinical validation studies',
        'Implement risk management and quality systems',
        'Prepare appropriate regulatory submission'
      ],
      impactLevel: 'high',
      relatedQuestions: this.getDefaultRelatedQuestions(),
      confidence: 0.9,
      agentUsed: 'fda',
      subAgentUsed: undefined
    };
  }
}
