import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Import static historical data
    const { historicalLegislations: staticHistorical } = await import('@/data/historicalLegislations');
    
    // Get dynamic regulations that have aged into historical status (older than 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Fetch recent regulations from database
    const recentRegulations = await prisma.regulatoryIntelligence.findMany({
      where: {
        lastUpdated: {
          lt: sevenDaysAgo
        }
      },
      orderBy: { lastUpdated: 'desc' }
    });
    
    // Convert recent regulations to historical format
    const dynamicHistorical = recentRegulations.map(regulation => ({
      id: `dynamic-${regulation.id}`,
      title: regulation.title,
      description: regulation.content,
      jurisdiction: 'Global',
      authority: regulation.source,
      category: 'AI/ML' as any,
      subcategory: 'General',
      effectiveDate: regulation.effectiveDate?.toISOString().split('T')[0] || regulation.lastUpdated.toISOString().split('T')[0],
      lastUpdated: regulation.lastUpdated.toISOString().split('T')[0],
      status: 'Active' as const,
      documentUrl: '',
      officialUrl: '',
      isPartOfAssessment: true,
      assessmentSections: ['regulatory-compliance'],
      impactLevel: regulation.impactLevel as any,
      requirements: [regulation.content.substring(0, 200) + '...'],
      penalties: ['Regulatory enforcement actions'],
      implementationGuidance: ['Follow regulatory guidance'],
      relatedLegislations: [],
      timeline: {
        proposed: regulation.lastUpdated.toISOString().split('T')[0],
        draft: regulation.lastUpdated.toISOString().split('T')[0],
        effective: regulation.effectiveDate?.toISOString().split('T')[0] || regulation.lastUpdated.toISOString().split('T')[0],
        lastAmendment: regulation.lastUpdated.toISOString().split('T')[0]
      },
      geographicScope: ['Global'],
      industryScope: ['Pharmaceuticals', 'AI/ML'],
      aiModelTypes: ['Traditional AI/ML', 'Computer Vision AI', 'Natural Language Processing'],
      deploymentScenarios: ['Clinical Decision Support', 'Regulatory Submission'],
      therapeuticAreas: ['General']
    }));
    
    // Combine static and dynamic historical data
    const allHistoricalLegislations = [...staticHistorical, ...dynamicHistorical];
    
    return NextResponse.json({
      success: true,
      data: allHistoricalLegislations,
      meta: {
        total: allHistoricalLegislations.length,
        static: staticHistorical.length,
        dynamic: dynamicHistorical.length,
        message: 'Historical legislations with dynamic aging'
      }
    });

    // Get summary statistics
    const stats = {
      total: allHistoricalLegislations.length,
      static: staticHistorical.length,
      dynamic: dynamicHistorical.length,
      byCategory: allHistoricalLegislations.reduce((acc, leg) => {
        acc[leg.category] = (acc[leg.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byJurisdiction: allHistoricalLegislations.reduce((acc, leg) => {
        acc[leg.jurisdiction] = (acc[leg.jurisdiction] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byStatus: allHistoricalLegislations.reduce((acc, leg) => {
        acc[leg.status] = (acc[leg.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byAuthority: allHistoricalLegislations.reduce((acc, leg) => {
        acc[leg.authority] = (acc[leg.authority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      partOfAssessment: allHistoricalLegislations.filter(leg => leg.isPartOfAssessment).length,
      notPartOfAssessment: allHistoricalLegislations.filter(leg => !leg.isPartOfAssessment).length
    };

    return NextResponse.json({
      success: true,
      data: allHistoricalLegislations,
      meta: {
        total: allHistoricalLegislations.length,
        static: staticHistorical.length,
        dynamic: dynamicHistorical.length,
        stats,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching historical legislations:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch historical legislations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, legislationId } = body;

    // Import static historical data
    const { historicalLegislations: staticHistorical } = await import('@/data/historicalLegislations');
    
    if (action === 'get-legislation-details') {
      const legislation = staticHistorical.find(leg => leg.id === legislationId);
      
      if (!legislation) {
        return NextResponse.json(
          { success: false, error: 'Legislation not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: legislation
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action specified' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error processing historical legislations request:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
