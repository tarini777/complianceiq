import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const personaId = searchParams.get('personaId');
    const subPersonaId = searchParams.get('subPersonaId');
    const therapeuticAreaId = searchParams.get('therapeuticAreaId');
    const aiModelTypes = searchParams.get('aiModelTypes')?.split(',') || [];
    const deploymentScenarios = searchParams.get('deploymentScenarios')?.split(',') || [];
    const includeQuestions = searchParams.get('includeQuestions') === 'true';
    const includeCollaboration = searchParams.get('includeCollaboration') === 'true';

    // Simplified response for deployment compatibility
    const sections = [
      {
        id: 'data-governance',
        title: 'Data Governance & Quality',
        description: 'Comprehensive data governance framework for AI compliance',
        category: 'Data Management',
        isCritical: true,
        questions: includeQuestions ? [
          {
            id: 'dg-001',
            text: 'How does your data governance framework ensure data quality and integrity for AI models?',
            type: 'scale_1_5',
            points: 5,
            isBlocker: false,
            category: 'Data Governance',
            evidenceRequired: ['Data governance policy', 'Quality control procedures'],
            responsibleRole: ['Data Governance Manager', 'Quality Assurance'],
            scaleLabels: {
              1: "Not implemented",
              2: "Partially implemented", 
              3: "Mostly implemented",
              4: "Well implemented",
              5: "Fully implemented"
            },
            scaleConfiguration: {
              min: 1,
              max: 5,
              step: 1,
              defaultLabels: false
            }
          }
        ] : [],
        totalQuestions: includeQuestions ? 1 : 0,
        totalPoints: 5,
        criticalQuestions: 0,
        productionBlockers: 0
      }
    ];

    return NextResponse.json({
      success: true,
      data: sections,
      count: sections.length,
      note: 'Using simplified sections data for deployment compatibility'
    });

  } catch (error) {
    console.error('Error fetching assessment sections:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch assessment sections',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}