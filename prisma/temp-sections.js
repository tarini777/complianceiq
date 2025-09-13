export const assessmentSections: AssessmentSection[] = [
  {
    id: 'regulatory-compliance',
    name: 'Regulatory Compliance Production Configuration',
    description: 'Production-ready for therapy-specific regulatory submissions',
    maxScore: 25,
    isCritical: true,
    validator: 'Regulatory Affairs Director',
    questions: [
      {
        id: 'reg-001',
        text: 'Are your existing AI system outputs production-configured and validated for immediate therapy-specific FDA submission?',
        type: "boolean",
        points: 5,
        isBlocker: true,
        category: 'Production Blocker',
        evidenceRequired: ['FDA validation documentation', 'Therapy-specific compliance certificates'],
        responsibleRole: ['Regulatory Affairs Director', 'Quality Assurance Manager'],
        validationCriteria: { required: true, documentation: 'FDA submission-ready' }
      },
      {
        id: 'reg-002',
        text: 'Is your current automated regulatory documentation generation production-configured for your therapeutic area requirements?',
        type: "boolean",
        points: 4,
        isBlocker: true,
        category: 'Production Blocker',
        evidenceRequired: ['Automated documentation system', 'Therapy-specific templates'],
        responsibleRole: ['Regulatory Affairs Director', 'Documentation Specialist'],
        validationCriteria: { required: true, automation: 'production-ready' }
      },
      {
        id: 'reg-003',
        text: 'Is your PCCP (Predetermined Change Control Plan) production-implemented and FDA-approved for your specific AI model types?',
        type: "boolean",
        points: 5,
        isBlocker: true,
        category: 'Production Blocker',
        evidenceRequired: ['PCCP documentation', 'FDA approval letters'],
        responsibleRole: ['Regulatory Affairs Director', 'AI/ML Engineer'],
        validationCriteria: { required: true, approval: 'FDA-approved' }
      }
    ],
    therapySpecificQuestions: {
      oncology: [
        {
          id: 'reg-onc-001',
          text: 'Are your AI outputs production-formatted and validated for FDA Oncology Center of Excellence requirements?',
          type: "boolean",
          points: 4,
          isBlocker: false,
          category: 'Oncology-Specific',
          evidenceRequired: ['FDA Oncology Center validation', 'Oncology-specific compliance documentation'],
          responsibleRole: ['Oncology Medical Director', 'Regulatory Affairs Director'],
          validationCriteria: { therapy: 'oncology', fdaCenter: 'Oncology Center of Excellence' }
        },
        {
          id: 'reg-onc-002',
          text: 'Is your real-world evidence generation production-configured for oncology endpoints (OS, PFS, ORR, biomarkers)?',
          type: "boolean",
          points: 4,
          isBlocker: false,
          category: 'Oncology-Specific',
          evidenceRequired: ['Oncology endpoint validation', 'Biomarker qualification documentation'],
          responsibleRole: ['Oncology Clinical Director', 'Real-World Evidence Manager'],
          validationCriteria: { endpoints: ['OS', 'PFS', 'ORR', 'biomarkers'], validation: 'production-ready' }
        }
      ],
      cardiology: [
        {
          id: 'reg-card-001',
          text: 'Are your AI models production-validated for cardiovascular endpoint assessment (MACE, mortality reduction)?',
          type: "boolean",
          points: 4,
          isBlocker: false,
          category: 'Cardiology-Specific',
          evidenceRequired: ['Cardiovascular endpoint validation', 'MACE assessment documentation'],
          responsibleRole: ['Cardiology Medical Director', 'Clinical Validation Manager'],
          validationCriteria: { endpoints: ['MACE', 'mortality'], validation: 'production-ready' }
        }
      ]
    },
    modelTypeQuestions: {
      'generative-ai': [
        {
          id: 'reg-genai-001',
          text: 'Are your hallucination detection systems production-deployed for clinical content generation?',
          type: "boolean",
          points: 3,
          isBlocker: false,
          category: 'GenAI-Specific',
          evidenceRequired: ['Hallucination detection system', 'Clinical content validation protocols'],
          responsibleRole: ['AI/ML Engineer', 'Clinical Content Manager'],
          validationCriteria: { detection: 'production-deployed', accuracy: '>95%' }
        }
      ],
      'agentic-ai': [
        {
          id: 'reg-agent-001',
          text: 'Are your agent decision audit trails production-deployed meeting FDA transparency requirements?',
          type: "boolean",
          points: 4,
          isBlocker: false,
          category: 'Agentic AI-Specific',
          evidenceRequired: ['Agent audit trail system', 'FDA transparency compliance documentation'],
          responsibleRole: ['AI/ML Engineer', 'Compliance Officer'],
          validationCriteria: { auditTrails: 'production-deployed', fdaCompliance: 'transparency-requirements' }
        }
      ]
    },
    deploymentQuestions: {
      'clinical-decision-support': [
        {
          id: 'reg-clinical-001',
          text: 'Are your clinical decision support AI systems production-configured for real-time regulatory compliance?',
          type: "boolean",
          points: 3,
          isBlocker: false,
          category: 'Clinical Decision Support',
          evidenceRequired: ['Real-time compliance monitoring', 'Clinical decision validation'],
          responsibleRole: ['Clinical Operations Director', 'Regulatory Affairs Manager'],
          validationCriteria: { realTime: true, compliance: 'regulatory-approved' }
        }
      ]
    }
  },
  {
    id: 'clinical-validation',
    name: 'Clinical Validation Production Configuration',
    description: 'Production-ready for therapy-appropriate clinical evidence generation',
    maxScore: 22,
    isCritical: true,
    validator: 'Clinical Development VP',
    questions: [
      {
        id: 'clin-001',
        text: 'Is your existing data lake production-configured to automatically generate clinical study reports meeting ICH E3 standards?',
        type: "boolean",
        points: 5,
        isBlocker: true,
        category: 'Production Blocker',
        evidenceRequired: ['ICH E3 compliance documentation', 'Automated report generation system'],
        responsibleRole: ['Clinical Development VP', 'Data Engineering Lead'],
        validationCriteria: { ichCompliance: 'E3-standards', automation: 'production-ready' }
      },
      {
        id: 'clin-002',
        text: 'Are your AI-generated clinical endpoints production-configured and automatically formatted for regulatory submissions?',
        type: "boolean",
        points: 4,
        isBlocker: true,
        category: 'Production Blocker',
        evidenceRequired: ['Clinical endpoint validation', 'Automated formatting system'],
        responsibleRole: ['Clinical Development VP', 'Regulatory Affairs Manager'],
        validationCriteria: { endpoints: 'production-configured', formatting: 'automated' }
      },
      {
        id: 'clin-003',
        text: 'Is your external validation system production-deployed across multiple geographic regions and clinical sites?',
        type: "boolean",
        points: 4,
        isBlocker: true,
        category: 'Production Blocker',
        evidenceRequired: ['Multi-site validation documentation', 'Geographic deployment certificates'],
        responsibleRole: ['Clinical Operations Director', 'Global Clinical Manager'],
        validationCriteria: { deployment: 'multi-region', sites: 'multiple-clinical-sites' }
      }
    ],
    therapySpecificQuestions: {},
    modelTypeQuestions: {},
    deploymentQuestions: {}
  },
  {
    id: 'safety-bias',
    name: 'Safety & Bias Production Configuration',
    description: 'Production-ready for therapy-specific risks and populations',
    maxScore: 25,
    isCritical: true,
    validator: 'Data Science/AI Head + Pharmacovigilance Director',
    questions: [
      {
        id: 'safety-001',
        text: 'Are your existing bias detection algorithms production-configured for therapy-specific demographic considerations?',
        type: "boolean",
        points: 5,
        isBlocker: true,
        category: 'Production Blocker',
        evidenceRequired: ['Bias detection system documentation', 'Demographic validation protocols'],
        responsibleRole: ['Data Science/AI Head', 'Pharmacovigilance Director'],
        validationCriteria: { biasDetection: 'production-configured', demographics: 'therapy-specific' }
      },
      {
        id: 'safety-002',
        text: 'Is your current safety monitoring system production-configured for therapy-specific adverse events?',
        type: "boolean",
        points: 4,
        isBlocker: true,
        category: 'Production Blocker',
        evidenceRequired: ['Safety monitoring system', 'Therapy-specific AE protocols'],
        responsibleRole: ['Pharmacovigilance Director', 'Clinical Safety Manager'],
        validationCriteria: { safetyMonitoring: 'production-configured', adverseEvents: 'therapy-specific' }
      }
    ],
    therapySpecificQuestions: {},
    modelTypeQuestions: {},
    deploymentQuestions: {}
  },
  {
    id: 'human-in-loop',
    name: 'Human-in-the-Loop Production Configuration',
    description: 'Production-ready for clinical decision support without replacing human judgment',
    maxScore: 20,
    isCritical: true,
    validator: 'Medical Affairs VP + Clinical Operations Director',
    questions: [
      {
        id: 'human-001',
        text: 'Are your existing human override capabilities production-configured and extensively tested across all AI system components?',
        type: "boolean",
        points: 5,
        isBlocker: true,
        category: 'Production Blocker',
        evidenceRequired: ['Human override system documentation', 'Extensive testing reports'],
        responsibleRole: ['Medical Affairs VP', 'Clinical Operations Director'],
        validationCriteria: { overrideCapabilities: 'production-configured', testing: 'extensive' }
      }
    ],
    therapySpecificQuestions: {},
    modelTypeQuestions: {},
    deploymentQuestions: {}
  },
  {
    id: 'explainable-ai',
    name: 'Explainable AI Production Configuration',
    description: 'Production-ready for clinical trust and regulatory compliance',
    maxScore: 22,
    isCritical: true,
    validator: 'Medical Affairs VP + Data Science/AI Head',
    questions: [
      {
        id: 'explain-001',
        text: 'Is your decision pathway documentation production-configured for all AI recommendations?',
        type: "boolean",
        points: 5,
        isBlocker: true,
        category: 'Production Blocker',
        evidenceRequired: ['Decision pathway documentation system', 'AI recommendation tracking'],
        responsibleRole: ['Medical Affairs VP', 'Data Science/AI Head'],
        validationCriteria: { documentation: 'production-configured', recommendations: 'all-ai-decisions' }
      }
    ],
    therapySpecificQuestions: {},
    modelTypeQuestions: {},
    deploymentQuestions: {}
  },
  {
    id: 'technical-infrastructure',
    name: 'Technical Infrastructure Production Configuration',
    description: 'Production-ready for scalable, secure AI deployment',
    maxScore: 25,
    isCritical: true,
    validator: 'Chief Technology Officer + IT Infrastructure Head',
    questions: [
      {
        id: 'tech-001',
        text: 'Are your existing real-time data pipelines production-configured for continuous clinical streams?',
        type: "boolean",
        points: 5,
        isBlocker: true,
        category: 'Production Blocker',
        evidenceRequired: ['Real-time data pipeline documentation', 'Clinical stream processing validation'],
        responsibleRole: ['Chief Technology Officer', 'IT Infrastructure Head'],
        validationCriteria: { pipelines: 'production-configured', streams: 'continuous-clinical' }
      }
    ],
    therapySpecificQuestions: {},
    modelTypeQuestions: {},
    deploymentQuestions: {}
  },
  {
    id: 'organizational-readiness',
    name: 'Organizational Production Readiness',
    description: 'Production-ready for AI deployment across therapeutic areas',
    maxScore: 18,
    isCritical: false,
    validator: 'Program Director + Executive Sponsor',
    questions: [
      {
        id: 'org-001',
        text: 'Is your multidisciplinary team production-configured with support capabilities for your therapeutic area?',
        type: "boolean",
        points: 4,
        isBlocker: true,
        category: 'Production Blocker',
        evidenceRequired: ['Team configuration documentation', 'Therapy-specific support capabilities'],
        responsibleRole: ['Program Director', 'Executive Sponsor'],
        validationCriteria: { team: 'production-configured', capabilities: 'therapy-specific' }
      }
    ],
    therapySpecificQuestions: {},
    modelTypeQuestions: {},
    deploymentQuestions: {}
  },
  {
    id: 'data-observability',
    name: 'Data Observability Production Configuration',
    description: 'Production-ready for continuous AI monitoring',
    maxScore: 20,
    isCritical: true,
    validator: 'Data Science/AI Head + Data Engineering Lead',
    questions: [
      {
        id: 'obs-001',
        text: 'Is your synthetic data generation production-configured for model enhancement?',
        type: "boolean",
        points: 4,
        isBlocker: true,
        category: 'Production Blocker',
        evidenceRequired: ['Synthetic data generation system', 'Model enhancement protocols'],
        responsibleRole: ['Data Science/AI Head', 'Data Engineering Lead'],
        validationCriteria: { syntheticData: 'production-configured', enhancement: 'model-improvement' }
      }
    ],
    therapySpecificQuestions: {},
    modelTypeQuestions: {},
    deploymentQuestions: {}
  },
  {
    id: 'data-rights-licensing',
    name: 'Data Rights & Licensing Production Compliance',
    description: 'Production-validated for immediate AI deployment',
    maxScore: 20,
    isCritical: true,
    validator: 'Legal Counsel - IP Specialist + Regulatory Affairs Director',
    questions: [
      {
        id: 'rights-001',
        text: 'Are your existing 3rd party data agreements production-validated to explicitly permit AI model training for your specific therapeutic applications?',
        type: "boolean",
        points: 5,
        isBlocker: true,
        category: 'Production Blocker',
        evidenceRequired: ['Third-party data agreements', 'AI training permissions documentation'],
        responsibleRole: ['Legal Counsel - IP Specialist', 'Regulatory Affairs Director'],
        validationCriteria: { agreements: 'production-validated', permissions: 'explicit-ai-training' }
      }
    ],
    therapySpecificQuestions: {},
    modelTypeQuestions: {},
    deploymentQuestions: {}
  },
  {
    id: 'data-classification',
    name: 'Automated Data Classification Production Configuration',
    description: 'Production-ready for therapy-specific compliance',
    maxScore: 18,
    isCritical: true,
    validator: 'Data Architecture Lead + Privacy Officer',
    questions: [
      {
        id: 'class-001',
        text: 'Is your existing automated data classification engine production-configured across all data sources for your therapeutic area?',
        type: "boolean",
        points: 4,
        isBlocker: true,
        category: 'Production Blocker',
        evidenceRequired: ['Automated classification engine', 'Therapy-specific configuration documentation'],
        responsibleRole: ['Data Architecture Lead', 'Privacy Officer'],
        validationCriteria: { classification: 'production-configured', coverage: 'all-data-sources' }
      }
    ],
    therapySpecificQuestions: {},
    modelTypeQuestions: {},
    deploymentQuestions: {}
  },
  {
    id: 'ai-output-storage',
    name: 'AI Output Storage Production Configuration',
    description: 'Production-ready for regulatory compliance and audit',
    maxScore: 20,
    isCritical: true,
    validator: 'Data Architecture Lead + Regulatory Affairs Director',
    questions: [
      {
        id: 'storage-001',
        text: 'Is your comprehensive AI output storage production-configured for all your production models?',
        type: "boolean",
        points: 4,
        isBlocker: true,
        category: 'Production Blocker',
        evidenceRequired: ['AI output storage system', 'Production model coverage documentation'],
        responsibleRole: ['Data Architecture Lead', 'Regulatory Affairs Director'],
        validationCriteria: { storage: 'production-configured', coverage: 'all-production-models' }
      }
    ],
    therapySpecificQuestions: {},
    modelTypeQuestions: {},
    deploymentQuestions: {}
  },
  {
    id: 'ai-system-operations',
    name: 'AI System Operations Production Configuration',
    description: 'Production-ready for continuous deployment and monitoring',
    maxScore: 25,
    isCritical: true,
    validator: 'Data Science/AI Head + DevOps Lead',
    questions: [
      {
        id: 'ops-001',
        text: 'Is your comprehensive model versioning production-configured across all AI components?',
        type: "boolean",
        points: 5,
        isBlocker: true,
        category: 'Production Blocker',
        evidenceRequired: ['Model versioning system', 'AI component coverage documentation'],
        responsibleRole: ['Data Science/AI Head', 'DevOps Lead'],
        validationCriteria: { versioning: 'production-configured', coverage: 'all-ai-components' }
      }
    ],
    therapySpecificQuestions: {},
    modelTypeQuestions: {},
    deploymentQuestions: {}
  }
];