import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    console.log('Assessment progress API called');
    const { searchParams } = new URL(request.url);
    const personaId = searchParams.get('personaId');
    const subPersonaId = searchParams.get('subPersonaId');
    const assessmentId = searchParams.get('assessmentId');

    console.log('Request params:', { personaId, subPersonaId, assessmentId });

    if (!personaId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Persona ID is required',
        },
        { status: 400 }
      );
    }

    // Simplified progress response for deployment compatibility
    const progress = {
      personaId,
      subPersonaId,
      assessmentId,
      totalSections: 4,
      completedSections: 0,
      totalQuestions: 12,
      completedQuestions: 0,
      totalPoints: 60,
      earnedPoints: 0,
      completionPercentage: 0,
      criticalSections: 1,
      completedCriticalSections: 0,
      productionBlockers: 0,
      resolvedBlockers: 0,
      lastUpdated: new Date().toISOString(),
      status: 'in_progress',
      note: 'Using simplified progress data for deployment compatibility'
    };

    return NextResponse.json({
      success: true,
      data: progress
    });

  } catch (error) {
    console.error('Error fetching assessment progress:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch assessment progress',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}