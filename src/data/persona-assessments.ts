import { Persona, SubPersona } from '@/types';

// Comprehensive question database organized by compliance areas
export const complianceQuestions = {
  // Executive Leadership Questions
  executiveGovernance: [
    {
      id: 'exec-gov-001',
      text: 'Has an AI Governance Committee been established with clear charter and responsibilities?',
      points: 8,
      isBlocker: true,
      category: 'AI Governance Committee',
      evidenceRequired: ['Governance charter document', 'Committee member list', 'Meeting minutes'],
      responsibleRole: ['CEO', 'CTO', 'Chief Compliance Officer'],
      personaRelevant: ['ceo-csuite', 'chief-medical', 'chief-compliance'],
      therapySpecific: false,
      aiModelTypeSpecific: false,
      deploymentScenarioSpecific: false
    },
    {
      id: 'exec-gov-002',
      text: 'Are there clear AI decision-making authorities and escalation paths defined?',
      points: 6,
      isBlocker: false,
      category: 'AI Governance Committee',
      evidenceRequired: ['Decision matrix document', 'Escalation procedures'],
      responsibleRole: ['CEO', 'CTO', 'Chief Compliance Officer'],
      personaRelevant: ['ceo-csuite', 'chief-compliance'],
      therapySpecific: false,
      aiModelTypeSpecific: false,
      deploymentScenarioSpecific: false
    }
  ],

  // Medical Leadership Questions
  medicalOversight: [
    {
      id: 'med-ov-001',
      text: 'Is there medical oversight for AI systems that impact patient care or clinical decisions?',
      points: 10,
      isBlocker: true,
      category: 'Clinical Validation',
      evidenceRequired: ['Medical oversight plan', 'Clinical decision support protocols'],
      responsibleRole: ['Chief Medical Officer', 'Medical Affairs Director'],
      personaRelevant: ['chief-medical', 'medical-affairs'],
      therapySpecific: true,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: true
    },
    {
      id: 'med-ov-002',
      text: 'Are clinical validation protocols established for AI-assisted diagnostic or treatment decisions?',
      points: 8,
      isBlocker: true,
      category: 'Clinical Validation',
      evidenceRequired: ['Clinical validation protocol', 'Validation study results'],
      responsibleRole: ['Chief Medical Officer', 'Clinical Operations Director'],
      personaRelevant: ['chief-medical', 'clinical-director'],
      therapySpecific: true,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: true
    }
  ],

  // Compliance Leadership Questions
  complianceOversight: [
    {
      id: 'comp-ov-001',
      text: 'Are comprehensive compliance frameworks established for AI regulatory requirements?',
      points: 8,
      isBlocker: true,
      category: 'Regulatory Compliance',
      evidenceRequired: ['Compliance framework document', 'Regulatory requirement matrix'],
      responsibleRole: ['Chief Compliance Officer', 'Regulatory Affairs Director'],
      personaRelevant: ['chief-compliance', 'regulatory-director'],
      therapySpecific: false,
      aiModelTypeSpecific: false,
      deploymentScenarioSpecific: false
    },
    {
      id: 'comp-ov-002',
      text: 'Is there a risk assessment process for AI compliance and regulatory risks?',
      points: 6,
      isBlocker: false,
      category: 'Risk Assessment',
      evidenceRequired: ['Risk assessment framework', 'Risk register', 'Mitigation plans'],
      responsibleRole: ['Chief Compliance Officer', 'Risk Management Director'],
      personaRelevant: ['chief-compliance', 'risk-specialist'],
      therapySpecific: false,
      aiModelTypeSpecific: false,
      deploymentScenarioSpecific: false
    }
  ],

  // AI/ML Engineering Questions
  aiDevelopment: [
    {
      id: 'ai-dev-001',
      text: 'Is there a comprehensive AI model validation framework following GMLP principles?',
      points: 10,
      isBlocker: true,
      category: 'AI Model Validation',
      evidenceRequired: ['GMLP validation framework', 'Model validation protocols'],
      responsibleRole: ['AI Head', 'ML Engineer', 'MLOps Engineer'],
      personaRelevant: ['ai-head-manager', 'ml-engineer', 'mlops-engineer'],
      therapySpecific: false,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: false
    },
    {
      id: 'ai-dev-002',
      text: 'Are AI models tested for bias, fairness, and clinical safety before deployment?',
      points: 8,
      isBlocker: true,
      category: 'Safety & Bias Detection',
      evidenceRequired: ['Bias testing results', 'Fairness assessment', 'Safety validation'],
      responsibleRole: ['ML Engineer', 'AI Specialist'],
      personaRelevant: ['ml-engineer'],
      therapySpecific: true,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: true
    }
  ],

  // Regulatory Affairs Questions
  regulatoryCompliance: [
    {
      id: 'reg-comp-001',
      text: 'Are FDA 2025 AI guidance requirements fully integrated into development processes?',
      points: 8,
      isBlocker: true,
      category: 'FDA 2025 Guidance',
      evidenceRequired: ['FDA guidance implementation plan', 'Compliance checklist'],
      responsibleRole: ['FDA Specialist', 'Regulatory Affairs Director'],
      personaRelevant: ['fda-specialist', 'regulatory-director'],
      therapySpecific: false,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: false
    },
    {
      id: 'reg-comp-002',
      text: 'Is international regulatory harmonization considered for global AI deployments?',
      points: 6,
      isBlocker: false,
      category: 'International Regulatory Harmonization',
      evidenceRequired: ['International compliance matrix', 'Harmonization strategy'],
      responsibleRole: ['International Regulatory Specialist', 'Regulatory Affairs Director'],
      personaRelevant: ['international-regulatory', 'regulatory-director'],
      therapySpecific: false,
      aiModelTypeSpecific: false,
      deploymentScenarioSpecific: true
    }
  ],

  // Quality Assurance Questions
  qualitySystems: [
    {
      id: 'qa-sys-001',
      text: 'Are quality management systems established for AI development and validation?',
      points: 8,
      isBlocker: true,
      category: 'Quality Assurance',
      evidenceRequired: ['QMS documentation', 'Quality procedures', 'Audit reports'],
      responsibleRole: ['Quality Assurance Director', 'Quality Manager'],
      personaRelevant: ['quality-director'],
      therapySpecific: false,
      aiModelTypeSpecific: false,
      deploymentScenarioSpecific: false
    },
    {
      id: 'qa-sys-002',
      text: 'Is there a comprehensive audit trail for AI model development and deployment?',
      points: 6,
      isBlocker: false,
      category: 'Quality Assurance',
      evidenceRequired: ['Audit trail documentation', 'Version control records'],
      responsibleRole: ['Quality Assurance Director', 'Audit Manager'],
      personaRelevant: ['quality-director', 'audit-manager'],
      therapySpecific: false,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: false
    }
  ],

  // Legal & Privacy Questions
  legalCompliance: [
    {
      id: 'legal-comp-001',
      text: 'Are legal liability frameworks established for AI system failures or errors?',
      points: 8,
      isBlocker: true,
      category: 'Legal Compliance & Liability',
      evidenceRequired: ['Liability framework document', 'Insurance coverage', 'Legal opinions'],
      responsibleRole: ['Legal Counsel', 'Legal Director'],
      personaRelevant: ['legal-counsel'],
      therapySpecific: true,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: true
    },
    {
      id: 'legal-comp-002',
      text: 'Is data privacy compliance ensured for AI systems processing personal health information?',
      points: 8,
      isBlocker: true,
      category: 'Data Privacy',
      evidenceRequired: ['Privacy impact assessment', 'Data processing agreements', 'Consent mechanisms'],
      responsibleRole: ['Privacy Officer', 'Data Protection Officer'],
      personaRelevant: ['privacy-officer'],
      therapySpecific: true,
      aiModelTypeSpecific: false,
      deploymentScenarioSpecific: true
    }
  ],

  // Clinical Operations Questions
  clinicalOps: [
    {
      id: 'clin-ops-001',
      text: 'Are clinical trial protocols updated to include AI system validation requirements?',
      points: 8,
      isBlocker: true,
      category: 'Clinical Trial Protocol Adherence',
      evidenceRequired: ['Updated trial protocols', 'AI validation requirements', 'Protocol amendments'],
      responsibleRole: ['Clinical Operations Director', 'Clinical Trial Manager'],
      personaRelevant: ['clinical-director'],
      therapySpecific: true,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: true
    },
    {
      id: 'clin-ops-002',
      text: 'Is pharmacovigilance enhanced to monitor AI system performance and safety signals?',
      points: 8,
      isBlocker: true,
      category: 'AI Pharmacovigilance',
      evidenceRequired: ['PV enhancement plan', 'AI monitoring protocols', 'Safety signal procedures'],
      responsibleRole: ['Pharmacovigilance Director', 'Safety Officer'],
      personaRelevant: ['pharmacovigilance'],
      therapySpecific: true,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: true
    }
  ],

  // Data & IT Governance Questions
  dataGovernance: [
    {
      id: 'data-gov-001',
      text: 'Are advanced data governance frameworks implemented for AI training and operational data?',
      points: 8,
      isBlocker: true,
      category: 'Advanced Data Governance',
      evidenceRequired: ['Data governance framework', 'Data classification scheme', 'Access controls'],
      responsibleRole: ['Chief Data Officer', 'Data Governance Director'],
      personaRelevant: ['data-officer'],
      therapySpecific: false,
      aiModelTypeSpecific: false,
      deploymentScenarioSpecific: false
    },
    {
      id: 'data-gov-002',
      text: 'Is information security and access control implemented for AI systems and data?',
      points: 8,
      isBlocker: true,
      category: 'Security & Access Control',
      evidenceRequired: ['Security framework', 'Access control matrix', 'Security assessments'],
      responsibleRole: ['IT Security Director', 'CISO'],
      personaRelevant: ['it-security'],
      therapySpecific: false,
      aiModelTypeSpecific: false,
      deploymentScenarioSpecific: false
    }
  ],

  // Technical Operations Questions
  technicalOps: [
    {
      id: 'tech-ops-001',
      text: 'Are system integration protocols established for AI system interoperability?',
      points: 6,
      isBlocker: false,
      category: 'AI System Interoperability',
      evidenceRequired: ['Integration protocols', 'Interoperability standards', 'Testing procedures'],
      responsibleRole: ['System Integration Manager', 'Integration Specialist'],
      personaRelevant: ['system-integration'],
      therapySpecific: false,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: true
    },
    {
      id: 'tech-ops-002',
      text: 'Is comprehensive technical documentation maintained for AI systems?',
      points: 4,
      isBlocker: false,
      category: 'Documentation',
      evidenceRequired: ['Technical documentation', 'User manuals', 'API documentation'],
      responsibleRole: ['Technical Writer', 'Documentation Specialist'],
      personaRelevant: ['technical-writer'],
      therapySpecific: false,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: false
    }
  ]
};

// Sub-persona specific question mapping
export const subPersonaQuestions = {
  // Executive Leadership Sub-Personas
  'ceo-csuite': [
    ...complianceQuestions.executiveGovernance.slice(0, 2),
    {
      id: 'ceo-strat-001',
      text: 'Is there a clear AI strategy aligned with business objectives and competitive positioning?',
      points: 10,
      isBlocker: true,
      category: 'Strategic Planning',
      evidenceRequired: ['AI strategy document', 'Business case', 'ROI projections'],
      responsibleRole: ['CEO', 'Board Members'],
      personaRelevant: ['ceo-csuite'],
      therapySpecific: false,
      aiModelTypeSpecific: false,
      deploymentScenarioSpecific: false
    }
  ],

  'chief-medical': [
    ...complianceQuestions.medicalOversight,
    {
      id: 'cmo-patientsafety-001',
      text: 'Are patient safety protocols established for AI-assisted clinical decisions?',
      points: 10,
      isBlocker: true,
      category: 'Patient Safety',
      evidenceRequired: ['Patient safety protocols', 'Clinical decision support guidelines'],
      responsibleRole: ['Chief Medical Officer'],
      personaRelevant: ['chief-medical'],
      therapySpecific: true,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: true
    }
  ],

  'chief-compliance': [
    ...complianceQuestions.complianceOversight,
    {
      id: 'cco-audit-001',
      text: 'Is there a comprehensive audit program for AI compliance monitoring?',
      points: 8,
      isBlocker: true,
      category: 'Audit Oversight',
      evidenceRequired: ['Audit program', 'Audit schedules', 'Audit reports'],
      responsibleRole: ['Chief Compliance Officer'],
      personaRelevant: ['chief-compliance'],
      therapySpecific: false,
      aiModelTypeSpecific: false,
      deploymentScenarioSpecific: false
    }
  ],

  // Data Science & AI Team Sub-Personas
  'ai-head-manager': [
    ...complianceQuestions.aiDevelopment.slice(0, 1),
    {
      id: 'ai-head-team-001',
      text: 'Is the AI team structure and governance aligned with regulatory requirements?',
      points: 8,
      isBlocker: true,
      category: 'Team Governance',
      evidenceRequired: ['Team structure document', 'Role definitions', 'Governance procedures'],
      responsibleRole: ['AI Head', 'AI Manager'],
      personaRelevant: ['ai-head-manager'],
      therapySpecific: false,
      aiModelTypeSpecific: false,
      deploymentScenarioSpecific: false
    },
    {
      id: 'ai-head-arch-001',
      text: 'Are technical architecture decisions documented and approved through governance?',
      points: 6,
      isBlocker: false,
      category: 'Technical Architecture',
      evidenceRequired: ['Architecture documentation', 'Decision records', 'Approval workflows'],
      responsibleRole: ['AI Head', 'Technical Director'],
      personaRelevant: ['ai-head-manager'],
      therapySpecific: false,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: false
    }
  ],

  'ml-engineer': [
    ...complianceQuestions.aiDevelopment.slice(1, 2),
    {
      id: 'ml-eng-model-001',
      text: 'Are machine learning models developed using validated algorithms and frameworks?',
      points: 8,
      isBlocker: true,
      category: 'Model Development',
      evidenceRequired: ['Algorithm validation', 'Framework documentation', 'Model specifications'],
      responsibleRole: ['ML Engineer', 'Deep Learning Engineer'],
      personaRelevant: ['ml-engineer'],
      therapySpecific: false,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: false
    },
    {
      id: 'ml-eng-validation-001',
      text: 'Is model validation performed using appropriate statistical methods and clinical relevance?',
      points: 8,
      isBlocker: true,
      category: 'Model Validation',
      evidenceRequired: ['Validation protocols', 'Statistical analysis', 'Clinical validation results'],
      responsibleRole: ['ML Engineer', 'NLP Engineer'],
      personaRelevant: ['ml-engineer'],
      therapySpecific: true,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: true
    }
  ],

  'mlops-engineer': [
    {
      id: 'mlops-deploy-001',
      text: 'Are AI models deployed using robust MLOps practices with monitoring and rollback capabilities?',
      points: 8,
      isBlocker: true,
      category: 'Model Deployment',
      evidenceRequired: ['MLOps framework', 'Deployment procedures', 'Monitoring systems'],
      responsibleRole: ['MLOps Engineer', 'DevOps Engineer'],
      personaRelevant: ['mlops-engineer'],
      therapySpecific: false,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: true
    },
    {
      id: 'mlops-monitor-001',
      text: 'Is continuous monitoring implemented for AI model performance and drift detection?',
      points: 6,
      isBlocker: false,
      category: 'Model Monitoring',
      evidenceRequired: ['Monitoring framework', 'Drift detection algorithms', 'Alert systems'],
      responsibleRole: ['MLOps Engineer', 'Platform Engineer'],
      personaRelevant: ['mlops-engineer'],
      therapySpecific: false,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: true
    }
  ],

  // Regulatory Affairs Sub-Personas
  'regulatory-director': [
    ...complianceQuestions.regulatoryCompliance.slice(0, 1),
    {
      id: 'reg-dir-strategy-001',
      text: 'Is there a comprehensive regulatory strategy for AI submissions and approvals?',
      points: 8,
      isBlocker: true,
      category: 'Regulatory Strategy',
      evidenceRequired: ['Regulatory strategy document', 'Submission timeline', 'Approval roadmap'],
      responsibleRole: ['Regulatory Affairs Director'],
      personaRelevant: ['regulatory-director'],
      therapySpecific: true,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: true
    }
  ],

  'fda-specialist': [
    ...complianceQuestions.regulatoryCompliance.slice(1, 2),
    {
      id: 'fda-guidance-001',
      text: 'Are FDA pre-submission meetings scheduled for AI-enabled medical products?',
      points: 6,
      isBlocker: false,
      category: 'FDA Interactions',
      evidenceRequired: ['Pre-submission meeting requests', 'FDA correspondence', 'Meeting minutes'],
      responsibleRole: ['FDA Specialist', 'FDA Liaison'],
      personaRelevant: ['fda-specialist'],
      therapySpecific: true,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: true
    }
  ],

  'international-regulatory': [
    ...complianceQuestions.regulatoryCompliance.slice(1, 2),
    {
      id: 'intl-harmon-001',
      text: 'Are international regulatory requirements harmonized for global AI deployments?',
      points: 6,
      isBlocker: false,
      category: 'International Harmonization',
      evidenceRequired: ['Harmonization strategy', 'Country-specific requirements', 'Compliance matrix'],
      responsibleRole: ['International Regulatory Specialist', 'EMA Specialist'],
      personaRelevant: ['international-regulatory'],
      therapySpecific: false,
      aiModelTypeSpecific: false,
      deploymentScenarioSpecific: true
    }
  ],

  // Quality Assurance Sub-Personas
  'quality-director': [
    ...complianceQuestions.qualitySystems.slice(0, 1),
    {
      id: 'qa-dir-gmlp-001',
      text: 'Is the GMLP framework fully integrated into quality management systems?',
      points: 8,
      isBlocker: true,
      category: 'GMLP Framework',
      evidenceRequired: ['GMLP implementation plan', 'Quality procedures', 'Training records'],
      responsibleRole: ['Quality Assurance Director'],
      personaRelevant: ['quality-director'],
      therapySpecific: false,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: false
    }
  ],

  'risk-specialist': [
    ...complianceQuestions.qualitySystems.slice(1, 2),
    {
      id: 'risk-ai-001',
      text: 'Are AI-specific risks identified and assessed using appropriate risk management frameworks?',
      points: 8,
      isBlocker: true,
      category: 'AI Risk Assessment',
      evidenceRequired: ['Risk assessment framework', 'Risk register', 'Mitigation strategies'],
      responsibleRole: ['Risk Management Specialist', 'Risk Analyst'],
      personaRelevant: ['risk-specialist'],
      therapySpecific: true,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: true
    }
  ],

  'audit-manager': [
    ...complianceQuestions.qualitySystems.slice(1, 2),
    {
      id: 'audit-compliance-001',
      text: 'Are regular compliance audits conducted for AI systems and processes?',
      points: 6,
      isBlocker: false,
      category: 'Compliance Auditing',
      evidenceRequired: ['Audit schedules', 'Audit procedures', 'Audit reports'],
      responsibleRole: ['Audit Manager', 'Compliance Auditor'],
      personaRelevant: ['audit-manager'],
      therapySpecific: false,
      aiModelTypeSpecific: false,
      deploymentScenarioSpecific: false
    }
  ],

  // Legal & Privacy Sub-Personas
  'legal-counsel': [
    ...complianceQuestions.legalCompliance.slice(0, 1),
    {
      id: 'legal-liability-001',
      text: 'Are liability frameworks and insurance coverage established for AI system failures?',
      points: 8,
      isBlocker: true,
      category: 'Liability Management',
      evidenceRequired: ['Liability framework', 'Insurance policies', 'Legal opinions'],
      responsibleRole: ['Legal Counsel', 'Senior Legal Counsel'],
      personaRelevant: ['legal-counsel'],
      therapySpecific: true,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: true
    }
  ],

  'privacy-officer': [
    ...complianceQuestions.legalCompliance.slice(1, 2),
    {
      id: 'privacy-dpa-001',
      text: 'Are data processing agreements and consent mechanisms established for AI systems?',
      points: 8,
      isBlocker: true,
      category: 'Data Processing Agreements',
      evidenceRequired: ['DPAs', 'Consent forms', 'Privacy notices'],
      responsibleRole: ['Privacy Officer', 'Data Protection Officer'],
      personaRelevant: ['privacy-officer'],
      therapySpecific: true,
      aiModelTypeSpecific: false,
      deploymentScenarioSpecific: true
    }
  ],

  'compliance-manager': [
    ...complianceQuestions.legalCompliance.slice(1, 2),
    {
      id: 'comp-thirdparty-001',
      text: 'Are third-party AI vendors and partners assessed for compliance risks?',
      points: 6,
      isBlocker: false,
      category: 'Third-Party Risk',
      evidenceRequired: ['Vendor assessment procedures', 'Risk assessments', 'Contract templates'],
      responsibleRole: ['Compliance Manager', 'Compliance Officer'],
      personaRelevant: ['compliance-manager'],
      therapySpecific: false,
      aiModelTypeSpecific: false,
      deploymentScenarioSpecific: false
    }
  ],

  // Clinical Operations Sub-Personas
  'clinical-director': [
    ...complianceQuestions.clinicalOps.slice(0, 1),
    {
      id: 'clin-ops-protocol-001',
      text: 'Are clinical trial protocols updated to include AI system validation and monitoring?',
      points: 8,
      isBlocker: true,
      category: 'Clinical Protocol Updates',
      evidenceRequired: ['Updated protocols', 'AI validation requirements', 'Monitoring procedures'],
      responsibleRole: ['Clinical Operations Director'],
      personaRelevant: ['clinical-director'],
      therapySpecific: true,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: true
    }
  ],

  'medical-affairs': [
    ...complianceQuestions.clinicalOps.slice(0, 1),
    {
      id: 'med-affairs-support-001',
      text: 'Is clinical decision support properly integrated with AI systems and validated?',
      points: 8,
      isBlocker: true,
      category: 'Clinical Decision Support',
      evidenceRequired: ['CDS integration plan', 'Validation protocols', 'User training'],
      responsibleRole: ['Medical Affairs Director'],
      personaRelevant: ['medical-affairs'],
      therapySpecific: true,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: true
    }
  ],

  'pharmacovigilance': [
    ...complianceQuestions.clinicalOps.slice(1, 2),
    {
      id: 'pv-ai-monitoring-001',
      text: 'Are AI system performance and safety signals integrated into pharmacovigilance processes?',
      points: 8,
      isBlocker: true,
      category: 'AI Safety Monitoring',
      evidenceRequired: ['PV enhancement plan', 'AI monitoring protocols', 'Signal detection procedures'],
      responsibleRole: ['Pharmacovigilance Director', 'Safety Officer'],
      personaRelevant: ['pharmacovigilance'],
      therapySpecific: true,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: true
    }
  ],

  // Data & IT Governance Sub-Personas
  'data-officer': [
    ...complianceQuestions.dataGovernance.slice(0, 1),
    {
      id: 'data-officer-strategy-001',
      text: 'Is there a comprehensive data strategy aligned with AI governance requirements?',
      points: 8,
      isBlocker: true,
      category: 'Data Strategy',
      evidenceRequired: ['Data strategy document', 'Governance framework', 'Data catalog'],
      responsibleRole: ['Chief Data Officer'],
      personaRelevant: ['data-officer'],
      therapySpecific: false,
      aiModelTypeSpecific: false,
      deploymentScenarioSpecific: false
    }
  ],

  'it-security': [
    ...complianceQuestions.dataGovernance.slice(1, 2),
    {
      id: 'it-sec-ai-001',
      text: 'Are AI systems and data protected with appropriate security controls and monitoring?',
      points: 8,
      isBlocker: true,
      category: 'AI Security',
      evidenceRequired: ['Security framework', 'Access controls', 'Security monitoring'],
      responsibleRole: ['IT Security Director', 'CISO'],
      personaRelevant: ['it-security'],
      therapySpecific: false,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: false
    }
  ],

  'system-architect': [
    ...complianceQuestions.dataGovernance.slice(1, 2),
    {
      id: 'sys-arch-interop-001',
      text: 'Are AI systems designed for interoperability with existing healthcare IT infrastructure?',
      points: 6,
      isBlocker: false,
      category: 'System Interoperability',
      evidenceRequired: ['Interoperability standards', 'Integration protocols', 'System architecture'],
      responsibleRole: ['System Architect', 'Integration Specialist'],
      personaRelevant: ['system-architect'],
      therapySpecific: false,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: true
    }
  ],

  // Technical Operations Sub-Personas
  'system-integration': [
    ...complianceQuestions.technicalOps.slice(0, 1),
    {
      id: 'sys-int-ops-001',
      text: 'Are AI system operations and maintenance procedures established and documented?',
      points: 6,
      isBlocker: false,
      category: 'System Operations',
      evidenceRequired: ['Operations procedures', 'Maintenance schedules', 'Incident response'],
      responsibleRole: ['System Integration Manager', 'Operations Manager'],
      personaRelevant: ['system-integration'],
      therapySpecific: false,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: true
    }
  ],

  'technical-writer': [
    ...complianceQuestions.technicalOps.slice(1, 2),
    {
      id: 'tech-writer-knowledge-001',
      text: 'Is comprehensive knowledge management established for AI system documentation?',
      points: 4,
      isBlocker: false,
      category: 'Knowledge Management',
      evidenceRequired: ['Documentation standards', 'Knowledge base', 'Training materials'],
      responsibleRole: ['Technical Writer', 'Knowledge Manager'],
      personaRelevant: ['technical-writer'],
      therapySpecific: false,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: false
    }
  ],

  'training-manager': [
    {
      id: 'train-adoption-001',
      text: 'Are comprehensive training programs established for AI system adoption and usage?',
      points: 6,
      isBlocker: false,
      category: 'Training & Adoption',
      evidenceRequired: ['Training curriculum', 'User manuals', 'Competency assessments'],
      responsibleRole: ['Training Manager', 'Learning Manager'],
      personaRelevant: ['training-manager'],
      therapySpecific: false,
      aiModelTypeSpecific: true,
      deploymentScenarioSpecific: true
    },
    {
      id: 'train-change-001',
      text: 'Is change management integrated into AI system deployment and adoption?',
      points: 4,
      isBlocker: false,
      category: 'Change Management',
      evidenceRequired: ['Change management plan', 'Communication strategy', 'Adoption metrics'],
      responsibleRole: ['Training Manager', 'User Adoption Specialist'],
      personaRelevant: ['training-manager'],
      therapySpecific: false,
      aiModelTypeSpecific: false,
      deploymentScenarioSpecific: true
    }
  ]
};

// Function to get questions for a specific sub-persona
export function getQuestionsForSubPersona(subPersonaId: string) {
  return subPersonaQuestions[subPersonaId as keyof typeof subPersonaQuestions] || [];
}

// Function to get all questions for a main persona
export function getQuestionsForPersona(personaId: string) {
  const personaSubPersonas = {
    'executive-leadership': ['ceo-csuite', 'chief-medical', 'chief-compliance'],
    'data-science-ai': ['ai-head-manager', 'ml-engineer', 'mlops-engineer'],
    'regulatory-affairs': ['regulatory-director', 'fda-specialist', 'international-regulatory'],
    'quality-risk': ['quality-director', 'risk-specialist', 'audit-manager'],
    'legal-privacy': ['legal-counsel', 'privacy-officer', 'compliance-manager'],
    'clinical-operations': ['clinical-director', 'medical-affairs', 'pharmacovigilance'],
    'data-it-governance': ['data-officer', 'it-security', 'system-architect'],
    'technical-operations': ['system-integration', 'technical-writer', 'training-manager']
  };

  const subPersonaIds = personaSubPersonas[personaId as keyof typeof personaSubPersonas] || [];
  const allQuestions = [];

  for (const subPersonaId of subPersonaIds) {
    const questions = getQuestionsForSubPersona(subPersonaId);
    allQuestions.push(...questions);
  }

  return allQuestions;
}

// Progress tracking configuration
export const progressTrackingConfig = {
  milestones: [
    { id: 'started', label: 'Assessment Started', threshold: 0 },
    { id: 'quarter', label: '25% Complete', threshold: 25 },
    { id: 'half', label: '50% Complete', threshold: 50 },
    { id: 'three-quarters', label: '75% Complete', threshold: 75 },
    { id: 'completed', label: 'Assessment Complete', threshold: 100 }
  ],
  categories: [
    'AI Governance Committee',
    'Regulatory Compliance',
    'AI Model Validation',
    'Clinical Validation',
    'Quality Assurance',
    'Risk Assessment',
    'Data Privacy',
    'Security & Access Control',
    'Documentation',
    'Training & Adoption'
  ]
};
