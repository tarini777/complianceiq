import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    console.log('Regulatory historical API called (simplified for build compatibility)');
    
    // Return mock historical data to avoid Prisma dependency during Vercel build
    const mockHistorical = [
      {
        id: 'historical-1',
        title: 'FDA AI/ML Guidance 2023',
        date: '2023-01-15',
        category: 'AI Governance',
        impact: 'High',
        status: 'Superseded',
        description: 'Initial FDA guidance on AI/ML in medical devices',
        jurisdiction: 'US',
        authority: 'FDA',
        effectiveDate: '2023-01-15',
        lastUpdated: '2023-01-15',
        isPartOfAssessment: true,
        assessmentSections: ['regulatory-compliance'],
        impactLevel: 'high',
        requirements: ['Follow FDA AI/ML guidance'],
        penalties: ['Regulatory enforcement actions'],
        implementationGuidance: ['Follow regulatory guidance'],
        relatedLegislations: [],
        timeline: {
          proposed: '2022-06-01',
          draft: '2022-09-15',
          effective: '2023-01-15',
          lastAmendment: '2023-01-15'
        },
        geographicScope: ['US'],
        industryScope: ['Pharmaceuticals', 'AI/ML'],
        aiModelTypes: ['Traditional AI/ML', 'Computer Vision AI'],
        deploymentScenarios: ['Clinical Decision Support'],
        therapeuticAreas: ['General']
      },
      {
        id: 'historical-2',
        title: 'EU AI Act - Initial Draft',
        date: '2022-04-21',
        category: 'Regulatory Framework',
        impact: 'Medium',
        status: 'Superseded',
        description: 'Initial draft of EU AI Act',
        jurisdiction: 'EU',
        authority: 'European Commission',
        effectiveDate: '2022-04-21',
        lastUpdated: '2022-04-21',
        isPartOfAssessment: false,
        assessmentSections: [],
        impactLevel: 'medium',
        requirements: ['Comply with EU AI Act'],
        penalties: ['EU regulatory enforcement'],
        implementationGuidance: ['Follow EU guidance'],
        relatedLegislations: [],
        timeline: {
          proposed: '2021-04-21',
          draft: '2022-04-21',
          effective: '2022-04-21',
          lastAmendment: '2022-04-21'
        },
        geographicScope: ['EU'],
        industryScope: ['AI/ML'],
        aiModelTypes: ['Traditional AI/ML'],
        deploymentScenarios: ['General AI'],
        therapeuticAreas: ['General']
      }
    ];
    
    return NextResponse.json({
      success: true,
      data: mockHistorical,
      meta: {
        total: mockHistorical.length,
        static: mockHistorical.length,
        dynamic: 0,
        message: 'Historical regulatory data loaded (simplified for deployment compatibility)'
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

    console.log(`Historical legislations POST action: ${action} (simplified for build compatibility)`);

    if (action === 'get-legislation-details') {
      // Return mock legislation details for build compatibility
      const mockLegislation = {
        id: legislationId,
        title: 'Mock Historical Legislation',
        description: 'Mock legislation details for build compatibility',
        category: 'AI Governance',
        impact: 'High',
        status: 'Active'
      };

      return NextResponse.json({
        success: true,
        data: mockLegislation,
        message: 'Legislation details loaded (simplified for deployment compatibility)'
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