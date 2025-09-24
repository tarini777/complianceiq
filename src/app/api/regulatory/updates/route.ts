import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build where clause for filtering
    const where: any = {
      status: 'active'
    };

    if (source && source !== 'all') {
      where.source = source;
    }

    if (category && category !== 'all') {
      where.therapeuticAreas = {
        has: category
      };
    }

    // Fetch regulatory intelligence data from database
    const regulatoryData = await prisma.regulatoryIntelligence.findMany({
      where,
      orderBy: {
        lastUpdated: 'desc'
      },
      take: limit
    });

    // Transform database data to match frontend interface
    const updates = regulatoryData.map(item => ({
      id: item.id,
      title: item.title,
      source: item.source,
      category: categorizeRegulatoryContent(item.title, item.content, item.source),
      severity: mapImpactToSeverity(item.impactLevel),
      date: item.effectiveDate ? item.effectiveDate.toISOString().split('T')[0] : item.lastUpdated.toISOString().split('T')[0],
      summary: item.content.substring(0, 200) + (item.content.length > 200 ? '...' : ''),
      impact: generateImpactDescription(item.impactLevel, item.therapeuticAreas),
      actionRequired: generateActionRequired(item.impactLevel, item.aiModelRelevance),
      url: generateSourceUrl(item.source),
      documentUrl: generateDocumentUrl(item.source, item.regulationId),
      affectedSections: mapToAffectedSections(item.therapeuticAreas),
      affectedQuestions: mapToAffectedQuestions(item.aiModelRelevance),
      assessmentImpact: generateAssessmentImpact(item.impactLevel, item.therapeuticAreas)
    }));

    return NextResponse.json({
      success: true,
      data: updates,
      meta: {
        total: updates.length,
        sources: [...new Set(updates.map(u => u.source))],
        categories: [...new Set(updates.map(u => u.category))],
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching regulatory updates:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch regulatory updates',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper functions to transform database data
function categorizeRegulatoryContent(title: string, content: string, source: string): string {
  const text = (title + ' ' + content).toLowerCase();
  
  // Data Privacy specific keywords (check first for more specific matches)
  if (text.includes('privacy') || text.includes('gdpr') || 
      text.includes('data protection') || text.includes('personal data') ||
      text.includes('consent') || text.includes('data security') ||
      source.toLowerCase().includes('privacy') || source.toLowerCase().includes('ico') ||
      source.toLowerCase().includes('oaic') || source.toLowerCase().includes('edpb')) {
    return 'Data Privacy';
  }
  
  // Clinical Trials specific keywords
  if (text.includes('clinical trial') || text.includes('clinical study') ||
      text.includes('gcp') || text.includes('good clinical practice') ||
      text.includes('patient') || text.includes('study protocol') ||
      text.includes('e6(r3)') || text.includes('ich e6')) {
    return 'Clinical Trials';
  }
  
  // Drug Safety specific keywords
  if (text.includes('safety') || text.includes('adverse event') ||
      text.includes('pharmacovigilance') || text.includes('risk assessment')) {
    return 'Drug Safety';
  }
  
  // Quality Assurance specific keywords
  if (text.includes('quality') || text.includes('manufacturing') ||
      text.includes('validation') || text.includes('compliance')) {
    return 'Quality Assurance';
  }
  
  // AI/ML specific keywords (check after more specific categories)
  if (text.includes('ai') || text.includes('artificial intelligence') || 
      text.includes('machine learning') || text.includes('ml') || 
      text.includes('algorithm') || text.includes('gmlp') || 
      text.includes('software as a medical device') || text.includes('samd') ||
      text.includes('ai act') || text.includes('ai guidelines')) {
    return 'AI/ML';
  }
  
  // Default to AI/ML for regulatory content
  return 'AI/ML';
}

function mapImpactToSeverity(impactLevel: string): 'Critical' | 'High' | 'Medium' | 'Low' {
  switch (impactLevel.toLowerCase()) {
    case 'critical':
      return 'Critical';
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
    default:
      return 'Medium';
  }
}

function generateImpactDescription(impactLevel: string, therapeuticAreas: string[]): string {
  const areas = therapeuticAreas.join(', ');
  switch (impactLevel.toLowerCase()) {
    case 'critical':
      return `Critical impact on ${areas} systems. Immediate compliance action required with mandatory implementation of new regulatory requirements.`;
    case 'high':
      return `High impact on ${areas} implementations. Significant compliance requirements with 30-day implementation timeline.`;
    case 'medium':
      return `Medium impact on ${areas} systems. Standard compliance requirements with 90-day implementation timeline.`;
    case 'low':
      return `Low impact on ${areas} systems. Recommended compliance improvements with 180-day implementation timeline.`;
    default:
      return `Regulatory update affecting ${areas} systems requiring compliance review.`;
  }
}

function generateActionRequired(impactLevel: string, aiModelRelevance: string[]): string {
  const models = aiModelRelevance.join(', ');
  switch (impactLevel.toLowerCase()) {
    case 'critical':
      return `Implement mandatory compliance framework for ${models} systems. Establish governance protocols and validation requirements.`;
    case 'high':
      return `Update compliance protocols for ${models} implementations. Review and enhance existing governance frameworks.`;
    case 'medium':
      return `Review compliance requirements for ${models} systems. Update documentation and monitoring protocols.`;
    case 'low':
      return `Assess compliance implications for ${models} systems. Consider implementation of recommended improvements.`;
    default:
      return `Review regulatory requirements for ${models} systems and update compliance protocols as needed.`;
  }
}

function generateSourceUrl(source: string): string {
  const sourceUrls: Record<string, string> = {
    'FDA': 'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device',
    'EMA': 'https://www.ema.europa.eu/en/documents/report/reflection-paper-artificial-intelligence-use-medicinal-products-human-medicine_en.pdf',
    'ICH': 'https://www.ich.org/page/quality-guidelines',
    'WHO': 'https://www.who.int/publications/i/item/9789240029200',
    'NIST': 'https://www.nist.gov/itl/ai-risk-management-framework',
    'FTC': 'https://www.ftc.gov/news-events/topics/technology/artificial-intelligence',
    'EU': 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52021PC0206',
    'EDPB': 'https://edpb.europa.eu/our-work-tools/general-guidance/artificial-intelligence-and-data-protection_en',
    'MHRA': 'https://www.gov.uk/government/organisations/medicines-and-healthcare-products-regulatory-agency',
    'ICO': 'https://ico.org.uk/for-organisations/guide-to-data-protection/key-data-protection-themes/artificial-intelligence/',
    'HealthCanada': 'https://www.canada.ca/en/health-canada/services/drugs-health-products/medical-devices/artificial-intelligence-machine-learning.html',
    'PrivacyCommissioner': 'https://www.priv.gc.ca/en/privacy-topics/technology/artificial-intelligence/',
    'TGA': 'https://www.tga.gov.au/resources/industry/artificial-intelligence-medical-devices',
    'OAIC': 'https://www.oaic.gov.au/privacy/guidance-and-advice/artificial-intelligence',
    'CAC': 'https://www.cac.gov.cn/2021-09/17/c_1632857355477489.htm',
    'PMDA': 'https://www.pmda.go.jp/english/review-services/outline/0001.html'
  };
  
  return sourceUrls[source] || 'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device';
}

function generateDocumentUrl(source: string, regulationId: string): string {
  // Generate document URLs based on source and regulation ID
  const baseUrls: Record<string, string> = {
    'FDA': 'https://www.fda.gov/media/109618/download', // Real SaMD guidance document
    'EMA': 'https://www.ema.europa.eu/en/documents/report/reflection-paper-artificial-intelligence-use-medicinal-products-human-medicine_en.pdf',
    'ICH': 'https://www.ich.org/page/quality-guidelines',
    'WHO': 'https://www.who.int/publications/i/item/9789240029200',
    'NIST': 'https://www.nist.gov/itl/ai-risk-management-framework'
  };
  
  return baseUrls[source] || baseUrls['FDA'];
}

function mapToAffectedSections(therapeuticAreas: string[]): string[] {
  const sectionMapping: Record<string, string[]> = {
    'AI/ML': ['Regulatory Compliance & FDA 2025 Guidance', 'AI Model Validation Coverage', 'AI Governance Framework'],
    'Medical Devices': ['Medical Device AI Requirements', 'AI Model Validation Coverage'],
    'Clinical Trials': ['Clinical Trial AI Standards', 'AI Model Validation Coverage'],
    'Data Privacy': ['Data Privacy and Protection', 'AI Governance Framework'],
    'Quality Assurance': ['Quality Assurance Standards', 'AI Model Validation Coverage'],
    'Risk Management': ['Risk Management Frameworks', 'AI Governance Framework']
  };

  const sections: string[] = [];
  therapeuticAreas.forEach(area => {
    if (sectionMapping[area]) {
      sections.push(...sectionMapping[area]);
    }
  });

  return [...new Set(sections)]; // Remove duplicates
}

function mapToAffectedQuestions(aiModelRelevance: string[]): string[] {
  const questionMapping: Record<string, string[]> = {
    'Machine Learning': ['ml-001', 'ml-002', 'ml-003'],
    'Deep Learning': ['dl-001', 'dl-002', 'dl-003'],
    'Natural Language Processing': ['nlp-001', 'nlp-002', 'nlp-003'],
    'Computer Vision': ['cv-001', 'cv-002', 'cv-003'],
    'Generative AI': ['gen-001', 'gen-002', 'gen-003'],
    'Reinforcement Learning': ['rl-001', 'rl-002', 'rl-003']
  };

  const questions: string[] = [];
  aiModelRelevance.forEach(model => {
    if (questionMapping[model]) {
      questions.push(...questionMapping[model]);
    }
  });

  return [...new Set(questions)]; // Remove duplicates
}

function generateAssessmentImpact(impactLevel: string, therapeuticAreas: string[]): string {
  const areas = therapeuticAreas.join(', ');
  switch (impactLevel.toLowerCase()) {
    case 'critical':
      return `Updates scoring requirements for ${areas} compliance. Critical blockers now require production-implemented frameworks.`;
    case 'high':
      return `Enhanced scoring requirements for ${areas} systems. High priority items require documented implementation plans.`;
    case 'medium':
      return `Standard scoring requirements for ${areas} compliance. Medium priority items require compliance review.`;
    case 'low':
      return `Recommended improvements for ${areas} systems. Low priority items require assessment consideration.`;
    default:
      return `Regulatory update affecting ${areas} assessment scoring and compliance requirements.`;
  }
}
