/**
 * Historical Legislations Repository - ComplianceIQ System
 * Complete repository of all AI-related regulations across all jurisdictions
 * Organized by timeline, jurisdiction, and assessment status
 */

export interface HistoricalLegislation {
  id: string;
  title: string;
  description: string;
  jurisdiction: string;
  authority: string;
  category: 'AI/ML' | 'Data Privacy' | 'Clinical Trials' | 'Drug Safety' | 'Quality Assurance' | 'Medical Devices' | 'General';
  subcategory: string;
  effectiveDate: string;
  lastUpdated: string;
  status: 'Active' | 'Superseded' | 'Draft' | 'Proposed' | 'Withdrawn';
  supersededBy?: string;
  documentUrl: string;
  officialUrl: string;
  isPartOfAssessment: boolean;
  assessmentSections: string[];
  impactLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  requirements: string[];
  penalties: string[];
  implementationGuidance: string[];
  relatedLegislations: string[];
  timeline: {
    proposed: string;
    draft: string;
    effective: string;
    lastAmendment: string;
  };
  geographicScope: string[];
  industryScope: string[];
  aiModelTypes: string[];
  deploymentScenarios: string[];
  therapeuticAreas: string[];
}

// Comprehensive Historical Legislations Repository
export const historicalLegislations: HistoricalLegislation[] = [
  // FDA Historical Legislations
  {
    id: 'fda-21cfr820-1996',
    title: 'FDA 21 CFR Part 820 - Quality System Regulation',
    description: 'FDA Quality System Regulation for medical devices, including software and AI systems',
    jurisdiction: 'United States',
    authority: 'FDA',
    category: 'Quality Assurance',
    subcategory: 'Medical Devices',
    effectiveDate: '1996-06-01',
    lastUpdated: '2023-01-15',
    status: 'Active',
    documentUrl: 'https://www.fda.gov/media/110822/download',
    officialUrl: 'https://www.fda.gov/medical-devices/quality-systems-qs-regulation/medical-device-quality-systems-manual',
    isPartOfAssessment: true,
    assessmentSections: ['quality-assurance', 'technical-infrastructure'],
    impactLevel: 'Critical',
    requirements: [
      'Quality management system implementation',
      'Design controls for software systems',
      'Risk management procedures',
      'Documentation and record keeping',
      'Corrective and preventive actions'
    ],
    penalties: [
      'Warning letters for non-compliance',
      'Import alerts for foreign manufacturers',
      'Civil monetary penalties up to $1.1M per violation',
      'Criminal penalties for willful violations'
    ],
    implementationGuidance: [
      'Follow ISO 13485 quality management system',
      'Implement design controls per FDA guidance',
      'Establish risk management procedures',
      'Maintain comprehensive documentation'
    ],
    relatedLegislations: ['FDA-21CFR11', 'FDA-SaMD-Guidance'],
    timeline: {
      proposed: '1995-03-01',
      draft: '1995-09-01',
      effective: '1996-06-01',
      lastAmendment: '2023-01-15'
    },
    geographicScope: ['United States'],
    industryScope: ['Medical Devices', 'Pharmaceuticals', 'Biotechnology'],
    aiModelTypes: ['Traditional AI/ML', 'Computer Vision AI', 'Natural Language Processing'],
    deploymentScenarios: ['Clinical Decision Support', 'Medical Devices', 'Quality Control'],
    therapeuticAreas: ['General', 'Oncology', 'Cardiology', 'Neurology']
  },
  {
    id: 'fda-21cfr11-1997',
    title: 'FDA 21 CFR Part 11 - Electronic Records and Signatures',
    description: 'FDA regulation for electronic records and electronic signatures in pharmaceutical and medical device industries',
    jurisdiction: 'United States',
    authority: 'FDA',
    category: 'Data Privacy',
    subcategory: 'Electronic Records',
    effectiveDate: '1997-08-20',
    lastUpdated: '2021-03-15',
    status: 'Active',
    documentUrl: 'https://www.fda.gov/media/75414/download',
    officialUrl: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/part-11-electronic-records-electronic-signatures-scope-and-application',
    isPartOfAssessment: true,
    assessmentSections: ['data-observability', 'ai-output-storage'],
    impactLevel: 'High',
    requirements: [
      'Electronic record integrity and authenticity',
      'Electronic signature authentication',
      'Audit trail maintenance',
      'System validation and documentation',
      'Access controls and security measures'
    ],
    penalties: [
      'Warning letters for non-compliance',
      'Data integrity violations',
      'Regulatory action and enforcement',
      'Civil monetary penalties'
    ],
    implementationGuidance: [
      'Implement electronic signature authentication',
      'Maintain comprehensive audit trails',
      'Validate electronic record systems',
      'Establish access controls'
    ],
    relatedLegislations: ['FDA-21CFR820', 'FDA-Data-Integrity-Guidance'],
    timeline: {
      proposed: '1996-02-01',
      draft: '1996-08-01',
      effective: '1997-08-20',
      lastAmendment: '2021-03-15'
    },
    geographicScope: ['United States'],
    industryScope: ['Pharmaceuticals', 'Medical Devices', 'Biotechnology'],
    aiModelTypes: ['Traditional AI/ML', 'Natural Language Processing'],
    deploymentScenarios: ['Clinical Trial Operations', 'Regulatory Submission', 'Quality Control'],
    therapeuticAreas: ['General']
  },
  {
    id: 'fda-samd-guidance-2019',
    title: 'FDA Software as a Medical Device (SaMD) Guidance',
    description: 'FDA guidance on Software as a Medical Device including AI/ML applications',
    jurisdiction: 'United States',
    authority: 'FDA',
    category: 'AI/ML',
    subcategory: 'Medical Devices',
    effectiveDate: '2019-09-27',
    lastUpdated: '2023-09-27',
    status: 'Active',
    documentUrl: 'https://www.fda.gov/media/109618/download',
    officialUrl: 'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device',
    isPartOfAssessment: true,
    assessmentSections: ['regulatory-compliance', 'clinical-validation', 'explainable-ai'],
    impactLevel: 'Critical',
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
    relatedLegislations: ['FDA-GMLP-Guidance', 'FDA-Cybersecurity-Guidance'],
    timeline: {
      proposed: '2018-03-01',
      draft: '2019-01-01',
      effective: '2019-09-27',
      lastAmendment: '2023-09-27'
    },
    geographicScope: ['United States'],
    industryScope: ['Medical Devices', 'Software', 'AI/ML'],
    aiModelTypes: ['Traditional AI/ML', 'Computer Vision AI', 'Natural Language Processing', 'Generative AI'],
    deploymentScenarios: ['Clinical Decision Support', 'Medical Devices', 'Diagnostic Tools'],
    therapeuticAreas: ['General', 'Oncology', 'Cardiology', 'Neurology', 'Radiology']
  },
  {
    id: 'fda-gmlp-guidance-2021',
    title: 'FDA Good Machine Learning Practice (GMLP) for Medical Device Development',
    description: 'FDA guidance on Good Machine Learning Practice for medical device development and validation',
    jurisdiction: 'United States',
    authority: 'FDA',
    category: 'AI/ML',
    subcategory: 'Medical Devices',
    effectiveDate: '2021-10-27',
    lastUpdated: '2023-01-15',
    status: 'Active',
    documentUrl: 'https://www.fda.gov/media/109618/download',
    officialUrl: 'https://www.fda.gov/medical-devices/software-medical-device-samd/good-machine-learning-practice-medical-device-development',
    isPartOfAssessment: true,
    assessmentSections: ['regulatory-compliance', 'clinical-validation', 'safety-bias', 'explainable-ai'],
    impactLevel: 'Critical',
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
    relatedLegislations: ['FDA-SaMD-Guidance', 'FDA-Clinical-Validation-Guidance'],
    timeline: {
      proposed: '2020-01-01',
      draft: '2021-04-01',
      effective: '2021-10-27',
      lastAmendment: '2023-01-15'
    },
    geographicScope: ['United States'],
    industryScope: ['Medical Devices', 'AI/ML', 'Software'],
    aiModelTypes: ['Traditional AI/ML', 'Computer Vision AI', 'Natural Language Processing', 'Generative AI', 'Agentic AI'],
    deploymentScenarios: ['Clinical Decision Support', 'Medical Devices', 'Diagnostic Tools', 'Therapeutic Applications'],
    therapeuticAreas: ['General', 'Oncology', 'Cardiology', 'Neurology', 'Radiology', 'Pathology']
  },

  // EU Historical Legislations
  {
    id: 'eu-mdr-2017',
    title: 'EU Medical Device Regulation (MDR) 2017/745',
    description: 'EU regulation on medical devices including software and AI systems',
    jurisdiction: 'European Union',
    authority: 'European Commission',
    category: 'Medical Devices',
    subcategory: 'General',
    effectiveDate: '2021-05-26',
    lastUpdated: '2023-03-15',
    status: 'Active',
    documentUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32017R0745',
    officialUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32017R0745',
    isPartOfAssessment: true,
    assessmentSections: ['regulatory-compliance', 'clinical-validation', 'quality-assurance'],
    impactLevel: 'Critical',
    requirements: [
      'Clinical evaluation and clinical investigation',
      'Post-market surveillance and vigilance',
      'Quality management system',
      'Risk management and risk-benefit analysis',
      'Technical documentation and conformity assessment'
    ],
    penalties: [
      'Administrative fines up to €5M or 4% of annual turnover',
      'Market surveillance and enforcement actions',
      'Withdrawal of medical devices from market',
      'Criminal penalties for serious violations'
    ],
    implementationGuidance: [
      'Implement quality management system per ISO 13485',
      'Conduct clinical evaluation per MEDDEV 2.7/1',
      'Establish post-market surveillance system',
      'Maintain technical documentation'
    ],
    relatedLegislations: ['EU-IVDR-2017', 'EU-AI-Act'],
    timeline: {
      proposed: '2012-09-01',
      draft: '2016-06-01',
      effective: '2021-05-26',
      lastAmendment: '2023-03-15'
    },
    geographicScope: ['European Union', 'EEA'],
    industryScope: ['Medical Devices', 'Software', 'AI/ML'],
    aiModelTypes: ['Traditional AI/ML', 'Computer Vision AI', 'Natural Language Processing'],
    deploymentScenarios: ['Clinical Decision Support', 'Medical Devices', 'Diagnostic Tools'],
    therapeuticAreas: ['General', 'Oncology', 'Cardiology', 'Neurology']
  },
  {
    id: 'gdpr-2016',
    title: 'EU General Data Protection Regulation (GDPR) 2016/679',
    description: 'EU regulation on data protection and privacy, including AI processing of personal data',
    jurisdiction: 'European Union',
    authority: 'European Commission',
    category: 'Data Privacy',
    subcategory: 'General',
    effectiveDate: '2018-05-25',
    lastUpdated: '2023-01-15',
    status: 'Active',
    documentUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679',
    officialUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679',
    isPartOfAssessment: true,
    assessmentSections: ['data-observability', 'data-rights-licensing', 'automated-data-classification'],
    impactLevel: 'Critical',
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
    relatedLegislations: ['EU-AI-Act', 'GDPR-AI-Guidelines'],
    timeline: {
      proposed: '2012-01-01',
      draft: '2016-04-01',
      effective: '2018-05-25',
      lastAmendment: '2023-01-15'
    },
    geographicScope: ['European Union', 'EEA', 'Global (extraterritorial)'],
    industryScope: ['All Industries', 'AI/ML', 'Software', 'Healthcare'],
    aiModelTypes: ['Traditional AI/ML', 'Computer Vision AI', 'Natural Language Processing', 'Generative AI', 'Agentic AI'],
    deploymentScenarios: ['All Scenarios'],
    therapeuticAreas: ['All Therapeutic Areas']
  },
  {
    id: 'eu-ai-act-2024',
    title: 'EU AI Act - Artificial Intelligence Act 2024/...',
    description: 'Comprehensive EU regulation on artificial intelligence systems with risk-based approach',
    jurisdiction: 'European Union',
    authority: 'European Commission',
    category: 'AI/ML',
    subcategory: 'General',
    effectiveDate: '2024-08-02',
    lastUpdated: '2024-01-20',
    status: 'Active',
    documentUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52021PC0206',
    officialUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52021PC0206',
    isPartOfAssessment: true,
    assessmentSections: ['regulatory-compliance', 'safety-bias', 'explainable-ai', 'data-observability'],
    impactLevel: 'Critical',
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
    relatedLegislations: ['GDPR', 'EU-MDR-2017', 'EMA-AI-Guidelines'],
    timeline: {
      proposed: '2021-04-01',
      draft: '2023-06-01',
      effective: '2024-08-02',
      lastAmendment: '2024-01-20'
    },
    geographicScope: ['European Union', 'EEA'],
    industryScope: ['All Industries', 'AI/ML', 'Software', 'Healthcare'],
    aiModelTypes: ['Traditional AI/ML', 'Computer Vision AI', 'Natural Language Processing', 'Generative AI', 'Agentic AI'],
    deploymentScenarios: ['All Scenarios'],
    therapeuticAreas: ['All Therapeutic Areas']
  },

  // ICH Historical Legislations
  {
    id: 'ich-e6-r2-2016',
    title: 'ICH E6(R2) Good Clinical Practice - Consolidated Guideline',
    description: 'International guideline for Good Clinical Practice in clinical trials',
    jurisdiction: 'Global',
    authority: 'ICH',
    category: 'Clinical Trials',
    subcategory: 'General',
    effectiveDate: '2016-11-09',
    lastUpdated: '2023-01-15',
    status: 'Superseded',
    supersededBy: 'ich-e6-r3-2024',
    documentUrl: 'https://www.ich.org/page/e6-guidelines',
    officialUrl: 'https://www.ich.org/page/e6-guidelines',
    isPartOfAssessment: false,
    assessmentSections: ['clinical-validation'],
    impactLevel: 'High',
    requirements: [
      'Clinical trial protocol development',
      'Informed consent procedures',
      'Data collection and management',
      'Monitoring and auditing',
      'Safety reporting and pharmacovigilance'
    ],
    penalties: [
      'Clinical trial suspension or termination',
      'Regulatory authority enforcement actions',
      'Data integrity violations and penalties',
      'Loss of regulatory approval'
    ],
    implementationGuidance: [
      'Develop comprehensive clinical trial protocols',
      'Implement data management systems',
      'Establish monitoring and auditing procedures',
      'Train staff on GCP requirements'
    ],
    relatedLegislations: ['ICH-E6-R3-2024', 'FDA-GCP-Guidance'],
    timeline: {
      proposed: '2015-01-01',
      draft: '2016-06-01',
      effective: '2016-11-09',
      lastAmendment: '2023-01-15'
    },
    geographicScope: ['Global'],
    industryScope: ['Pharmaceuticals', 'Biotechnology', 'Medical Devices'],
    aiModelTypes: ['Traditional AI/ML'],
    deploymentScenarios: ['Clinical Trial Operations', 'Clinical Decision Support'],
    therapeuticAreas: ['All Therapeutic Areas']
  },
  {
    id: 'ich-e6-r3-2024',
    title: 'ICH E6(R3) Good Clinical Practice - AI Integration',
    description: 'Updated ICH E6 guidelines addressing AI integration in clinical trials',
    jurisdiction: 'Global',
    authority: 'ICH',
    category: 'Clinical Trials',
    subcategory: 'AI Integration',
    effectiveDate: '2024-01-01',
    lastUpdated: '2024-01-25',
    status: 'Active',
    documentUrl: 'https://www.ich.org/page/e6-good-clinical-practice',
    officialUrl: 'https://www.ich.org/page/e6-good-clinical-practice',
    isPartOfAssessment: true,
    assessmentSections: ['clinical-validation', 'safety-bias', 'data-observability'],
    impactLevel: 'High',
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
    relatedLegislations: ['ICH-E6-R2-2016', 'FDA-GCP-Guidance', 'EMA-GCP-Guidelines'],
    timeline: {
      proposed: '2022-01-01',
      draft: '2023-06-01',
      effective: '2024-01-01',
      lastAmendment: '2024-01-25'
    },
    geographicScope: ['Global'],
    industryScope: ['Pharmaceuticals', 'Biotechnology', 'Medical Devices', 'AI/ML'],
    aiModelTypes: ['Traditional AI/ML', 'Computer Vision AI', 'Natural Language Processing', 'Generative AI'],
    deploymentScenarios: ['Clinical Trial Operations', 'Clinical Decision Support', 'Data Analytics'],
    therapeuticAreas: ['All Therapeutic Areas']
  },

  // WHO Historical Legislations
  {
    id: 'who-ai-guidelines-2021',
    title: 'WHO Guidelines on AI for Health',
    description: 'WHO guidelines on artificial intelligence for health applications',
    jurisdiction: 'Global',
    authority: 'WHO',
    category: 'AI/ML',
    subcategory: 'Health Applications',
    effectiveDate: '2021-06-28',
    lastUpdated: '2023-01-15',
    status: 'Active',
    documentUrl: 'https://www.who.int/publications/i/item/9789240029200',
    officialUrl: 'https://www.who.int/publications/i/item/9789240029200',
    isPartOfAssessment: true,
    assessmentSections: ['regulatory-compliance', 'clinical-validation', 'safety-bias'],
    impactLevel: 'High',
    requirements: [
      'Protect human autonomy and agency',
      'Promote human well-being and safety',
      'Ensure transparency and explainability',
      'Foster responsibility and accountability',
      'Ensure inclusiveness and equity',
      'Promote AI that is responsive and sustainable'
    ],
    penalties: [
      'International health regulation violations',
      'Loss of WHO recognition and support',
      'Reputational damage and sanctions',
      'National regulatory enforcement'
    ],
    implementationGuidance: [
      'Implement ethical AI principles',
      'Establish governance frameworks',
      'Conduct impact assessments',
      'Ensure stakeholder engagement'
    ],
    relatedLegislations: ['WHO-Digital-Health-Guidelines'],
    timeline: {
      proposed: '2019-01-01',
      draft: '2020-06-01',
      effective: '2021-06-28',
      lastAmendment: '2023-01-15'
    },
    geographicScope: ['Global'],
    industryScope: ['Healthcare', 'AI/ML', 'Software'],
    aiModelTypes: ['Traditional AI/ML', 'Computer Vision AI', 'Natural Language Processing', 'Generative AI'],
    deploymentScenarios: ['Clinical Decision Support', 'Public Health', 'Health Research'],
    therapeuticAreas: ['All Therapeutic Areas']
  }
];

export default historicalLegislations;
