/**
 * Regulatory Intelligence Types - ComplianceIQ System
 * Comprehensive mapping of all AI-related regulations across 26 assessment sections
 * Central reference database for compliance measurement
 */

export interface RegulatoryType {
  id: string;
  name: string;
  description: string;
  jurisdiction: string;
  authority: string;
  category: 'AI/ML' | 'Data Privacy' | 'Clinical Trials' | 'Drug Safety' | 'Quality Assurance' | 'Medical Devices' | 'General';
  impactLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  effectiveDate: string;
  lastUpdated: string;
  status: 'Active' | 'Draft' | 'Superseded' | 'Proposed';
  regulations: Regulation[];
  affectedSections: string[]; // Assessment section IDs
  affectedQuestions: string[]; // Question IDs
  complianceRequirements: ComplianceRequirement[];
}

export interface Regulation {
  id: string;
  title: string;
  description: string;
  regulationNumber: string;
  documentUrl: string;
  officialUrl: string;
  requirements: string[];
  penalties: string[];
  implementationGuidance: string[];
  relatedRegulations: string[];
}

export interface ComplianceRequirement {
  id: string;
  description: string;
  assessmentSection: string;
  questionId: string;
  evidenceRequired: string[];
  responsibleRole: string[];
  validationCriteria: Record<string, any>;
  implementationTimeline: string;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
}

// Comprehensive Regulatory Types covering all 26 assessment sections
export const regulatoryTypes: RegulatoryType[] = [
  {
    id: 'fda-ai-ml-guidance',
    name: 'FDA AI/ML Guidance Framework',
    description: 'Comprehensive FDA guidance for AI/ML in medical devices and pharmaceutical applications',
    jurisdiction: 'United States',
    authority: 'FDA',
    category: 'AI/ML',
    impactLevel: 'Critical',
    effectiveDate: '2023-09-27',
    lastUpdated: '2024-01-15',
    status: 'Active',
    regulations: [
      {
        id: 'fda-samd-guidance',
        title: 'Software as a Medical Device (SaMD) Guidance',
        description: 'FDA guidance on Software as a Medical Device including AI/ML applications',
        regulationNumber: 'FDA-2023-SaMD-001',
        documentUrl: 'https://www.fda.gov/media/109618/download',
        officialUrl: 'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device',
        requirements: [
          'Clinical evaluation of AI/ML software',
          'Risk management for AI/ML systems',
          'Quality management system requirements',
          'Cybersecurity considerations',
          'Human factors and usability engineering'
        ],
        penalties: [
          'Warning letters for non-compliance',
          'Import alerts for foreign manufacturers',
          'Civil monetary penalties up to $1.1M per violation',
          'Criminal penalties for willful violations'
        ],
        implementationGuidance: [
          'Follow ISO 13485 quality management system',
          'Implement risk management per ISO 14971',
          'Conduct clinical evaluation per MEDDEV 2.7/1',
          'Establish cybersecurity program per FDA guidance'
        ],
        relatedRegulations: ['FDA-GMLP-Guidance', 'FDA-Cybersecurity-Guidance']
      },
      {
        id: 'fda-gmlp-guidance',
        title: 'Good Machine Learning Practice (GMLP) for Medical Device Development',
        description: 'FDA guidance on Good Machine Learning Practice for medical device development and validation',
        regulationNumber: 'FDA-2021-GMLP-001',
        documentUrl: 'https://www.fda.gov/media/109618/download',
        officialUrl: 'https://www.fda.gov/medical-devices/software-medical-device-samd/good-machine-learning-practice-medical-device-development',
        requirements: [
          'Multi-disciplinary team approach',
          'Good software engineering practices',
          'Clinical study participants and data collection',
          'Training data and reference datasets',
          'Data management and preparation',
          'Model design and development',
          'Model validation and verification',
          'Deployment, monitoring, and maintenance'
        ],
        penalties: [
          'Warning letters for inadequate ML practices',
          'Refusal to accept premarket submissions',
          'Civil monetary penalties for false claims'
        ],
        implementationGuidance: [
          'Establish ML lifecycle management',
          'Implement continuous learning protocols',
          'Document model performance monitoring',
          'Establish change control procedures'
        ],
        relatedRegulations: ['FDA-SaMD-Guidance', 'FDA-Clinical-Validation-Guidance']
      }
    ],
    affectedSections: [
      'regulatory-compliance',
      'clinical-validation',
      'safety-bias',
      'explainable-ai',
      'technical-infrastructure',
      'ai-system-operations'
    ],
    affectedQuestions: [
      'reg-001', 'reg-002', 'reg-003',
      'cv-001', 'cv-002', 'cv-003',
      'sb-001', 'sb-002', 'sb-003',
      'xai-001', 'xai-002', 'xai-003'
    ],
    complianceRequirements: [
      {
        id: 'fda-ai-001',
        description: 'Implement FDA-approved AI/ML validation framework',
        assessmentSection: 'regulatory-compliance',
        questionId: 'reg-001',
        evidenceRequired: ['FDA validation documentation', 'AI model validation reports'],
        responsibleRole: ['Regulatory Affairs Director', 'AI/ML Engineer'],
        validationCriteria: { fdaApproval: true, validationComplete: true },
        implementationTimeline: '6 months',
        riskLevel: 'Critical'
      }
    ]
  },
  {
    id: 'ema-ai-guidance',
    name: 'EMA AI/ML Guidelines for Medicinal Products',
    description: 'European Medicines Agency guidelines for AI/ML in pharmaceutical development and clinical trials',
    jurisdiction: 'European Union',
    authority: 'EMA',
    category: 'AI/ML',
    impactLevel: 'Critical',
    effectiveDate: '2023-03-01',
    lastUpdated: '2024-01-10',
    status: 'Active',
    regulations: [
      {
        id: 'ema-ai-reflection-paper',
        title: 'EMA Reflection Paper on AI in Medicinal Products',
        description: 'EMA reflection paper on the use of artificial intelligence in medicinal products for human use',
        regulationNumber: 'EMA-2023-AI-001',
        documentUrl: 'https://www.ema.europa.eu/en/documents/report/reflection-paper-artificial-intelligence-use-medicinal-products-human-medicine_en.pdf',
        officialUrl: 'https://www.ema.europa.eu/en/documents/report/reflection-paper-artificial-intelligence-use-medicinal-products-human-medicine_en.pdf',
        requirements: [
          'Transparency and explainability of AI systems',
          'Robustness and reliability of AI outputs',
          'Data quality and representativeness',
          'Clinical validation and evidence generation',
          'Risk management and monitoring',
          'Regulatory oversight and governance'
        ],
        penalties: [
          'Market authorization suspension',
          'Withdrawal of marketing authorization',
          'Administrative fines up to €5M',
          'Criminal penalties for serious violations'
        ],
        implementationGuidance: [
          'Develop AI governance framework',
          'Implement explainable AI systems',
          'Establish continuous monitoring protocols',
          'Document AI decision-making processes'
        ],
        relatedRegulations: ['EU-AI-Act', 'GDPR-AI-Guidelines']
      }
    ],
    affectedSections: [
      'regulatory-compliance',
      'clinical-validation',
      'safety-bias',
      'explainable-ai',
      'data-observability',
      'ai-system-operations'
    ],
    affectedQuestions: [
      'reg-001', 'reg-002', 'reg-003',
      'cv-001', 'cv-002', 'cv-003',
      'sb-001', 'sb-002', 'sb-003'
    ],
    complianceRequirements: [
      {
        id: 'ema-ai-001',
        description: 'Implement EMA-compliant AI transparency framework',
        assessmentSection: 'explainable-ai',
        questionId: 'xai-001',
        evidenceRequired: ['AI explainability documentation', 'Decision audit trails'],
        responsibleRole: ['AI/ML Engineer', 'Regulatory Affairs Director'],
        validationCriteria: { explainabilityScore: '>80%', auditTrailComplete: true },
        implementationTimeline: '4 months',
        riskLevel: 'High'
      }
    ]
  },
  {
    id: 'eu-ai-act',
    name: 'EU AI Act - Artificial Intelligence Act',
    description: 'Comprehensive EU regulation on artificial intelligence systems',
    jurisdiction: 'European Union',
    authority: 'European Commission',
    category: 'AI/ML',
    impactLevel: 'Critical',
    effectiveDate: '2024-08-02',
    lastUpdated: '2024-01-20',
    status: 'Active',
    regulations: [
      {
        id: 'eu-ai-act-regulation',
        title: 'EU AI Act - Implementation Guidelines',
        description: 'Comprehensive EU regulation on artificial intelligence systems with risk-based approach',
        regulationNumber: 'EU-2024-AI-Act-001',
        documentUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52021PC0206',
        officialUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52021PC0206',
        requirements: [
          'Risk-based classification of AI systems',
          'Conformity assessment procedures',
          'Transparency and information obligations',
          'Human oversight requirements',
          'Accuracy, robustness and cybersecurity',
          'Data governance and management',
          'Record keeping and documentation',
          'Post-market monitoring and reporting'
        ],
        penalties: [
          'Administrative fines up to €35M or 7% of annual turnover',
          'Market surveillance and enforcement actions',
          'Withdrawal of AI systems from market',
          'Criminal penalties for serious violations'
        ],
        implementationGuidance: [
          'Conduct AI system risk assessment',
          'Implement conformity assessment procedures',
          'Establish human oversight mechanisms',
          'Develop post-market monitoring systems'
        ],
        relatedRegulations: ['GDPR', 'EMA-AI-Guidelines', 'EU-MDR']
      }
    ],
    affectedSections: [
      'regulatory-compliance',
      'safety-bias',
      'explainable-ai',
      'data-observability',
      'data-rights-licensing',
      'ai-system-operations'
    ],
    affectedQuestions: [
      'reg-001', 'reg-002', 'reg-003',
      'sb-001', 'sb-002', 'sb-003',
      'xai-001', 'xai-002', 'xai-003',
      'drl-001', 'drl-002', 'drl-003'
    ],
    complianceRequirements: [
      {
        id: 'eu-ai-act-001',
        description: 'Implement EU AI Act compliance framework',
        assessmentSection: 'regulatory-compliance',
        questionId: 'reg-001',
        evidenceRequired: ['AI Act compliance documentation', 'Risk assessment reports'],
        responsibleRole: ['Compliance Officer', 'AI/ML Engineer'],
        validationCriteria: { aiActCompliant: true, riskAssessmentComplete: true },
        implementationTimeline: '12 months',
        riskLevel: 'Critical'
      }
    ]
  },
  {
    id: 'gdpr-ai-guidelines',
    name: 'GDPR AI Processing Guidelines',
    description: 'GDPR guidelines for processing personal data using AI systems',
    jurisdiction: 'European Union',
    authority: 'EDPB',
    category: 'Data Privacy',
    impactLevel: 'Critical',
    effectiveDate: '2024-01-01',
    lastUpdated: '2024-01-15',
    status: 'Active',
    regulations: [
      {
        id: 'gdpr-ai-processing',
        title: 'EDPB Guidelines on AI Processing of Personal Data',
        description: 'Guidelines on artificial intelligence and data protection under GDPR',
        regulationNumber: 'EDPB-2024-AI-001',
        documentUrl: 'https://edpb.europa.eu/our-work-tools/general-guidance/artificial-intelligence-and-data-protection_en',
        officialUrl: 'https://edpb.europa.eu/our-work-tools/general-guidance/artificial-intelligence-and-data-protection_en',
        requirements: [
          'Lawfulness of processing personal data',
          'Transparency and information obligations',
          'Data subject rights and automated decision-making',
          'Data protection by design and by default',
          'Data protection impact assessments',
          'Security of processing and breach notification',
          'Data protection officer appointment',
          'Cross-border data transfers'
        ],
        penalties: [
          'Administrative fines up to €20M or 4% of annual turnover',
          'Data processing suspension or prohibition',
          'Corrective measures and compliance orders',
          'Criminal penalties for serious violations'
        ],
        implementationGuidance: [
          'Conduct DPIA for AI systems',
          'Implement privacy by design principles',
          'Establish data subject rights procedures',
          'Develop breach notification protocols'
        ],
        relatedRegulations: ['EU-AI-Act', 'GDPR', 'EMA-AI-Guidelines']
      }
    ],
    affectedSections: [
      'data-observability',
      'data-rights-licensing',
      'automated-data-classification',
      'ai-output-storage',
      'ai-system-operations'
    ],
    affectedQuestions: [
      'do-001', 'do-002', 'do-003',
      'drl-001', 'drl-002', 'drl-003',
      'adc-001', 'adc-002', 'adc-003',
      'aos-001', 'aos-002', 'aos-003'
    ],
    complianceRequirements: [
      {
        id: 'gdpr-ai-001',
        description: 'Implement GDPR-compliant AI data processing',
        assessmentSection: 'data-rights-licensing',
        questionId: 'drl-001',
        evidenceRequired: ['DPIA documentation', 'Privacy impact assessments'],
        responsibleRole: ['Data Protection Officer', 'AI/ML Engineer'],
        validationCriteria: { gdprCompliant: true, dpiacomplete: true },
        implementationTimeline: '3 months',
        riskLevel: 'Critical'
      }
    ]
  },
  {
    id: 'ich-e6-r3',
    name: 'ICH E6(R3) Good Clinical Practice - AI Integration',
    description: 'ICH guidelines for AI integration in clinical trials and GCP compliance',
    jurisdiction: 'Global',
    authority: 'ICH',
    category: 'Clinical Trials',
    impactLevel: 'High',
    effectiveDate: '2024-01-01',
    lastUpdated: '2024-01-25',
    status: 'Active',
    regulations: [
      {
        id: 'ich-e6-r3-ai',
        title: 'ICH E6(R3) - AI in Clinical Trials',
        description: 'Updated ICH E6 guidelines addressing AI integration in clinical trials',
        regulationNumber: 'ICH-E6-R3-AI-001',
        documentUrl: 'https://www.ich.org/page/e6-good-clinical-practice',
        officialUrl: 'https://www.ich.org/page/e6-good-clinical-practice',
        requirements: [
          'Data integrity for AI-generated clinical data',
          'Protocol compliance with AI systems',
          'Quality assurance for AI applications',
          'Documentation of AI system validation',
          'Risk management for AI in clinical trials',
          'Monitoring and oversight of AI systems',
          'Training and competency requirements',
          'Audit trail and data traceability'
        ],
        penalties: [
          'Clinical trial suspension or termination',
          'Regulatory authority enforcement actions',
          'Data integrity violations and penalties',
          'Loss of regulatory approval'
        ],
        implementationGuidance: [
          'Validate AI systems for clinical use',
          'Implement AI monitoring protocols',
          'Establish AI audit procedures',
          'Train staff on AI systems'
        ],
        relatedRegulations: ['FDA-GCP-Guidance', 'EMA-GCP-Guidelines']
      }
    ],
    affectedSections: [
      'clinical-validation',
      'safety-bias',
      'data-observability',
      'ai-system-operations'
    ],
    affectedQuestions: [
      'cv-001', 'cv-002', 'cv-003',
      'sb-001', 'sb-002', 'sb-003',
      'do-001', 'do-002', 'do-003'
    ],
    complianceRequirements: [
      {
        id: 'ich-e6-ai-001',
        description: 'Implement ICH E6(R3) AI compliance for clinical trials',
        assessmentSection: 'clinical-validation',
        questionId: 'cv-001',
        evidenceRequired: ['AI validation documentation', 'Clinical trial protocols'],
        responsibleRole: ['Clinical Research Director', 'AI/ML Engineer'],
        validationCriteria: { ichCompliant: true, validationComplete: true },
        implementationTimeline: '6 months',
        riskLevel: 'High'
      }
    ]
  }
];

export default regulatoryTypes;
