/**
 * Company Data - ComplianceIQ
 * Comprehensive list of pharmaceutical and biotech companies
 */

export interface Company {
  id: string;
  name: string;
  industryType: string;
  description: string;
  website: string;
  subscriptionTier: 'basic' | 'standard' | 'premium' | 'enterprise';
  therapeuticFocus: string[]; // Therapeutic area IDs
  aiInitiatives: string[]; // AI model type IDs
  deploymentScenarios: string[]; // Deployment scenario IDs
  isActive: boolean;
  logo?: string;
  headquarters?: string;
  founded?: number;
  employees?: string;
  marketCap?: string;
}

export const companies: Company[] = [
  {
    id: 'gilead',
    name: 'Gilead Sciences',
    industryType: 'Biotechnology',
    description: 'Leading biopharmaceutical company focused on antiviral and oncology therapeutics',
    website: 'https://www.gilead.com',
    subscriptionTier: 'enterprise',
    therapeuticFocus: ['oncology', 'infectious_disease', 'rare_disease'],
    aiInitiatives: ['drug_discovery', 'clinical_trial', 'patient_monitoring'],
    deploymentScenarios: ['clinical_trial', 'drug_discovery', 'post_market'],
    isActive: true,
    headquarters: 'Foster City, CA',
    founded: 1987,
    employees: '14,000+',
    marketCap: '$85B',
  },
  {
    id: 'genentech',
    name: 'Genentech',
    industryType: 'Biotechnology',
    description: 'Pioneer in biotechnology, developing treatments for cancer, neurological disorders, and other serious diseases',
    website: 'https://www.gene.com',
    subscriptionTier: 'enterprise',
    therapeuticFocus: ['oncology', 'neurology', 'immunology'],
    aiInitiatives: ['diagnostic_aid', 'drug_discovery', 'computer_vision'],
    deploymentScenarios: ['diagnostic_aid', 'drug_discovery', 'clinical_trial'],
    isActive: true,
    headquarters: 'South San Francisco, CA',
    founded: 1976,
    employees: '13,000+',
    marketCap: '$300B+ (Roche)',
  },
  {
    id: 'exelixis',
    name: 'Exelixis',
    industryType: 'Biotechnology',
    description: 'Oncology-focused biotechnology company developing small molecule therapies for cancer treatment',
    website: 'https://www.exelixis.com',
    subscriptionTier: 'premium',
    therapeuticFocus: ['oncology'],
    aiInitiatives: ['drug_discovery', 'clinical_trial'],
    deploymentScenarios: ['drug_discovery', 'clinical_trial', 'post_market'],
    isActive: true,
    headquarters: 'Alameda, CA',
    founded: 1994,
    employees: '1,200+',
    marketCap: '$6B',
  },
  {
    id: 'abbvie',
    name: 'AbbVie',
    industryType: 'Pharmaceutical',
    description: 'Global pharmaceutical company focused on immunology, oncology, neuroscience, and eye care',
    website: 'https://www.abbvie.com',
    subscriptionTier: 'enterprise',
    therapeuticFocus: ['oncology', 'mental_health', 'immunology'],
    aiInitiatives: ['drug_discovery', 'patient_monitoring', 'nlp'],
    deploymentScenarios: ['drug_discovery', 'patient_monitoring', 'regulatory_submission'],
    isActive: true,
    headquarters: 'North Chicago, IL',
    founded: 2013,
    employees: '50,000+',
    marketCap: '$280B',
  },
  {
    id: 'moderna',
    name: 'Moderna',
    industryType: 'Biotechnology',
    description: 'Biotechnology company pioneering messenger RNA (mRNA) therapeutics and vaccines',
    website: 'https://www.modernatx.com',
    subscriptionTier: 'premium',
    therapeuticFocus: ['infectious_disease', 'oncology', 'rare_disease'],
    aiInitiatives: ['drug_discovery', 'generative_ai', 'multimodal_ai'],
    deploymentScenarios: ['drug_discovery', 'clinical_trial', 'regulatory_submission'],
    isActive: true,
    headquarters: 'Cambridge, MA',
    founded: 2010,
    employees: '5,000+',
    marketCap: '$50B',
  },
  {
    id: 'biogen',
    name: 'Biogen',
    industryType: 'Biotechnology',
    description: 'Biotechnology company focused on neurological and neurodegenerative diseases',
    website: 'https://www.biogen.com',
    subscriptionTier: 'standard',
    therapeuticFocus: ['neurology', 'rare_disease', 'mental_health'],
    aiInitiatives: ['diagnostic_aid', 'patient_monitoring', 'nlp'],
    deploymentScenarios: ['diagnostic_aid', 'patient_monitoring', 'post_market'],
    isActive: true,
    headquarters: 'Cambridge, MA',
    founded: 1978,
    employees: '9,000+',
    marketCap: '$35B',
  },
];

// Company categories for filtering
export const companyCategories = [
  { id: 'all', name: 'All Companies', count: companies.length },
  { id: 'biotechnology', name: 'Biotechnology', count: companies.filter(c => c.industryType === 'Biotechnology').length },
  { id: 'pharmaceutical', name: 'Pharmaceutical', count: companies.filter(c => c.industryType === 'Pharmaceutical').length },
  { id: 'enterprise', name: 'Enterprise', count: companies.filter(c => c.subscriptionTier === 'enterprise').length },
  { id: 'premium', name: 'Premium', count: companies.filter(c => c.subscriptionTier === 'premium').length },
  { id: 'standard', name: 'Standard', count: companies.filter(c => c.subscriptionTier === 'standard').length },
];

// Therapeutic area mappings
export const therapeuticAreaMappings = {
  'oncology': 'Oncology',
  'infectious_disease': 'Infectious Disease',
  'rare_disease': 'Rare Disease',
  'neurology': 'Neurology',
  'immunology': 'Immunology',
  'mental_health': 'Mental Health',
  'cardiology': 'Cardiology',
  'dermatology': 'Dermatology',
  'ophthalmology': 'Ophthalmology',
  'pediatrics': 'Pediatrics',
  'emergency_medicine': 'Emergency Medicine',
};

// AI initiative mappings
export const aiInitiativeMappings = {
  'drug_discovery': 'Drug Discovery',
  'clinical_trial': 'Clinical Trial Support',
  'patient_monitoring': 'Patient Monitoring',
  'diagnostic_aid': 'Diagnostic Aid',
  'computer_vision': 'Computer Vision AI',
  'nlp': 'Natural Language Processing',
  'generative_ai': 'Generative AI',
  'multimodal_ai': 'Multimodal AI',
  'traditional_ml': 'Traditional AI/ML',
  'federated_learning': 'Federated Learning',
  'edge_ai': 'Edge AI',
  'agentic_ai': 'Agentic AI',
};

// Deployment scenario mappings
export const deploymentScenarioMappings = {
  'clinical_trial': 'Clinical Trial Support',
  'drug_discovery': 'Drug Discovery',
  'post_market': 'Post-Market Surveillance',
  'diagnostic_aid': 'Diagnostic Aid',
  'patient_monitoring': 'Patient Monitoring',
  'regulatory_submission': 'Regulatory Submission',
};

// Utility functions
export const getCompanyById = (id: string): Company | undefined => {
  return companies.find(company => company.id === id);
};

export const getCompaniesByIndustry = (industryType: string): Company[] => {
  return companies.filter(company => company.industryType === industryType);
};

export const getCompaniesByTherapeuticFocus = (therapeuticArea: string): Company[] => {
  return companies.filter(company => 
    company.therapeuticFocus.includes(therapeuticArea)
  );
};

export const getCompaniesBySubscriptionTier = (tier: string): Company[] => {
  return companies.filter(company => company.subscriptionTier === tier);
};

export const formatCompanyName = (company: Company): string => {
  return `${company.name} (${company.industryType})`;
};

export const getCompanyComplexityScore = (company: Company): number => {
  const therapeuticComplexity = company.therapeuticFocus.length * 2;
  const aiComplexity = company.aiInitiatives.length * 3;
  const deploymentComplexity = company.deploymentScenarios.length * 2;
  
  return therapeuticComplexity + aiComplexity + deploymentComplexity;
};

export const getCompanyRiskLevel = (company: Company): 'low' | 'medium' | 'high' => {
  const complexityScore = getCompanyComplexityScore(company);
  
  if (complexityScore <= 15) return 'low';
  if (complexityScore <= 25) return 'medium';
  return 'high';
};
