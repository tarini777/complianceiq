/**
 * Comprehensive Assessment Data - ComplianceIQ System
 * Complete 12-section pharmaceutical AI production readiness assessment
 * Dynamic question generation based on therapeutic areas, AI model types, and deployment scenarios
 */

export interface TherapeuticArea {
  id: string;
  name: string;
  complexity: 'Low' | 'Medium' | 'High' | 'Critical';
  overlayPoints: number;
  specificRequirements: string[];
  regulatoryGuidance: string[];
}

export interface AIModelType {
  id: string;
  name: string;
  complexity: 'Low' | 'Medium' | 'High' | 'Critical';
  complexityPoints: number;
  specificRequirements: string[];
  safetyConsiderations: string[];
}

export interface DeploymentScenario {
  id: string;
  name: string;
  complexity: 'Low' | 'Medium' | 'High' | 'Critical';
  complexityPoints: number;
  regulatoryRequirements: string[];
  operationalConsiderations: string[];
}

export interface AssessmentSection {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  isCritical: boolean;
  validator: string;
  questions: AssessmentQuestion[];
  therapySpecificQuestions: TherapySpecificQuestions;
  modelTypeQuestions: ModelTypeQuestions;
  deploymentQuestions: DeploymentQuestions;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'boolean' | 'text' | 'radio' | 'checkbox' | 'rating';
  points: number;
  isBlocker: boolean;
  category: string;
  evidenceRequired: string[];
  responsibleRole: string[];
  options?: QuestionOption[];
  validationCriteria: Record<string, unknown>;
}

export interface QuestionOption {
  value: string;
  label: string;
  points: number;
  description?: string;
}

export interface TherapySpecificQuestions {
  [therapyAreaId: string]: AssessmentQuestion[];
}

export interface ModelTypeQuestions {
  [modelTypeId: string]: AssessmentQuestion[];
}

export interface DeploymentQuestions {
  [deploymentId: string]: AssessmentQuestion[];
}

// Therapeutic Areas Configuration
export const therapeuticAreas: TherapeuticArea[] = [
  {
    id: 'oncology',
    name: 'Oncology',
    complexity: 'Critical',
    overlayPoints: 20,
    specificRequirements: ['Genomics', 'Biomarkers', 'Tumor heterogeneity', 'Clinical endpoints'],
    regulatoryGuidance: ['FDA Oncology Center of Excellence', 'SEER registry validation', 'Biomarker qualification']
  },
  {
    id: 'cardiology',
    name: 'Cardiology',
    complexity: 'High',
    overlayPoints: 18,
    specificRequirements: ['Cardiovascular endpoints', 'ECG interpretation', 'Device integration', 'Emergency protocols'],
    regulatoryGuidance: ['AHA/ACC guidelines', 'FDA Class II device requirements', 'Cardiac device integration']
  },
  {
    id: 'neurology',
    name: 'Neurology',
    complexity: 'High',
    overlayPoints: 16,
    specificRequirements: ['Cognitive assessment', 'Brain imaging', 'Neurological outcomes', 'Movement disorders'],
    regulatoryGuidance: ['FDA CNS guidance', 'Neuropsychological testing standards', 'Radiology workflow integration']
  },
  {
    id: 'rare-disease',
    name: 'Rare Disease',
    complexity: 'Medium',
    overlayPoints: 15,
    specificRequirements: ['Small populations', 'Natural history modeling', 'Patient registries', 'Specialized protocols'],
    regulatoryGuidance: ['FDA orphan drug guidance', 'Rare disease endpoint validation', 'Patient registry integration']
  },
  {
    id: 'infectious-disease',
    name: 'Infectious Disease',
    complexity: 'Medium',
    overlayPoints: 12,
    specificRequirements: ['Outbreak response', 'Antimicrobial resistance', 'Epidemiological modeling', 'Vaccine development'],
    regulatoryGuidance: ['WHO guidelines', 'CDC protocols', 'Antimicrobial stewardship']
  },
  {
    id: 'mental-health',
    name: 'Mental Health',
    complexity: 'Medium',
    overlayPoints: 14,
    specificRequirements: ['Behavioral assessment', 'Privacy concerns', 'Cognitive evaluation', 'Therapy adherence'],
    regulatoryGuidance: ['HIPAA compliance', 'Mental health privacy', 'Behavioral assessment standards']
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    complexity: 'Medium',
    overlayPoints: 13,
    specificRequirements: ['Age-specific considerations', 'Safety protocols', 'Dosage adjustments', 'Parental consent'],
    regulatoryGuidance: ['Pediatric study requirements', 'Age-appropriate dosing', 'Safety monitoring']
  },
  {
    id: 'emergency-medicine',
    name: 'Emergency Medicine',
    complexity: 'High',
    overlayPoints: 17,
    specificRequirements: ['Rapid response', 'Critical decisions', 'Emergency protocols', 'Real-time monitoring'],
    regulatoryGuidance: ['Emergency care standards', 'Critical decision protocols', 'Rapid response requirements']
  }
];

// AI Model Types Configuration
export const aiModelTypes: AIModelType[] = [
  {
    id: 'traditional-ml',
    name: 'Traditional AI/ML',
    complexity: 'Low',
    complexityPoints: 8,
    specificRequirements: ['Supervised/unsupervised learning', 'Deterministic outputs', 'Statistical validation'],
    safetyConsiderations: ['Model explainability', 'Bias detection', 'Performance monitoring']
  },
  {
    id: 'generative-ai',
    name: 'Generative AI (GenAI)',
    complexity: 'High',
    complexityPoints: 15,
    specificRequirements: ['Large language models', 'Content generation', 'Creative AI', 'Hallucination detection'],
    safetyConsiderations: ['Content validation', 'Misinformation prevention', 'Citation tracking', 'Quality assurance']
  },
  {
    id: 'agentic-ai',
    name: 'Agentic AI',
    complexity: 'Critical',
    complexityPoints: 20,
    specificRequirements: ['Multi-agent systems', 'Autonomous decision-making', 'Agent coordination', 'Human oversight'],
    safetyConsiderations: ['Decision audit trails', 'Agent behavior monitoring', 'Safety constraints', 'Emergency stops']
  },
  {
    id: 'computer-vision',
    name: 'Computer Vision AI',
    complexity: 'Medium',
    complexityPoints: 12,
    specificRequirements: ['Medical imaging', 'Pathology analysis', 'Radiology interpretation', 'Image quality validation'],
    safetyConsiderations: ['Image preprocessing', 'Quality assessment', 'Radiologist integration', 'Uncertainty quantification']
  },
  {
    id: 'nlp',
    name: 'Natural Language Processing',
    complexity: 'Medium',
    complexityPoints: 10,
    specificRequirements: ['Clinical text analysis', 'Documentation automation', 'Medical terminology', 'Language processing'],
    safetyConsiderations: ['Text validation', 'Medical accuracy', 'Privacy preservation', 'Content quality']
  },
  {
    id: 'multimodal',
    name: 'Multimodal AI',
    complexity: 'High',
    complexityPoints: 18,
    specificRequirements: ['Text/image/sensor data', 'Multi-source integration', 'Complex validation', 'Cross-modal analysis'],
    safetyConsiderations: ['Data integration', 'Validation complexity', 'Performance monitoring', 'Error propagation']
  },
  {
    id: 'federated-learning',
    name: 'Federated Learning',
    complexity: 'High',
    complexityPoints: 16,
    specificRequirements: ['Distributed training', 'Privacy preservation', 'Multi-institution coordination', 'Model aggregation'],
    safetyConsiderations: ['Privacy protection', 'Model security', 'Data leakage prevention', 'Federation governance']
  },
  {
    id: 'edge-ai',
    name: 'Edge AI',
    complexity: 'High',
    complexityPoints: 14,
    specificRequirements: ['Point-of-care deployment', 'Real-time processing', 'Resource constraints', 'Local inference'],
    safetyConsiderations: ['Latency requirements', 'Resource limitations', 'Offline capabilities', 'Security constraints']
  }
];

// Deployment Scenarios Configuration
export const deploymentScenarios: DeploymentScenario[] = [
  {
    id: 'clinical-decision-support',
    name: 'Clinical Decision Support',
    complexity: 'Medium',
    complexityPoints: 10,
    regulatoryRequirements: ['Real-time clinical integration', 'FDA guidance compliance', 'Clinical workflow validation'],
    operationalConsiderations: ['Real-time inference', 'Clinical workflow integration', 'Alert management', 'User training']
  },
  {
    id: 'drug-discovery',
    name: 'Drug Discovery & Development',
    complexity: 'Low',
    complexityPoints: 8,
    regulatoryRequirements: ['Research environment protocols', 'Data validation', 'Research ethics'],
    operationalConsiderations: ['Research timelines', 'Data quality', 'Collaboration tools', 'Knowledge management']
  },
  {
    id: 'clinical-trials',
    name: 'Clinical Trial Operations',
    complexity: 'High',
    complexityPoints: 12,
    regulatoryRequirements: ['ICH GCP compliance', 'Multi-site coordination', 'Regulatory reporting'],
    operationalConsiderations: ['Trial design', 'Patient recruitment', 'Data collection', 'Monitoring protocols']
  },
  {
    id: 'regulatory-submission',
    name: 'Regulatory Submission',
    complexity: 'High',
    complexityPoints: 15,
    regulatoryRequirements: ['FDA compliance', 'Documentation standards', 'Evidence generation'],
    operationalConsiderations: ['Document automation', 'Quality assurance', 'Submission timelines', 'Regulatory liaison']
  },
  {
    id: 'real-world-evidence',
    name: 'Real-World Evidence',
    complexity: 'Medium',
    complexityPoints: 10,
    regulatoryRequirements: ['Post-market surveillance', 'Outcome tracking', 'Real-world data standards'],
    operationalConsiderations: ['Data collection', 'Outcome measurement', 'Long-term monitoring', 'Evidence synthesis']
  },
  {
    id: 'commercial-analytics',
    name: 'Commercial Analytics',
    complexity: 'Low',
    complexityPoints: 6,
    regulatoryRequirements: ['Business intelligence', 'Market analysis', 'Competitive intelligence'],
    operationalConsiderations: ['Data analytics', 'Market research', 'Business intelligence', 'Performance tracking']
  }
];

// Comprehensive Assessment Sections
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
        type: 'boolean',
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
        type: 'boolean',
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
        type: 'boolean',
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
          type: 'boolean',
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
          type: 'boolean',
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
          type: 'boolean',
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
          type: 'boolean',
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
          type: 'boolean',
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
          type: 'boolean',
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
        type: 'boolean',
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
        type: 'boolean',
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
        type: 'boolean',
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
        type: 'boolean',
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
        type: 'boolean',
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
        type: 'boolean',
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
        type: 'boolean',
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
        type: 'boolean',
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
        type: 'boolean',
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
        type: 'boolean',
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
        type: 'boolean',
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
        type: 'boolean',
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
        type: 'boolean',
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
        type: 'boolean',
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

// Scoring Configuration
export const scoringConfiguration = {
  maxBaseScore: 282,
  maxTherapyOverlay: 20,
  maxModelComplexity: 25,
  maxDeploymentComplexity: 15,
  maxTotalScore: 350,
  
  readinessThresholds: {
    productionReady: { min: 315, max: 350, percentage: 90, status: '✅ PRODUCTION READY' },
    conditional: { min: 280, max: 314, percentage: 80, status: '⚠️ PRODUCTION CONDITIONAL' },
    preProduction: { min: 245, max: 279, percentage: 70, status: '🔄 PRE-PRODUCTION' },
    developmentComplete: { min: 210, max: 244, percentage: 60, status: '📋 DEVELOPMENT COMPLETE' },
    notReady: { min: 0, max: 209, percentage: 0, status: '🚫 NOT PRODUCTION READY' }
  }
};

// Bottleneck Resolution Intelligence
export const bottleneckResolutions = {
  oncology: [
    {
      bottleneck: 'Genomic data integration complexity',
      resolution: 'Federated genomic learning with synthetic augmentation',
      priority: 'High',
      implementation: 'Deploy federated learning framework with synthetic data generation for rare genomic variants'
    },
    {
      bottleneck: 'Tumor heterogeneity bias across populations',
      resolution: 'Population-specific model ensembles',
      priority: 'Critical',
      implementation: 'Implement ensemble models trained on population-specific cohorts with bias correction'
    }
  ],
  cardiology: [
    {
      bottleneck: 'ECG interpretation accuracy across demographics',
      resolution: 'Diverse population federated training',
      priority: 'High',
      implementation: 'Deploy federated learning across diverse populations with demographic-specific validation'
    }
  ],
  'generative-ai': [
    {
      bottleneck: 'Clinical misinformation generation',
      resolution: 'Medical knowledge base grounding with real-time validation',
      priority: 'Critical',
      implementation: 'Integrate medical knowledge bases with real-time content validation and citation tracking'
    }
  ],
  'agentic-ai': [
    {
      bottleneck: 'Multi-agent coordination complexity',
      resolution: 'Hierarchical agent architecture with clear role definition',
      priority: 'High',
      implementation: 'Implement hierarchical agent system with defined roles, responsibilities, and communication protocols'
    }
  ]
};

export default {
  therapeuticAreas,
  aiModelTypes,
  deploymentScenarios,
  assessmentSections,
  scoringConfiguration,
  bottleneckResolutions
};
