import { TherapeuticArea, AIModelType, DeploymentScenario } from '@/types';

export const therapeuticAreas: TherapeuticArea[] = [
  { id: 'oncology', name: 'Oncology', complexity: 20, description: 'Cancer treatment and research' },
  { id: 'cardiology', name: 'Cardiology', complexity: 18, description: 'Heart and cardiovascular diseases' },
  { id: 'neurology', name: 'Neurology', complexity: 16, description: 'Brain and nervous system disorders' },
  { id: 'rare_disease', name: 'Rare Disease', complexity: 15, description: 'Orphan diseases and conditions' },
  { id: 'infectious_disease', name: 'Infectious Disease', complexity: 12, description: 'Bacterial, viral, and parasitic infections' },
  { id: 'mental_health', name: 'Mental Health', complexity: 14, description: 'Psychiatric and psychological conditions' },
  { id: 'pediatrics', name: 'Pediatrics', complexity: 13, description: 'Medical care for infants, children, and adolescents' },
  { id: 'emergency_medicine', name: 'Emergency Medicine', complexity: 17, description: 'Acute medical conditions requiring immediate attention' },
  { id: 'dermatology', name: 'Dermatology', complexity: 10, description: 'Skin, hair, and nail conditions' },
  { id: 'ophthalmology', name: 'Ophthalmology', complexity: 10, description: 'Eye and vision disorders' },
];

export const aiModelTypes: AIModelType[] = [
  { id: 'traditional_ml', name: 'Traditional AI/ML', complexity: 8, description: 'Classical machine learning algorithms' },
  { id: 'computer_vision', name: 'Computer Vision AI', complexity: 12, description: 'Image and video analysis AI' },
  { id: 'nlp', name: 'Natural Language Processing', complexity: 10, description: 'Text and language understanding AI' },
  { id: 'generative_ai', name: 'Generative AI (GenAI)', complexity: 15, description: 'AI that creates new content' },
  { id: 'agentic_ai', name: 'Agentic AI', complexity: 20, description: 'Autonomous AI agents that can act independently' },
  { id: 'multimodal_ai', name: 'Multimodal AI', complexity: 18, description: 'AI that processes multiple data types' },
  { id: 'federated_learning', name: 'Federated Learning', complexity: 16, description: 'Distributed learning across multiple sites' },
  { id: 'edge_ai', name: 'Edge AI', complexity: 14, description: 'AI processing at the edge of networks' },
];

export const deploymentScenarios: DeploymentScenario[] = [
  { id: 'clinical_trial', name: 'Clinical Trial Support', complexity: 12, description: 'AI supporting clinical research' },
  { id: 'diagnostic_aid', name: 'Diagnostic Aid', complexity: 18, description: 'AI assisting in medical diagnosis' },
  { id: 'drug_discovery', name: 'Drug Discovery', complexity: 15, description: 'AI in pharmaceutical research' },
  { id: 'patient_monitoring', name: 'Patient Monitoring', complexity: 10, description: 'Continuous patient health tracking' },
  { id: 'regulatory_submission', name: 'Regulatory Submission', complexity: 14, description: 'AI supporting regulatory processes' },
  { id: 'post_market', name: 'Post-Market Surveillance', complexity: 8, description: 'Ongoing safety monitoring' },
];

export const sampleCompanies = [
  {
    id: 'gilead',
    name: 'Gilead Sciences',
    industryType: 'Biotechnology',
    therapeuticFocus: ['oncology', 'infectious_disease'],
    aiInitiatives: ['drug_discovery', 'clinical_trial']
  },
  {
    id: 'genentech',
    name: 'Genentech',
    industryType: 'Biotechnology',
    therapeuticFocus: ['oncology', 'neurology'],
    aiInitiatives: ['diagnostic_aid', 'drug_discovery']
  },
  {
    id: 'exelixis',
    name: 'Exelixis',
    industryType: 'Biotechnology',
    therapeuticFocus: ['oncology'],
    aiInitiatives: ['drug_discovery', 'clinical_trial']
  },
  {
    id: 'abbvie',
    name: 'AbbVie',
    industryType: 'Pharmaceutical',
    therapeuticFocus: ['oncology', 'mental_health'],
    aiInitiatives: ['drug_discovery', 'patient_monitoring']
  }
];

export const sampleQuestions = [
  {
    id: 'data_privacy_compliance',
    sectionTitle: 'Data Privacy & Protection',
    questionText: 'Does your AI system comply with GDPR, HIPAA, and other relevant data protection regulations?',
    questionType: 'boolean' as const,
    isBlocker: true,
    points: 25,
    evidenceRequired: ['Privacy Impact Assessment', 'Data Processing Agreements', 'Compliance Certificates'],
    responsibleRoles: ['Data Protection Officer', 'Legal Counsel', 'IT Security'],
    guidance: {
      explanation: 'Data privacy compliance is critical for pharmaceutical AI systems that handle patient data.',
      howToValidate: [
        'Conduct a comprehensive privacy impact assessment',
        'Review all data processing agreements',
        'Ensure proper consent mechanisms are in place',
        'Verify data anonymization techniques'
      ],
      commonPitfalls: [
        'Insufficient data anonymization',
        'Missing consent documentation',
        'Inadequate data retention policies'
      ],
      regulatoryCitations: [
        'GDPR Article 25 - Data Protection by Design',
        'HIPAA Privacy Rule 45 CFR 164.502',
        'FDA Guidance on Clinical Decision Support Software'
      ],
      examples: [
        'Implement differential privacy techniques',
        'Use federated learning approaches',
        'Establish clear data minimization policies'
      ]
    }
  },
  {
    id: 'bias_detection',
    sectionTitle: 'Bias Detection & Mitigation',
    questionText: 'Have you implemented comprehensive bias detection and mitigation strategies for your AI model?',
    questionType: 'boolean' as const,
    isBlocker: false,
    points: 20,
    evidenceRequired: ['Bias Assessment Report', 'Mitigation Strategy Document', 'Testing Results'],
    responsibleRoles: ['AI/ML Engineer', 'Clinical Statistician', 'Ethics Committee'],
    guidance: {
      explanation: 'Bias detection is essential to ensure AI systems work fairly across different patient populations.',
      howToValidate: [
        'Test model performance across demographic groups',
        'Implement bias detection algorithms',
        'Document mitigation strategies',
        'Conduct regular bias audits'
      ],
      commonPitfalls: [
        'Insufficient demographic representation in training data',
        'Lack of ongoing bias monitoring',
        'Inadequate documentation of bias mitigation efforts'
      ],
      regulatoryCitations: [
        'FDA Guidance on AI/ML in Medical Devices',
        'EMA Reflection Paper on AI in Medicine',
        'WHO Ethics and Governance of AI for Health'
      ],
      examples: [
        'Use demographic parity metrics',
        'Implement adversarial debiasing techniques',
        'Regular performance monitoring across subgroups'
      ]
    }
  },
  {
    id: 'model_validation',
    sectionTitle: 'Model Validation & Verification',
    questionText: 'Describe your AI model validation and verification processes, including testing methodologies.',
    questionType: 'text' as const,
    isBlocker: false,
    points: 15,
    evidenceRequired: ['Validation Protocol', 'Test Results', 'Statistical Analysis'],
    responsibleRoles: ['AI/ML Engineer', 'Clinical Statistician', 'Quality Assurance'],
    guidance: {
      explanation: 'Robust validation ensures AI models perform reliably in real-world clinical settings.',
      howToValidate: [
        'Implement cross-validation techniques',
        'Conduct prospective validation studies',
        'Perform sensitivity and specificity analysis',
        'Document validation methodology'
      ],
      commonPitfalls: [
        'Insufficient validation dataset size',
        'Data leakage between training and validation sets',
        'Lack of external validation'
      ],
      regulatoryCitations: [
        'ICH E6 R2 - Good Clinical Practice',
        'FDA Guidance on Software as Medical Device',
        'ISO 13485 - Medical Device Quality Management'
      ],
      examples: [
        'Use stratified cross-validation',
        'Implement temporal validation for time-series data',
        'Conduct multi-site validation studies'
      ]
    }
  }
];
