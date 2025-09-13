/**
 * Regulatory Data Sources Configuration
 * Comprehensive list of global regulatory bodies and their data sources
 */

export interface RegulatoryDataSource {
  id: string;
  name: string;
  source: string;
  jurisdiction: string;
  apiEndpoint?: string;
  rssFeed?: string;
  website: string;
  updateFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  categories: string[];
  status: 'active' | 'inactive' | 'maintenance';
  lastChecked?: Date;
  lastUpdate?: Date;
}

export const REGULATORY_DATA_SOURCES: RegulatoryDataSource[] = [
  // US Regulatory Bodies
  {
    id: 'fda-ai-ml',
    name: 'FDA AI/ML Guidance',
    source: 'FDA',
    jurisdiction: 'US',
    apiEndpoint: 'https://api.fda.gov/device/guidance.json',
    rssFeed: 'https://www.fda.gov/about-fda/fda-newsroom/rss-feeds-fda',
    website: 'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device',
    updateFrequency: 'weekly',
    categories: ['AI/ML', 'Medical Devices', 'Software', 'Clinical Trials'],
    status: 'active'
  },
  {
    id: 'fda-drug-development',
    name: 'FDA Drug Development Guidelines',
    source: 'FDA',
    jurisdiction: 'US',
    apiEndpoint: 'https://api.fda.gov/drug/guidance.json',
    website: 'https://www.fda.gov/drugs/guidance-compliance-regulatory-information/guidances-drugs',
    updateFrequency: 'weekly',
    categories: ['Drug Development', 'Clinical Trials', 'AI/ML', 'Quality Assurance'],
    status: 'active'
  },
  {
    id: 'ftc-ai',
    name: 'FTC AI Regulations',
    source: 'FTC',
    jurisdiction: 'US',
    website: 'https://www.ftc.gov/news-events/topics/technology/artificial-intelligence',
    updateFrequency: 'monthly',
    categories: ['AI/ML', 'Consumer Protection', 'Data Privacy', 'Competition'],
    status: 'active'
  },
  {
    id: 'nist-ai',
    name: 'NIST AI Risk Management Framework',
    source: 'NIST',
    jurisdiction: 'US',
    apiEndpoint: 'https://www.nist.gov/api/ai-risk-management',
    website: 'https://www.nist.gov/itl/ai-risk-management-framework',
    updateFrequency: 'monthly',
    categories: ['AI/ML', 'Risk Management', 'Standards', 'Cybersecurity'],
    status: 'active'
  },

  // European Regulatory Bodies
  {
    id: 'ema-ai',
    name: 'EMA AI Guidelines',
    source: 'EMA',
    jurisdiction: 'EU',
    apiEndpoint: 'https://www.ema.europa.eu/en/api/guidelines',
    rssFeed: 'https://www.ema.europa.eu/en/rss',
    website: 'https://www.ema.europa.eu/en/human-regulatory/research-development/scientific-guidelines',
    updateFrequency: 'weekly',
    categories: ['AI/ML', 'Clinical Trials', 'Drug Development', 'Pharmacovigilance'],
    status: 'active'
  },
  {
    id: 'eu-ai-act',
    name: 'EU AI Act',
    source: 'EU',
    jurisdiction: 'EU',
    apiEndpoint: 'https://eur-lex.europa.eu/api/legal-content',
    website: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52021PC0206',
    updateFrequency: 'monthly',
    categories: ['AI/ML', 'Data Privacy', 'Risk Management', 'Fundamental Rights'],
    status: 'active'
  },
  {
    id: 'edpb-ai',
    name: 'EDPB AI Guidelines',
    source: 'EDPB',
    jurisdiction: 'EU',
    website: 'https://edpb.europa.eu/our-work-tools/general-guidance/artificial-intelligence-and-data-protection_en',
    updateFrequency: 'monthly',
    categories: ['AI/ML', 'Data Protection', 'GDPR', 'Privacy by Design'],
    status: 'active'
  },

  // UK Regulatory Bodies
  {
    id: 'uk-mhra',
    name: 'UK MHRA AI Guidelines',
    source: 'MHRA',
    jurisdiction: 'UK',
    website: 'https://www.gov.uk/government/organisations/medicines-and-healthcare-products-regulatory-agency',
    updateFrequency: 'monthly',
    categories: ['AI/ML', 'Medical Devices', 'Clinical Trials', 'Drug Development'],
    status: 'active'
  },
  {
    id: 'uk-ico-ai',
    name: 'UK ICO AI Guidance',
    source: 'ICO',
    jurisdiction: 'UK',
    website: 'https://ico.org.uk/for-organisations/guide-to-data-protection/key-data-protection-themes/artificial-intelligence/',
    updateFrequency: 'monthly',
    categories: ['AI/ML', 'Data Protection', 'Privacy Rights', 'Algorithmic Decision Making'],
    status: 'active'
  },

  // Canadian Regulatory Bodies
  {
    id: 'canada-health-ai',
    name: 'Health Canada AI Guidelines',
    source: 'HealthCanada',
    jurisdiction: 'Canada',
    website: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/medical-devices/artificial-intelligence-machine-learning.html',
    updateFrequency: 'monthly',
    categories: ['AI/ML', 'Medical Devices', 'Clinical Trials', 'Healthcare'],
    status: 'active'
  },
  {
    id: 'canada-privacy-ai',
    name: 'Canada Privacy Commissioner AI Guidance',
    source: 'PrivacyCommissioner',
    jurisdiction: 'Canada',
    website: 'https://www.priv.gc.ca/en/privacy-topics/technology/artificial-intelligence/',
    updateFrequency: 'monthly',
    categories: ['AI/ML', 'Data Privacy', 'Consumer Rights', 'Algorithmic Transparency'],
    status: 'active'
  },

  // Australian Regulatory Bodies
  {
    id: 'australia-tga-ai',
    name: 'Australia TGA AI Guidelines',
    source: 'TGA',
    jurisdiction: 'Australia',
    website: 'https://www.tga.gov.au/resources/industry/artificial-intelligence-medical-devices',
    updateFrequency: 'monthly',
    categories: ['AI/ML', 'Medical Devices', 'Clinical Trials', 'Healthcare'],
    status: 'active'
  },
  {
    id: 'australia-oaic-ai',
    name: 'Australia OAIC AI Guidance',
    source: 'OAIC',
    jurisdiction: 'Australia',
    website: 'https://www.oaic.gov.au/privacy/guidance-and-advice/artificial-intelligence',
    updateFrequency: 'monthly',
    categories: ['AI/ML', 'Data Privacy', 'Privacy Rights', 'Algorithmic Decision Making'],
    status: 'active'
  },

  // Asian Regulatory Bodies
  {
    id: 'china-cac-ai',
    name: 'China CAC AI Regulations',
    source: 'CAC',
    jurisdiction: 'China',
    website: 'https://www.cac.gov.cn/2021-09/17/c_1632857355477489.htm',
    updateFrequency: 'monthly',
    categories: ['AI/ML', 'Data Security', 'Algorithm Governance', 'Content Moderation'],
    status: 'active'
  },
  {
    id: 'japan-pmda-ai',
    name: 'Japan PMDA AI Guidelines',
    source: 'PMDA',
    jurisdiction: 'Japan',
    website: 'https://www.pmda.go.jp/english/review-services/outline/0001.html',
    updateFrequency: 'monthly',
    categories: ['AI/ML', 'Medical Devices', 'Clinical Trials', 'Drug Development'],
    status: 'active'
  },

  // Global Organizations
  {
    id: 'ich-guidelines',
    name: 'ICH Guidelines',
    source: 'ICH',
    jurisdiction: 'Global',
    apiEndpoint: 'https://www.ich.org/api/guidelines',
    website: 'https://www.ich.org/page/ich-guidelines',
    updateFrequency: 'monthly',
    categories: ['Clinical Trials', 'Quality', 'Safety', 'Efficacy', 'AI/ML'],
    status: 'active'
  },
  {
    id: 'who-ai-guidelines',
    name: 'WHO AI Guidelines',
    source: 'WHO',
    jurisdiction: 'Global',
    apiEndpoint: 'https://www.who.int/api/ai-guidelines',
    website: 'https://www.who.int/publications/i/item/9789240029200',
    updateFrequency: 'quarterly',
    categories: ['AI/ML', 'Healthcare', 'Ethics', 'Global Health'],
    status: 'active'
  }
];

// Helper functions
export function getSourcesByJurisdiction(jurisdiction: string): RegulatoryDataSource[] {
  return REGULATORY_DATA_SOURCES.filter(source => source.jurisdiction === jurisdiction);
}

export function getSourcesByCategory(category: string): RegulatoryDataSource[] {
  return REGULATORY_DATA_SOURCES.filter(source => 
    source.categories.includes(category)
  );
}

export function getActiveSources(): RegulatoryDataSource[] {
  return REGULATORY_DATA_SOURCES.filter(source => source.status === 'active');
}

export function getSourceById(id: string): RegulatoryDataSource | undefined {
  return REGULATORY_DATA_SOURCES.find(source => source.id === id);
}

// Coverage statistics
export function getCoverageStats() {
  const jurisdictions = new Set(REGULATORY_DATA_SOURCES.map(s => s.jurisdiction));
  const categories = new Set(REGULATORY_DATA_SOURCES.flatMap(s => s.categories));
  const sources = new Set(REGULATORY_DATA_SOURCES.map(s => s.source));
  
  return {
    totalSources: REGULATORY_DATA_SOURCES.length,
    jurisdictions: jurisdictions.size,
    categories: categories.size,
    uniqueRegulatoryBodies: sources.size,
    activeSources: getActiveSources().length,
    coverage: {
      US: getSourcesByJurisdiction('US').length,
      EU: getSourcesByJurisdiction('EU').length,
      UK: getSourcesByJurisdiction('UK').length,
      Canada: getSourcesByJurisdiction('Canada').length,
      Australia: getSourcesByJurisdiction('Australia').length,
      China: getSourcesByJurisdiction('China').length,
      Japan: getSourcesByJurisdiction('Japan').length,
      Global: getSourcesByJurisdiction('Global').length
    }
  };
}
